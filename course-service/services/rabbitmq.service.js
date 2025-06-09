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
    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
};

// Example helper function to send course notifications
// Notification templates configuration
const NOTIFICATION_TEMPLATES = {
  COURSE_UPDATE: {
    title: 'New Chapter Available',
    message: (data) => `A new chapter "${data.title}" has been added to the platform.`,
    targetUsers: "student",
    dataMapper: (chapter) => ({
      courseId: chapter._id,
      classLevel: chapter.classLevel,
      chapterName: chapter.title,
      link: `/courses/${chapter.courseId}/chapters/${chapter._id}`
    })
  },
  
  NEW_ASSIGNMENT: {
    title: 'New Assignment',
    message: (data) => `A new assignment has been added to the course "${data.subject.name}".`,
    targetUsers: (assignment) => [assignment.userId],
    dataMapper: (assignment) => {
      const link = assignment.exercise 
        ? `courses/${assignment.subject.name}/chapters/${assignment.chapter.id}/lessons/${assignment.lesson.id}/exercises/${assignment.exercise.id}`
        : `courses/${assignment.subject.name}/chapters/${assignment.chapter.id}/lessons/${assignment.lesson.id}/quizzes/${assignment.quizz.id}`;
      
      return {
        assignmentId: assignment._id,
        dueDate: assignment.dueDate,
        link: link
      };
    }
  },
  
  NEW_COURSE_FROM_TEACHER: {
    title: 'New Course Available',
    message: (data) => `A new course "${data.title}" has been added by ${data.addedByName} to the platform.`,
    targetUsers: 'admin',
    dataMapper: (chapter) => ({
      courseId: chapter._id,
      chapterName: chapter.title,
      addedBy: {
        id: chapter.addedById,
        name: chapter.addedByName
      }
    })
  },
  
  ASSIGNMENT_COMPLETED: {
    title: 'Assignment Completed',
    message: (data) => `Ton enfant a bien complété l'exercice "${data.quizz.title || data.exercise.title}"`,
    targetUsers: (assignment) => [assignment.parentId],
    dataMapper: (assignment) => assignment
  }
};

// Dynamic notification sender
export const sendDynamicNotification = async (type, sourceData) => {
  const template = NOTIFICATION_TEMPLATES[type];
  
  if (!template) {
    throw new Error(`Unknown notification type: ${type}`);
  }
  
  // Resolve target users (can be function or static value)
  const targetUsers = typeof template.targetUsers === 'function' 
    ? template.targetUsers(sourceData)
    : template.targetUsers;
   
  // Map source data using the template's data mapper
  const mappedData = template.dataMapper(sourceData);
  // Generate message using template function
  const message = template.message(sourceData);
  const notificationPayload = { 
    type,
    title: template.title,
    message,
    targetUsers,
    data: mappedData
  }
  return sendNotification(notificationPayload);
};

// Simplified wrapper functions (optional - for backward compatibility)
export const notifyCourseCreated = async (chapter, targetUsers = 'all') => {
  return sendDynamicNotification('COURSE_UPDATE', chapter);
};

export const notifyAssignmentCreated = async (assignment) => {
  return sendDynamicNotification('NEW_ASSIGNMENT', assignment);
};

export const notifyNewCourseFromTeacher = async (chapter) => {
  return sendDynamicNotification('NEW_COURSE_FROM_TEACHER', chapter);
};

export const notifyAssignmentCompleted = async (assignment) => {
  return sendDynamicNotification('ASSIGNMENT_COMPLETED', assignment);
};

// Close connection when service shuts down
export const closeRabbitMQ = async () => {
  if (channel) await channel.close();
  if (connection) await connection.close();
};