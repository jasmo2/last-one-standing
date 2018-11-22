import { ITime } from '../contracts/time.interface';

export class TimeFormatter {
	public static formatTime(seconds: number): ITime {
		return {
			raw: seconds,
			minutes: Math.floor(seconds / 60),
			seconds: Math.floor(seconds % 60)
		}
	}
}