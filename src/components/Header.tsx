import { Bell, Search, ChevronDown, Plus, Zap, Download, Menu } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'

interface HeaderProps {
  onMenuClick: () => void
  isMobile: boolean
}

export function Header({ onMenuClick, isMobile }: HeaderProps) {
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
              이커머스 플랫폼 구축 프로젝트
            </h1>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="flex-1 max-w-xs md:max-w-md">
                <div className="flex items-center justify-between text-xs md:text-sm text-gray-600 mb-1">
                  <span>전체 진행율</span>
                  <span>67%</span>
                </div>
                <Progress value={67} className="h-1.5 md:h-2" />
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs whitespace-nowrap">
                5단계 진행 중
              </Badge>
            </div>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 md:gap-3 ml-2">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-4 h-4 md:w-5 md:h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
              3
            </span>
          </Button>
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
    </header>
  )
}