import mongoose, { Schema } from "mongoose";

const course = new Schema({
    title : String,
    slug : String,
    description : String,
    level : String,
    category : String,
    duration : Number,
    chaptersCount : Number,
    lessonsCount : Number,
    exercisesCount : Number,
    quizCount : Number,
    price : Number,
    discountPrice : Number,
    isPublished : Boolean,
    thumbnail : String,
    chapters : [
        {
            title : String,
            description : String,
            order : Number,
            lessons : [
                {
                    title : String,
                    description : String,
                    order : Number,
                    estimatedTime : Number,
                    content : String,
                    resources : [{ title : String, url : String, type : String }],
                    exercises : [
                        {
                            title : String,
                            description : String,
                            difficulty : String,
                            points : Number,
                            type : String,
                            instructions : String,
                            sampleSolution : String,
                        }
                    ],
                    quiz : [
                        {
                            question : String,
                            type : String,
                            points : Number,
                            options : [{ text : String, isCorrect : Boolean }],
                            explanation : String
                        }
                    ]
                }
            ]
        }
    ],
    createdAt : { type: Date, default: Date.now },
    updatedAt : { type: Date, default: Date.now }
})

export default mongoose.model("course", course)