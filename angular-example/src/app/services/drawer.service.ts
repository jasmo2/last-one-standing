import {
	BehaviorSubject,
	Subject
} from 'rxjs';

import { Injectable } from '@angular/core';

import { StorageItems } from '../enums/storage-items.enum';
import { StorageService } from './storage.service';

@Injectable({
	providedIn: 'root',
})
export class DrawerService {
	private _navDrawerOpenSubject: BehaviorSubject<boolean> = new BehaviorSubject(this._storageService.getOrDefault<boolean>(StorageItems.DrawerOpen, true));
	private _navDrawerToggleSubject: Subject<void> = new Subject();
	public navDrawerToggle = this._navDrawerToggleSubject.asObservable();
	public navDrawerOpen = this._navDrawerOpenSubject.asObservable();

	constructor(
		private _storageService: StorageService
	) { }

	public toggleNavDrawer(visible?: boolean): void {
		if (visible === null || visible === undefined)
			this._navDrawerToggleSubject.next();
		else this._navDrawerOpenSubject.next(visible);
	}
}