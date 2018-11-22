import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import { StorageItems } from '../enums/storage-items.enum';
import { StorageService } from './storage.service';

class DrawerServiceSingleton {
	private _navDrawerOpenSubject: BehaviorSubject<boolean> = new BehaviorSubject(StorageService.getOrDefault<boolean>(StorageItems.DrawerOpen, true));
	private _navDrawerToggleSubject: Subject<void> = new Subject();
	public navDrawerToggle = this._navDrawerToggleSubject.asObservable();
	public navDrawerOpen = this._navDrawerOpenSubject.asObservable();

	public toggleNavDrawer(visible?: boolean): void {
		if (visible === null || visible === undefined)
			this._navDrawerToggleSubject.next();
		else this._navDrawerOpenSubject.next(visible);
	}
}

export const DrawerService = new DrawerServiceSingleton();