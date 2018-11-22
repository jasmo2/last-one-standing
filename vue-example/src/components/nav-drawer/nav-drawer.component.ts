import { Subscription } from 'rxjs/Subscription';

import {
	Component,
	Vue
} from 'vue-property-decorator';

import { StorageItems } from '../../enums/storage-items.enum';
import { DrawerService } from '../../services/drawer.service';
import { StorageService } from '../../services/storage.service';

@Component
export default class NavDrawerComponent extends Vue {
	subscriptions: Subscription[] = [];
	show: boolean = true;

	created() {
		this.subscriptions.push(DrawerService.navDrawerOpen.subscribe(open => {
			if (this.show !== open) this.show = open;
			StorageService.set(StorageItems.DrawerOpen, open);
		}));

		this.subscriptions.push(DrawerService.navDrawerToggle.subscribe(() => {
			this.show = !this.show;
			DrawerService.toggleNavDrawer(this.show);
			StorageService.set(StorageItems.DrawerOpen, this.show);
		}));
	}

	beforeDestroy() {
		this.subscriptions.forEach(sub => sub.unsubscribe());
	}
}