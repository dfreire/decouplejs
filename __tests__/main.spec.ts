import { Decouple } from '../src/main';

// tslint:disable
describe('Decouple', () => {
	it('is possible to create an instance', () => {
		const decouple = new Decouple();
		expect(decouple.on).toBeDefined();
		expect(decouple.off).toBeDefined();
		expect(decouple.fire).toBeDefined();
		expect(decouple.handle).toBeDefined();
		expect(decouple.request).toBeDefined();
	});
});

describe('Decouple instance when there are no callbacks registered', () => {
	let decouple: Decouple;

	beforeEach(() => {
		decouple = new Decouple();
	});

	it('is possible to register callbacks', () => {
		expect(decouple.on('EVENT_A', jest.fn())).toBeDefined();
		expect(decouple.on('EVENT_B', jest.fn())).toBeDefined();
		expect(decouple.on('EVENT_C', jest.fn())).toBeDefined();
	});
});

describe('Decouple instance when there are callbacks registered', () => {
	let decouple: Decouple;
	let subscriberIdA1, callbackA1;
	let subscriberIdA2, callbackA2;
	let subscriberIdB1, callbackB1;
	let subscriberIdB2, callbackB2;

	beforeEach(() => {
		decouple = new Decouple();

		callbackA1 = jest.fn();
		callbackA2 = jest.fn();
		callbackB1 = jest.fn();
		callbackB2 = jest.fn();

		subscriberIdA1 = decouple.on('EVENT_A', callbackA1);
		subscriberIdA2 = decouple.on('EVENT_A', callbackA2);
		subscriberIdB1 = decouple.on('EVENT_B', callbackB1);
		subscriberIdB2 = decouple.on('EVENT_B', callbackB2);
	});

	describe('an event is fired', () => {
		beforeEach(() => {
			decouple.fire('EVENT_A', 123);
		});

		it('the right callbacks are called', () => {
			expect(callbackA1).toBeCalledWith(123);
			expect(callbackA2).toBeCalledWith(123);
		});

		it('the other callbacks are not called', () => {
			expect(callbackB1).not.toBeCalled();
			expect(callbackB2).not.toBeCalled();
		});
	});

	describe('an event is fired twice', () => {
		beforeEach(() => {
			decouple.fire('EVENT_A', 123);
			decouple.fire('EVENT_A', 456);
		});

		it('the right callbacks are called twice', () => {
			expect(callbackA1).toBeCalledWith(123);
			expect(callbackA1).toBeCalledWith(456);
			expect(callbackA1).toHaveBeenCalledTimes(2);
		});
	});

	describe('a callback is unregistered', () => {
		beforeEach(() => {
			decouple.off('EVENT_A', subscriberIdA1);
		});

		describe('an event is fired', () => {
			beforeEach(() => {
				decouple.fire('EVENT_A', 123);
			});

			it('that callback is not called', () => {
				expect(callbackA1).not.toBeCalled();
			});
		});
	});
});

describe('no handler is registered', () => {
	let decouple: Decouple;

	beforeEach(() => {
		decouple = new Decouple();
	});

	it('is possible to register new handlers', () => {
		expect(() => { decouple.handle('ping', jest.fn()) }).not.toThrow();
		expect(() => { decouple.handle('echo', jest.fn()) }).not.toThrow();
	});

	it('is not possible to request an inexistent handler', () => {
		expect(() => { decouple.request('inexistent') }).toThrow();
	});
});

describe('handlers are registered', () => {
	let decouple: Decouple;

	beforeEach(() => {
		decouple = new Decouple();
		decouple.handle('ping', ping);
		decouple.handle('echo', echo);
		decouple.handle('asyncPing', asyncPing);
	});

	it('is possible to request a registered handler', () => {
		expect(decouple.request('ping')).toBe('pong');
	});

	it('is possible to request another registered handler', () => {
		expect(decouple.request('echo','hello')).toBe('hello');
	});

	it('is not possible to register repeated handlers', () => {
		expect(() => { decouple.handle('ping', jest.fn()) }).toThrow();
	});

	it('is not possible to request an inexistent handler', () => {
		expect(() => { decouple.request('inexistent') }).toThrow();
	});

	it('is possible to request an async handler', async () => {
		const result = await decouple.request('asyncPing');
		expect(result).toBe('pong, but async');
	});
});

function ping(): string {
	return 'pong';
}

function echo(message: string): string {
	return message;
}

function asyncPing(): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		setTimeout(() => {
			resolve('pong, but async');
		}, 0);
	});
}
// tslint:enable
