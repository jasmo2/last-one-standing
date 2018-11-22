import { Subscription } from 'rxjs';

import {
	Component,
	OnDestroy
} from '@angular/core';

import { StorageItems } from './../../enums/storage-items.enum';
import { DrawerService } from './../../services/drawer.service';
import { StorageService } from './../../services/storage.service';

@Component({
	selector: 'nav-drawer-component',
	templateUrl: './nav-drawer.component.html',
	styleUrls: ['./nav-drawer.component.scss']
})
export class NavDrawerComponent implements OnDestroy {
	private _subscriptions: Subscription[] = [];

	public show: boolean = true;

	constructor(
		private _drawerService: DrawerService,
		private _storageService: StorageService
	) {
		this._subscriptions.push(this._drawerService.navDrawerOpen.subscribe(open => {
			if (this.show !== open) this.show = open;
			this._storageService.set(StorageItems.DrawerOpen, open);
		}));

		this._subscriptions.push(this._drawerService.navDrawerToggle.subscribe(() => {
			this._drawerService.toggleNavDrawer(!this.show);
		}));
	}

	public ngOnDestroy(): void {
		this._subscriptions.forEach(sub => sub.unsubscribe());
	}
}