"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var mongoose_update_if_current_1 = require("mongoose-update-if-current");
var orderSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
}, {
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
orderSchema.set('versionKey', 'version');
orderSchema.plugin(mongoose_update_if_current_1.updateIfCurrentPlugin);
orderSchema.statics.build = function (attrs) {
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        price: attrs.price,
        userId: attrs.userId,
        status: attrs.status,
    });
};
var Order = mongoose_1.default.model('Order', orderSchema);
exports.Order = Order;
