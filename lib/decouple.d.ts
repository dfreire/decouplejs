export default class Decouple {
    subscribers: {
        [id: string]: any;
    };
    services: {
        [id: string]: any;
    };
    constructor();
    subscribe(id: string, callback: Function): string;
    unsubscribe(id: string, subscriberId: string): void;
    publish(id: string, data?: any): void;
    setService<T>(id: string, service: T): void;
    getService<T>(id: string): T;
}
