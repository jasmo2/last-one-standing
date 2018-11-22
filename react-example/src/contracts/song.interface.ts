import { IAlbum } from './album.interface';
import { IArtist } from './artist.interface';

export interface ISong {
	id: number;
	album: IAlbum;
	artist: IArtist;
	title: string;
	source: string;
}