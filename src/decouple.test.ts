/// <reference path="../node_modules/@types/jest/index.d.ts" />

import Decouple from './decouple';

describe('Decouple', () => {
    it('is possible to create an instance', () => {
        const decouple = new Decouple();
        expect(decouple.subscribe).toBeDefined();
        expect(decouple.unsubscribe).toBeDefined();
        expect(decouple.publish).toBeDefined();
        expect(decouple.setService).toBeDefined();
        expect(decouple.getService).toBeDefined();
    });
});

describe('Decouple instance when there are no callbacks registered', () => {
    let decouple;

    beforeEach(() => {
        decouple = new Decouple();
    });

    it('is possible to register callbacks', () => {
        expect(decouple.subscribe('EVENT_A', jest.fn())).toBeDefined();
        expect(decouple.subscribe('EVENT_B', jest.fn())).toBeDefined();
        expect(decouple.subscribe('EVENT_C', jest.fn())).toBeDefined();
    });
});

describe('Decouple instance when there are callbacks registered', () => {
    let decouple;
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

        subscriberIdA1 = decouple.subscribe('EVENT_A', callbackA1);
        subscriberIdA2 = decouple.subscribe('EVENT_A', callbackA2);
        subscriberIdB1 = decouple.subscribe('EVENT_B', callbackB1);
        subscriberIdB2 = decouple.subscribe('EVENT_B', callbackB2);
    });

    describe('an event is fired', () => {
        beforeEach(() => {
            decouple.publish('EVENT_A', 123);
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
            decouple.publish('EVENT_A', 123);
            decouple.publish('EVENT_A', 456);
        });

        it('the right callbacks are called twice', () => {
            expect(callbackA1).toBeCalledWith(123);
            expect(callbackA1).toBeCalledWith(456);
            expect(callbackA1).toHaveBeenCalledTimes(2);
        });
    });

    describe('a callback is unregistered', () => {
        beforeEach(() => {
            decouple.unsubscribe('EVENT_A', subscriberIdA1);
        });

        describe('an event is fired', () => {
            beforeEach(() => {
                decouple.publish('EVENT_A', 123);
            });

            it('that callback is not called', () => {
                expect(callbackA1).not.toBeCalled();
            });
        });
    });
});

describe('no service is registered', () => {
    let decouple;

    beforeEach(() => {
        decouple = new Decouple();
    });

    it('is possible to register new services', () => {
        expect(() => { decouple.setService('PingService', jest.fn()) }).not.toThrow();
        expect(() => { decouple.setService('EchoService', jest.fn()) }).not.toThrow();
    });

    it('is not possible to obtain an inexistent service', () => {
        expect(() => { decouple.getService('InexistentService') }).toThrow();
    });
});

describe('services are registered', () => {
    let decouple;

    beforeEach(() => {
        decouple = new Decouple();
        decouple.setService('PingService', new PingService());
        decouple.setService('EchoService', new EchoService());
    });

    it('is possible to obtain a registered service', () => {
        const service: PingService = decouple.getService('PingService');
        expect(service.ping()).toBe('pong');
    });

    it('is possible to obtain another registered service', () => {
        const service: EchoService = decouple.getService('EchoService');
        expect(service.echo('hello')).toBe('hello');
    });

    it('is not possible to register repeated services', () => {
        expect(() => { decouple.setService('PingService', {}) }).toThrow();
    });

    it('is not possible to obtain an inexistent service', () => {
        expect(() => { decouple.getService('InexistentService') }).toThrow();
    });
});

class PingService {
    ping(): string {
        return 'pong';
    }
}

class EchoService {
    echo(message: string): string {
        return message;
    }
}