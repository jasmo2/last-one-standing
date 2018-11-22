<template>
	<div>
		<h1>Home</h1>
		<p>There are millions of songs. Play your favorites, discover new tracks, and build the perfect collection.
		You'll find readymade playlists to match your mood, put together by music fans and experts.
		Hear this week's latest singles and albums, and check out what's hot in the Top 50. There are millions of songs. Play your favorites, discover new tracks, and build the perfect collection.
		You'll find readymade playlists to match your mood, put together by music fans and experts.
		Hear this week's latest singles and albums, and check out what's hot in the Top 50.</p>

		<h2>
			<span>
				Personalized music for you
				<md-button class="md-icon-button" @click="refreshSuggested">
					<md-icon>refresh</md-icon>
				</md-button>
			</span>
		</h2>
		<ul id="suggested-songs" class="md-layout">
			<li v-for="song in suggestedSongs" :key="song.id" class="md-layout-item md-size-25">
				<div class="img-wrapper" v-bind:class="{ 'active': playingSong && playingSong.id === song.id }" @click="playSong(song)">
					<img v-bind:src="'backend/covers/' + song.album.coverImg" />
					<md-icon class="md-size-3x">{{playingSong && playingSong.id === song.id && !currentSongPaused ? 'pause_circle_filled' : 'play_circle_filled'}}</md-icon>
				</div>
				<div class="details">
					<div class="title">
						<router-link v-bind:to="'/album/' + song.album.id">{{song.title}}</router-link>
					</div>
					<div class="artist">
						<router-link v-bind:to="'/artist/' + song.artist.id">{{song.artist.name}}</router-link>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>
<script src="./home.component.ts"></script>
<style src="./home.component.scss" scoped></style>
