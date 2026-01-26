"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-primary/80 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="animate-fade-in">
        <div className="relative w-48 h-48 animate-pulse bg-white rounded-full overflow-hidden shadow-2xl flex items-center justify-center p-4">
          <Image 
            src="https://i.imgur.com/Rm4fQnT.jpeg" 
            alt="4K Team Logo" 
            fill 
            className="object-contain p-6" // p-6 adiciona um respiro interno para a logo não encostar nas bordas
            priority 
          />
        </div>
      </div>
    </div>
  )
}