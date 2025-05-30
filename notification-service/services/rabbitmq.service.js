import amqp from 'amqplib';
import { v4 as uuidv4 } from 'uuid';
import { createNotification } from '../controllers/notification.controller.js';

let connection;
let channel;
let replyQueue;
const responseCallbacks = new Map();

// Setup RabbitMQ connection
export const setupRabbitMQ = async () => {
  // If already connected, return the existing reply queue
  if (channel && replyQueue) {
    return replyQueue;
  }
  
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
    
    // Setup response queue for this service
    const queueResult = await channel.assertQueue('', { exclusive: true });
    replyQueue = queueResult.queue;
    
    // Create the notification.create queue
    await channel.assertQueue('notification.create', { durable: true });
    
    channel.consume('notification.create', async (msg) => {
      try {
        await createNotification(msg);
        channel.ack(msg);
      } catch (error) {
        console.error('Error processing message:', error);
        channel.nack(msg, false, true);
      }
    });
    
    // Listen for responses
    channel.consume(replyQueue, (msg) => {
      const correlationId = msg.properties.correlationId;
      if (correlationId && responseCallbacks.has(correlationId)) {
        const { resolve } = responseCallbacks.get(correlationId);
        const content = JSON.parse(msg.content.toString());
        responseCallbacks.delete(correlationId);
        resolve(content);
      }
    }, { noAck: true });
    
    return replyQueue;
  } catch (error) {
    console.error('Error setting up RabbitMQ:', error);
    throw error;
  }
};

// Publish a message and wait for response
export const publishMessage = async (routingKey, message) => {
  if (!channel) {
    await setupRabbitMQ();
  }
  
  const correlationId = uuidv4();
  
  return new Promise((resolve, reject) => {
    responseCallbacks.set(correlationId, { resolve, reject });
    
    channel.publish('', routingKey, Buffer.from(JSON.stringify(message)), {
      correlationId,
      replyTo: replyQueue,
      expiration: '10000' // 10 seconds timeout
    });
    
    // Set timeout to prevent hanging promises
    setTimeout(() => {
      if (responseCallbacks.has(correlationId)) {
        const { reject } = responseCallbacks.get(correlationId);
        responseCallbacks.delete(correlationId);
        reject(new Error(`Request to ${routingKey} timed out`));
      }
    }, 10000);
  });
};

// Close connection when service shuts down
export const closeRabbitMQ = async () => {
  if (channel) await channel.close();
  if (connection) await connection.close();
  channel = null;
  connection = null;
  replyQueue = null;
};