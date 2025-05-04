const services = {
    auth: {
      name: 'auth-service',
      url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
      endpoints: {
        register: '/api/auth/register',
        login: '/api/auth/login',
        verify: '/api/auth/verify'
      }
    },
    course: {
      name: 'course-service',
      url: process.env.COURSE_SERVICE_URL || 'http://localhost:3002',
      endpoints: {
        courses: '/api/courses'
      }
    },
    chat: {
      name: 'chat-service',
      url: process.env.CHAT_SERVICE_URL || 'http://localhost:3003',
      endpoints: {
        conversations: '/api/chat/conversations'
      }
    },
    notification: {
      name: 'notification-service',
      url: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3004',
      endpoints: {
        notifications: '/api/notifications'
      }
    },
    payment: {
      name: 'payment-service',
      url: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005',
      endpoints: {
        payments: '/api/payments'
      }
    }
  };
  
  // Health check function for services
  const checkServiceHealth = async (serviceName) => {
    try {
      const axios = require('axios');
      const service = services[serviceName];
      
      if (!service) {
        throw new Error(`Service ${serviceName} not found`);
      }
      
      const response = await axios.get(`${service.url}/health`, { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      console.error(`Health check failed for ${serviceName}:`, error.message);
      return false;
    }
  };
  
  // Get all service health statuses
  const getAllServicesHealth = async () => {
    const healthStatus = {};
    
    for (const serviceName in services) {
      healthStatus[serviceName] = await checkServiceHealth(serviceName);
    }
    
    return healthStatus;
  };
  
  export {
    services,
    checkServiceHealth,
    getAllServicesHealth
  };