import { Subject } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class HeaderToolbarService {
	private _clearSearchPhraseSubject: Subject<void> = new Subject();

	public clearSearchPhrase = this._clearSearchPhraseSubject.asObservable();

	public requestClearSearchPhrase(): void {
		this._clearSearchPhraseSubject.next();
	}
}