import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';

function QuizzesForm({ 
  currentLesson, 
  updateCurrentLesson 
}) {
  console.log(currentLesson)
  const addQuiz = () => {
    const newQuiz = {
      _id: Date.now().toString(),
      title: '',
      description: '',
      timeLimit: 10,
      passingScore: 70,
      questions: []
    };
    console.log('new quiz',newQuiz)
    updateCurrentLesson({
      quizzes: [...(currentLesson.quizzes || []), newQuiz]
    });
  };
  
  const updateQuiz = (id, data) => {
    const updatedQuizzes = (currentLesson.quizzes || []).map(quiz => 
      quiz._id === id ? { ...quiz, ...data } : quiz
    );
    
    updateCurrentLesson({ quizzes: updatedQuizzes });
  };
  
  const removeQuiz = (id) => {
    const updatedQuizzes = (currentLesson.quizzes || []).filter(
      quiz => quiz._id !== id
    );
    
    updateCurrentLesson({ quizzes: updatedQuizzes });
    toast.success("Quiz removed");
  };
  
  const addQuestion = (quizId) => {
    const quiz = currentLesson.quizzes.find(q => q._id === quizId);
    if (!quiz) return;
    
    const newQuestion = {
      _id: Date.now().toString(),
      text: '',
      type: 'multiple-choice',
      options: [
        { _id: '1', text: 'Option 1', isCorrect: false },
        { _id: '2', text: 'Option 2', isCorrect: false },
        { _id: '3', text: 'Option 3', isCorrect: false },
        { _id: '4', text: 'Option 4', isCorrect: false }
      ],
      points: 1
    };
    
    const updatedQuestions = [...(quiz.questions || []), newQuestion];
    updateQuiz(quizId, { questions: updatedQuestions });
  };
  
  const updateQuestion = (quizId, questionId, data) => {
    const quiz = currentLesson.quizzes.find(q => q._id === quizId);
    if (!quiz) return;
    
    const updatedQuestions = (quiz.questions || []).map(question => 
      question._id === questionId ? { ...question, ...data } : question
    );
    
    updateQuiz(quizId, { questions: updatedQuestions });
  };
  
  const removeQuestion = (quizId, questionId) => {
    const quiz = currentLesson.quizzes.find(q => q._id === quizId);
    if (!quiz) return;
    
    const updatedQuestions = (quiz.questions || []).filter(
      question => question._id !== questionId
    );
    
    updateQuiz(quizId, { questions: updatedQuestions });
    toast.success("Question removed");
  };
  
  const updateOption = (quizId, questionId, optionId, data) => {
    const quiz = currentLesson.quizzes.find(q => q._id === quizId);
    if (!quiz) return;
    
    const question = quiz.questions.find(q => q._id === questionId);
    if (!question) return;
    
    const updatedOptions = question.options.map(option => 
      option._id === optionId ? { ...option, ...data } : option
    );
    
    updateQuestion(quizId, questionId, { options: updatedOptions });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Quizzes</h4>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addQuiz}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Quiz
        </Button>
      </div>
      
      {(!currentLesson.quizzes || currentLesson.quizzes.length === 0) ? (
        <div className="text-center p-6 border border-dashed rounded-md">
          <p className="text-muted-foreground">No quizzes added yet. Add a quiz to test student knowledge.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {currentLesson.quizzes.map((quiz, quizIndex) => (
            <div key={quiz._id} className="border rounded-md p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="font-medium">Quiz {quizIndex + 1}: {quiz.title || 'Untitled Quiz'}</h5>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeQuiz(quiz._id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`quiz-title-${quiz._id}`}>Title</Label>
                  <Input 
                    id={`quiz-title-${quiz._id}`}
                    value={quiz.title} 
                    onChange={(e) => updateQuiz(quiz._id, { title: e.target.value })} 
                    placeholder="e.g. Chapter 1 Assessment"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`quiz-time-${quiz._id}`}>Time Limit (minutes)</Label>
                  <Input 
                    id={`quiz-time-${quiz._id}`}
                    type="number" 
                    min="1" 
                    value={quiz.timeLimit} 
                    onChange={(e) => updateQuiz(quiz._id, { timeLimit: parseInt(e.target.value) || 10 })} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`quiz-description-${quiz._id}`}>Description</Label>
                <Textarea 
                  id={`quiz-description-${quiz._id}`}
                  value={quiz.description} 
                  onChange={(e) => updateQuiz(quiz._id, { description: e.target.value })} 
                  placeholder="Instructions for students taking this quiz"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`quiz-passing-${quiz._id}`}>Passing Score (%)</Label>
                <Input 
                  id={`quiz-passing-${quiz._id}`}
                  type="number" 
                  min="0" 
                  max="100" 
                  value={quiz.passingScore} 
                  onChange={(e) => updateQuiz(quiz._id, { passingScore: parseInt(e.target.value) || 70 })} 
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h6 className="font-medium text-sm">Questions</h6>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addQuestion(quiz._id)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Question
                  </Button>
                </div>
                
                {(!quiz.questions || quiz.questions.length === 0) ? (
                  <div className="text-center p-4 border border-dashed rounded-md">
                    <p className="text-sm text-muted-foreground">No questions added yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {quiz.questions.map((question, questionIndex) => (
                      <div key={question._id} className="border rounded-md p-3 space-y-3 bg-muted/20">
                        <div className="flex justify-between items-center">
                          <h6 className="font-medium text-sm">Question {questionIndex + 1}</h6>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeQuestion(quiz._id, question._id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`question-text-${question._id}`}>Question</Label>
                          <Textarea 
                            id={`question-text-${question._id}`}
                            value={question.text} 
                            onChange={(e) => updateQuestion(quiz._id, question._id, { text: e.target.value })} 
                            placeholder="Enter your question here"
                            rows={2}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Answer Options</Label>
                          <div className="space-y-2">
                            {question.options.map((option) => (
                              <div key={option._id} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`option-correct-${option._id}`}
                                  checked={option.isCorrect}
                                  onCheckedChange={(checked) => 
                                    updateOption(quiz._id, question._id, option._id, { isCorrect: !!checked })
                                  }
                                />
                                <Input 
                                  value={option.text} 
                                  onChange={(e) => 
                                    updateOption(quiz._id, question._id, option._id, { text: e.target.value })
                                  } 
                                  placeholder={`Option ${option._id}`}
                                  className="flex-1"
                                />
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">Check the box next to correct answer(s)</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`question-points-${question._id}`}>Points</Label>
                          <Input 
                            id={`question-points-${question._id}`}
                            type="number" 
                            min="1" 
                            value={question.points} 
                            onChange={(e) => updateQuestion(quiz._id, question._id, { points: parseInt(e.target.value) || 1 })} 
                            className="w-24"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuizzesForm;