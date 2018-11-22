import { Subscription } from 'rxjs/Subscription';

import {
	Component,
	Vue
} from 'vue-property-decorator';

import { ISongMetadata } from '../../contracts/song-metadata.interface';
import { ISong } from '../../contracts/song.interface';
import { ITime } from '../../contracts/time.interface';
import { TimeFormatter } from '../../formatters/time.formatter';
import { FavoritesService } from '../../services/favorites.service';
import { MusicService } from '../../services/music.service';

@Component
export default class PlayerComponent extends Vue {
	currentSongPaused: boolean = false;
	currentTime: ITime = null;
	chosenSong: ISong = null;
	playingSongMetadata: ISongMetadata = null;
	progressValue: number = 0;
	skipTimeChange: boolean = false;
	subscriptions: Subscription[] = [];
	volumeValue: number = 100;
	isFavorite: boolean = false;
	isPlayingCollection: boolean = false;
	isRepeatingCollection: boolean = false;
	isShufflingCollection: boolean = false;

	created() {
		this.subscriptions.push(MusicService.currentlyChosenSong.subscribe(chosenSong => {
			this.chosenSong = chosenSong;
			if (this.chosenSong) this.isFavorite = FavoritesService.isFavorite(this.chosenSong.id);
		}));

		this.subscriptions.push(MusicService.currentlyPlayingSongMetadata.subscribe(playingSongMetadata => {
			this.playingSongMetadata = playingSongMetadata;
		}));

		this.subscriptions.push(MusicService.currentlyPlayingSongTimeChange.subscribe(currentTime => {
			if (this.skipTimeChange) return;
			this.currentTime = currentTime;
			this.progressValue = this.currentTime && this.playingSongMetadata ? this.currentTime.raw / this.playingSongMetadata.time.raw * 100 : 0;
		}));

		this.subscriptions.push(MusicService.currentlyPlayingSongVolumeChange.subscribe(volumeValue => {
			this.volumeValue = volumeValue * 100;
		}));

		this.subscriptions.push(MusicService.currentlyPlayingSongPaused.subscribe(currentSongPaused => {
			this.currentSongPaused = currentSongPaused;
		}));

		this.subscriptions.push(MusicService.isPlayingCollection.subscribe(isPlayingCollection => {
			this.isPlayingCollection = isPlayingCollection;
		}));

		this.subscriptions.push(MusicService.isRepeatingCollection.subscribe(isRepeatingCollection => {
			this.isRepeatingCollection = isRepeatingCollection;
		}));

		this.subscriptions.push(MusicService.isShufflingCollection.subscribe(isShufflingCollection => {
			this.isShufflingCollection = isShufflingCollection;
		}));

		this.subscriptions.push(FavoritesService.favoritesChange.subscribe(() => {
			if (this.chosenSong) this.isFavorite = FavoritesService.isFavorite(this.chosenSong.id);
		}));
	}

	beforeDestroy() {
		this.subscriptions.forEach(sub => sub.unsubscribe());
	}

	changeProgress(event) {
		const rect: DOMRect = event.target.getBoundingClientRect();
		const progress = (event.pageX - rect.left) / rect.width;
		this.progressValue = progress * 100;
		this.currentTime = TimeFormatter.formatTime(this.playingSongMetadata.time.raw * progress);
	}

	changeTime(event) {
		const rect: DOMRect = event.target.getBoundingClientRect();
		const progress = (event.pageX - rect.left) / rect.width;
		MusicService.changeCurrentTime(this.playingSongMetadata.time.raw * progress);
	}

	requestCurrentTime() {
		MusicService.emitCurrentTime();
	}

	changeVolumeDisplayValue(event) {
		const rect: DOMRect = event.target.getBoundingClientRect();
		const progress = (event.pageX - rect.left) / rect.width;
		this.volumeValue = progress * 100;
	}

	setVolume(event) {
		const rect: DOMRect = event.target.getBoundingClientRect();
		const progress = (event.pageX - rect.left) / rect.width;
		MusicService.setVolume(progress);
	}

	requestVolume() {
		MusicService.emitVolume();
	}

	toggleMute() {
		MusicService.setVolume(this.volumeValue < 1 ? 1 : 0);
	}

	playOrPause() {
		MusicService.resumeOrPauseCurrentSong();
	}

	playNext() {
		MusicService.playNextFromCollection();
	}

	playPrev() {
		MusicService.playPrevFromCollection();
	}

	shuffle() {
		MusicService.setShuffleCollection(!this.isShufflingCollection);
	}

	repeat() {
		MusicService.setRepeatCollection(!this.isRepeatingCollection);
	}

	toggleFavorite() {
		FavoritesService.toggleFavorite(this.chosenSong.id);
	}

	close() {
		MusicService.reset();
	}
}