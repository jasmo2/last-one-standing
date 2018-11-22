import { Subscription } from 'rxjs/Subscription';

import Drawer from '@material-ui/core/Drawer';
import Icon from '@material-ui/core/Icon';
import * as React from 'react';
import { NavLink } from 'react-router-dom';

import './nav-drawer.component.scss';
import { StorageItems } from '../../enums/storage-items.enum';
import { DrawerService } from '../../services/drawer.service';
import { StorageService } from '../../services/storage.service';
import { INavDrawerState } from './nav-drawer-state.interface';

export default class NavDrawerComponent extends React.Component<undefined, INavDrawerState> {
	private _subscriptions: Subscription[] = [];
	public state: INavDrawerState = {
		show: true
	}

	public componentWillMount(): void {
		this._subscriptions.push(DrawerService.navDrawerOpen.subscribe(open => {
			if (this.state.show !== open) this.setState({ show: open });
			StorageService.set(StorageItems.DrawerOpen, open);
		}));

		this._subscriptions.push(DrawerService.navDrawerToggle.subscribe(() => {
			DrawerService.toggleNavDrawer(!this.state.show);
		}));
	}

	public componentWillUnmount(): void {
		this._subscriptions.forEach(sub => sub.unsubscribe());
	}

	public render(): JSX.Element {
		return (
			<Drawer id="nav-drawer" variant="persistent" open={this.state.show}>
				<div className="menu-links">
					<NavLink to="/favorites">
						<Icon>star</Icon> Favorites
					</NavLink>
					<NavLink to="/playlists">
						<Icon>playlist_play</Icon> Playlists
					</NavLink>
				</div>
			</Drawer>
		);
	}
}