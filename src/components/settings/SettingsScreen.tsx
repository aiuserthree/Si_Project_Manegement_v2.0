import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Switch } from '../ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Globe,
  Save,
  RefreshCw,
  Trash2,
  Plus,
  Mail,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react'

export function SettingsScreen() {
  const [showPassword, setShowPassword] = useState(false)
  const [settings, setSettings] = useState({
    // 프로필 설정
    profile: {
      name: '김프로젝트',
      email: 'pm@company.com',
      role: 'Project Manager',
      department: 'IT개발팀',
      phone: '010-1234-5678'
    },
    // 알림 설정
    notifications: {
      emailNotifications: true,
      projectUpdates: true,
      taskAssignments: true,
      deadlineReminders: true,
      weeklyReports: false,
      systemAlerts: true
    },
    // 보안 설정
    security: {
      twoFactorAuth: false,
      sessionTimeout: '30',
      passwordExpiry: '90',
      loginAlerts: true,
      ipRestrictions: false
    },
    // 시스템 설정
    system: {
      language: 'ko',
      timezone: 'Asia/Seoul',
      dateFormat: 'YYYY-MM-DD',
      theme: 'light',
      autoSave: true,
      backupFrequency: 'daily'
    },
    // 프로젝트 설정
    project: {
      defaultProjectType: 'web',
      autoArchive: true,
      archiveAfterDays: '90',
      maxFileSize: '50',
      allowedFileTypes: ['pdf', 'doc', 'docx', 'xlsx', 'pptx']
    }
  })

  const handleSave = () => {
    // 설정 저장 로직
    console.log('설정이 저장되었습니다:', settings)
    alert('설정이 저장되었습니다.')
  }

  const handleReset = () => {
    if (confirm('모든 설정을 기본값으로 초기화하시겠습니까?')) {
      // 설정 초기화 로직
      console.log('설정이 초기화되었습니다.')
      alert('설정이 초기화되었습니다.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">설정</h1>
          <p className="text-gray-600 mt-1">
            시스템 설정을 관리하고 개인화할 수 있습니다
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            초기화
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            저장
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            프로필
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            알림
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            보안
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            시스템
          </TabsTrigger>
          <TabsTrigger value="project" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            프로젝트
          </TabsTrigger>
        </TabsList>

        {/* 프로필 설정 */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>개인 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    value={settings.profile.name}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, name: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, email: e.target.value }
                    })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">역할</Label>
                  <Input
                    id="role"
                    value={settings.profile.role}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, role: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="department">부서</Label>
                  <Input
                    id="department"
                    value={settings.profile.department}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, department: e.target.value }
                    })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">전화번호</Label>
                <Input
                  id="phone"
                  value={settings.profile.phone}
                  onChange={(e) => setSettings({
                    ...settings,
                    profile: { ...settings.profile, phone: e.target.value }
                  })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>비밀번호 변경</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="current-password">현재 비밀번호</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showPassword ? "text" : "password"}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="new-password">새 비밀번호</Label>
                <Input
                  id="new-password"
                  type="password"
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">비밀번호 확인</Label>
                <Input
                  id="confirm-password"
                  type="password"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 알림 설정 */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>알림 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">이메일 알림</Label>
                  <p className="text-sm text-gray-500">이메일로 알림을 받습니다</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, emailNotifications: checked }
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="project-updates">프로젝트 업데이트</Label>
                  <p className="text-sm text-gray-500">프로젝트 상태 변경 시 알림</p>
                </div>
                <Switch
                  id="project-updates"
                  checked={settings.notifications.projectUpdates}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, projectUpdates: checked }
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="task-assignments">작업 할당</Label>
                  <p className="text-sm text-gray-500">새로운 작업이 할당될 때 알림</p>
                </div>
                <Switch
                  id="task-assignments"
                  checked={settings.notifications.taskAssignments}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, taskAssignments: checked }
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="deadline-reminders">마감일 알림</Label>
                  <p className="text-sm text-gray-500">마감일 3일 전 알림</p>
                </div>
                <Switch
                  id="deadline-reminders"
                  checked={settings.notifications.deadlineReminders}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, deadlineReminders: checked }
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-reports">주간 보고서</Label>
                  <p className="text-sm text-gray-500">매주 월요일 진행 상황 보고서</p>
                </div>
                <Switch
                  id="weekly-reports"
                  checked={settings.notifications.weeklyReports}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, weeklyReports: checked }
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="system-alerts">시스템 알림</Label>
                  <p className="text-sm text-gray-500">시스템 오류 및 중요 공지사항</p>
                </div>
                <Switch
                  id="system-alerts"
                  checked={settings.notifications.systemAlerts}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, systemAlerts: checked }
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 보안 설정 */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>보안 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor">2단계 인증</Label>
                  <p className="text-sm text-gray-500">로그인 시 추가 보안 단계</p>
                </div>
                <Switch
                  id="two-factor"
                  checked={settings.security.twoFactorAuth}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    security: { ...settings.security, twoFactorAuth: checked }
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="login-alerts">로그인 알림</Label>
                  <p className="text-sm text-gray-500">새로운 기기에서 로그인 시 이메일 알림</p>
                </div>
                <Switch
                  id="login-alerts"
                  checked={settings.security.loginAlerts}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    security: { ...settings.security, loginAlerts: checked }
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ip-restrictions">IP 제한</Label>
                  <p className="text-sm text-gray-500">특정 IP에서만 접근 허용</p>
                </div>
                <Switch
                  id="ip-restrictions"
                  checked={settings.security.ipRestrictions}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    security: { ...settings.security, ipRestrictions: checked }
                  })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="session-timeout">세션 타임아웃 (분)</Label>
                  <Select
                    value={settings.security.sessionTimeout}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      security: { ...settings.security, sessionTimeout: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15분</SelectItem>
                      <SelectItem value="30">30분</SelectItem>
                      <SelectItem value="60">1시간</SelectItem>
                      <SelectItem value="120">2시간</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="password-expiry">비밀번호 만료 (일)</Label>
                  <Select
                    value={settings.security.passwordExpiry}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      security: { ...settings.security, passwordExpiry: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30일</SelectItem>
                      <SelectItem value="60">60일</SelectItem>
                      <SelectItem value="90">90일</SelectItem>
                      <SelectItem value="180">180일</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 시스템 설정 */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>시스템 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language">언어</Label>
                  <Select
                    value={settings.system.language}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      system: { ...settings.system, language: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ko">한국어</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone">시간대</Label>
                  <Select
                    value={settings.system.timezone}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      system: { ...settings.system, timezone: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Seoul">Asia/Seoul (KST)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date-format">날짜 형식</Label>
                  <Select
                    value={settings.system.dateFormat}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      system: { ...settings.system, dateFormat: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="theme">테마</Label>
                  <Select
                    value={settings.system.theme}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      system: { ...settings.system, theme: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">라이트</SelectItem>
                      <SelectItem value="dark">다크</SelectItem>
                      <SelectItem value="auto">자동</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-save">자동 저장</Label>
                  <p className="text-sm text-gray-500">작업 내용을 자동으로 저장합니다</p>
                </div>
                <Switch
                  id="auto-save"
                  checked={settings.system.autoSave}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    system: { ...settings.system, autoSave: checked }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="backup-frequency">백업 주기</Label>
                <Select
                  value={settings.system.backupFrequency}
                  onValueChange={(value) => setSettings({
                    ...settings,
                    system: { ...settings.system, backupFrequency: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">매일</SelectItem>
                    <SelectItem value="weekly">매주</SelectItem>
                    <SelectItem value="monthly">매월</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 프로젝트 설정 */}
        <TabsContent value="project" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>프로젝트 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="default-project-type">기본 프로젝트 유형</Label>
                <Select
                  value={settings.project.defaultProjectType}
                  onValueChange={(value) => setSettings({
                    ...settings,
                    project: { ...settings.project, defaultProjectType: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">웹 개발</SelectItem>
                    <SelectItem value="mobile">모바일 앱</SelectItem>
                    <SelectItem value="desktop">데스크톱 앱</SelectItem>
                    <SelectItem value="api">API 개발</SelectItem>
                    <SelectItem value="data">데이터 분석</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-archive">자동 아카이브</Label>
                  <p className="text-sm text-gray-500">완료된 프로젝트를 자동으로 아카이브합니다</p>
                </div>
                <Switch
                  id="auto-archive"
                  checked={settings.project.autoArchive}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    project: { ...settings.project, autoArchive: checked }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="archive-after-days">아카이브 대기 기간 (일)</Label>
                <Select
                  value={settings.project.archiveAfterDays}
                  onValueChange={(value) => setSettings({
                    ...settings,
                    project: { ...settings.project, archiveAfterDays: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30일</SelectItem>
                    <SelectItem value="60">60일</SelectItem>
                    <SelectItem value="90">90일</SelectItem>
                    <SelectItem value="180">180일</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="max-file-size">최대 파일 크기 (MB)</Label>
                <Select
                  value={settings.project.maxFileSize}
                  onValueChange={(value) => setSettings({
                    ...settings,
                    project: { ...settings.project, maxFileSize: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10MB</SelectItem>
                    <SelectItem value="25">25MB</SelectItem>
                    <SelectItem value="50">50MB</SelectItem>
                    <SelectItem value="100">100MB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>허용된 파일 형식</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {settings.project.allowedFileTypes.map((type, index) => (
                    <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm">
                      {type}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-gray-200"
                        onClick={() => {
                          const newTypes = settings.project.allowedFileTypes.filter((_, i) => i !== index)
                          setSettings({
                            ...settings,
                            project: { ...settings.project, allowedFileTypes: newTypes }
                          })
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => {
                      const newType = prompt('새 파일 형식을 입력하세요:')
                      if (newType) {
                        setSettings({
                          ...settings,
                          project: { 
                            ...settings.project, 
                            allowedFileTypes: [...settings.project.allowedFileTypes, newType]
                          }
                        })
                      }
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    추가
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
