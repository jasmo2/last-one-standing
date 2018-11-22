import Vue from 'vue';
import {
	MdApp,
	MdButton,
	MdContent,
	MdDrawer,
	MdField,
	MdIcon,
	MdProgress,
	MdRipple,
	MdTable,
	MdTabs,
	MdToolbar
} from 'vue-material/dist/components';
import VueRouter from 'vue-router';

import 'vue-material/dist/theme/default-dark.css';
import 'vue-material/dist/vue-material.min.css';
import AlbumComponent from './components/album/album.component.vue';
import ArtistComponent from './components/artist/artist.component.vue';
import FavoritesComponent from './components/favorites/favorites.component.vue';
import HomeComponent from './components/home/home.component.vue';
import PlaylistsComponent from './components/playlists/playlists.component.vue';
import SearchComponent from './components/search/search.component.vue';
import Main from './main.vue';

Vue.use(VueRouter);

Vue.use(MdApp);
Vue.use(MdButton);
Vue.use(MdContent);
Vue.use(MdDrawer);
Vue.use(MdField);
Vue.use(MdIcon);
Vue.use(MdProgress);
Vue.use(MdRipple);
Vue.use(MdTable);
Vue.use(MdTabs);
Vue.use(MdToolbar);

const routes = [
	{ path: '/', component: HomeComponent },
	{ path: '/album/:id', component: AlbumComponent },
	{ path: '/artist/:id', component: ArtistComponent },
	{ path: '/favorites', component: FavoritesComponent },
	{ path: '/playlists', component: PlaylistsComponent },
	{ path: '/search', component: SearchComponent }
];

const router = new VueRouter({ routes });

new Vue({
	router,
	el: '#app',
	render: (render) => render(Main),
})