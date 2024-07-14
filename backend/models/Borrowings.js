import mongoose from "mongoose";

const schema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.String,
    },
    book_id:{
        type: mongoose.Schema.Types.String,
    },
    borrow_date:{
        type: Number,
        default: Date.now,
    },
    late_fee: {
        type: Number,
        default : 0
    }
})

export const Borrowings = mongoose.model("Borrowings", schema, "Borrowings");