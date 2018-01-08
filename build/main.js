"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Decouple = (function () {
    function Decouple() {
        this.listeners = {};
        this.handlers = {};
    }
    Decouple.prototype.on = function (eventId, callback) {
        if (this.listeners[eventId] == null) {
            this.listeners[eventId] = {};
        }
        var listenerId;
        while (listenerId == null || this.listeners[eventId][listenerId] != null) {
            listenerId = Math.random().toString(36).slice(-12);
        }
        this.listeners[eventId][listenerId] = callback;
        return listenerId;
    };
    Decouple.prototype.off = function (eventId, listenerId) {
        delete this.listeners[eventId][listenerId];
    };
    Decouple.prototype.fire = function (eventId, payload) {
        for (var listenerId in this.listeners[eventId]) {
            var callback = this.listeners[eventId][listenerId];
            callback(payload);
        }
    };
    Decouple.prototype.handle = function (requestId, callback) {
        if (this.handlers[requestId] == null) {
            this.handlers[requestId] = callback;
        }
        else {
            throw "Error: there is already a handler with id: '" + requestId + "'.";
        }
    };
    Decouple.prototype.request = function (requestId, payload) {
        var callback = this.handlers[requestId];
        return callback(payload);
    };
    return Decouple;
}());
exports.Decouple = Decouple;
//# sourceMappingURL=main.js.map