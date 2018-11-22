import { BehaviorSubject } from 'rxjs';

import { Injectable } from '@angular/core';

import { StorageItems } from '../enums/storage-items.enum';
import { StorageService } from './storage.service';

@Injectable({
	providedIn: 'root',
})
export class FavoritesService {
	private _favorites: number[] = this._storageService.getOrDefault<number[]>(StorageItems.Favorites, []);
	private _favoritesSubject: BehaviorSubject<number[]> = new BehaviorSubject(this._favorites);
	public favoritesChange = this._favoritesSubject.asObservable();

	constructor(
		private _storageService: StorageService
	) { }

	public isFavorite(id: number): boolean {
		return this._favorites.indexOf(id) > -1;
	}

	public toggleFavorite(id: number): void {
		this.setFavorite(id, !this.isFavorite(id));
	}

	public setFavorite(id: number, isFavorite: boolean): void {
		if ((isFavorite && this.isFavorite(id)) || (!isFavorite && !this.isFavorite(id))) return;
		if (isFavorite) this._favorites.push(id);
		else this._favorites.splice(this._favorites.indexOf(id), 1);
		this._storageService.set(StorageItems.Favorites, this._favorites);
		this._favoritesSubject.next(this._favorites.slice());
	}
}