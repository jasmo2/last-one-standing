import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ArtistAgent } from './../../agents/artist.agent';
import { IArtist } from './../../contracts/artist.interface';
import { ISong } from './../../contracts/song.interface';

@Component({
	templateUrl: './artist.component.html'
})
export class ArtistComponent {
	public artist: IArtist = null;
	public songs: ISong[] = [];

	constructor(
		private _artistAgent: ArtistAgent,
		private _route: ActivatedRoute
	) {
		const artistId: number = +this._route.snapshot.params.id;

		this._artistAgent.getById(artistId).subscribe(artist => {
			this.artist = artist;
		});

		this._artistAgent.getSongsByArtistId(artistId).subscribe(songs => {
			this.songs = songs;
		});
	}
}