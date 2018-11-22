import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { IAlbum } from '../contracts/album.interface';
import { ISong } from '../contracts/song.interface';
import { BaseAgent } from './base.agent';
import { MusicAgent } from './music.agent';

class AlbumAgentSingleton extends BaseAgent {
	public getById(id: number): Observable<IAlbum> {
		return MusicAgent.getAll().map<ISong[], IAlbum>(songs => songs.find(song => song.album.id === id).album);
	}

	public getSongsByArtistId(id: number): Observable<ISong[]> {
		return MusicAgent.getAll().map<ISong[], ISong[]>(songs => songs.filter(song => song.album.id === id));
	}
}

export const AlbumAgent = new AlbumAgentSingleton();