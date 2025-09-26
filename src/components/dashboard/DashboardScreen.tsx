import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { ProfileScreen } from '../settings/ProfileScreen'
import { 
  Plus, 
  FileText, 
  Users, 
  Calendar, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Zap,
  Target,
  BarChart3,
  LogOut
} from 'lucide-react'

interface DashboardScreenProps {
  onStartNewProject: () => void
  onContinueProject: (projectId: string) => void
  currentMenu?: string
  onMenuChange?: (menu: string) => void
  onBackToPrevious?: () => void
  onLogout?: () => void
}

interface Project {
  id: string
  name: string
  client: string
  status: 'active' | 'completed' | 'paused'
  progress: number
  currentStep: number
  startDate: string
  endDate: string
  lastActivity: string
}

interface Stats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalRequirements: number
  aiAnalyses: number
}

export function DashboardScreen({ onStartNewProject, onContinueProject, currentMenu = 'dashboard', onMenuChange, onBackToPrevious, onLogout }: DashboardScreenProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [showAllProjects, setShowAllProjects] = useState(false)
  
  const [stats] = useState<Stats>({
    totalProjects: 12,
    activeProjects: 5,
    completedProjects: 7,
    totalRequirements: 156,
    aiAnalyses: 89
  })

  const [allProjects] = useState<Project[]>([
    {
      id: 'proj-001',
      name: '이커머스 플랫폼 구축',
      client: 'ABC 쇼핑몰',
      status: 'active',
      progress: 67,
      currentStep: 5,
      startDate: '2025-01-15',
      endDate: '2025-06-30',
      lastActivity: '2시간 전'
    },
    {
      id: 'proj-002',
      name: 'HR 관리 시스템',
      client: 'XYZ 기업',
      status: 'active',
      progress: 43,
      currentStep: 3,
      startDate: '2025-02-01',
      endDate: '2025-07-15',
      lastActivity: '1일 전'
    },
    {
      id: 'proj-003',
      name: '재고 관리 솔루션',
      client: 'DEF 제조업',
      status: 'completed',
      progress: 100,
      currentStep: 7,
      startDate: '2024-10-01',
      endDate: '2025-01-31',
      lastActivity: '1주일 전'
    },
    {
      id: 'proj-004',
      name: '고객 관리 시스템',
      client: 'GHI 서비스',
      status: 'active',
      progress: 25,
      currentStep: 2,
      startDate: '2025-02-10',
      endDate: '2025-08-15',
      lastActivity: '3일 전'
    },
    {
      id: 'proj-005',
      name: '재무 관리 솔루션',
      client: 'JKL 금융',
      status: 'paused',
      progress: 80,
      currentStep: 6,
      startDate: '2024-11-01',
      endDate: '2025-03-31',
      lastActivity: '2주일 전'
    },
    {
      id: 'proj-006',
      name: '교육 플랫폼 개발',
      client: 'MNO 교육',
      status: 'completed',
      progress: 100,
      currentStep: 7,
      startDate: '2024-08-01',
      endDate: '2024-12-31',
      lastActivity: '1개월 전'
    }
  ])

  const recentProjects = showAllProjects ? allProjects : allProjects.slice(0, 3)

  const [recentActivities] = useState([
    {
      id: 1,
      type: 'ai_analysis',
      message: '이커머스 플랫폼 구축 프로젝트에서 5개 문서 분석 완료',
      time: '2시간 전',
      icon: Zap
    },
    {
      id: 2,
      type: 'requirement_added',
      message: 'HR 관리 시스템에 새로운 요구사항 3개 추가',
      time: '1일 전',
      icon: Target
    },
    {
      id: 3,
      type: 'project_completed',
      message: '재고 관리 솔루션 프로젝트 완료',
      time: '1주일 전',
      icon: CheckCircle
    }
  ])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">진행중</Badge>
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">완료</Badge>
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800">일시정지</Badge>
      default:
        return <Badge variant="secondary">알 수 없음</Badge>
    }
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

  const handleLogoutClick = () => {
    setShowLogoutDialog(true)
  }

  const handleLogoutConfirm = () => {
    setShowLogoutDialog(false)
    if (onLogout) {
      onLogout()
    }
  }

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false)
  }

  const toggleAllProjects = () => {
    setShowAllProjects(!showAllProjects)
  }

  const renderMenuContent = () => {
    switch (currentMenu) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => onBackToPrevious && onBackToPrevious()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                뒤로 가기
              </Button>
              <h2 className="text-2xl font-bold text-gray-900">프로필 설정</h2>
            </div>
            
            <ProfileScreen />
          </div>
        )
      
      default: // dashboard
        return (
          <div className="space-y-6">
            {/* 기존 대시보드 컨텐츠 */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
                <p className="text-gray-600 mt-1">
                  SI Project Manager에 오신 것을 환영합니다
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={onStartNewProject}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  새 프로젝트 시작
                </Button>
                <Button 
                  onClick={handleLogoutClick}
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">전체 프로젝트</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProjects}</div>
                  <p className="text-xs text-muted-foreground">
                    +2 from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">진행 중인 프로젝트</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeProjects}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((stats.activeProjects / stats.totalProjects) * 100)}% of total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">AI 분석 완료</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.aiAnalyses}</div>
                  <p className="text-xs text-muted-foreground">
                    +12 this week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">총 요구사항</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalRequirements}</div>
                  <p className="text-xs text-muted-foreground">
                    +23 this month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Projects */}
            <Card>
              <CardHeader>
                <CardTitle>최근 프로젝트</CardTitle>
                <CardDescription>
                  진행 중인 프로젝트와 최근 완료된 프로젝트를 확인하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentProjects.map((project) => (
                    <div
                      key={project.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => onContinueProject(project.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">{project.name}</h3>
                        {getStatusBadge(project.status)}
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{project.client}</p>
                      <div className="space-y-1 text-xs text-gray-500">
                        <div>현재 단계: {getStepName(project.currentStep)}</div>
                        <div>마지막 활동: {project.lastActivity}</div>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>진행률</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={toggleAllProjects}
                  >
                    {showAllProjects ? '프로젝트 접기' : `모든 프로젝트 보기 (${allProjects.length}개)`}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>최근 활동</CardTitle>
                <CardDescription>
                  시스템에서 발생한 최근 활동을 확인하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentActivities.map((activity) => {
                    const Icon = activity.icon
                    return (
                      <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Icon className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {renderMenuContent()}
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
    </div>
  )
}
