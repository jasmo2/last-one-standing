import { IArtist } from '../../contracts/artist.interface';
import { ISong } from '../../contracts/song.interface';

export interface IArtistState {
	artist: IArtist;
	songs: ISong[];
}