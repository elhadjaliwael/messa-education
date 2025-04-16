import { Gamepad2, Activity, LineChart, Trophy } from "lucide-react"

export function LearningTools() {
  const tools = [
    {
      id: "games",
      name: "Jeux éducatifs",
      description: "Apprendre en s'amusant",
      icon: <Gamepad2 className="h-6 w-6" />,
    },
    {
      id: "activities",
      name: "Activités interactives",
      description: "Exercices pratiques",
      icon: <Activity className="h-6 w-6" />,
    },
    {
      id: "progress",
      name: "Suivi des progrès",
      description: "Tableau de bord",
      icon: <LineChart className="h-6 w-6" />,
    },
    {
      id: "rewards",
      name: "Récompenses",
      description: "Badges et trophées",
      icon: <Trophy className="h-6 w-6" />,
    },
  ]

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold mb-6">Outils d'apprentissage</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <div key={tool.id} className="border rounded-lg p-6 bg-white dark:bg-slate-950">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">{tool.icon}</div>
              <h3 className="font-medium mb-1">{tool.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{tool.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
