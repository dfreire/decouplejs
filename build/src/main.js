"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Decouple {
    constructor() {
        this.subscribers = {};
        this.services = {};
    }
    subscribe(id, callback) {
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
    unsubscribe(id, subscriberId) {
        delete this.subscribers[id][subscriberId];
    }
    publish(id, data) {
        for (let subscriberId in this.subscribers[id]) {
            const callback = this.subscribers[id][subscriberId];
            callback(data);
        }
    }
    setService(id, service) {
        if (this.services[id] == null) {
            this.services[id] = service;
        }
        else {
            throw `Error: there is already a service with id: '${id}'.`;
        }
    }
    getService(id) {
        if (this.services[id] != null) {
            return this.services[id];
        }
        else {
            throw `Error: there is no service with id: '${id}'.`;
        }
    }
}
exports.Decouple = Decouple;
//# sourceMappingURL=main.js.map