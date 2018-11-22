import { Subscription } from 'rxjs/Subscription';

import {
	Component,
	Vue
} from 'vue-property-decorator';

import { DrawerService } from '../../services/drawer.service';
import { HeaderToolbarService } from '../../services/header-toolbar.service';

@Component
export default class HeaderToolbarComponent extends Vue {
	searchPhrase: string = '';
	subscriptions: Subscription[] = [];

	created() {
		this.searchPhrase = this.$route.query.phrase;

		this.subscriptions.push(HeaderToolbarService.clearSearchPhrase.subscribe(() => {
			this.searchPhrase = '';
		}));
	}

	beforeDestroy() {
		this.subscriptions.forEach(sub => sub.unsubscribe());
	}

	toggleNavDrawer() {
		DrawerService.toggleNavDrawer();
	}

	onSearch() {
		this.$router.push({
			path: '/search',
			query: {
				phrase: this.searchPhrase
			}
		});
	}
}