import { Subscription } from 'rxjs';

import {
	Component,
	OnDestroy
} from '@angular/core';

import { MusicAgent } from './../../agents/music.agent';
import { ISong } from './../../contracts/song.interface';
import { FavoritesService } from './../../services/favorites.service';

@Component({
	templateUrl: './favorites.component.html'
})
export class FavoritesComponent implements OnDestroy {
	private _subscriptions: Subscription[] = [];

	public songs: ISong[] = [];

	constructor(
		private _favoritesService: FavoritesService,
		private _musicAgent: MusicAgent
	) {
		this._subscriptions.push(this._favoritesService.favoritesChange.subscribe(favorites => {
			this._musicAgent.getSongsById(favorites).subscribe(songs => {
				this.songs = songs;
			});
		}));
	}

	public ngOnDestroy(): void {
		this._subscriptions.forEach(sub => sub.unsubscribe());
	}
}