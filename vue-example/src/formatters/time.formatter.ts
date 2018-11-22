import { ITime } from '../contracts/time.interface';

export class TimeFormatterSingleton {
	public formatTime(seconds: number): ITime {
		return {
			raw: seconds,
			minutes: Math.floor(seconds / 60),
			seconds: Math.floor(seconds % 60)
		}
	}
}

export const TimeFormatter = new TimeFormatterSingleton();