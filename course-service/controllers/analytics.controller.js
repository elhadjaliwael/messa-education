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

