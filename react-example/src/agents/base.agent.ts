import { Rxios } from 'rxios';

export abstract class BaseAgent {
	protected _http: Rxios = new Rxios();
}