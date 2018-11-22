import { Subscription } from 'rxjs/Subscription';

import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Toolbar from '@material-ui/core/Toolbar';
import * as React from 'react';
import { Link } from 'react-router-dom';

import './player.component.scss';
import { TimeFormatter } from '../../formatters/time.formatter';
import { FavoritesService } from '../../services/favorites.service';
import { MusicService } from '../../services/music.service';
import { IPlayerState } from './player-state.interface';

export default class PlayerComponent extends React.Component<undefined, IPlayerState> {
	private _skipTimeChange: boolean = false;
	private _subscriptions: Subscription[] = [];

	public state: IPlayerState = {
		chosenSong: null,
		currentSongPaused: false,
		currentTime: null,
		isFavorite: false,
		isPlayingCollection: false,
		isRepeatingCollection: false,
		isShufflingCollection: false,
		playingSongMetadata: null,
		progressValue: 0,
		volumeValue: 100
	};
	public progressRef: React.RefObject<HTMLDivElement> = React.createRef();
	public volumeRef: React.RefObject<HTMLDivElement> = React.createRef();

	componentWillMount() {
		this._subscriptions.push(MusicService.currentlyChosenSong.subscribe(chosenSong => {
			this.setState({ chosenSong });
			if (chosenSong) this.setState({ isFavorite: FavoritesService.isFavorite(chosenSong.id) });
		}));

		this._subscriptions.push(MusicService.currentlyPlayingSongMetadata.subscribe(playingSongMetadata => {
			this.setState({ playingSongMetadata });
		}));

		this._subscriptions.push(MusicService.currentlyPlayingSongTimeChange.subscribe(currentTime => {
			if (this._skipTimeChange) return;
			this.setState({ currentTime, progressValue: currentTime && this.state.playingSongMetadata ? currentTime.raw / this.state.playingSongMetadata.time.raw * 100 : 0 })
		}));

		this._subscriptions.push(MusicService.currentlyPlayingSongVolumeChange.subscribe(volumeValue => {
			this.setState({ volumeValue: volumeValue * 100 })
		}));

		this._subscriptions.push(MusicService.currentlyPlayingSongPaused.subscribe(currentSongPaused => {
			this.setState({ currentSongPaused });
		}));

		this._subscriptions.push(MusicService.isPlayingCollection.subscribe(isPlayingCollection => {
			this.setState({ isPlayingCollection });
		}));

		this._subscriptions.push(MusicService.isRepeatingCollection.subscribe(isRepeatingCollection => {
			this.setState({ isRepeatingCollection });
		}));

		this._subscriptions.push(MusicService.isShufflingCollection.subscribe(isShufflingCollection => {
			this.setState({ isShufflingCollection });
		}));

		this._subscriptions.push(FavoritesService.favoritesChange.subscribe(() => {
			if (this.state.chosenSong) this.setState({ isFavorite: FavoritesService.isFavorite(this.state.chosenSong.id) });
		}));
	}

	componentWillUnmount() {
		this._subscriptions.forEach(sub => sub.unsubscribe());
	}

	public changeProgress(event): void {
		const rect: ClientRect = this.progressRef.current.getBoundingClientRect();
		const progress = (event.pageX - rect.left) / rect.width;
		this.setState({ progressValue: progress * 100, currentTime: TimeFormatter.formatTime(this.state.playingSongMetadata.time.raw * progress) });
	}

	public changeTime(event): void {
		const rect: ClientRect = this.progressRef.current.getBoundingClientRect();
		const progress = (event.pageX - rect.left) / rect.width;
		MusicService.changeCurrentTime(this.state.playingSongMetadata.time.raw * progress);
	}

	public requestCurrentTime(): void {
		MusicService.emitCurrentTime();
	}

	public changeVolumeDisplayValue(event): void {
		const rect: ClientRect = this.volumeRef.current.getBoundingClientRect();
		const progress = (event.pageX - rect.left) / rect.width;
		this.setState({ volumeValue: progress * 100 });
	}

	public setVolume(event): void {
		const rect: ClientRect = this.volumeRef.current.getBoundingClientRect();
		const progress = (event.pageX - rect.left) / rect.width;
		MusicService.setVolume(progress);
	}

	public requestVolume(): void {
		MusicService.emitVolume();
	}

	public toggleMute(): void {
		MusicService.setVolume(this.state.volumeValue < 1 ? 1 : 0);
	}

	public playOrPause(): void {
		MusicService.resumeOrPauseCurrentSong();
	}

	public playNext(): void {
		MusicService.playNextFromCollection();
	}

	public playPrev(): void {
		MusicService.playPrevFromCollection();
	}

	public shuffle(): void {
		MusicService.setShuffleCollection(!this.state.isShufflingCollection);
	}

	public repeat(): void {
		MusicService.setRepeatCollection(!this.state.isRepeatingCollection);
	}

	public toggleFavorite(): void {
		FavoritesService.toggleFavorite(this.state.chosenSong.id);
	}

	public close(): void {
		MusicService.reset();
	}

	public render(): JSX.Element {
		if (!this.state.chosenSong) return null;
		return (
			<AppBar id="player">
				<Toolbar>
					<Grid container>
						<Grid item xs={3} className="song-details">
							<img src={`backend/covers/${this.state.chosenSong.album.coverImg}`} className="pull-left" />
							<div><Link to={`/album/${this.state.chosenSong.album.id}`}><b>{this.state.chosenSong.title}</b></Link></div>
							<div><Link to={`/artist/${this.state.chosenSong.artist.id}`}>{this.state.chosenSong.artist.name}</Link></div>
							<IconButton onClick={() => this.toggleFavorite()}>
								<Icon>{this.state.isFavorite ? 'star' : 'star_border'}</Icon>
							</IconButton>
						</Grid>
						<Grid item xs={6}>
							<Grid container className="controls">
								<Grid item xs={12} className="align-center">
									<IconButton disabled={!this.state.isPlayingCollection} className={`${this.state.isShufflingCollection ? 'active' : ''}`} onClick={() => this.shuffle()}>
										<Icon>shuffle</Icon>
									</IconButton>
									<IconButton disabled={!this.state.isPlayingCollection} onClick={() => this.playPrev()}>
										<Icon>skip_previous</Icon>
									</IconButton>
									<IconButton onClick={() => this.playOrPause()}>
										<Icon style={{ fontSize: '48px' }}>{this.state.currentSongPaused ? 'play_circle_outline' : 'pause_circle_outline'}</Icon>
									</IconButton>
									<IconButton disabled={!this.state.isPlayingCollection} onClick={() => this.playNext()}>
										<Icon>skip_next</Icon>
									</IconButton>
									<IconButton disabled={!this.state.isPlayingCollection} className={`${this.state.isRepeatingCollection ? 'active' : ''}`} onClick={() => this.repeat()}>
										<Icon>repeat</Icon>
									</IconButton>
								</Grid>
							</Grid>
							<Grid container className="controls">
								<Grid item xs={1} className="align-right" style={{ fontSize: '14px' }}>
									{this.state.currentTime ? `${this.state.currentTime.minutes}:${(this.state.currentTime.seconds.toString()).padStart(2, '0')}` : ''}
								</Grid>
								<Grid item xs={10} className="progress">
									<div ref={this.progressRef} onClick={(e) => this.changeTime(e)} onMouseEnter={() => this._skipTimeChange = true} onMouseLeave={() => { this._skipTimeChange = false; this.requestCurrentTime() }} onMouseMove={(e) => this.changeProgress(e)} >
										<LinearProgress className="range" variant="determinate" value={this.state.progressValue}></LinearProgress>
									</div>
								</Grid>
								<Grid item xs={1} style={{ fontSize: '14px' }}>
									{this.state.playingSongMetadata ? `${this.state.playingSongMetadata.time.minutes}:${(this.state.playingSongMetadata.time.seconds.toString()).padStart(2, '0')}` : ''}
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={3}>
							<Grid container>
								<Grid item xs={2}></Grid>
								<Grid item xs={3} className="align-right volume-button">
									<IconButton onClick={() => this.toggleMute()}>
										<Icon>{this.state.volumeValue < 1 ? 'volume_off' : this.state.volumeValue < 10 ? 'volume_mute' : this.state.volumeValue < 50 ? 'volume_down' : 'volume_up'}}</Icon>
									</IconButton>
								</Grid>
								<Grid item xs={5} className="volume">
									<div ref={this.volumeRef} onClick={(e) => this.setVolume(e)} onMouseMove={(e) => this.changeVolumeDisplayValue(e)} onMouseLeave={() => this.requestVolume()}>
										<LinearProgress className="range" variant="determinate" value={this.state.volumeValue}></LinearProgress>
									</div>
								</Grid>
								<Grid item xs={2} className="align-right close">
									<IconButton onClick={() => this.close()}>
										<Icon>close</Icon>
									</IconButton>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
		);
	};
}