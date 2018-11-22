import { Subscription } from 'rxjs';
import {
	filter,
	first
} from 'rxjs/operators';

import {
	Component,
	OnDestroy
} from '@angular/core';
import {
	ActivatedRoute,
	Router
} from '@angular/router';

import { DrawerService } from './../../services/drawer.service';
import { HeaderToolbarService } from './../../services/header-toolbar.service';

@Component({
	selector: 'header-toolbar-component',
	templateUrl: './header-toolbar.component.html',
	styleUrls: ['./header-toolbar.component.scss']
})
export class HeaderToolbarComponent implements OnDestroy {
	private _subscriptions: Subscription[] = [];

	public searchPhrase: string = '';

	constructor(
		private _drawerService: DrawerService,
		private _headerToolbarService: HeaderToolbarService,
		private _route: ActivatedRoute,
		private _router: Router
	) {
		this._subscriptions.push(this._route.queryParams.pipe(
			filter(params => !!params.phrase),
			first()
		).subscribe(params => {
			this.searchPhrase = params.phrase;
		}));

		this._subscriptions.push(this._headerToolbarService.clearSearchPhrase.subscribe(() => {
			this.searchPhrase = '';
		}));
	}

	public ngOnDestroy(): void {
		this._subscriptions.forEach(sub => sub.unsubscribe());
	}

	public toggleNavDrawer(): void {
		this._drawerService.toggleNavDrawer();
	}

	public onSearch(): void {
		this._router.navigate(['/search'], {
			queryParams: {
				phrase: this.searchPhrase
			}
		});
	}
}