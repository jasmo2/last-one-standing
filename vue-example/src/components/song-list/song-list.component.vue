<template>
	<div>
		<md-table v-if="songs && songs.length">
			<md-table-row>
				<md-table-head class="thin overflow-visible relative">
					<md-button class="md-primary md-dense md-raised absolute" @click="playAll">PLAY ALL</md-button>
				</md-table-head>
				<md-table-head class="thin"></md-table-head>
				<md-table-head>Title</md-table-head>
				<md-table-head>Artist</md-table-head>
				<md-table-head>Album</md-table-head>
			</md-table-row>
			<md-table-row v-for="song in songs" v-bind:key="song.id">
				<md-table-cell class="thin">
					<md-button class="md-icon-button" v-bind:class="{ 'active': playingSong && playingSong.id === song.id }" @click="playSong(song)">
						<md-icon>{{playingSong && playingSong.id === song.id && !currentSongPaused ? 'pause_circle_outline' : 'play_circle_outline'}}</md-icon>
					</md-button>
				</md-table-cell>
				<md-table-cell class="thin">
					<md-button class="md-icon-button" @click="toggleFavorite(song.id)">
						<md-icon>{{favorites.indexOf(song.id) === -1 ? 'star_border' : 'star'}}</md-icon>
					</md-button>
				</md-table-cell>
				<md-table-cell>{{song.title}}</md-table-cell>
				<md-table-cell><router-link v-bind:to="'/artist/' + song.artist.id">{{song.artist.name}}</router-link></md-table-cell>
				<md-table-cell><router-link v-bind:to="'/album/' + song.album.id">{{song.album.title}}</router-link></md-table-cell>
			</md-table-row>
		</md-table>
		<div v-else>
			<h3 class="no-border">There are no results to show.</h3>
		</div>
	</div>
</template>
<script src="./song-list.component.ts"></script>
<style src="./song-list.component.scss" scoped></style>
