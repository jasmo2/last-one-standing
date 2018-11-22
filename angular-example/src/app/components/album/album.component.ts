import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AlbumAgent } from './../../agents/album.agent';
import { IAlbum } from './../../contracts/album.interface';
import { ISong } from './../../contracts/song.interface';

@Component({
	templateUrl: './album.component.html'
})
export class AlbumComponent {
	public album: IAlbum = null;
	public songs: ISong[] = [];

	constructor(
		private _albumAgent: AlbumAgent,
		private _route: ActivatedRoute
	) {
		const albumId: number = +this._route.snapshot.params.id;

		this._albumAgent.getById(albumId).subscribe(album => {
			this.album = album;
		});

		this._albumAgent.getSongsByAlbumId(albumId).subscribe(songs => {
			this.songs = songs;
		});
	}
}