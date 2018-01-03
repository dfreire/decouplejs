// tslint:disable
export type ListenerCallback = { (payload?: any): void };
export type HandlerCallback = { (payload?: any): any };

export class Decouple {
	private listeners: {
		[eventId: string]: {
			[listenerId: string]: ListenerCallback;
		};
	};

	private handlers: {
		[requestId: string]: HandlerCallback;
	}

	constructor() {
		this.listeners = {};
		this.handlers = {};
	}

	on(eventId: string, callback: ListenerCallback): string {
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

	fire(eventId: string, payload?: any): void {
		for (let listenerId in this.listeners[eventId]) {
			const callback = this.listeners[eventId][listenerId];
			callback(payload);
		}
	}

	handle(requestId: string, callback: HandlerCallback) {
		if (this.handlers[requestId] == null) {
			this.handlers[requestId] = callback;
		} else {
			throw `Error: there is already a handler with id: '${requestId}'.`
		}
	}

	request(requestId: string, payload?: any): any {
		const callback = this.handlers[requestId];
		return callback(payload);
	}
}
// tslint:enable
