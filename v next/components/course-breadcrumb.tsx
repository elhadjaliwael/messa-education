import { Link } from "react-router-dom"

interface CourseBreadcrumbProps {
  level?: string
  subLevel?: string
}

export function CourseBreadcrumb({ level, subLevel }: CourseBreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Link
        to="/courses"
        className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
      >
        Cours
      </Link>
      {level && (
        <>
          <span className="text-sm text-slate-500 dark:text-slate-400">/</span>
          {subLevel ? (
            <Link
              to={`/cours/${level}`}
              className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Link>
          ) : (
            <span className="text-sm font-medium">{level.charAt(0).toUpperCase() + level.slice(1)}</span>
          )}
        </>
      )}
      {subLevel && (
        <>
          <span className="text-sm text-slate-500 dark:text-slate-400">/</span>
          <span className="text-sm font-medium">{subLevel}</span>
        </>
      )}
    </div>
  )
}
