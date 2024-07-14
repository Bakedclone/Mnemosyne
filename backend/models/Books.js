import mongoose from "mongoose";

const schema = new mongoose.Schema({

    ISBN:{
        type:String,
        required:[true, "Please enter your ISBN No."],
    },
    title:{
        type:String,
        required:[true, "Please enter your Title No."],
    },
    author:{
        type:String,
        required:[true, "Please enter your author No."],
    },
    publisher:{
        type:String,
        required:[true, "Please enter your publisher No."],
    },
    year:{
        type:Number,
        required:[true, "Please enter your year No."],
    },
    genre:{
        type:String,
        required:[true, "Please enter your genre No."],
    },
    quantity:{
        type:Number,
        required:[true, "Please enter your quantity No."],
    },
    available:{
        type:Number,
        required:[true, "Please enter your available No."],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

})

export const Books = mongoose.model("Books", schema, "Books");