import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { IArtist } from '../contracts/artist.interface';
import { ISong } from '../contracts/song.interface';
import { BaseAgent } from './base.agent';
import { MusicAgent } from './music.agent';

class ArtistAgentSingleton extends BaseAgent {
	public getById(id: number): Observable<IArtist> {
		return MusicAgent.getAll().map<ISong[], IArtist>(songs => songs.find(song => song.artist.id === id).artist);
	}

	public getSongsByArtistId(id: number): Observable<ISong[]> {
		return MusicAgent.getAll().map<ISong[], ISong[]>(songs => songs.filter(song => song.artist.id === id));
	}
}

export const ArtistAgent = new ArtistAgentSingleton();