import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    senderId: { type: String, required: true },
    senderRole : { type: String, required: true },
    groupId: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    isGroupMessage: { type: Boolean, default: true },
    read: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("groupMessages", messageSchema);