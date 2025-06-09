import mongoose from "mongoose";
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Add TTL index to automatically delete documents after 1 hour (3600 seconds)
tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

const token = mongoose.model("token", tokenSchema);
export default token;