import { Subscription } from 'rxjs/Subscription';

import * as React from 'react';

import { MusicAgent } from '../../agents/music.agent';
import { FavoritesService } from '../../services/favorites.service';
import SongListComponent from '../song-list/song-list.component';
import { IFavoritesState } from './favorites-state.interface';

export default class FavoritesComponent extends React.Component<undefined, IFavoritesState> {
	private _subscriptions: Subscription[] = [];

	public state: IFavoritesState = {
		songs: []
	}

	componentWillMount(): void {
		this._subscriptions.push(FavoritesService.favoritesChange.subscribe(favorites => {
			MusicAgent.getSongsById(favorites).subscribe(songs => {
				this.setState({ songs });
			});
		}));
	}

	componentWillUnmount(): void {
		this._subscriptions.forEach(sub => sub.unsubscribe());
	}

	public render(): JSX.Element {
		return (
			<div>
				<h1>Favorite songs</h1>
				<SongListComponent songs={this.state.songs}></SongListComponent>
			</div>
		);
	}
}