import {
	Component,
	Vue
} from 'vue-property-decorator';

import { ArtistAgent } from '../../agents/artist.agent';
import { IArtist } from '../../contracts/artist.interface';
import { ISong } from '../../contracts/song.interface';
import SongListComponent from '../song-list/song-list.component.vue';

@Component({
	components: {
		SongListComponent
	}
})
export default class ArtistComponent extends Vue {
	artist: IArtist = null;
	songs: ISong[] = [];

	created() {
		const artistId: number = +this.$route.params.id;

		ArtistAgent.getById(artistId).subscribe(artist => {
			this.artist = artist;
		});

		ArtistAgent.getSongsByArtistId(artistId).subscribe(songs => {
			this.songs = songs;
		});
	}
}