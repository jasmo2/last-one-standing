import { Subscription } from 'rxjs';

import {
	Component,
	OnDestroy
} from '@angular/core';

import { MusicAgent } from './../../agents/music.agent';
import { ISong } from './../../contracts/song.interface';
import { MusicService } from './../../services/music.service';

@Component({
	templateUrl: './home.component.html',
	styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnDestroy {
	public currentSongPaused: boolean = false;
	public playingSong: ISong = null;
	public subscriptions: Subscription[] = [];
	public suggestedSongs: ISong[] = [];

	constructor(
		private _musicAgent: MusicAgent,
		private _musicService: MusicService
	) {
		this.refreshSuggested();

		this.subscriptions.push(this._musicService.currentlyPlayingSong.subscribe(playingSong => {
			this.playingSong = playingSong;
		}));

		this.subscriptions.push(this._musicService.currentlyPlayingSongPaused.subscribe(currentSongPaused => {
			this.currentSongPaused = currentSongPaused;
		}));
	}

	public ngOnDestroy(): void {
		this.subscriptions.forEach(sub => sub.unsubscribe());
	}

	public refreshSuggested(): void {
		this._musicAgent.getSuggested().subscribe(suggestedSongs => {
			this.suggestedSongs = suggestedSongs;
		});
	}

	public playSong(song: ISong): void {
		if (this.playingSong && this.playingSong.id === song.id)
			this._musicService.resumeOrPauseCurrentSong();
		else
			this._musicService.playSong(song.id);
	}
}