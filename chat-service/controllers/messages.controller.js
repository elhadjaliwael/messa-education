import groupMessages from '../models/messages.js';

export const getMessagesInGroup = async (req,res) => {
    try {
        const groupId = req.params.groupId;
        const messages = await groupMessages.find({
            groupId
        }).sort({ createdAt: 1 });
        return res.status(200).json(messages);
    }catch (error) {
        return res.status(500).json({ error });
    }
}
