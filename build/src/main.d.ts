export declare type ListenerCallback = {
    (payload?: any): void;
};
export declare type HandlerCallback = {
    (payload?: any): any;
};
export declare class Decouple {
    private listeners;
    private handlers;
    constructor();
    on(eventId: string, callback: ListenerCallback): string;
    off(eventId: string, listenerId: string): void;
    fire(eventId: string, payload?: any): void;
    handle(requestId: string, callback: HandlerCallback): void;
    request(requestId: string, payload?: any): any;
}
