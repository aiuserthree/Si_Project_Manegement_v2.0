import { useState } from 'react'
import { 
  LayoutDashboard, 
  FileText, 
  FileEdit, 
  Network, 
  Code2, 
  Settings, 
  Users,
  ChevronDown,
  User,
  X
} from 'lucide-react'
import { Button } from './ui/button'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

const menuItems = [
  { icon: LayoutDashboard, label: '대시보드', key: 'dashboard', active: true },
  { icon: FileText, label: '요구사항 관리', key: 'requirements' },
  { icon: FileEdit, label: '문서 생성', key: 'documents' },
  { icon: Network, label: 'IA/화면설계', key: 'ia-design' },
  { icon: Code2, label: '개발 가이드', key: 'dev-guide' },
  { icon: Settings, label: '프로젝트 설정', key: 'settings' },
  { icon: Users, label: '팀 협업', key: 'collaboration' },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  isMobile: boolean
}

export function Sidebar({ isOpen, onClose, isMobile }: SidebarProps) {
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
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
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
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1 md:space-y-2">
          {menuItems.map((item) => (
            <li key={item.key}>
              <Button
                variant={activeItem === item.key ? "default" : "ghost"}
                className={`w-full justify-start gap-3 h-10 text-sm ${
                  activeItem === item.key 
                    ? 'bg-blue-700 text-white hover:bg-blue-800' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => {
                  setActiveItem(item.key)
                  if (isMobile) onClose()
                }}
              >
                <item.icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Button>
            </li>
          ))}
        </ul>
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