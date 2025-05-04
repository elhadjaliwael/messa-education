import { useEffect, useState } from "react";

export default function useTheme(){
    const [theme,setTheme] = useState("light")

    function toggleTheme(){
        const newTheme = theme === "light" ? "dark" : "light"
        setTheme(newTheme)
        localStorage.setItem("theme", newTheme)
        document.body.classList.remove("light", "dark")
        document.body.classList.add(newTheme)
    }

    useEffect(() => {
        const selectedTheme = localStorage.getItem("theme")
        if(selectedTheme){
            setTheme(selectedTheme)
            document.body.classList.add(selectedTheme)
        }
        else if(window.matchMedia("(prefers-color-scheme: dark)").matches){
            setTheme("dark")
            document.body.classList.add("dark")
        } else {
            setTheme("light")
            document.body.classList.add("light")
        }
    }, []) // Only run once on mount

    return {theme,setTheme : toggleTheme}
}
