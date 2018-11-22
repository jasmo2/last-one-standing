import { Subject } from 'rxjs/Subject';

class HeaderToolbarServiceSingleton {
	private _clearSearchPhraseSubject: Subject<void> = new Subject();

	public get clearSearchPhrase() { return this._clearSearchPhraseSubject.asObservable() };

	public requestClearSearchPhrase(): void {
		this._clearSearchPhraseSubject.next();
	}
}

export const HeaderToolbarService = new HeaderToolbarServiceSingleton();