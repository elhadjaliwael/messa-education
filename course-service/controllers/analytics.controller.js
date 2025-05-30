import { Activity, Progress, Analytics } from '../models/analytics.js';
import { Chapter, Lesson } from '../models/course.js';

// Track a learning activity
export const trackActivity = async (req, res) => {
  try {
    const { activityType, subject, chapterId, lessonId, exerciseId, quizId, resourceId, score, timeSpent, metadata } = req.body;

    const userId = req.user.id;
    // Create new activity record
    const activity = new Activity({
      userId,
      activityType,
      subject,
      chapterId,
      lessonId,
      exerciseId,
      quizId,
      resourceId,
      score,
      timeSpent,
      metadata
    });

    await activity.save();
    
    // Update progress if this is a course-related activity
    if (subject) {
      // Instead of find-then-save, use findOneAndUpdate with upsert
      let progressUpdate = {
        lastAccessedAt: new Date()
      };
      
      // Add time spent if provided
      if (timeSpent) {
        progressUpdate.$inc = { totalTimeSpent: timeSpent };
      }
      
      // Update arrays based on activity type
      if (activityType === 'exercise_complete' && exerciseId) {
        progressUpdate.$addToSet = { completedExercises: exerciseId };
      } else if ((activityType === 'quiz_attempt' || activityType === 'quiz_complete') && quizId && score >= 70) {
        progressUpdate.$addToSet = { completedQuizzes: quizId };
      } else if (activityType === 'lesson_complete' && lessonId) {
        progressUpdate.$addToSet = { completedLessons: lessonId };
      }
      
      // First update the basic progress data
      let progress = await Progress.findOneAndUpdate(
        { userId, subject },
        progressUpdate,
        { 
          new: true, 
          upsert: true,
          setDefaultsOnInsert: true
        }
      );
      
      // Now calculate overall progress percentage
      const chapter = await Chapter.findOne({ 
        subject: { $regex: new RegExp('^' + subject + '$', 'i') } 
      });
      
      if (chapter) {
        // Get all chapters for this subject
        const chapters = await Chapter.find({ 
          subject: { $regex: new RegExp('^' + subject + '$', 'i') } 
        });
        
        // Get all lessons for these chapters
        const chapterIds = chapters.map(chapter => chapter._id);
        const lessons = await Lesson.find({ chapterId: { $in: chapterIds } });
        
        // Count total items
        const totalLessons = lessons.length;
        const totalExercises = lessons.reduce((sum, lesson) => sum + (lesson.exercises?.length || 0), 0);
        const totalQuizzes = lessons.reduce((sum, lesson) => sum + (lesson.quizzes?.length || 0), 0);
        
        const totalItems = totalLessons + totalExercises + totalQuizzes;
        
        const completedItems = 
          progress.completedLessons.length + 
          progress.completedExercises.length + 
          progress.completedQuizzes.length;
        
        const progressPercentage = totalItems > 0 
          ? Math.min(100, Math.round((completedItems / totalItems) * 100)) 
          : 0;
          
        // Calculate progress for each chapter
        const chapterProgressArray = [];
        const completedChapters = [];
        
        for (const chapter of chapters) {
          // Get lessons for this chapter
          const chapterLessons = lessons.filter(lesson => 
            lesson.chapterId.toString() === chapter._id.toString()
          );
          
          // Count total items in this chapter
          const chapterTotalLessons = chapterLessons.length;
          const chapterTotalExercises = chapterLessons.reduce((sum, lesson) => 
            sum + (lesson.exercises?.length || 0), 0);
          const chapterTotalQuizzes = chapterLessons.reduce((sum, lesson) => 
            sum + (lesson.quizzes?.length || 0), 0);
          
          // Count completed items in this chapter
          const chapterCompletedLessons = chapterLessons.filter(lesson => 
            progress.completedLessons.some(id => id.toString() === lesson._id.toString())
          ).length;
          
          const chapterCompletedExercises = chapterLessons.flatMap(lesson => 
            lesson.exercises || []
          ).filter(exercise => 
            progress.completedExercises.some(id => id.toString() === exercise._id.toString())
          ).length;
          
          const chapterCompletedQuizzes = chapterLessons.flatMap(lesson => 
            lesson.quizzes || []
          ).filter(quiz => 
            progress.completedQuizzes.some(id => id.toString() === quiz._id.toString())
          ).length;
          
          // Calculate chapter progress percentage
          const chapterTotalItems = chapterTotalLessons + chapterTotalExercises + chapterTotalQuizzes;
          const chapterCompletedItems = chapterCompletedLessons + chapterCompletedExercises + chapterCompletedQuizzes;
          
          const chapterProgressPercentage = chapterTotalItems > 0 
            ? Math.min(100, Math.round((chapterCompletedItems / chapterTotalItems) * 100)) 
            : 0;
          
          // Check if all lessons, exercises, and quizzes in this chapter are completed
          const allLessonsCompleted = chapterLessons.every(lesson => 
            progress.completedLessons.some(id => id.toString() === lesson._id.toString())
          );
          
          const allExercisesCompleted = chapterLessons.flatMap(lesson => 
            lesson.exercises || []
          ).every(exercise => 
            progress.completedExercises.some(id => id.toString() === exercise._id.toString())
          );
          
          const allQuizzesCompleted = chapterLessons.flatMap(lesson => 
            lesson.quizzes || []
          ).every(quiz => 
            progress.completedQuizzes.some(id => id.toString() === quiz._id.toString())
          );
          
          // Add chapter to completed chapters if all content is completed
          const chapterFullyCompleted = allLessonsCompleted && allExercisesCompleted && allQuizzesCompleted;
          if (chapterFullyCompleted && chapterLessons.length > 0) {
            completedChapters.push(chapter._id);
          }
          
          // Add chapter progress to array
          chapterProgressArray.push({
            chapterId: chapter._id,
            title: chapter.title,
            progress: chapterProgressPercentage,
            totalLessons: chapterTotalLessons,
            completedLessons: chapterCompletedLessons,
            totalExercises: chapterTotalExercises,
            completedExercises: chapterCompletedExercises,
            totalQuizzes: chapterTotalQuizzes,
            completedQuizzes: chapterCompletedQuizzes,
            completed: chapterProgressPercentage === 100
          });
        }
        
        // Use findOneAndUpdate again to update the calculated progress data
        // This avoids version conflicts
        progress = await Progress.findOneAndUpdate(
          { userId, subject },
          { 
            progress: progressPercentage,
            chapterProgress: chapterProgressArray,
            completedChapters: completedChapters
          },
          { new: true }
        );
        
        // Check if course is completed
        if (progressPercentage === 100 && !progress.certificateIssued) {
          await Progress.findOneAndUpdate(
            { userId, subject },
            { 
              certificateIssued: true,
              certificateIssuedAt: new Date()
            }
          );
          
          // Track certificate earned activity
          const certificateActivity = new Activity({
            userId,
            activityType: 'certificate_earned',
            subject,
            metadata: {
              progress: 100,
              completedAt: new Date()
            }
          });
          await certificateActivity.save();
        }
      }
    }

    // Update daily analytics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Use findOneAndUpdate for analytics too
    let analyticsUpdate = {};
    
    // Set up the update based on activity type
    if (activityType === 'course_view' && subject) {
      analyticsUpdate.$inc = { totalCoursesViewed: 1 };
    } else if (activityType === 'chapter_view' && chapterId) {
      analyticsUpdate.$inc = { totalChaptersViewed: 1 };
    } else if (activityType === 'lesson_view' && lessonId) {
      analyticsUpdate.$inc = { totalLessonsViewed: 1 };
    } else if (activityType === 'lesson_complete' && lessonId) {
      analyticsUpdate.$inc = { totalLessonsCompleted: 1 };
    } else if (activityType === 'exercise_complete') {
      analyticsUpdate.$inc = { totalExercisesCompleted: 1 };
    } else if (activityType === 'quiz_attempt') {
      analyticsUpdate.$inc = { totalQuizzesAttempted: 1 };
    } else if (activityType === 'quiz_complete') {
      analyticsUpdate.$inc = { totalQuizzesCompleted: 1 };
    }
    
    // Create or update analytics
    await Analytics.findOneAndUpdate(
      { date: today },
      analyticsUpdate,
      { 
        upsert: true,
        setDefaultsOnInsert: true
      }
    );
    
    // Handle subject engagement separately if needed
    if (activityType === 'course_view' && subject) {
      const analytics = await Analytics.findOne({ date: today });
      
      const subjectIndex = analytics.subjectEngagement.findIndex(
        item => item.subject === subject
      );
      
      if (subjectIndex >= 0) {
        // Update existing subject engagement
        const updatePath = `subjectEngagement.${subjectIndex}.views`;
        await Analytics.findOneAndUpdate(
          { date: today },
          { $inc: { [updatePath]: 1 } }
        );
      } else {
        // Add new subject engagement
        const chapter = await Chapter.findOne({ subject });
        const classLevel = chapter ? chapter.classLevel : null;
        
        const classLevelDistribution = {};
        if (classLevel) {
          classLevelDistribution[classLevel] = 1;
        }
        
        await Analytics.findOneAndUpdate(
          { date: today },
          { 
            $push: { 
              subjectEngagement: {
                subject,
                views: 1,
                completionRate: 0,
                classLevelDistribution
              }
            }
          }
        );
      }
    }
    
    // Update average score for quiz attempts
    if (activityType === 'quiz_attempt' && score !== undefined) {
      const analytics = await Analytics.findOne({ date: today });
      if (analytics) {
        const currentTotal = analytics.averageScore * (analytics.totalQuizzesAttempted - 1);
        const newAverage = (currentTotal + (score || 0)) / analytics.totalQuizzesAttempted;
        
        await Analytics.findOneAndUpdate(
          { date: today },
          { averageScore: newAverage }
        );
      }
    }
    
    // Count unique users for the day
    const uniqueUsers = await Activity.distinct('userId', {
      createdAt: { $gte: today }
    });
    
    await Analytics.findOneAndUpdate(
      { date: today },
      { dailyActiveUsers: uniqueUsers.length }
    );

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
    const { subject } = req.params;

    const progress = await Progress.findOne({ userId, subject });
    
    if (!progress) {
      return res.status(200).json({ 
        progress: 0,
        completedLessons: [],
        completedExercises: [],
        completedQuizzes: [],
        completedChapters: [],
        chapterProgress: [],
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
    const userId = req.user.role === 'parent' ? req.params.id : req.user.id;
  
    
    // Get all user progress records - remove the populate that's causing the error
    const progressRecords = await Progress.find({ userId });
    
    // Get recent activities
    const recentActivities = await Activity.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
    
    // Get attendance data for activity tracking
    const attendance = await Activity.find({ userId }, 'createdAt activityType')
      .sort({ createdAt: -1 });
  
    // Calculate basic statistics
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
        subject: p.subject,
        issuedAt: p.certificateIssuedAt
      }));
    
    // Calculate learning streak (consecutive days with activity)
    const streak = await calculateLearningStreak(userId);
    
    // Calculate activity by day of week
    const activityByDayOfWeek = await calculateActivityByDayOfWeek(userId);
    
    // Calculate subject distribution
    const subjectDistribution = calculateSubjectDistribution(progressRecords);
    
    // Calculate performance metrics
    const performanceMetrics = await calculatePerformanceMetrics(userId);
    
    // Calculate recent progress trend (last 7 days)
    const progressTrend = await calculateProgressTrend(userId);
    
    res.status(200).json({
      stats: {
        totalCourses,
        completedCourses,
        inProgressCourses,
        averageProgress: Math.round(averageProgress),
        totalTimeSpent,
        certificatesEarned: certificates.length,
        learningStreak: streak.currentStreak,
        longestStreak: streak.longestStreak
      },
      courseProgress: progressRecords.map(p => ({
        subject: p.subject,
        progress: p.progress,
        lastAccessed: p.lastAccessedAt,
        chapterProgress: p.chapterProgress
      })),
      recentActivities: recentActivities.map(a => ({
        id: a._id,
        type: a.activityType,
        subject: a.subject,
        score: a.score,
        date: a.createdAt,
        timeSpent: a.timeSpent
      })),
      activities: attendance,
      certificates,
      activityByDayOfWeek,
      subjectDistribution,
      performanceMetrics,
      progressTrend
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

// Helper function to calculate subject distribution
function calculateSubjectDistribution(progressRecords) {
  const subjectMap = new Map();
  
  progressRecords.forEach(record => {
    const subject = record.subject;
    if (subject) {
      if (subjectMap.has(subject)) {
        subjectMap.set(subject, {
          count: subjectMap.get(subject).count + 1,
          timeSpent: subjectMap.get(subject).timeSpent + record.totalTimeSpent,
          progress: subjectMap.get(subject).progress + record.progress
        });
      } else {
        subjectMap.set(subject, {
          count: 1,
          timeSpent: record.totalTimeSpent,
          progress: record.progress
        });
      }
    }
  });
  
  return Array.from(subjectMap.entries()).map(([subject, data]) => ({
    subject,
    count: data.count,
    timeSpent: data.timeSpent,
    averageProgress: Math.round(data.progress / data.count),
    percentage: Math.round((data.count / progressRecords.length) * 100)
  }));
}

// Helper function to calculate learning streak
async function calculateLearningStreak(userId) {
  // Get all user activities sorted by date
  const activities = await Activity.find({ userId })
    .sort({ createdAt: -1 });
  
  if (activities.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }
  
  // Group activities by day
  const activityDays = new Set();
  activities.forEach(activity => {
    const date = new Date(activity.createdAt);
    const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    activityDays.add(dateString);
  });
  
  // Convert to array and sort
  const sortedDays = Array.from(activityDays).sort().reverse();
  
  // Calculate current streak
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < sortedDays.length; i++) {
    const dateParts = sortedDays[i].split('-').map(Number);
    const activityDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    
    // Check if this date is part of the streak
    if (activityDate.getTime() === expectedDate.getTime()) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  // Calculate longest streak
  let longestStreak = 0;
  let currentLongestStreak = 0;
  
  for (let i = 0; i < sortedDays.length - 1; i++) {
    const dateParts = sortedDays[i].split('-').map(Number);
    const currentDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    
    const nextDateParts = sortedDays[i + 1].split('-').map(Number);
    const nextDate = new Date(nextDateParts[0], nextDateParts[1] - 1, nextDateParts[2]);
    
    const diffDays = Math.round((currentDate - nextDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      currentLongestStreak++;
    } else {
      currentLongestStreak = 0;
    }
    
    longestStreak = Math.max(longestStreak, currentLongestStreak);
  }
  
  return { currentStreak, longestStreak: Math.max(longestStreak, currentStreak) };
}

// Helper function to calculate activity by day of week
async function calculateActivityByDayOfWeek(userId) {
  const activities = await Activity.find({ userId });
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const activityByDay = Array(7).fill(0);
  
  activities.forEach(activity => {
    const dayOfWeek = new Date(activity.createdAt).getDay();
    activityByDay[dayOfWeek]++;
  });
  
  return dayNames.map((day, index) => ({
    day,
    count: activityByDay[index]
  }));
}

// Helper function to calculate performance metrics
async function calculatePerformanceMetrics(userId) {
  // Get quiz activities
  const quizActivities = await Activity.find({ 
    userId, 
    activityType: { $in: ['quiz_attempt', 'quiz_complete'] },
    score: { $exists: true }
  });
  
  // Calculate average quiz score
  const averageQuizScore = quizActivities.length > 0
    ? quizActivities.reduce((sum, activity) => sum + (activity.score || 0), 0) / quizActivities.length
    : 0;
  
  // Get exercise activities
  const exerciseActivities = await Activity.find({
    userId,
    activityType: { $in: ['exercise_attempt', 'exercise_complete'] }
  });
  
  // Calculate exercise completion rate
  const exerciseAttempts = exerciseActivities.filter(a => a.activityType === 'exercise_attempt').length;
  const exerciseCompletions = exerciseActivities.filter(a => a.activityType === 'exercise_complete').length;
  
  const exerciseCompletionRate = exerciseAttempts > 0
    ? Math.round((exerciseCompletions / exerciseAttempts) * 100)
    : 0;
  
  return {
    averageQuizScore: Math.round(averageQuizScore),
    exerciseCompletionRate,
    totalQuizAttempts: quizActivities.length,
    totalExerciseAttempts: exerciseAttempts
  };
}

// Helper function to calculate progress trend
async function calculateProgressTrend(userId) {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  
  // Get activities from the last 7 days
  const recentActivities = await Activity.find({
    userId,
    createdAt: { $gte: sevenDaysAgo }
  }).sort({ createdAt: 1 });
  
  // Group by day
  const dailyProgress = {};
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    dailyProgress[dateString] = {
      date: dateString,
      lessonsCompleted: 0,
      exercisesCompleted: 0,
      quizzesCompleted: 0,
      totalTimeSpent: 0
    };
  }
  
  // Fill in the data
  recentActivities.forEach(activity => {
    const date = new Date(activity.createdAt);
    const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    
    if (dailyProgress[dateString]) {
      if (activity.activityType === 'lesson_complete') {
        dailyProgress[dateString].lessonsCompleted++;
      } else if (activity.activityType === 'exercise_complete') {
        dailyProgress[dateString].exercisesCompleted++;
      } else if (activity.activityType === 'quiz_complete') {
        dailyProgress[dateString].quizzesCompleted++;
      }
      
      dailyProgress[dateString].totalTimeSpent += (activity.timeSpent || 0);
    }
  });
  
  return Object.values(dailyProgress).reverse();
}

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
export const getExerciseActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { lessonId } = req.params; 
    const activities = await Activity.find({ 
      userId, 
      lessonId, 
      activityType: { $in: ['exercise_complete', 'exercise_attempt'] } 
    });
    if (!activities) {
      return res.status(404).json({ message: 'No exercise activity found' });
    }

    res.status(200).json(activities);
  } catch (error) {
    console.error('Error getting exercise activity:', error); 
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const getQuizzActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { lessonId } = req.params; 
    const activities = await Activity.find({
      userId,
      lessonId,
      activityType: { $in: ['quiz_attempt', 'quiz_complete'] }
    });
    if (!activities) {
      return res.status(404).json({ message: 'No quiz activity found' });
    }
    res.status(200).json(activities);
  } catch (error) {
    console.error('Error getting quiz activity:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}