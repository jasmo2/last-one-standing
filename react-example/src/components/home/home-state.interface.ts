import { ISong } from "../../contracts/song.interface";

export interface IHomeState {
	currentSongPaused: boolean;
	playingSong: ISong;
	suggestedSongs: ISong[];
}