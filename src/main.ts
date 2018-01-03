
export class Decouple {
	// tslint:disable
	subscribers: { [id: string]: any };
	services: { [id: string]: any };

	constructor() {
		this.subscribers = {};
		this.services = {};
	}

	subscribe(id: string, callback: Function): string {
		if (this.subscribers[id] == null) {
			this.subscribers[id] = {};
		}

		let subscriberId;
		while (subscriberId == null || this.subscribers[id][subscriberId] != null) {
			subscriberId = Math.random().toString(36).slice(-12);
		}

		this.subscribers[id][subscriberId] = callback;
		return subscriberId;
	}

	unsubscribe(id: string, subscriberId: string): void {
		delete this.subscribers[id][subscriberId];
	}

	publish(id: string, data?: any): void {
		for (let subscriberId in this.subscribers[id]) {
			const callback = this.subscribers[id][subscriberId];
			callback(data);
		}
	}

	setService<T>(id: string, service: T) {
		if (this.services[id] == null) {
			this.services[id] = service;
		} else {
			throw `Error: there is already a service with id: '${id}'.`
		}
	}

	getService<T>(id: string): T {
		if (this.services[id] != null) {
			return this.services[id];
		} else {
			throw `Error: there is no service with id: '${id}'.`
		}
	}
	// tslint:enable
}
