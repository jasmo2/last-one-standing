import { Subscription } from 'rxjs/Subscription';

import {
	Component,
	Vue
} from 'vue-property-decorator';

import { MusicAgent } from '../../agents/music.agent';
import { ISong } from '../../contracts/song.interface';
import { FavoritesService } from '../../services/favorites.service';
import SongListComponent from '../song-list/song-list.component.vue';

@Component({
	components: {
		SongListComponent
	}
})
export default class FavoritesComponent extends Vue {
	songs: ISong[] = [];
	subscriptions: Subscription[] = [];

	created(): void {
		this.subscriptions.push(FavoritesService.favoritesChange.subscribe(favorites => {
			MusicAgent.getSongsById(favorites).subscribe(songs => {
				this.songs = songs;
			});
		}));
	}

	beforeDestroy() {
		this.subscriptions.forEach(sub => sub.unsubscribe());
	}
}