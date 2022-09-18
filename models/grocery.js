const mongoose = require("mongoose");

const Grocery = mongoose.model("Groceries", {
    title:{
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    }
})

module.exports = Grocery;