import { IAlbum } from './../../contracts/album.interface';
import { ISong } from './../../contracts/song.interface';

export interface IAlbumState {
	album: IAlbum;
	songs: ISong[];
}