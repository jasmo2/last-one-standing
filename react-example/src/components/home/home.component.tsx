import { Subscription } from 'rxjs/Subscription';

import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import * as React from 'react';
import { Link } from 'react-router-dom';

import './home.component.scss';
import { MusicAgent } from '../../agents/music.agent';
import { ISong } from '../../contracts/song.interface';
import { MusicService } from '../../services/music.service';
import { IHomeState } from './home-state.interface';

export default class HomeComponent extends React.Component<undefined, IHomeState> {
	private _subscriptions: Subscription[] = [];

	public state: IHomeState = {
		currentSongPaused: false,
		playingSong: null,
		suggestedSongs: []
	}

	componentWillMount(): void {
		this.refreshSuggested();

		this._subscriptions.push(MusicService.currentlyPlayingSong.subscribe(playingSong => {
			this.setState({ playingSong });
		}));

		this._subscriptions.push(MusicService.currentlyPlayingSongPaused.subscribe(currentSongPaused => {
			this.setState({ currentSongPaused });
		}));
	}

	componentWillUnmount(): void {
		this._subscriptions.forEach(sub => sub.unsubscribe());
	}

	public refreshSuggested(): void {
		MusicAgent.getSuggested().subscribe(suggestedSongs => {
			this.setState({ suggestedSongs })
		});
	}

	public playSong(song: ISong): void {
		if (this.state.playingSong && this.state.playingSong.id === song.id)
			MusicService.resumeOrPauseCurrentSong();
		else
			MusicService.playSong(song.id);
	}

	public render(): JSX.Element {
		return (
			<div id="home-component">
				<h1>Home</h1>
				<p>There are millions of songs. Play your favorites, discover new tracks, and build the perfect collection.
				You'll find readymade playlists to match your mood, put together by music fans and experts.
				Hear this week's latest singles and albums, and check out what's hot in the Top 50. There are millions of songs. Play your favorites, discover new tracks, and build the perfect collection.
				You'll find readymade playlists to match your mood, put together by music fans and experts.
				Hear this week's latest singles and albums, and check out what's hot in the Top 50.</p>

				<h2>
					<span className="title">
						Personalized music for you
						<IconButton onClick={() => this.refreshSuggested()}>
							<Icon>refresh</Icon>
						</IconButton>
					</span>
				</h2>

				<Grid container id="suggested-songs" spacing={24}>
					{this.state.suggestedSongs.map(song => {
						return (
							<Grid key={song.id} item xs={3}>
								<div onClick={() => this.playSong(song)} className={`img-wrapper ${this.state.playingSong && this.state.playingSong.id === song.id ? 'active' : ''}`}>
									<img src={`backend/covers/${song.album.coverImg}`} />
									<Icon style={{ fontSize: '72px' }}>{this.state.playingSong && this.state.playingSong.id === song.id && !this.state.currentSongPaused ? 'pause_circle_filled' : 'play_circle_filled'}</Icon>
								</div>
								<div className="details">
									<div className="title">
										<Link to={`/album/${song.album.id}`}>{song.title}</Link>
									</div>
									<div className="artist">
										<Link to={`/artist/${song.artist.id}`}>{song.artist.name}</Link>
									</div>
								</div>
							</Grid>
						);
					})}
				</Grid>
			</div>
		);
	}
}