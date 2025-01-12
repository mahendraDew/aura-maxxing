'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { MoonIcon, SunIcon } from 'lucide-react'

export default function ModeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
   
      <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className='rounded-full w-7 h-7'>
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </Button>
  )
}
