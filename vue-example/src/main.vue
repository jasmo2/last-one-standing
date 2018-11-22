<template>
	<div class="root" v-bind:class="{ 'nav-drawer-open': isNavDrawerOpen, 'player-open': isPlayerOpen }">
		<header-toolbar-component></header-toolbar-component>
		<nav-drawer-component></nav-drawer-component>
		<main id="content">
			<router-view></router-view>
		</main>
		<player-component></player-component>
	</div>
</template>
<script src="./main.ts"></script>
<style src="./main.scss"></style>