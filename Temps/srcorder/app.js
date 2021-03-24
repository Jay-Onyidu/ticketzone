"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var express_1 = __importDefault(require("express"));
require("express-async-errors");
var cookie_session_1 = __importDefault(require("cookie-session"));
var body_parser_1 = require("body-parser");
var common_1 = require("@ojtikzo/common");
var delete_1 = require("./routes/delete");
var new_1 = require("./routes/new");
var show_1 = require("./routes/show");
var index_1 = require("./routes/index");
var app = express_1.default();
exports.app = app;
app.set('trust proxy', true);
app.use(body_parser_1.json());
app.use(cookie_session_1.default({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
}));
app.use(common_1.currentUser);
app.use(delete_1.deleteOrderRouter);
app.use(new_1.newOrderRouter);
app.use(show_1.showOrderRouter);
app.use(index_1.indexOrderRouter);
app.all('*', function () {
    throw new common_1.NotFoundError();
});
app.use(common_1.errorHandler);
