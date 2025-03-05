import { createContext } from 'react'
import Home from './components/Home'
import useTheme from './hooks/useTheme'
import themeContext from './contexts/theme-context'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Login from './components/Login'
import Signup from './components/Signup'
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  }
])
function App() {
  const {theme,setTheme} = useTheme()
  return (
    <>
      <themeContext.Provider value={{theme,setTheme}}>
        <RouterProvider router={router}></RouterProvider>
      </themeContext.Provider>
    </>
  )
}

export default App
