import { Activity, Progress, Analytics } from '../models/analytics.js';
import Course from '../models/course.js';
// Track a learning activity
export const trackActivity = async (req, res) => {
  try {
    const { activityType, courseId, exerciseId, quizId, resourceId, score, timeSpent, metadata } = req.body;

    const userId = req.user.id;
    // Create new activity record
    const activity = new Activity({
      userId,
      activityType,
      courseId,
      exerciseId,
      quizId,
      resourceId,
      score,
      timeSpent,
      metadata
    });

    await activity.save();

    // Update progress if this is a course-related activity
    if (courseId) {
      // Find or create progress record
      let progress = await Progress.findOne({ userId, courseId });
      
      if (!progress) {
        progress = new Progress({
          userId,
          courseId,
          progress: 0,
          completedLessons: [],
          completedExercises: [],
          completedQuizzes: []
        });
      }

      // Update progress based on activity type
      if (activityType === 'exercise_complete' && exerciseId) {
        if (!progress.completedExercises.includes(exerciseId)) {
          progress.completedExercises.push(exerciseId);
        }
      } else if (activityType === 'quiz_attempt' && quizId && score >= 70) {
        // Consider quiz completed if score is 70% or higher
        if (!progress.completedQuizzes.includes(quizId)) {
          progress.completedQuizzes.push(quizId);
        }
      }

      // Update last accessed time
      progress.lastAccessedAt = new Date();
      
      // Add time spent
      if (timeSpent) {
        progress.totalTimeSpent += timeSpent;
      }

      // Calculate overall progress percentage
      const course = await Course.findById(courseId);
      if (course) {
        const totalItems = 
          (course.lessons?.length || 0) + 
          (course.exercises?.length || 0) + 
          (course.quizzes?.length || 0);
        
        const completedItems = 
          progress.completedLessons.length + 
          progress.completedExercises.length + 
          progress.completedQuizzes.length;
        
        progress.progress = totalItems > 0 
          ? Math.min(100, Math.round((completedItems / totalItems) * 100)) 
          : 0;
          
        // Check if course is completed
        if (progress.progress === 100 && !progress.certificateIssued) {
          progress.certificateIssued = true;
          progress.certificateIssuedAt = new Date();
        }
      }

      await progress.save();
    }

    // Update daily analytics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let dailyAnalytics = await Analytics.findOne({ date: today });
    
    if (!dailyAnalytics) {
      dailyAnalytics = new Analytics({
        date: today,
        dailyActiveUsers: 0,
        totalCoursesViewed: 0,
        totalExercisesCompleted: 0,
        totalQuizzesAttempted: 0,
        averageScore: 0,
        courseEngagement: []
      });
    }

    // Update metrics based on activity type
    if (activityType === 'course_view' && courseId) {
      dailyAnalytics.totalCoursesViewed += 1;
      
      // Update course engagement
      const courseIndex = dailyAnalytics.courseEngagement.findIndex(
        item => item.courseId.toString() === courseId.toString()
      );
      
      if (courseIndex >= 0) {
        dailyAnalytics.courseEngagement[courseIndex].views += 1;
      } else {
        dailyAnalytics.courseEngagement.push({
          courseId,
          views: 1,
          completionRate: 0
        });
      }
    } else if (activityType === 'exercise_complete') {
      dailyAnalytics.totalExercisesCompleted += 1;
    } else if (activityType === 'quiz_attempt') {
      dailyAnalytics.totalQuizzesAttempted += 1;
      
      // Update average score
      const currentTotal = dailyAnalytics.averageScore * (dailyAnalytics.totalQuizzesAttempted - 1);
      dailyAnalytics.averageScore = (currentTotal + (score || 0)) / dailyAnalytics.totalQuizzesAttempted;
    }

    // Count unique users for the day
    const uniqueUsers = await Activity.distinct('userId', {
      createdAt: { $gte: today }
    });
    dailyAnalytics.dailyActiveUsers = uniqueUsers.length;

    await dailyAnalytics.save();

    res.status(200).json({ 
      success: true, 
      message: 'Activity tracked successfully',
      activityId: activity._id
    });
  } catch (error) {
    console.error('Error tracking activity:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to track activity',
      error: error.message
    });
  }
};

// Get user progress for a specific course
export const getUserCourseProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    const progress = await Progress.findOne({ userId, courseId })
      .populate('completedLessons', 'title')
      .populate('completedExercises', 'title')
      .populate('completedQuizzes', 'title');

    if (!progress) {
      return res.status(200).json({ 
        progress: 0,
        completedLessons: [],
        completedExercises: [],
        completedQuizzes: [],
        totalTimeSpent: 0,
        certificateIssued: false
      });
    }

    res.status(200).json(progress);
  } catch (error) {
    console.error('Error getting user progress:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get user progress',
      error: error.message
    });
  }
};

// Get user dashboard analytics
export const getUserDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all user progress records
    const progressRecords = await Progress.find({ userId })
      .populate('courseId', 'title category level');
    
    // Get recent activities
    const recentActivities = await Activity.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('courseId', 'title')
      .populate('exerciseId', 'title')
      .populate('quizId', 'title');
    
    const attendance =  await Activity.find({ userId }, 'createdAt activityType')
    .sort({ createdAt: -1 });
  
    // Calculate statistics
    const totalCourses = progressRecords.length;
    const completedCourses = progressRecords.filter(p => p.progress === 100).length;
    const inProgressCourses = progressRecords.filter(p => p.progress > 0 && p.progress < 100).length;
    const totalTimeSpent = progressRecords.reduce((sum, record) => sum + record.totalTimeSpent, 0);
    
    // Calculate average progress across all courses
    const averageProgress = totalCourses > 0
      ? progressRecords.reduce((sum, record) => sum + record.progress, 0) / totalCourses
      : 0;
    
    // Get certificates
    const certificates = progressRecords
      .filter(p => p.certificateIssued)
      .map(p => ({
        courseId: p.courseId._id,
        courseTitle: p.courseId.title,
        issuedAt: p.certificateIssuedAt
      }));
    
    res.status(200).json({
      stats: {
        totalCourses,
        completedCourses,
        inProgressCourses,
        averageProgress: Math.round(averageProgress),
        totalTimeSpent,
        certificatesEarned: certificates.length
      },
      courseProgress: progressRecords.map(p => ({
        courseId: p.courseId._id,
        courseTitle: p.courseId.title,
        category: p.courseId.category,
        level: p.courseId.level,
        progress: p.progress,
        lastAccessed: p.lastAccessedAt
      })),
      recentActivities: recentActivities.map(a => ({
        id: a._id,
        type: a.activityType,
        course: a.courseId?.title || 'Unknown',
        exercise: a.exerciseId?.title,
        quiz: a.quizId?.title,
        score: a.score,
        date: a.createdAt
      })),
      activities : attendance,
      certificates
    });
  } catch (error) {
    console.error('Error getting dashboard analytics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get dashboard analytics',
      error: error.message
    });
  }
};

// Get admin analytics dashboard
export const getAdminAnalytics = async (req, res) => {
  try {
    // Ensure user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get last 30 days
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Get daily analytics for last 30 days
    const dailyAnalytics = await Analytics.find({
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: 1 });
    
    // Get total users
    const totalUsers = await Activity.distinct('userId').length;
    
    // Get most active courses
    const courseEngagement = await Activity.aggregate([
      { $match: { courseId: { $exists: true, $ne: null } } },
      { $group: {
          _id: '$courseId',
          views: { $sum: { $cond: [{ $eq: ['$activityType', 'course_view'] }, 1, 0] } },
          exercises: { $sum: { $cond: [{ $eq: ['$activityType', 'exercise_complete'] }, 1, 0] } },
          quizzes: { $sum: { $cond: [{ $eq: ['$activityType', 'quiz_attempt'] }, 1, 0] } },
          totalActivities: { $sum: 1 }
        }
      },
      { $sort: { totalActivities: -1 } },
      { $limit: 10 },
      { $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course'
        }
      },
      { $unwind: '$course' },
      { $project: {
          _id: 1,
          courseTitle: '$course.title',
          views: 1,
          exercises: 1,
          quizzes: 1,
          totalActivities: 1
        }
      }
    ]);
    
    // Get completion rates
    const completionRates = await Progress.aggregate([
      { $group: {
          _id: '$courseId',
          totalUsers: { $sum: 1 },
          completedUsers: { 
            $sum: { $cond: [{ $eq: ['$progress', 100] }, 1, 0] }
          }
        }
      },
      { $project: {
          _id: 1,
          totalUsers: 1,
          completedUsers: 1,
          completionRate: { 
            $cond: [
              { $eq: ['$totalUsers', 0] },
              0,
              { $multiply: [{ $divide: ['$completedUsers', '$totalUsers'] }, 100] }
            ]
          }
        }
      },
      { $sort: { completionRate: -1 } },
      { $limit: 10 },
      { $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course'
        }
      },
      { $unwind: '$course' },
      { $project: {
          courseId: '$_id',
          courseTitle: '$course.title',
          totalUsers: 1,
          completedUsers: 1,
          completionRate: 1
        }
      }
    ]);
    
    res.status(200).json({
      dailyStats: dailyAnalytics.map(day => ({
        date: day.date,
        activeUsers: day.dailyActiveUsers,
        coursesViewed: day.totalCoursesViewed,
        exercisesCompleted: day.totalExercisesCompleted,
        quizzesAttempted: day.totalQuizzesAttempted,
        averageScore: day.averageScore
      })),
      totalUsers,
      courseEngagement,
      completionRates
    });
  } catch (error) {
    console.error('Error getting admin analytics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get admin analytics',
      error: error.message
    });
  }
};

