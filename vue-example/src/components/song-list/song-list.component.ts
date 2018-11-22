import { Subscription } from 'rxjs/Subscription';

import {
	Component,
	Prop,
	Vue
} from 'vue-property-decorator';

import { ISong } from '../../contracts/song.interface';
import { FavoritesService } from '../../services/favorites.service';
import { MusicService } from '../../services/music.service';

@Component
export default class SongListComponent extends Vue {
	@Prop() songs!: ISong[];
	currentSongPaused: boolean = false;
	favorites: number[] = [];
	playingSong: ISong = null;
	subscriptions: Subscription[] = [];

	created(): void {
		this.subscriptions.push(MusicService.currentlyPlayingSong.subscribe(playingSong => {
			this.playingSong = playingSong;
		}));

		this.subscriptions.push(MusicService.currentlyPlayingSongPaused.subscribe(currentSongPaused => {
			this.currentSongPaused = currentSongPaused;
		}));

		this.subscriptions.push(FavoritesService.favoritesChange.subscribe(favorites => {
			this.favorites = favorites;
		}));
	}

	beforeDestroy() {
		this.subscriptions.forEach(sub => sub.unsubscribe());
	}

	playSong(song: ISong): void {
		if (this.playingSong && this.playingSong.id === song.id)
			MusicService.resumeOrPauseCurrentSong();
		else
			MusicService.playSong(song.id);
	}

	playAll(): void {
		MusicService.playCollection(this.songs);
	}

	toggleFavorite(songId: number): void {
		FavoritesService.toggleFavorite(songId);
	}
}