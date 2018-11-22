import 'rxjs/add/observable/forkJoin';
import { Observable } from 'rxjs/Observable';

import Grid from '@material-ui/core/Grid';
import * as React from 'react';

import { ArtistAgent } from '../../agents/artist.agent';
import SongListComponent from '../song-list/song-list.component';
import { IArtistState } from './artist-state.interface';

export default class ArtistComponent extends React.Component<any, IArtistState> {
	public state: IArtistState = {
		artist: null,
		songs: []
	}

	componentWillMount(): void {
		const albumId: number = +this.props.match.params.id;

		Observable.forkJoin([
			ArtistAgent.getById(albumId),
			ArtistAgent.getSongsByArtistId(albumId)
		]).subscribe(result => {
			this.setState({ artist: result[0], songs: result[1] });
		});
	}

	public render(): JSX.Element {
		return (
			<Grid container spacing={24}>
				{this.state.artist ?
					(
						<Grid item xs={3}>
							<img src={`backend/artists/${this.state.artist.img}`} />
							<h3 className="no-border">
								{this.state.artist.name}
							</h3>
						</Grid>
					) : ''
				}
				{this.state.songs.length ?
					(
						<Grid item xs={9}>
							<SongListComponent songs={this.state.songs}></SongListComponent>
						</Grid>
					) : ''

				}
			</Grid >
		);
	}
}