import { Subscription } from 'rxjs/Subscription';

import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import {
	parse,
	stringify
} from 'query-string';
import * as React from 'react';
import {
	Link,
	withRouter
} from 'react-router-dom';

import './header-toolbar.component.scss';
import { DrawerService } from '../../services/drawer.service';
import { HeaderToolbarService } from '../../services/header-toolbar.service';
import { IHeaderToolbarState } from './header-toolbar-state.interface';

class HeaderToolbarComponent extends React.Component<any, IHeaderToolbarState> {
	private _subscriptions: Subscription[] = [];

	public state: IHeaderToolbarState = {
		searchPhrase: ''
	}

	componentWillMount(): void {
		if (this.props.location.search) this.setState({ searchPhrase: parse(this.props.location.search).phrase });

		this._subscriptions.push(HeaderToolbarService.clearSearchPhrase.subscribe(() => {
			this.setState({ searchPhrase: '' });
		}));
	}

	componentWillUnmount(): void {
		this._subscriptions.forEach(sub => sub.unsubscribe());
	}

	public onSearch(event: React.ChangeEvent<HTMLInputElement>): void {
		this.setState({ searchPhrase: event.target.value });
		this.props.history.push({
			pathname: '/search',
			search: stringify({ phrase: event.target.value })
		});
	}

	public toggleNavDrawer(): void {
		DrawerService.toggleNavDrawer();
	}

	public render(): JSX.Element {
		return (
			<AppBar id="header-toolbar">
				<Toolbar>
					<Grid container>
						<Grid item xs={3}>
							<IconButton onClick={() => this.toggleNavDrawer()}>
								<Icon>menu</Icon>
							</IconButton>
							<Link to="/" className="button-link">
								<IconButton>
									<Icon>home</Icon>
								</IconButton>
							</Link>
						</Grid>
						<Grid item xs={5}>
							<TextField value={this.state.searchPhrase} onChange={(e) => this.onSearch(e)} placeholder="Search" fullWidth />
						</Grid>
						<Grid item xs={4} className="align-right">
							<IconButton>
								<Icon>language</Icon>
							</IconButton>
							<IconButton>
								<Icon>help</Icon>
							</IconButton>
							<IconButton>
								<Icon>account_circle</Icon>
							</IconButton>
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
		);
	}
}

export default withRouter(HeaderToolbarComponent);