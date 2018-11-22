import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { IAlbum } from '../contracts/album.interface';
import { ISong } from '../contracts/song.interface';
import { MusicAgent } from './music.agent';

@Injectable({
	providedIn: 'root'
})
export class AlbumAgent {
	constructor(
		private _musicAgent: MusicAgent
	) { }

	public getById(id: number): Observable<IAlbum> {
		return this._musicAgent.getAll().pipe(
			map<ISong[], IAlbum>(songs => songs.find(song => song.album.id === id).album)
		);
	}

	public getSongsByAlbumId(id: number): Observable<ISong[]> {
		return this._musicAgent.getAll().pipe(
			map<ISong[], ISong[]>(songs => songs.filter(song => song.album.id === id))
		);
	}
}