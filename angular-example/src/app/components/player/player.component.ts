import { Subscription } from 'rxjs';

import {
	Component,
	ElementRef,
	OnDestroy,
	ViewChild
} from '@angular/core';

import { ISongMetadata } from './../../contracts/song-metadata.interface';
import { ISong } from './../../contracts/song.interface';
import { ITime } from './../../contracts/time.interface';
import { TimeFormatter } from './../../formatters/time.formatter';
import { FavoritesService } from './../../services/favorites.service';
import { MusicService } from './../../services/music.service';

@Component({
	selector: 'player-component',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnDestroy {
	@ViewChild('timeEl') timeEl: ElementRef<HTMLElement>;
	@ViewChild('volumeEl') volumeEl: ElementRef<HTMLElement>;

	public currentSongPaused: boolean = false;
	public currentTime: ITime = null;
	public chosenSong: ISong = null;
	public playingSongMetadata: ISongMetadata = null;
	public progressValue: number = 0;
	public skipTimeChange: boolean = false;
	public subscriptions: Subscription[] = [];
	public volumeValue: number = 100;
	public isFavorite: boolean = false;
	public isPlayingCollection: boolean = false;
	public isRepeatingCollection: boolean = false;
	public isShufflingCollection: boolean = false;

	constructor(
		private _favoritesService: FavoritesService,
		private _musicService: MusicService
	) {
		this.subscriptions.push(this._musicService.currentlyChosenSong.subscribe(chosenSong => {
			this.chosenSong = chosenSong;
			if (this.chosenSong) this.isFavorite = this._favoritesService.isFavorite(this.chosenSong.id);
		}));

		this.subscriptions.push(this._musicService.currentlyPlayingSongMetadata.subscribe(playingSongMetadata => {
			this.playingSongMetadata = playingSongMetadata;
		}));

		this.subscriptions.push(this._musicService.currentlyPlayingSongTimeChange.subscribe(currentTime => {
			if (this.skipTimeChange) return;
			this.currentTime = currentTime;
			this.progressValue = this.currentTime && this.playingSongMetadata ? this.currentTime.raw / this.playingSongMetadata.time.raw * 100 : 0;
		}));

		this.subscriptions.push(this._musicService.currentlyPlayingSongVolumeChange.subscribe(volumeValue => {
			this.volumeValue = volumeValue * 100;
		}));

		this.subscriptions.push(this._musicService.currentlyPlayingSongPaused.subscribe(currentSongPaused => {
			this.currentSongPaused = currentSongPaused;
		}));

		this.subscriptions.push(this._musicService.isPlayingCollection.subscribe(isPlayingCollection => {
			this.isPlayingCollection = isPlayingCollection;
		}));

		this.subscriptions.push(this._musicService.isRepeatingCollection.subscribe(isRepeatingCollection => {
			this.isRepeatingCollection = isRepeatingCollection;
		}));

		this.subscriptions.push(this._musicService.isShufflingCollection.subscribe(isShufflingCollection => {
			this.isShufflingCollection = isShufflingCollection;
		}));

		this.subscriptions.push(this._favoritesService.favoritesChange.subscribe(() => {
			if (this.chosenSong) this.isFavorite = this._favoritesService.isFavorite(this.chosenSong.id);
		}));
	}

	public ngOnDestroy(): void {
		this.subscriptions.forEach(sub => sub.unsubscribe());
	}

	public changeProgress(event): void {
		const rect: ClientRect = this.timeEl.nativeElement.getBoundingClientRect();
		const progress = (event.pageX - rect.left) / rect.width;
		this.progressValue = progress * 100;
		this.currentTime = TimeFormatter.formatTime(this.playingSongMetadata.time.raw * progress);
	}

	public changeTime(event): void {
		const rect: ClientRect = this.timeEl.nativeElement.getBoundingClientRect();
		const progress = (event.pageX - rect.left) / rect.width;
		this._musicService.changeCurrentTime(this.playingSongMetadata.time.raw * progress);
	}

	public requestCurrentTime(): void {
		this._musicService.emitCurrentTime();
	}

	public changeVolumeDisplayValue(event): void {
		const rect: ClientRect = this.volumeEl.nativeElement.getBoundingClientRect();
		const progress = (event.pageX - rect.left) / rect.width;
		this.volumeValue = progress * 100;
	}

	public setVolume(event): void {
		const rect: ClientRect = this.volumeEl.nativeElement.getBoundingClientRect();
		const progress = (event.pageX - rect.left) / rect.width;
		this._musicService.setVolume(progress);
	}

	public requestVolume(): void {
		this._musicService.emitVolume();
	}

	public toggleMute(): void {
		this._musicService.setVolume(this.volumeValue < 1 ? 1 : 0);
	}

	public playOrPause(): void {
		this._musicService.resumeOrPauseCurrentSong();
	}

	public playNext(): void {
		this._musicService.playNextFromCollection();
	}

	public playPrev(): void {
		this._musicService.playPrevFromCollection();
	}

	public shuffle(): void {
		this._musicService.setShuffleCollection(!this.isShufflingCollection);
	}

	public repeat(): void {
		this._musicService.setRepeatCollection(!this.isRepeatingCollection);
	}

	public toggleFavorite(): void {
		this._favoritesService.toggleFavorite(this.chosenSong.id);
	}

	public close(): void {
		this._musicService.reset();
	}
}