import { useState, useEffect } from 'react'
import { Header } from '../Header'
import { Sidebar } from '../Sidebar'
import { Button } from '../ui/button'
import { Menu, X } from 'lucide-react'

interface AppLayoutProps {
  children: React.ReactNode
  currentStep?: number
  onStepChange?: (step: number) => void
  onSave?: () => void
  currentMenu?: string
  onMenuChange?: (menu: string) => void
}

export function AppLayout({ children, currentStep, onStepChange, onSave, currentMenu, onMenuChange }: AppLayoutProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setSidebarOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
        isMobile={isMobile}
        currentStep={currentStep}
        onStepChange={onStepChange}
        currentMenu={currentMenu}
        onMenuChange={onMenuChange}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header 
          onMenuClick={handleMenuClick}
          isMobile={isMobile}
          onMenuChange={onMenuChange}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 py-8 w-full">
            <div className="space-y-6">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={handleSidebarClose}
        />
      )}
    </div>
  )
}
