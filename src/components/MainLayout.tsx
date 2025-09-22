import { useState } from 'react'
import { StepHeader } from './StepHeader'
import { StepNavigation } from './StepNavigation'

interface MainLayoutProps {
  children: React.ReactNode
  currentStep: number
  onStepChange: (step: number) => void
  onSave?: () => void
}

export function MainLayout({ children, currentStep, onStepChange, onSave }: MainLayoutProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    if (onSave) {
      onSave()
    }
    // 실제 저장 로직 구현
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Progress */}
      <StepHeader currentStep={currentStep} />
      
      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        <div className="space-y-6">
          {children}
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <StepNavigation 
        currentStep={currentStep} 
        onStepChange={onStepChange}
        onSave={handleSave}
        isLoading={isLoading}
      />
    </div>
  )
}