import Link from 'next/link'
import { Button } from '@/components/ui/button'
import ModeToggle from './mode-toggle'

export function Navigation() {
  return (
    <div className='w-full  flex justify-center items-center'>

    <nav className="p-4 rounded-lg  flex justify-between items-center max-w-6xl  border  w-full">
      <Link href="/">
        <span className="text-xl font-bold">AURA Maxxing</span>
      </Link>
      <div className='flex justify-center items-center gap-2'>
        <Link href="/dashboard">
          <Button variant="ghost">Dashboard</Button>
        </Link>
        <ModeToggle />
      </div>
    </nav>
    </div>
  )
}

