<template>
	<header>
		<md-toolbar class="md-large md-primary">
			<div class="md-layout">
				<div class="md-layout-item md-size-25">
					<md-button @click="toggleNavDrawer" class="md-icon-button">
						<md-icon>menu</md-icon>
					</md-button>
					<router-link to="/">
						<md-button class="md-icon-button">
							<md-icon>home</md-icon>
						</md-button>
					</router-link>
				</div>
				<div class="md-layout-item">
					<md-field>
						<md-input placeholder="Search" v-on:keyup="onSearch" v-model="searchPhrase"></md-input>
					</md-field>
				</div>
				<div class="md-layout-item md-size-30 align-right">
					<md-button class="md-icon-button">
						<md-icon>language</md-icon>
					</md-button>
					<md-button class="md-icon-button">
						<md-icon>help</md-icon>
					</md-button>
					<md-button class="md-icon-button">
						<md-icon>account_circle</md-icon>
					</md-button>
				</div>
  			</div>
		</md-toolbar>
	</header>
</template>
<script src="./header-toolbar.component.ts"></script>
<style src="./header-toolbar.component.scss" scoped></style>
