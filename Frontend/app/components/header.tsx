'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient();

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [authDropdown, setAuthDropdown] = useState(false)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }
  
    getSession()
  
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })
  
    return () => {
      data?.subscription.unsubscribe()
    }
  }, [])
  
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) section.scrollIntoView({ behavior: 'smooth' })
  }

  const handleNav = (sectionId: string) => {
    if (pathname === '/') {
      scrollToSection(sectionId)
    } else {
      router.push(`/#${sectionId}`)
    }
  }

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image 
            src={'/Appian_Logo.svg.png'}
            width={70}
            height={70}
            alt='Appian logo'
          />
          <span className="text-2xl font-bold">DesignAI</span>
        </Link>
        <nav className="flex items-center space-x-8">
          <button onClick={() => handleNav('features')} className="text-sm font-medium hover:underline">
            Features
          </button>
          <button onClick={() => handleNav('demo')} className="text-sm font-medium hover:underline">
            Demo
          </button>
          <Button onClick={() => router.push('/get-started')}>Get Started</Button>
          {user ? (
            <div className="relative">
              <Image
                src={user.user_metadata.avatar_url}
                width={40}
                height={40}
                className="rounded-full cursor-pointer"
                alt="User profile"
                onClick={() => setShowModal(!showModal)}
              />
              {showModal && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
                  <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <Button onClick={() => setAuthDropdown(!authDropdown)}>Sign In</Button>
              {authDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
                  <button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign in with Google
                  </button>
                  <button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign up with Google
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}