"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    title: {
        type: String,
    },
    image: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category"
    },
    like: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});
const productModel = (0, mongoose_1.model)("Product", productSchema);
exports.default = productModel;
//# sourceMappingURL=product.js.map