"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var ticket_updated_listener_1 = require("../ticket-updated-listener");
var nats_wrapper_1 = require("../../../nats-wrapper");
var ticket_1 = require("../../../models/ticket");
var setup = function () { return __awaiter(void 0, void 0, void 0, function () {
    var listener, ticket, data, msg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                listener = new ticket_updated_listener_1.TicketUpdatedListener(nats_wrapper_1.natsWrapper.client);
                ticket = ticket_1.Ticket.build({
                    id: mongoose_1.default.Types.ObjectId().toHexString(),
                    title: 'concert',
                    price: 20,
                });
                return [4 /*yield*/, ticket.save()];
            case 1:
                _a.sent();
                data = {
                    id: ticket.id,
                    version: ticket.version + 1,
                    title: 'new concert',
                    price: 999,
                    userId: 'ablskdjf',
                };
                msg = {
                    ack: jest.fn(),
                };
                // return all of this stuff
                return [2 /*return*/, { msg: msg, data: data, ticket: ticket, listener: listener }];
        }
    });
}); };
it('finds, updates, and saves a ticket', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, msg, data, ticket, listener, updatedTicket;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, setup()];
            case 1:
                _a = _b.sent(), msg = _a.msg, data = _a.data, ticket = _a.ticket, listener = _a.listener;
                return [4 /*yield*/, listener.onMessage(data, msg)];
            case 2:
                _b.sent();
                return [4 /*yield*/, ticket_1.Ticket.findById(ticket.id)];
            case 3:
                updatedTicket = _b.sent();
                expect(updatedTicket.title).toEqual(data.title);
                expect(updatedTicket.price).toEqual(data.price);
                expect(updatedTicket.version).toEqual(data.version);
                return [2 /*return*/];
        }
    });
}); });
it('acks the message', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, msg, data, listener;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, setup()];
            case 1:
                _a = _b.sent(), msg = _a.msg, data = _a.data, listener = _a.listener;
                return [4 /*yield*/, listener.onMessage(data, msg)];
            case 2:
                _b.sent();
                expect(msg.ack).toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
it('does not call ack if the event has a skipped version number', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, msg, data, listener, ticket, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, setup()];
            case 1:
                _a = _b.sent(), msg = _a.msg, data = _a.data, listener = _a.listener, ticket = _a.ticket;
                data.version = 10;
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                return [4 /*yield*/, listener.onMessage(data, msg)];
            case 3:
                _b.sent();
                return [3 /*break*/, 5];
            case 4:
                err_1 = _b.sent();
                return [3 /*break*/, 5];
            case 5:
                expect(msg.ack).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
