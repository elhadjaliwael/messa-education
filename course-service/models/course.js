import mongoose, { Schema } from "mongoose";

const course = new Schema({
    name : String,
    duration : Number,
    chapters : Number,
    exercices : Number,
    lessons : Number,

})
export default mongoose.model("course",course)