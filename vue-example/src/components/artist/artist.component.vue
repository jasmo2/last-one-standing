<template>
	<div>
		<div class="md-layout md-gutter" v-if="artist && songs.length">
			<div class="md-layout-item md-size-25">
				<img v-bind:src="'backend/artists/' + artist.img" />
				<h3 class="no-border">
					{{artist.name}}
				</h3>
			</div>
			<div class="md-layout-item">
				<song-list-component v-bind:songs="songs"></song-list-component>
			</div>
		</div>
	</div>
</template>
<script src="./artist.component.ts"></script>