"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Decouple {
    constructor() {
        this.listeners = {};
        this.handlers = {};
    }
    on(eventId, callback) {
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
    off(eventId, listenerId) {
        delete this.listeners[eventId][listenerId];
    }
    fire(eventId, payload) {
        for (let listenerId in this.listeners[eventId]) {
            const callback = this.listeners[eventId][listenerId];
            callback(payload);
        }
    }
    handle(requestId, callback) {
        if (this.handlers[requestId] == null) {
            this.handlers[requestId] = callback;
        }
        else {
            throw `Error: there is already a handler with id: '${requestId}'.`;
        }
    }
    request(requestId, payload) {
        const callback = this.handlers[requestId];
        return callback(payload);
    }
}
exports.Decouple = Decouple;
//# sourceMappingURL=main.js.map