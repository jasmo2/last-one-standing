import { ISongMetadata } from './../../contracts/song-metadata.interface';
import { ISong } from './../../contracts/song.interface';
import { ITime } from './../../contracts/time.interface';

export interface IPlayerState {
	chosenSong: ISong;
	currentSongPaused: boolean;
	currentTime: ITime;
	isFavorite: boolean;
	isPlayingCollection: boolean;
	isRepeatingCollection: boolean;
	isShufflingCollection: boolean;
	playingSongMetadata: ISongMetadata;
	progressValue: number;
	volumeValue: number;
};