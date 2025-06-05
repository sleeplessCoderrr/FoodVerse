import { type ReactNode } from 'react'
import { Navbar } from './Navbar'

interface AuthenticatedLayoutProps {
  children: ReactNode
  onSearch?: (query: string) => void
  searchPlaceholder?: string
  showNavbar?: boolean
}

export function AuthenticatedLayout({ 
  children, 
  onSearch, 
  searchPlaceholder,
  showNavbar = true 
}: AuthenticatedLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0EEE6] via-[#F0EEE6] to-[#F5F3ED] dark:from-[#262624] dark:via-[#2A2A28] dark:to-[#1E1E1C]">
      {showNavbar && (
        <Navbar 
          onSearch={onSearch} 
          searchPlaceholder={searchPlaceholder}
        />
      )}
      <main className={showNavbar ? "pt-0" : ""}>
        {children}
      </main>
    </div>
  )
}

export default AuthenticatedLayout
