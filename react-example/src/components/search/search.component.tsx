import Grid from '@material-ui/core/Grid';
import { parse } from 'query-string';
import * as React from 'react';
import { Link } from 'react-router-dom';

import './search.component.scss';
import { MusicAgent } from '../../agents/music.agent';
import { HeaderToolbarService } from '../../services/header-toolbar.service';
import SongListComponent from '../song-list/song-list.component';
import { ISearchState } from './search-state.interface';

export default class SearchComponent extends React.Component<any, ISearchState> {
	private _unlistenLocation: () => void = null;

	public state: ISearchState = {
		phrase: '',
		result: {
			songs: [],
			albums: [],
			artists: []
		}
	}

	componentWillMount(): void {
		if (this.props.location.search) this.search(parse(this.props.location.search).phrase);

		this._unlistenLocation = this.props.history.listen(location => {
			if (location.search) this.search(parse(location.search).phrase);
		});
	}

	componentWillUnmount(): void {
		this._unlistenLocation();
		HeaderToolbarService.requestClearSearchPhrase();
	}

	private search(phrase: string) {
		MusicAgent.searchByPhrase(phrase).subscribe(result => {
			this.setState({ result, phrase });
		});
	}

	public render(): JSX.Element {
		return (
			<div id="search-component">
				<Grid spacing={32} container className="margin-bottom large">
					{this.state.result.artists && this.state.result.artists.length ? (
						<Grid item xs={true}>
							<Grid container>
								<h1>Artists</h1>
								{this.state.result.artists.map(artist => {
									return (
										<Grid item key={artist.id} xs={3} className="margin-bottom">
											<Grid container>
												<Link to={`/album/${artist.id}`}>
													<Grid item xs={6} className="center">
														<img className="rounded margin-bottom" src={`backend/artists/${artist.img}`} />
													</Grid>
													<Grid item className="center">
														{artist.name}
													</Grid>
												</Link>
											</Grid>
										</Grid>
									);
								})}
							</Grid>
						</Grid>
					) : ''}
					{this.state.result.albums && this.state.result.albums.length ? (
						<Grid item xs={true}>
							<Grid container>
								<h1>Albums</h1>
								{this.state.result.albums.map(album => {
									return (
										<Grid item key={album.id} xs={3} className="margin-bottom">
											<Grid container>
												<Link to={`/album/${album.id}`}>
													<Grid item xs={6} className="center">
														<img className="rounded margin-bottom" src={`backend/covers/${album.coverImg}`} />
													</Grid>
													<Grid item className="center">
														{album.title}
													</Grid>
												</Link>
											</Grid>
										</Grid>
									);
								})}
							</Grid>
						</Grid>
					) : ''}
				</Grid>
				<Grid container>
					<Grid item xs={true}>
						<h1>Song results for '{this.state.phrase}'</h1>
						<SongListComponent songs={this.state.result.songs}></SongListComponent>
					</Grid>
				</Grid>
			</div >
		);
	}
}