import { Check } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'

const steps = [
  { id: 1, name: '파일 업로드', shortName: '파일' },
  { id: 2, name: '질의서', shortName: '질의서' },
  { id: 3, name: '요구사항', shortName: '요구사항' },
  { id: 4, name: '메뉴구조', shortName: '메뉴' },
  { id: 5, name: 'IA설계', shortName: 'IA' },
  { id: 6, name: '개발문서', shortName: '문서' },
  { id: 7, name: '가이드', shortName: '가이드' }
]

interface StepHeaderProps {
  currentStep: number
}

export function StepHeader({ currentStep }: StepHeaderProps) {
  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed'
    if (stepId === currentStep) return 'active'
    return 'pending'
  }

  return (
    <header className="bg-white border-b border-gray-200 h-16">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900">SI Project Manager</h1>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${getStepStatus(step.id) === 'completed' 
                    ? 'bg-green-500 text-white' 
                    : getStepStatus(step.id) === 'active'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {getStepStatus(step.id) === 'completed' ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
                </div>
                
                {/* Label */}
                <span className={`
                  text-xs mt-1
                  ${getStepStatus(step.id) === 'active' 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-600'
                  }
                `}>
                  {step.shortName}
                </span>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className={`
                  w-8 h-0.5 mx-2 mt-[-20px]
                  ${step.id < currentStep ? 'bg-green-500' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/api/placeholder/32/32" />
                  <AvatarFallback>김PM</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-700">김프로젝트</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>프로필 설정</DropdownMenuItem>
              <DropdownMenuItem>프로젝트 설정</DropdownMenuItem>
              <DropdownMenuItem>로그아웃</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}