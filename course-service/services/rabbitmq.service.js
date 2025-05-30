import amqp from 'amqplib';

let connection;
let channel;
const responseCallbacks = new Map();

// Setup RabbitMQ connection
export const setupRabbitMQ = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
    
    // Create notification queue
    await channel.assertQueue('notification.create', { durable: true });
    
    console.log('Connected to RabbitMQ');
    return channel;
  } catch (error) {
    console.error('Error setting up RabbitMQ:', error);
    throw error;
  }
};

// Send notification
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

// Example helper function to send course notifications
export const notifyCourseCreated = async (chapter, targetUsers = 'all') => {
  return sendNotification({
    type: 'COURSE_UPDATE', // Using one of the enum values from the schema
    title: 'New Chapter Available',
    message: `A new chapter "${chapter.title}" has been added to the platform.`,
    targetUsers, // This should be a user ID or 'all'
    data: {
      courseId: chapter._id,
      chapterName: chapter.title,
      link: `/courses/${chapter.courseId}/chapters/${chapter._id}`
    }
  });
};

// Example helper function to send assignment notifications
export const notifyAssignmentCreated = async (assignment) => {
  const link = assignment.exercise ? `courses/${assignment.subject.name}/chapters/${assignment.chapter.id}/lessons/${assignment.lesson.id}/exercises/${assignment.exercise.id}` :
    `courses/${assignment.subject.name}/chapters/${assignment.chapter.id}/lessons/${assignment.lesson.id}/quizzes/${assignment.quizz.id}` 
  return sendNotification({
    type: 'NEW_ASSIGNMENT',
    title: 'New Assignment',
    message: `A new assignment has been added to the course "${assignment.subject.name}".`,
    targetUsers: [assignment.userId],
    data: {
      assignmentId: assignment._id,
      dueDate: assignment.dueDate,
      link: link,
    }
  });
};
export const notifyNewCourseFromTeacher = async (chapter) => {
  return sendNotification({
    type: 'NEW_COURSE_FROM_TEACHER',
    title: 'New Course Available',
    message: `A new course "${chapter.title}" has been added to the platform.`,
    targetUsers: 'admin', // This should be a user ID or 'all'
    data: {
      courseId: chapter._id,
      chapterName: chapter.title,
    }
  })
}

// Close connection when service shuts down
export const closeRabbitMQ = async () => {
  if (channel) await channel.close();
  if (connection) await connection.close();
};