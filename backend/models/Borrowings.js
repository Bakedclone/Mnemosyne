import mongoose from "mongoose";

const schema = new mongoose.Schema({
    
    user_id:{
        type: mongoose.Schema.Types.String,
        ref: Users,
    },
    book_id:{
        type: mongoose.Schema.Types.String,
        ref: Books,
    },
    borrow_date:{
        type: Date,
        default: Date.now,
    },
    due_date:{
        type: Date,
    },
    return_date: {
        type: Date,
    },
    late_fee: {
        type: Number,
    }
})

export const Borrowings = mongoose.model("Borrowings", schema, "Borrowings");