import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class StorageService {
	private _storage: Storage = localStorage;

	public get<T>(key: string): T {
		return JSON.parse(this._storage.getItem(key));
	}

	public getOrDefault<T>(key: string, value: T): T {
		const storedValue = this.get<T>(key);
		return storedValue === null || storedValue === undefined ? value : storedValue;
	}

	public set(key: string, value: any): void {
		this._storage.setItem(key, JSON.stringify(value));
	}
}