import { Subscription } from 'rxjs';

import {
	Component,
	Input,
	OnDestroy
} from '@angular/core';

import { ISong } from './../../contracts/song.interface';
import { FavoritesService } from './../../services/favorites.service';
import { MusicService } from './../../services/music.service';

@Component({
	selector: 'song-list-component',
	templateUrl: './song-list.component.html',
	styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnDestroy {
	private _subscriptions: Subscription[] = [];

	@Input() public songs!: ISong[];
	public currentSongPaused: boolean = false;
	public displayedColumns: string[] = ['play', 'favorite', 'title', 'artist', 'album'];
	public favorites: number[] = [];
	public playingSong: ISong = null;

	constructor(
		private _favoritesService: FavoritesService,
		private _musicService: MusicService
	) {
		this._subscriptions.push(this._musicService.currentlyPlayingSong.subscribe(playingSong => {
			this.playingSong = playingSong;
		}));

		this._subscriptions.push(this._musicService.currentlyPlayingSongPaused.subscribe(currentSongPaused => {
			this.currentSongPaused = currentSongPaused;
		}));

		this._subscriptions.push(this._favoritesService.favoritesChange.subscribe(favorites => {
			this.favorites = favorites;
		}));
	}

	public ngOnDestroy(): void {
		this._subscriptions.forEach(sub => sub.unsubscribe());
	}

	public playSong(song: ISong): void {
		if (this.playingSong && this.playingSong.id === song.id)
			this._musicService.resumeOrPauseCurrentSong();
		else
			this._musicService.playSong(song.id);
	}

	public playAll(): void {
		this._musicService.playCollection(this.songs);
	}

	public toggleFavorite(songId: number): void {
		this._favoritesService.toggleFavorite(songId);
	}
}