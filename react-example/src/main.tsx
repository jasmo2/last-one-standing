import { Subscription } from 'rxjs/Subscription';

import * as React from 'react';
import {
	Route,
	Switch
} from 'react-router-dom';

import './main.scss';
import AlbumComponent from './components/album/album.component';
import ArtistComponent from './components/artist/artist.component';
import FavoritesComponent from './components/favorites/favorites.component';
import HeaderToolbarComponent from './components/header-toolbar/header-toolbar.component';
import HomeComponent from './components/home/home.component';
import NavDrawerComponent from './components/nav-drawer/nav-drawer.component';
import PlayerComponent from './components/player/player.component';
import PlaylistsComponent from './components/playlists/playlists.component';
import SearchComponent from './components/search/search.component';
import { DrawerService } from './services/drawer.service';
import { MusicService } from './services/music.service';

export default class Main extends React.Component {
	private _subscriptions: Subscription[] = [];
	public state = {
		navDrawerOpen: true,
		playerOpen: false
	}

	public componentWillMount(): void {
		this._subscriptions.push(DrawerService.navDrawerOpen.subscribe(open => {
			this.setState({ navDrawerOpen: open });
		}));

		this._subscriptions.push(MusicService.currentlyChosenSong.subscribe(chosenSong => {
			this.setState({ playerOpen: !!chosenSong })
		}));
	}

	public componentWillUnmount(): void {
		this._subscriptions.forEach(sub => sub.unsubscribe());
	}

	render() {
		return (
			<div className={`root ${this.state.navDrawerOpen ? 'nav-drawer-open' : ''} ${this.state.playerOpen ? 'player-open' : ''}`}>
				<HeaderToolbarComponent />
				<NavDrawerComponent />
				<PlayerComponent />
				<main id="content">
					<Switch>
						<Route exact path='/' component={HomeComponent} />
						<Route path='/search' component={SearchComponent} />
						<Route path='/favorites' component={FavoritesComponent} />
						<Route path='/playlists' component={PlaylistsComponent} />
						<Route path='/album/:id' component={AlbumComponent} />
						<Route path='/artist/:id' component={ArtistComponent} />
					</Switch>
				</main>
			</div>
		);
	}
}