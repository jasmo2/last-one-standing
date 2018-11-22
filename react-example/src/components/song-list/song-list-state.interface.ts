import { ISong } from './../../contracts/song.interface';

export interface ISongListState {
	currentSongPaused: boolean;
	favorites: number[];
	playingSong: ISong;
}