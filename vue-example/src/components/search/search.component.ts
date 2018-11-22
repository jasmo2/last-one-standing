import {
	Component,
	Vue
} from 'vue-property-decorator';

import { MusicAgent } from '../../agents/music.agent';
import { ISearchResult } from '../../contracts/search-result.interface';
import { HeaderToolbarService } from '../../services/header-toolbar.service';
import SongListComponent from '../song-list/song-list.component.vue';

@Component({
	components: {
		SongListComponent
	}
})
export default class SearchComponent extends Vue {
	result: ISearchResult = { songs: [], artists: [], albums: [] };

	created() {
		if (this.$route.query.phrase) this.search(this.$route.query.phrase);
		this.$watch('$route.query.phrase', () => {
			this.search(this.$route.query.phrase);
		});
	}

	destroyed() {
		HeaderToolbarService.requestClearSearchPhrase();
	}

	search(phrase: string) {
		MusicAgent.searchByPhrase(phrase).subscribe(result => {
			this.result = result;
		});
	}
}