import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { IArtist } from '../contracts/artist.interface';
import { ISong } from '../contracts/song.interface';
import { MusicAgent } from './music.agent';

@Injectable({
	providedIn: 'root'
})
export class ArtistAgent {
	constructor(
		private _musicAgent: MusicAgent
	) { }

	public getById(id: number): Observable<IArtist> {
		return this._musicAgent.getAll().pipe(
			map<ISong[], IArtist>(songs => songs.find(song => song.artist.id === id).artist)
		);
	}

	public getSongsByArtistId(id: number): Observable<ISong[]> {
		return this._musicAgent.getAll().pipe(
			map<ISong[], ISong[]>(songs => songs.filter(song => song.artist.id === id))
		);
	}
}