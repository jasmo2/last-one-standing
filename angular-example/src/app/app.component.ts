import { Subscription } from 'rxjs';

import {
	Component,
	OnDestroy,
	ViewEncapsulation
} from '@angular/core';

import { DrawerService } from './services/drawer.service';
import { MusicService } from './services/music.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnDestroy {
	private _subscriptions: Subscription[] = [];

	public isNavDrawerOpen: boolean = true;
	public isPlayerOpen: boolean = false;

	constructor(
		private _drawerService: DrawerService,
		private _musicService: MusicService
	) {
		this._subscriptions.push(this._drawerService.navDrawerOpen.subscribe(open => {
			this.isNavDrawerOpen = open;
		}));

		this._subscriptions.push(this._musicService.currentlyChosenSong.subscribe(chosenSong => {
			this.isPlayerOpen = !!chosenSong;
		}));
	}

	public ngOnDestroy(): void {
		this._subscriptions.forEach(sub => sub.unsubscribe());
	}
}