export const transformIds = (item) => {
  if (!item) return item;
  return {
    ...item,
    id: item._id || item.id,
    _id: undefined
  };
};

export const transformArrayIds = (array) => {
  if (!Array.isArray(array)) return array;
  return array.map(transformIds);
};

export const transformLessonIds = (lessons) => {
  return lessons.map(lesson => ({
    ...lesson,
    id: lesson._id || lesson.id,
    _id: undefined,
    exercises: lesson.exercises ? lesson.exercises.map(exercise => ({
      ...exercise,
      id: exercise._id || exercise.id,
      _id: undefined
    })) : [],
    resources: lesson.resources ? lesson.resources.map(resource => ({
      ...resource,
      id: resource._id || resource.id,
      _id: undefined
    })) : [],
    quizzes: lesson.quizzes ? lesson.quizzes.map(quiz => ({
      ...quiz,
      id: quiz._id || quiz.id,
      _id: undefined
    })) : []
  }));
};

export const transformCourseData = (rawData) => {
  return {
    ...rawData,
    id: rawData._id || rawData.id,
    _id: undefined,
    lessons: rawData.lessons ? transformLessonIds(rawData.lessons) : []
  };
};