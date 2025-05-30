import React from 'react'
import { Link } from 'react-router-dom'

function DeuxiemeAnneePage() {
  const subjects = [
    { id: 1, name: 'Mathématiques', videos: 14, exercises: 10, quizzes: 5 },
    { id: 2, name: 'Français', videos: 12, exercises: 8, quizzes: 4 },
    { id: 3, name: 'Arabe', videos: 10, exercises: 7, quizzes: 3 },
    { id: 4, name: 'Éveil scientifique', videos: 8, exercises: 6, quizzes: 3 },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">2ème Année Primaire</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map(subject => (
          <div key={subject.id} className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-foreground">{subject.name}</h2>
            <div className="grid grid-cols-3 gap-2">
              <Link to={`/cours/primaire/2eme/videos/${subject.name.toLowerCase()}/introduction`}>
                <div className="bg-primary/10 p-3 rounded text-center hover:bg-primary/20 transition-colors">
                  <p className="font-medium text-foreground">Vidéos</p>
                  <p className="text-sm text-muted-foreground">{subject.videos}</p>
                </div>
              </Link>
              <Link to={`/cours/primaire/2eme/exercises/${subject.name.toLowerCase()}/basic`}>
                <div className="bg-primary/10 p-3 rounded text-center hover:bg-primary/20 transition-colors">
                  <p className="font-medium text-foreground">Exercices</p>
                  <p className="text-sm text-muted-foreground">{subject.exercises}</p>
                </div>
              </Link>
              <Link to={`/cours/primaire/2eme/quiz/${subject.name.toLowerCase()}/chapter1`}>
                <div className="bg-primary/10 p-3 rounded text-center hover:bg-primary/20 transition-colors">
                  <p className="font-medium text-foreground">Quiz</p>
                  <p className="text-sm text-muted-foreground">{subject.quizzes}</p>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DeuxiemeAnneePage