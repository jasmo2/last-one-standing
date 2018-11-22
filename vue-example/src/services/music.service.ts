import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MusicAgent } from '../agents/music.agent';
import { ISongMetadata } from '../contracts/song-metadata.interface';
import { ISong } from '../contracts/song.interface';
import { ITime } from '../contracts/time.interface';
import { StorageItems } from '../enums/storage-items.enum';
import { TimeFormatter } from '../formatters/time.formatter';
import { StorageService } from './storage.service';

class MusicServiceSingleton {
	private _audio: HTMLAudioElement = new Audio();
	private _collection: ISong[];
	private _originalCollection: ISong[];
	private _restartCollection: boolean = false;
	private _currentlyChosenSongSubject: BehaviorSubject<ISong> = new BehaviorSubject(null);
	private _currentlyPlayingSongSubject: BehaviorSubject<ISong> = new BehaviorSubject(null);
	private _currentlyPlayingSongMetadataSubject: BehaviorSubject<ISongMetadata> = new BehaviorSubject(null);
	private _currentlyPlayingSongPausedSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
	private _currentlyPlayingSongTimeChangeSubject: BehaviorSubject<ITime> = new BehaviorSubject(null);
	private _currentlyPlayingSongVolumeChangeSubject: BehaviorSubject<number> = new BehaviorSubject(StorageService.getOrDefault<number>(StorageItems.Volume, 1));
	private _isPlayingCollectionSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
	private _isRepeatingCollectionSubject: BehaviorSubject<boolean> = new BehaviorSubject(StorageService.getOrDefault<boolean>(StorageItems.IsRepeatingCollection, false));
	private _isShufflingCollectionSubject: BehaviorSubject<boolean> = new BehaviorSubject(StorageService.getOrDefault<boolean>(StorageItems.IsShufflingCollection, false));

	public currentlyChosenSong = this._currentlyChosenSongSubject.asObservable();
	public currentlyPlayingSong = this._currentlyPlayingSongSubject.asObservable();
	public currentlyPlayingSongMetadata = this._currentlyPlayingSongMetadataSubject.asObservable();
	public currentlyPlayingSongPaused = this._currentlyPlayingSongPausedSubject.asObservable();
	public currentlyPlayingSongTimeChange = this._currentlyPlayingSongTimeChangeSubject.asObservable();
	public currentlyPlayingSongVolumeChange = this._currentlyPlayingSongVolumeChangeSubject.asObservable();
	public isPlayingCollection = this._isPlayingCollectionSubject.asObservable();
	public isRepeatingCollection = this._isRepeatingCollectionSubject.asObservable();
	public isShufflingCollection = this._isShufflingCollectionSubject.asObservable();

	constructor() {
		const defaultVolume = this._currentlyPlayingSongVolumeChangeSubject.getValue();
		if (defaultVolume !== 1) this.setVolume(defaultVolume);

		this._audio.onloadedmetadata = () => {
			this._currentlyPlayingSongMetadataSubject.next(this.formatMetadata());
		};
		this._audio.ontimeupdate = () => {
			const previousTime = this._currentlyPlayingSongTimeChangeSubject.getValue();
			const newTime = TimeFormatter.formatTime(this._audio.currentTime);
			if (previousTime && previousTime.minutes === newTime.minutes && previousTime.seconds === newTime.seconds) return;
			this._currentlyPlayingSongTimeChangeSubject.next(newTime);
		};
		this._audio.onvolumechange = () => {
			this._currentlyPlayingSongVolumeChangeSubject.next(this._audio.volume);
		};
		this._audio.onpause = this._audio.onplay = () => {
			this._currentlyPlayingSongPausedSubject.next(this._audio.paused);
		};
		this._audio.onended = () => {
			if (this._isPlayingCollectionSubject.getValue())
				this.playNextFromCollection();
			else
				this._currentlyPlayingSongSubject.next(null);
		}
	}

	public playSong(id: number, fromCollection: boolean = false): void {
		this._audio.pause();
		this._audio.src = '';
		this._isPlayingCollectionSubject.next(fromCollection);
		MusicAgent.getSongById(id).subscribe(song => {
			if (!song) return; //TODO: show an error
			this._audio.src = `backend/songs/${song.source}`;
			this._audio.load();
			this._audio.play();
			this._currentlyChosenSongSubject.next(song);
			this._currentlyPlayingSongSubject.next(song);
		});
	}

	public playCollection(collection: ISong[]): void {
		this._currentlyChosenSongSubject.next(null)
		this._currentlyPlayingSongSubject.next(null);
		this._originalCollection = collection;
		this._collection = collection.slice();
		if (this._isShufflingCollectionSubject.getValue()) this.shuffleCollection(this._collection);
		this._isPlayingCollectionSubject.next(true);
		this.playNextFromCollection();
	}

	public playNextFromCollection(): void {
		const currentlyChosen = this._currentlyChosenSongSubject.getValue();
		const index = currentlyChosen && !this._restartCollection ? this._collection.findIndex(song => song.id === currentlyChosen.id) + 1 : 0;
		if (this._collection[index]) {
			this.playSong(this._collection[index].id, true);
		} else if (this._isRepeatingCollectionSubject.getValue()) {
			if (this._isShufflingCollectionSubject.getValue()) this.shuffleCollection(this._collection);
			this.playSong(this._collection[0].id, true);
		} else {
			this.changeCurrentTime(this._currentlyPlayingSongMetadataSubject.getValue().time.raw);
		}

		this._restartCollection = false;
	}

	public playPrevFromCollection(): void {
		const currentlyChosen = this._currentlyChosenSongSubject.getValue();
		const index = currentlyChosen && !this._restartCollection ? this._collection.findIndex(song => song.id === currentlyChosen.id) - 1 : 0;
		if (this._collection[index]) {
			this.playSong(this._collection[index].id, true);
		} else if (this._isRepeatingCollectionSubject.getValue()) {
			if (this._isShufflingCollectionSubject.getValue()) this.shuffleCollection(this._collection);
			this.playSong(this._collection[this._collection.length - 1].id, true);
		} else {
			this.changeCurrentTime(0);
		}

		this._restartCollection = false;
	}

	public reset(): void {
		this._audio.pause();
		this._audio.src = '';
		this._currentlyChosenSongSubject.next(null);
		this._currentlyPlayingSongSubject.next(null);
		this._currentlyPlayingSongMetadataSubject.next(null);
		this._currentlyPlayingSongTimeChangeSubject.next(null);
	}

	public resumeOrPauseCurrentSong(): void {
		if (this._currentlyPlayingSongSubject.getValue()) {
			if (this._audio.paused) this._audio.play();
			else this._audio.pause();
		} else if (this._currentlyChosenSongSubject.getValue()) {
			this.playSong(this._currentlyChosenSongSubject.getValue().id);
		}
	}

	public changeCurrentTime(seconds: number): void {
		this._audio.currentTime = seconds;
	}

	public emitCurrentTime(): void {
		this._currentlyPlayingSongTimeChangeSubject.next(TimeFormatter.formatTime(this._audio.currentTime));
	}

	public emitVolume(): void {
		this._currentlyPlayingSongVolumeChangeSubject.next(this._audio.volume);
	}

	public setVolume(volume: number): void {
		this._audio.volume = volume;
		StorageService.set(StorageItems.Volume, volume);
	}

	public setRepeatCollection(isRepeat: boolean): void {
		this._isRepeatingCollectionSubject.next(isRepeat);
		StorageService.set(StorageItems.IsRepeatingCollection, isRepeat);
	}

	public setShuffleCollection(isShuffle: boolean): void {
		if (this._isPlayingCollectionSubject.getValue()) {
			if (isShuffle) this.shuffleCollection(this._collection);
			else this._collection = this._originalCollection.slice();
			this._restartCollection = true;
		}
		this._isShufflingCollectionSubject.next(isShuffle);
		StorageService.set(StorageItems.IsShufflingCollection, isShuffle);
	}

	private formatMetadata(): ISongMetadata {
		return {
			time: TimeFormatter.formatTime(this._audio.duration)
		}
	}

	private shuffleCollection(collection: ISong[]): void {
		for (let i = collection.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[collection[i], collection[j]] = [collection[j], collection[i]];
		}
	}
}

export const MusicService = new MusicServiceSingleton();