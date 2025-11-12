import { useState } from 'react'
import {
  LayoutDashboard, 
  FileText, 
  FileEdit, 
  Code2, 
  Settings, 
  Users,
  ChevronDown,
  User,
  X,
  Upload,
  Target,
  Layout,
  BookOpen,
  Building2,
  Zap,
  Shield,
  UserPlus,
  GanttChartSquare,
  Sparkles,
  FileCheck
} from 'lucide-react'
import { Button } from './ui/button'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

const mainMenuItems = [
  { icon: LayoutDashboard, label: '대시보드', key: 'dashboard' },
  { icon: Settings, label: '프로필 설정', key: 'profile' },
]

const workflowSteps = [
  { id: 1, label: '파일 업로드', icon: Upload, description: '요구사항 문서 업로드' },
  { id: 2, label: '질의서', icon: Target, description: 'AI 기반 질의서 생성' },
  { id: 3, label: '요구사항 정의', icon: FileEdit, description: '요구사항 도출 및 정의' },
  { id: 4, label: '메뉴 구조', icon: Layout, description: '시스템 메뉴 구조 설계' },
  { id: 5, label: '기능정의서', icon: FileCheck, description: '메뉴 구조 기반 기능정의서 자동생성' },
  { id: 6, label: '인력 관리', icon: UserPlus, description: '인력 pool 및 프로젝트 투입 관리' },
  { id: 7, label: 'WBS', icon: GanttChartSquare, description: '작업 분해 및 일정 관리' },
  { id: 8, label: '피그마 메이크 프롬프트', icon: Sparkles, description: '기능정의서 기반 프롬프트 자동생성' },
  { id: 9, label: '문서 편집', icon: FileText, description: '개발 문서 생성' },
  { id: 10, label: '개발 가이드', icon: BookOpen, description: '최종 개발 가이드 생성' },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  isMobile: boolean
  currentStep?: number
  onStepChange?: (step: number) => void
  currentMenu?: string
  onMenuChange?: (menu: string) => void
}

export function Sidebar({ isOpen, onClose, isMobile, currentStep, onStepChange, currentMenu = 'dashboard', onMenuChange }: SidebarProps) {
  const [activeItem, setActiveItem] = useState('dashboard')

  const sidebarClasses = isMobile
    ? `fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`
    : 'w-60 bg-white border-r border-gray-200 flex-shrink-0'

  return (
    <div className={`${sidebarClasses} flex flex-col h-full`}>
      {/* Logo Section */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-sm md:text-base">
              SI Project Manager
            </span>
          </div>
          {isMobile && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Project Selector */}
      <div className="p-4 border-b border-gray-200">
        <Select defaultValue="ecommerce-project">
          <SelectTrigger className="w-full bg-gray-50 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ecommerce-project">이커머스 플랫폼 구축</SelectItem>
            <SelectItem value="erp-system">ERP 시스템 개발</SelectItem>
            <SelectItem value="mobile-app">모바일 앱 프로젝트</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto">
        {/* Main Menu */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            메인 메뉴
          </h3>
          <ul className="space-y-1">
            {mainMenuItems.map((item) => (
              <li key={item.key}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-10 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    if (onMenuChange) {
                      onMenuChange(item.key)
                    }
                    if (isMobile) onClose()
                  }}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>

        {/* Workflow Steps */}
        <div className="p-4 border-t border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            워크플로우
          </h3>
          <ul className="space-y-1">
            {workflowSteps.map((step) => {
              const isActive = currentStep === step.id
              const isCompleted = currentStep && step.id < currentStep
              
              return (
                <li key={step.id}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 h-10 text-sm relative ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-r-2 border-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    } ${isCompleted && !isActive ? 'text-green-600' : ''}`}
                    onClick={() => {
                      if (onStepChange) {
                        onStepChange(step.id)
                      }
                      if (isMobile) onClose()
                    }}
                  >
                    <step.icon className={`w-4 h-4 flex-shrink-0 ${isCompleted ? 'text-green-600' : ''}`} />
                    <div className="flex flex-col items-start flex-1">
                      <span className="text-sm">{step.label}</span>
                      <span className={`text-xs ${
                        isActive ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {step.description}
                      </span>
                    </div>
                    {isCompleted && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    )}
                  </Button>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src="/api/placeholder/32/32" />
            <AvatarFallback className="text-xs">김PM</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">김프로젝트</p>
            <p className="text-xs text-gray-500 truncate">Project Manager</p>
          </div>
        </div>
      </div>
    </div>
  )
}