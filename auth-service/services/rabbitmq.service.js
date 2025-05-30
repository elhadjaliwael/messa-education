import amqp from 'amqplib';
import User from '../models/user.model.js';

let connection;
let channel;

// Setup RabbitMQ connection
export const setupRabbitMQ = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
    
    // Setup queue for auth service requests
    await channel.assertQueue('auth.get.students', { durable: false });
    await channel.assertQueue('notification.create', { durable: true });
    // Consume messages from the queue
    channel.consume('auth.get.students', async (msg) => {
      try {
        // Get all students from the database
        const targetUsers = JSON.parse(msg.content.toString());
        const role = targetUsers === 'all' ? 'student' : targetUsers;
        const users = await User.find({ role }).select('-password');
        
        // Send back the response
        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify(users)),
          {
            correlationId: msg.properties.correlationId
          }
        );
        
        // Acknowledge the message
        channel.ack(msg);
      } catch (error) {
        console.error('Error processing auth.get.students request:', error);
        
        // Send error response
        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify({ error: error.message })),
          {
            correlationId: msg.properties.correlationId
          }
        );
        
        // Acknowledge the message even if there was an error
        channel.ack(msg);
      }
    });
    
    console.log('RabbitMQ consumer setup for auth.get.students');
  } catch (error) {
    console.error('Error setting up RabbitMQ:', error);
    throw error;
  }
};

// Close connection when service shuts down
export const closeRabbitMQ = async () => {
  if (channel) await channel.close();
  if (connection) await connection.close();
};

export const sendNotification = async (notificationData) => {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }
  
  try {
    channel.sendToQueue(
      'notification.create',
      Buffer.from(JSON.stringify(notificationData)),
      { persistent: true }
    );
    
    console.log('Notification sent to queue:', notificationData.title);
    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
};
export const notifyTeacherAdded = async (teacher, targetUsers = 'all') => {
  return sendNotification({
    type: 'TEACHER_ADDED', // Using one of the enum values from the schema
    title: 'New Teacher Added',
    message: `A new teacher "${teacher.username}" has been added to the platform. Email: ${teacher.email},Password : ${teacher.password}`,
    targetUsers, // This should be a user ID or 'all'
    data: {
      teacherId: teacher._id,
      teacherName: teacher.name,
      email: teacher.email
    }
  });
};