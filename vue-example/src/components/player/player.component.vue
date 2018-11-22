<template>
	<md-toolbar v-if="chosenSong">
		<div class="md-layout">
			<div class="md-layout-item md-size-25 song-details">
				<img v-bind:src="'backend/covers/' + chosenSong.album.coverImg" class="pull-left" />
				<div><router-link v-bind:to="'/album/' + chosenSong.album.id"><b>{{chosenSong.title}}</b></router-link></div>
				<div><router-link v-bind:to="'/artist/' + chosenSong.artist.id">{{chosenSong.artist.name}}</router-link></div>
				<md-button class="md-icon-button" @click="toggleFavorite()">
					<md-icon>{{isFavorite ? 'star' : 'star_border'}}</md-icon>
				</md-button>
			</div>
			<div class="md-layout-item">
				<div class="md-layout controls">
					<div class="md-layout-item align-center">
						<md-button class="md-icon-button" :disabled="!isPlayingCollection" :active="isShufflingCollection" @click="shuffle">
							<md-icon>shuffle</md-icon>
						</md-button>
						<md-button class="md-icon-button" :disabled="!isPlayingCollection" @click="playPrev">
							<md-icon>skip_previous</md-icon>
						</md-button>
						<md-button class="md-icon-button md-size-2x" @click="playOrPause">
							<md-icon class="md-size-2x">{{currentSongPaused ? 'play_circle_outline' : 'pause_circle_outline'}}</md-icon>
						</md-button>
						<md-button class="md-icon-button" :disabled="!isPlayingCollection" @click="playNext">
							<md-icon>skip_next</md-icon>
						</md-button>
						<md-button class="md-icon-button" :disabled="!isPlayingCollection" :active="isRepeatingCollection" @click="repeat">
							<md-icon>repeat</md-icon>
						</md-button>
					</div>
				</div>
				<div class="md-layout">
					<div class="md-layout-item md-size-10 align-right">
						<div v-if="currentTime">
							{{currentTime.minutes}}:{{currentTime.seconds.toString().padStart(2, '0')}}
						</div>
					</div>
					<div class="md-layout-item progress">
						<div v-on:click="changeTime" v-on:mouseenter="skipTimeChange = true" v-on:mouseleave="skipTimeChange = false; requestCurrentTime()" v-on:mousemove="changeProgress" >
							<md-progress-bar md-mode="determinate" :md-value="progressValue"></md-progress-bar>
						</div>
					</div>
					<div class="md-layout-item md-size-10">
						<div v-if="playingSongMetadata">
							{{playingSongMetadata.time.minutes}}:{{playingSongMetadata.time.seconds.toString().padStart(2, '0')}}
						</div>
					</div>
				</div>
			</div>
			<div class="md-layout-item md-size-5"></div>
			<div class="md-layout-item md-size-5 volume-button align-right">
				<md-button class="md-icon-button" @click="toggleMute">
					<md-icon>{{volumeValue < 1 ? 'volume_off' : volumeValue < 10 ? 'volume_mute' : volumeValue < 50 ? 'volume_down' : 'volume_up' }}</md-icon>
				</md-button>
			</div>
			<div class="md-layout-item md-size-10 volume">
				<div v-on:click="setVolume" v-on:mousemove="changeVolumeDisplayValue" v-on:mouseleave="requestVolume()">
					<md-progress-bar md-mode="determinate" :md-value="volumeValue"></md-progress-bar>
				</div>
			</div>
			<div class="md-layout-item md-size-5 align-right close">
				<md-button class="md-icon-button" @click="close">
					<md-icon>close</md-icon>
				</md-button>
			</div>
		</div>
	</md-toolbar>
</template>
<script src="./player.component.ts"></script>
<style src="./player.component.scss" scoped></style>
