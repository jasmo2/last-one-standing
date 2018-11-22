import { Routes } from '@angular/router';

import { AlbumComponent } from './components/album/album.component';
import { ArtistComponent } from './components/artist/artist.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { HomeComponent } from './components/home/home.component';
import { PlaylistsComponent } from './components/playlists/playlists.component';
import { SearchComponent } from './components/search/search.component';

export const APP_ROUTES: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'album/:id', component: AlbumComponent },
	{ path: 'artist/:id', component: ArtistComponent },
	{ path: 'favorites', component: FavoritesComponent },
	{ path: 'playlists', component: PlaylistsComponent },
	{ path: 'search', component: SearchComponent }
];