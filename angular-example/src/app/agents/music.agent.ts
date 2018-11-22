import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IAlbum } from '../contracts/album.interface';
import { IArtist } from '../contracts/artist.interface';
import { ISearchResult } from '../contracts/search-result.interface';
import { ISong } from '../contracts/song.interface';

@Injectable({
	providedIn: 'root'
})
export class MusicAgent {
	constructor(
		private _http: HttpClient
	) { }

	public getSuggested(): Observable<ISong[]> {
		return this.getAll().pipe(
			map(songs => {
				const random = Math.round(Math.random() * (songs.length - 4));
				return songs.slice(random, random + 4);
			})
		);
	}

	public searchByPhrase(phrase: string): Observable<ISearchResult> {
		const searchPhrase = phrase.toLocaleLowerCase();
		return this.getAll().pipe(
			map<ISong[], ISearchResult>(result => {
				const songs = result.filter(song => song.title.toLocaleLowerCase().includes(searchPhrase));
				const artists = result.map(song => song.artist).filter(artist => artist.name.toLocaleLowerCase().includes(searchPhrase));
				const albums = result.map(song => song.album).filter(album => album.title.toLocaleLowerCase().includes(searchPhrase));
				const uniqueArtists: IArtist[] = [], uniqueAlbums: IAlbum[] = [];
				artists.forEach(artist => {
					if (!uniqueArtists.find(uniqueArtist => uniqueArtist.id === artist.id))
						uniqueArtists.push(artist);
				});
				albums.forEach(album => {
					if (!uniqueAlbums.find(uniqueAlbum => uniqueAlbum.id === album.id))
						uniqueAlbums.push(album);
				});
				return { songs, artists: uniqueArtists, albums: uniqueAlbums };
			}));
	}

	public getSongById(id: number): Observable<ISong> {
		return this.getAll().pipe(
			map<ISong[], ISong>(songs => songs.find(song => song.id === id))
		);
	}

	public getSongsById(ids: number[]): Observable<ISong[]> {
		return this.getAll().pipe(
			map<ISong[], ISong[]>(songs => songs.filter(song => ids.indexOf(song.id) > -1))
		);
	}

	public getAll(): Observable<ISong[]> {
		return this._http.get<ISong[]>('backend/all.json');
	}
}