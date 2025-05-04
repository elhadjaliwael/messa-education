import express from 'express';
import Message from '../models/messages.js';

const router = express.Router();

// Get messages between two users
router.get('/', async (req, res) => {
    try {
        const { sender, recipient } = req.query;
        
        if (!sender || !recipient) {
            return res.status(400).json({ success: false, message: 'Sender and recipient are required' });
        }
        
        // Find messages where the current user is either sender or receiver
        const messages = await Message.find({
            $or: [
                { senderId: sender, receiverId: recipient },
                { senderId: recipient, receiverId: sender }
            ]
        }).sort({ timestamp: 1 });
        
        // Mark messages as "isMe" if the current user is the sender
        const formattedMessages = messages.map(msg => ({
            id: msg._id,
            senderId: msg.senderId,
            senderUsername: msg.senderUsername,
            recipientId: msg.receiverId,
            text: msg.text,
            image: msg.image,
            timestamp: msg.timestamp,
            isMe: msg.senderId === sender
        }));
        
        res.json({ success: true, messages: formattedMessages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Save a new message
router.post('/', async (req, res) => {
    try {
        const { senderId, senderUsername, recipientId, text, image } = req.body;
        
        if (!senderId || !recipientId || !text) {
            return res.status(400).json({ success: false, message: 'Sender, recipient, and text are required' });
        }
        
        const newMessage = new Message({
            senderId,
            senderUsername,
            receiverId: recipientId,
            text,
            image,
            timestamp: new Date()
        });
        
        await newMessage.save();
        
        res.status(201).json({ success: true, message: newMessage });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get all conversations for a user
router.get('/conversations', async (req, res) => {
    try {
        const { username } = req.query;
        
        if (!username) {
            return res.status(400).json({ success: false, message: 'Username is required' });
        }
        
        // Find all messages where the user is either sender or receiver
        const messages = await Message.find({
            $or: [
                { senderId: username },
                { receiverId: username }
            ]
        }).sort({ timestamp: -1 });
        
        // Group messages by conversation
        const conversations = {};
        
        messages.forEach(msg => {
            // Determine the other user in the conversation
            const otherUser = msg.senderId === username ? msg.receiverId : msg.senderId;
            
            if (!conversations[otherUser]) {
                conversations[otherUser] = {
                    otherUser,
                    messages: []
                };
            }
            
            conversations[otherUser].messages.push({
                id: msg._id,
                senderId: msg.senderId,
                senderUsername: msg.senderUsername,
                recipientId: msg.receiverId,
                text: msg.text,
                image: msg.image,
                timestamp: msg.timestamp,
                isMe: msg.senderId === username
            });
        });
        
        // Convert to array and sort by latest message
        const conversationsArray = Object.values(conversations);
        
        // Sort messages within each conversation
        conversationsArray.forEach(conv => {
            conv.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        });
        
        res.json({ success: true, conversations: conversationsArray });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;