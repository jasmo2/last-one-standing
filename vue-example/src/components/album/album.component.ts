import {
	Component,
	Vue
} from 'vue-property-decorator';

import { AlbumAgent } from '../../agents/album.agent';
import { IAlbum } from '../../contracts/album.interface';
import { ISong } from '../../contracts/song.interface';
import SongListComponent from '../song-list/song-list.component.vue';

@Component({
	components: {
		SongListComponent
	}
})
export default class AlbumComponent extends Vue {
	album: IAlbum = null;
	songs: ISong[] = [];

	created() {
		const albumId: number = +this.$route.params.id;

		AlbumAgent.getById(albumId).subscribe(album => {
			this.album = album;
		});

		AlbumAgent.getSongsByArtistId(albumId).subscribe(songs => {
			this.songs = songs;
		});
	}
}