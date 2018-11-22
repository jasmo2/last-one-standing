import { Subscription } from 'rxjs/Subscription';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import * as React from 'react';
import { Link } from 'react-router-dom';

import './song-list.component.scss';
import Button from '../../../node_modules/@material-ui/core/Button';
import Icon from '../../../node_modules/@material-ui/core/Icon';
import IconButton from '../../../node_modules/@material-ui/core/IconButton';
import { ISong } from '../../contracts/song.interface';
import { FavoritesService } from './../../services/favorites.service';
import { MusicService } from './../../services/music.service';
import { ISongListProps } from './song-list-props.interface';
import { ISongListState } from './song-list-state.interface';

export default class SongListComponent extends React.Component<ISongListProps, ISongListState> {
	private _subscriptions: Subscription[] = [];

	public state: ISongListState = {
		currentSongPaused: false,
		favorites: [],
		playingSong: null
	}

	public componentWillMount(): void {
		this._subscriptions.push(MusicService.currentlyPlayingSong.subscribe(playingSong => {
			this.setState({ playingSong });
		}));

		this._subscriptions.push(MusicService.currentlyPlayingSongPaused.subscribe(currentSongPaused => {
			this.setState({ currentSongPaused });
		}));

		this._subscriptions.push(FavoritesService.favoritesChange.subscribe(favorites => {
			this.setState({ favorites });
		}));
	}

	public componentWillUnmount(): void {
		this._subscriptions.forEach(sub => sub.unsubscribe());
	}

	public playSong(song: ISong): void {
		if (this.state.playingSong && this.state.playingSong.id === song.id)
			MusicService.resumeOrPauseCurrentSong();
		else
			MusicService.playSong(song.id);
	}

	public playAll(): void {
		MusicService.playCollection(this.props.songs);
	}

	public toggleFavorite(songId: number): void {
		FavoritesService.toggleFavorite(songId);
	}

	public render(): JSX.Element {
		if (!this.props.songs || !this.props.songs.length) return <h3 className="no-border">There are no results to show.</h3>;
		return (
			<Paper className="song-list">
				<Table>
					<TableHead>
						<TableRow>
							<TableCell className="thin overflow-visible relative">
								<Button color="primary" variant="raised" className="absolute" onClick={() => this.playAll()}>PLAY ALL</Button>
							</TableCell>
							<TableCell className="thin"></TableCell>
							<TableCell>Title</TableCell>
							<TableCell>Artist</TableCell>
							<TableCell>Album</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{this.props.songs.map(song => {
							return (
								<TableRow key={song.id}>
									<TableCell className="thin">
										<IconButton className={`${this.state.playingSong && this.state.playingSong.id === song.id ? 'active' : ''}`} onClick={() => this.playSong(song)}>
											<Icon>{this.state.playingSong && this.state.playingSong.id === song.id && !this.state.currentSongPaused ? 'pause_circle_outline' : 'play_circle_outline'}</Icon>
										</IconButton>
									</TableCell>
									<TableCell className="thin">
										<IconButton onClick={() => this.toggleFavorite(song.id)}>
											<Icon>{this.state.favorites.indexOf(song.id) === -1 ? 'star_border' : 'star'}</Icon>
										</IconButton>
									</TableCell>
									<TableCell>{song.title}</TableCell>
									<TableCell><Link to={`/artist/${song.artist.id}`}>{song.artist.name}</Link></TableCell>
									<TableCell><Link to={`/album/${song.album.id}`}>{song.album.title}</Link></TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</Paper>
		);
	}
}