import { Subscription } from 'rxjs/Subscription';

import {
	Component,
	Vue
} from 'vue-property-decorator';

import HeaderToolbarComponent from './components/header-toolbar/header-toolbar.component.vue';
import NavDrawerComponent from './components/nav-drawer/nav-drawer.component.vue';
import PlayerComponent from './components/player/player.component.vue';
import { DrawerService } from './services/drawer.service';
import { MusicService } from './services/music.service';


@Component({
	components: {
		HeaderToolbarComponent,
		NavDrawerComponent,
		PlayerComponent,
	}
})
export default class Main extends Vue {
	subscriptions: Subscription[] = [];
	isNavDrawerOpen: boolean = true;
	isPlayerOpen: boolean = false;

	created() {
		this.subscriptions.push(DrawerService.navDrawerOpen.subscribe(open => {
			this.isNavDrawerOpen = open;
		}));

		this.subscriptions.push(MusicService.currentlyChosenSong.subscribe(chosenSong => {
			this.isPlayerOpen = !!chosenSong;
		}));
	}

	beforeDestroy() {
		this.subscriptions.forEach(sub => sub.unsubscribe());
	}
}