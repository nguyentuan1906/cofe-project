const mongoose = require('mongoose');
var categorySchema = new mongoose.Schema(
    {
        tensanpham: {
            type: String,
            require: true,
        },
        soluong: {
            type: Number,
            require: true,
        },
        thanhtien: {
            type: Number,
            require: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);