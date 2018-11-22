<template>
	<div class="md-layout md-gutter" v-if="album && songs.length">
		<div class="md-layout-item md-size-25">
			<img v-bind:src="'backend/covers/' + album.coverImg" />
			<h3 class="no-border">
				{{album.title}}
			</h3>
		</div>
		<div class="md-layout-item">
			<song-list-component v-bind:songs="songs"></song-list-component>
		</div>
	</div>
</template>
<script src="./album.component.ts"></script>