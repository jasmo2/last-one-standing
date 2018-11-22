import 'rxjs/add/observable/forkJoin';
import { Observable } from 'rxjs/Observable';

import Grid from '@material-ui/core/Grid';
import * as React from 'react';

import { AlbumAgent } from '../../agents/album.agent';
import SongListComponent from '../song-list/song-list.component';
import { IAlbumState } from './album-state.interface';

export default class AlbumComponent extends React.Component<any, IAlbumState> {
	public state: IAlbumState = {
		album: null,
		songs: []
	}

	componentWillMount(): void {
		const albumId: number = +this.props.match.params.id;

		Observable.forkJoin([
			AlbumAgent.getById(albumId),
			AlbumAgent.getSongsByArtistId(albumId)
		]).subscribe(result => {
			this.setState({ album: result[0], songs: result[1] });
		});
	}

	public render(): JSX.Element {
		return (
			<Grid container spacing={24}>
				{this.state.album ?
					(
						<Grid item xs={3}>
							<img src={`backend/covers/${this.state.album.coverImg}`} />
							<h3 className="no-border">
								{this.state.album.title}
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