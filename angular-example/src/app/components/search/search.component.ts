import { Subscription } from 'rxjs';

import {
	Component,
	OnDestroy
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MusicAgent } from './../../agents/music.agent';
import { ISearchResult } from './../../contracts/search-result.interface';
import { HeaderToolbarService } from './../../services/header-toolbar.service';

@Component({
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnDestroy {
	private _subscriptions: Subscription[] = [];

	public result: ISearchResult = { songs: [], artists: [], albums: [] };

	constructor(
		private _headerToolbarService: HeaderToolbarService,
		private _route: ActivatedRoute,
		private _musicAgent: MusicAgent
	) {
		this._subscriptions.push(this._route.queryParams.subscribe(params => {
			this.search(params.phrase);
		}));
	}

	public ngOnDestroy(): void {
		this._subscriptions.forEach(sub => sub.unsubscribe());
		this._headerToolbarService.requestClearSearchPhrase();
	}

	public search(phrase: string): void {
		this._musicAgent.searchByPhrase(phrase).subscribe(result => {
			this.result = result;
		});
	}
}