import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import {
	MatButtonModule,
	MatFormFieldModule,
	MatIconModule,
	MatInputModule,
	MatProgressBarModule,
	MatSidenavModule,
	MatTableModule,
	MatToolbarModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { APP_ROUTES } from './app.routes';
import { AlbumComponent } from './components/album/album.component';
import { ArtistComponent } from './components/artist/artist.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { HeaderToolbarComponent } from './components/header-toolbar/header-toolbar.component';
import { HomeComponent } from './components/home/home.component';
import { NavDrawerComponent } from './components/nav-drawer/nav-drawer.component';
import { PlayerComponent } from './components/player/player.component';
import { PlaylistsComponent } from './components/playlists/playlists.component';
import { SearchComponent } from './components/search/search.component';
import { SongListComponent } from './components/song-list/song-list.component';

@NgModule({
	imports: [
		BrowserAnimationsModule,
		BrowserModule,
		FlexLayoutModule,
		FormsModule,
		HttpClientModule,
		MatButtonModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatProgressBarModule,
		MatSidenavModule,
		MatTableModule,
		MatToolbarModule,
		RouterModule.forRoot(
			APP_ROUTES,
			// { enableTracing: true }
		)
	],
	declarations: [
		AppComponent,
		AlbumComponent,
		ArtistComponent,
		FavoritesComponent,
		HeaderToolbarComponent,
		HomeComponent,
		NavDrawerComponent,
		PlayerComponent,
		PlaylistsComponent,
		SearchComponent,
		SongListComponent
	],
	bootstrap: [AppComponent]
})
export class AppModule { }