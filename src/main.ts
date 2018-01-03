export class Decouple {
	// tslint:disable
	listeners: { [id: string]: any };
	handlers: { [id: string]: any };

	constructor() {
		this.listeners = {};
		this.handlers = {};
	}

	on(eventId: string, callback: Function): string {
		if (this.listeners[eventId] == null) {
			this.listeners[eventId] = {};
		}

		let listenerId;
		while (listenerId == null || this.listeners[eventId][listenerId] != null) {
			listenerId = Math.random().toString(36).slice(-12);
		}

		this.listeners[eventId][listenerId] = callback;
		return listenerId;
	}

	off(eventId: string, listenerId: string): void {
		delete this.listeners[eventId][listenerId];
	}

	fire(eventId: string, data?: any): void {
		for (let listenerId in this.listeners[eventId]) {
			const callback = this.listeners[eventId][listenerId];
			callback(data);
		}
	}

	handle(requestId: string, callback: Function) {
		if (this.handlers[requestId] == null) {
			this.handlers[requestId] = callback;
		} else {
			throw `Error: there is already a handler with id: '${requestId}'.`
		}
	}

	request(requestId: string, data?: any): any {
		const callback = this.handlers[requestId];
		return callback(data);
	}
	// tslint:enable
}
