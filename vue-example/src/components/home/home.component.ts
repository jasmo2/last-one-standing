import { Subscription } from 'rxjs/Subscription';

import {
	Component,
	Vue
} from 'vue-property-decorator';

import { MusicAgent } from '../../agents/music.agent';
import { ISong } from '../../contracts/song.interface';
import { MusicService } from '../../services/music.service';

@Component
export default class HomeComponent extends Vue {
	currentSongPaused: boolean = false;
	playingSong: ISong = null;
	subscriptions: Subscription[] = [];
	suggestedSongs: ISong[] = [];

	created(): void {
		this.refreshSuggested();

		this.subscriptions.push(MusicService.currentlyPlayingSong.subscribe(playingSong => {
			this.playingSong = playingSong;
		}));

		this.subscriptions.push(MusicService.currentlyPlayingSongPaused.subscribe(currentSongPaused => {
			this.currentSongPaused = currentSongPaused;
		}));
	}

	beforeDestroy() {
		this.subscriptions.forEach(sub => sub.unsubscribe());
	}

	refreshSuggested(): void {
		MusicAgent.getSuggested().subscribe(suggestedSongs => {
			this.suggestedSongs = suggestedSongs;
		});
	}

	playSong(song: ISong): void {
		if (this.playingSong && this.playingSong.id === song.id)
			MusicService.resumeOrPauseCurrentSong();
		else
			MusicService.playSong(song.id);
	}
}