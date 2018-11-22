import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { StorageItems } from '../enums/storage-items.enum';
import { StorageService } from './storage.service';

class FavoritesServiceSingleton {
	private _favorites: number[] = StorageService.getOrDefault<number[]>(StorageItems.Favorites, []);
	private _favoritesSubject: BehaviorSubject<number[]> = new BehaviorSubject(this._favorites);
	public favoritesChange = this._favoritesSubject.asObservable();

	public isFavorite(id: number): boolean {
		return this._favorites.indexOf(id) > -1;
	}

	public toggleFavorite(id: number): void {
		this.setFavorite(id, !this.isFavorite(id))
	}

	public setFavorite(id: number, isFavorite: boolean): void {
		if ((isFavorite && this.isFavorite(id)) || (!isFavorite && !this.isFavorite(id))) return;
		if (isFavorite) this._favorites.push(id);
		else this._favorites.splice(this._favorites.indexOf(id), 1);
		StorageService.set(StorageItems.Favorites, this._favorites);
		this._favoritesSubject.next(this._favorites.slice());
	}
}

export const FavoritesService = new FavoritesServiceSingleton();