<template>
	<md-drawer :md-active.sync="show" md-persistent="full">
		<div class="menu-links">
			<router-link to="/favorites">
				<md-icon>star</md-icon> Favorites
			</router-link>
			<router-link to="/playlists">
				<md-icon>playlist_play</md-icon> Playlists
			</router-link>
		</div>
	</md-drawer>
</template>
<script src="./nav-drawer.component.ts"></script>
<style src="./nav-drawer.component.scss" scoped></style>
