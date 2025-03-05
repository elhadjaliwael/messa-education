import React, { useContext } from 'react'
import { motion as m } from "motion/react";
import themeContext from '../contexts/theme-context';
function ThemeIcon() {
    const {theme,setTheme} = useContext(themeContext)
    const raysVariants = {
        hidden: {
        strokeOpacity: 0,
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
        },
        },
        visible: {
        strokeOpacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
        },
    };

    const rayVariant = {
        hidden: {
            pathLength: 0,
            opacity: 0,
            // Start from center of the circle
            scale: 0
        },
        visible: {
            pathLength: 1,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.15,
                ease: "easeOut",
                // Customize timing for each property
                pathLength: { duration: 0.3 },
                scale: { duration: 0.3 }
        }
        },
    };

    

    const sunPath = "M47.0001 65.3334C57.1253 65.3334 65.3334 57.1253 65.3334 47.0001C65.3334 36.8749 57.1253 28.6667 47.0001 28.6667C36.8749 28.6667 28.6667 36.8749 28.6667 47.0001C28.6667 57.1253 36.8749 65.3334 47.0001 65.3334Z";
    const moonPath = "M47.0001 65.3334C57.1253 65.3334 65.3334 57.1253 65.3334 47.0001C48.9405 55.7086 41.8508 46.2156 47.0001 28.6667C36.8749 28.6667 28.6667 36.8749 28.6667 47.0001C28.6667 57.1253 36.8749 65.3334 47.0001 65.3334Z";

    return (
        <div className='mr-3 flex justify-center items-center'>
            <button onClick={() => setTheme()}>
                <m.svg width="30" height="30" viewBox="0 0 94 94" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <m.path initial={{fillOpacity : 0,strokeOpacity:0}} animate={theme === 'dark' ? {
                        fillOpacity : 1,
                        strokeOpacity : 1,
                        scale : 2,
                        rotate : 360,
                        fill : "var(--color-copy)",
                        stroke : "var(--color-copy)",
                        d : moonPath
                    } : {
                        fillOpacity : 1,
                        strokeOpacity : 1,
                        rotate : 0,
                        fill : "var(--color-copy)",
                        stroke : "var(--color-copy)",
                        
                    }} d={sunPath} />
                    <m.g variants={raysVariants} initial="hidden" animate = {
                        theme === "light" ? "visible" : "hidden"
                    } className='stroke-6 stroke-copy'>
                        <m.path  variants = {rayVariant} d="M47 1.16675V10.3334" />
                        <m.path  variants = {rayVariant} d="M47 83.6667V92.8334" />
                        <m.path  variants = {rayVariant} d="M14.5959 14.5959L21.0584 21.0584" />
                        <m.path  variants = {rayVariant} d="M72.9417 72.9417L79.4041 79.4041" />
                        <m.path  variants = {rayVariant} d="M1.16675 47H10.3334"/>
                        <m.path  variants = {rayVariant} d="M83.6667 47H92.8334"/>
                        <m.path  variants = {rayVariant} d="M21.0584 72.9417L14.5959 79.4041"/>
                        <m.path  variants = {rayVariant} d="M79.4041 14.5959L72.9417 21.0584"/>
                    </m.g>
                </m.svg>
            </button>
        </div>
    )
}

export default ThemeIcon