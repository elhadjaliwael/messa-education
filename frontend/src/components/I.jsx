import React, { useContext } from 'react'
import ThemeContext from '../contexts/theme-context'
function I({src,className}) {
  const {theme} = useContext(ThemeContext)
  return (
    <>
      <img src={src} className={`${className} ${theme === "light" ? "light-icon" : "dark-icon"}`} alt="icon" />
    </>
  )
}

export default I