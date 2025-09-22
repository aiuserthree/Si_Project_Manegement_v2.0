import { ChevronLeft, ChevronRight, Save } from 'lucide-react'
import { Button } from './ui/button'

interface StepNavigationProps {
  currentStep: number
  onStepChange: (step: number) => void
  onSave?: () => void
  isLoading?: boolean
}

export function StepNavigation({ 
  currentStep, 
  onStepChange, 
  onSave,
  isLoading = false 
}: StepNavigationProps) {
  const canGoPrevious = currentStep > 1
  const canGoNext = currentStep < 7

  const handlePrevious = () => {
    console.log('Previous button clicked')
    if (canGoPrevious) {
      onStepChange(currentStep - 1)
    }
  }

  const handleNext = () => {
    console.log('Next button clicked, currentStep:', currentStep, 'canGoNext:', canGoNext)
    
    if (canGoNext) {
      const nextStep = currentStep + 1
      console.log('Moving to next step:', nextStep)
      onStepChange(nextStep)
    } else {
      console.log('All steps completed')
      alert('모든 단계가 완료되었습니다! 프로젝트가 성공적으로 완성되었습니다.')
    }
  }

  const handleSave = () => {
    console.log('Save button clicked')
    if (onSave) {
      onSave()
    }
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-18">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Previous Button */}
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={!canGoPrevious || isLoading}
            className="flex items-center space-x-2 h-10"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>이전 단계</span>
          </Button>

          {/* Save Button */}
          <Button
            variant="secondary"
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center space-x-2 h-10"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? '저장 중...' : '저장'}</span>
          </Button>

          {/* Next Button */}
          <Button
            onClick={handleNext}
            disabled={isLoading}
            className="flex items-center space-x-2 h-10 bg-blue-600 hover:bg-blue-700"
          >
            <span>
              {canGoNext ? '다음 단계' : '완료'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </footer>
  )
}