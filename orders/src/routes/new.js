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
exports.newOrderRouter = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var express_1 = __importDefault(require("express"));
var common_1 = require("@ojtikzo/common");
var express_validator_1 = require("express-validator");
var ticket_1 = require("../models/ticket");
var order_1 = require("../models/order");
var order_created_publisher_1 = require("../events/publishers/order-created-publisher");
var nats_wrapper_1 = require("../nats-wrapper");
var router = express_1.default.Router();
exports.newOrderRouter = router;
var EXPIRATION_WINDOW_SECONDS = 1 * 60;
router.post('/api/orders', common_1.requireAuth, [
    express_validator_1.body('ticketId')
        .not()
        .isEmpty()
        .custom(function (input) { return mongoose_1.default.Types.ObjectId.isValid(input); })
        .withMessage('TicketId must be provided'),
], common_1.ValidateRequest, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ticketId, ticket, isReserved, expiration, order;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ticketId = req.body.ticketId;
                return [4 /*yield*/, ticket_1.Ticket.findById(ticketId)];
            case 1:
                ticket = _a.sent();
                if (!ticket) {
                    throw new common_1.NotFoundError();
                }
                return [4 /*yield*/, ticket.isReserved()];
            case 2:
                isReserved = _a.sent();
                if (isReserved) {
                    throw new common_1.BadRequestError('Ticket is already reserved');
                }
                expiration = new Date();
                expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
                order = order_1.Order.build({
                    userId: req.currentUser.id,
                    status: common_1.OrderStatus.Created,
                    expiresAt: expiration,
                    ticket: ticket,
                });
                return [4 /*yield*/, order.save()];
            case 3:
                _a.sent();
                // Publish an event saying that an order was created
                new order_created_publisher_1.OrderCreatedPublisher(nats_wrapper_1.natsWrapper.client).publish({
                    id: order.id,
                    version: order.version,
                    status: order.status,
                    userId: order.userId,
                    expiresAt: order.expiresAt.toISOString(),
                    ticket: {
                        id: ticket.id,
                        price: ticket.price,
                    },
                });
                res.status(201).send(order);
                return [2 /*return*/];
        }
    });
}); });
