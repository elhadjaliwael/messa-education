import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    senderId: { type: String, required: true },
    senderUsername: { type: String, required: true },
    receiverId: { type: String, required: true },
    text: { type: String, required: true },
    image: { type: String },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("messages", messageSchema);