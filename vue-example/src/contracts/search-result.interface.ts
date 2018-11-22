import { IAlbum } from './album.interface';
import { IArtist } from './artist.interface';
import { ISong } from './song.interface';

export interface ISearchResult {
	songs: ISong[];
	artists: IArtist[];
	albums: IAlbum[];
}