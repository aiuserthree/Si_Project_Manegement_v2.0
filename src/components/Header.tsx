import { Search, ChevronDown, Plus, Zap, Download, Menu, User, LogOut, Settings } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { authService } from '../services/authService'
import { useState, useEffect } from 'react'

interface HeaderProps {
  onMenuClick: () => void
  isMobile: boolean
  onMenuChange?: (menu: string) => void
}

export function Header({ onMenuClick, isMobile, onMenuChange }: HeaderProps) {
  const [authState, setAuthState] = useState(authService.getAuthState())
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [currentProject, setCurrentProject] = useState({
    name: '이커머스 플랫폼 구축 프로젝트',
    progress: 67,
    currentStep: 5
  })

  useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState)
    return unsubscribe
  }, [])

  const handleLogoutClick = () => {
    setShowLogoutDialog(true)
  }

  const handleLogoutConfirm = async () => {
    setShowLogoutDialog(false)
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false)
  }

  const getStepName = (step: number) => {
    const steps = [
      '파일 업로드',
      '질의서',
      '요구사항 정의',
      '메뉴 구조',
      'IA 디자인',
      '문서 편집',
      '개발 가이드'
    ]
    return steps[step - 1] || '알 수 없음'
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        {/* Left side - Menu and Project Title */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {isMobile && (
            <Button variant="ghost" size="sm" onClick={onMenuClick}>
              <Menu className="w-5 h-5" />
            </Button>
          )}
          
          <div className="flex-1 min-w-0">
            <h1 className="text-lg md:text-2xl font-bold text-gray-900 mb-1 md:mb-2 truncate">
              {currentProject.name}
            </h1>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="flex-1 max-w-xs md:max-w-md">
                <div className="flex items-center justify-between text-xs md:text-sm text-gray-600 mb-1">
                  <span>전체 진행율</span>
                  <span>{currentProject.progress}%</span>
                </div>
                <Progress value={currentProject.progress} className="h-1.5 md:h-2" />
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs whitespace-nowrap">
                {currentProject.currentStep}단계 진행 중
              </Badge>
            </div>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 md:gap-3 ml-2">

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={authState.user?.avatar} alt={authState.user?.name} />
                  <AvatarFallback>
                    {authState.user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{authState.user?.name}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {authState.user?.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onMenuChange && onMenuChange('profile')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>프로필 설정</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogoutClick}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>로그아웃</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0">
        {/* Quick Actions */}
        <div className="flex items-center gap-2 md:gap-3 overflow-x-auto">
          <Button className="bg-blue-700 hover:bg-blue-800 text-white whitespace-nowrap text-sm">
            <Plus className="w-4 h-4 mr-1 md:mr-2" />
            {isMobile ? '새 요구사항' : '새 요구사항 추가'}
          </Button>
          <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50 whitespace-nowrap text-sm">
            <Zap className="w-4 h-4 mr-1 md:mr-2" />
            AI 분석
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="whitespace-nowrap text-sm">
                <Download className="w-4 h-4 mr-1 md:mr-2" />
                Export
                <ChevronDown className="w-4 h-4 ml-1 md:ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>요구사항 정의서 (PDF)</DropdownMenuItem>
              <DropdownMenuItem>IA 문서 (Excel)</DropdownMenuItem>
              <DropdownMenuItem>개발 가이드 (MD)</DropdownMenuItem>
              <DropdownMenuItem>전체 문서 패키지</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder={isMobile ? "검색..." : "요구사항, IA 코드 검색..."} 
              className={`pl-10 bg-gray-50 text-sm ${isMobile ? 'w-full' : 'w-60 md:w-80'}`}
            />
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg border border-gray-200 shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">로그아웃 확인</h3>
            <p className="text-gray-600 mb-6">
              정말로 로그아웃하시겠습니까?
            </p>
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={handleLogoutCancel}
              >
                취소
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleLogoutConfirm}
              >
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}