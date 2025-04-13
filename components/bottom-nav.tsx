'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Heart } from 'lucide-react'
import { useEffect, useState } from 'react'

const BottomNav = () => {
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Prevent hydration mismatch by not rendering anything until mounted
    if (!mounted) {
        return null
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800">
            <div className="flex justify-around items-center h-16">
                <Link
                    href="/"
                    className={`flex flex-col items-center justify-center w-full h-full ${pathname === '/' ? 'text-white' : 'text-gray-500'
                        }`}
                >
                    <Home
                        className="h-6 w-6"
                        fill={pathname === '/' ? 'currentColor' : 'none'}
                    />
                    <span className="text-xs mt-1">Home</span>
                </Link>

                <Link
                    href="/recommendations"
                    className={`flex flex-col items-center justify-center w-full h-full ${pathname === '/recommendations' ? 'text-white' : 'text-gray-500'
                        }`}
                >
                    <Heart
                        className="h-6 w-6"
                        fill={pathname === '/recommendations' ? 'currentColor' : 'none'}
                    />
                    <span className="text-xs mt-1">For You</span>
                </Link>
            </div>
        </nav>
    )
}

export default BottomNav 