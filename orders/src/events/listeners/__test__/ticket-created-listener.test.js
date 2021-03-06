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
var ticket_created_listener_1 = require("../ticket-created-listener");
var nats_wrapper_1 = require("../../../nats-wrapper");
var ticket_1 = require("../../../models/ticket");
var setup = function () { return __awaiter(void 0, void 0, void 0, function () {
    var listener, data, msg;
    return __generator(this, function (_a) {
        listener = new ticket_created_listener_1.TicketCreatedListener(nats_wrapper_1.natsWrapper.client);
        data = {
            version: 0,
            id: new mongoose_1.default.Types.ObjectId().toHexString(),
            title: 'concert',
            price: 10,
            userId: new mongoose_1.default.Types.ObjectId().toHexString(),
        };
        msg = {
            ack: jest.fn(),
        };
        return [2 /*return*/, { listener: listener, data: data, msg: msg }];
    });
}); };
it('creates and saves a ticket', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, listener, data, msg, ticket;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, setup()];
            case 1:
                _a = _b.sent(), listener = _a.listener, data = _a.data, msg = _a.msg;
                // call the onMessage function with the data object + message object
                return [4 /*yield*/, listener.onMessage(data, msg)];
            case 2:
                // call the onMessage function with the data object + message object
                _b.sent();
                return [4 /*yield*/, ticket_1.Ticket.findById(data.id)];
            case 3:
                ticket = _b.sent();
                expect(ticket).toBeDefined();
                expect(ticket.title).toEqual(data.title);
                expect(ticket.price).toEqual(data.price);
                return [2 /*return*/];
        }
    });
}); });
it('acks the message', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, data, listener, msg;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, setup()];
            case 1:
                _a = _b.sent(), data = _a.data, listener = _a.listener, msg = _a.msg;
                // call the onMessage function with the data object + message object
                return [4 /*yield*/, listener.onMessage(data, msg)];
            case 2:
                // call the onMessage function with the data object + message object
                _b.sent();
                // write assertions to make sure ack function is called
                expect(msg.ack).toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
