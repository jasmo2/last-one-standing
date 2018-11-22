<template>
	<div>
		<div class="md-layout md-gutter margin-bottom large">
			<div class="md-layout-item md-layout" v-if="result.artists && result.artists.length">
				<h1>Artists</h1>
				<div class="md-layout-item md-size-25 md-gutter md-layout margin-bottom" v-for="artist in result.artists" :key="artist.id">
					<router-link v-bind:to="'/artist/' + artist.id">
						<div class="md-layout-item md-size-50 md-gutter center">
							<img class="rounded margin-bottom" v-bind:src="'backend/artists/' + artist.img" />
						</div>
						<div class="md-layout-item center">
							{{artist.name}}
						</div>
					</router-link>
				</div>
			</div>
			<div class="md-layout-item md-layout" v-if="result.albums && result.albums.length">
				<h1>Albums</h1>
				<div class="md-layout-item md-size-25 md-gutter md-layout margin-bottom" v-for="album in result.albums" :key="album.id">
					<router-link v-bind:to="'/album/' + album.id">
						<div class="md-layout-item md-size-50 md-gutter center">
							<img class="rounded margin-bottom" v-bind:src="'backend/covers/' + album.coverImg" />
						</div>
						<div class="md-layout-item center">
							{{album.title}}
						</div>
					</router-link>
				</div>
			</div>
		</div>
		<div class="md-layout md-gutter">
			<div class="md-layout-item">
				<h1>Song results for '{{$route.query.phrase}}'</h1>
				<song-list-component v-bind:songs="result.songs"></song-list-component>
			</div>
		</div>
	</div>
</template>
<script src="./search.component.ts"></script>
<style src="./search.component.scss" scoped></style>
