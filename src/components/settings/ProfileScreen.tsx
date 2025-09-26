import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { 
  User, 
  Save,
  Eye,
  EyeOff
} from 'lucide-react'

export function ProfileScreen() {
  const [showPassword, setShowPassword] = useState(false)
  const [profile, setProfile] = useState({
    name: '김프로젝트',
    email: 'pm@company.com',
    role: 'Project Manager',
    department: 'IT개발팀',
    phone: '010-1234-5678'
  })

  const handleSave = () => {
    // 프로필 저장 로직
    console.log('프로필이 저장되었습니다:', profile)
    alert('프로필이 저장되었습니다.')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">프로필 설정</h1>
          <p className="text-gray-600 mt-1">
            개인 정보를 관리하고 프로필을 업데이트할 수 있습니다
          </p>
        </div>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          저장
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 프로필 미리보기 */}
        <Card>
          <CardHeader>
            <CardTitle>프로필 미리보기</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">{profile.name}</h3>
              <p className="text-sm text-gray-600">{profile.role}</p>
              <p className="text-sm text-gray-500">{profile.department}</p>
            </div>
            
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">이메일</span>
                <span className="text-gray-900">{profile.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">전화번호</span>
                <span className="text-gray-900">{profile.phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 개인 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>개인 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({
                  ...profile,
                  name: e.target.value
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({
                  ...profile,
                  email: e.target.value
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">역할</Label>
              <Input
                id="role"
                value={profile.role}
                onChange={(e) => setProfile({
                  ...profile,
                  role: e.target.value
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">부서</Label>
              <Input
                id="department"
                value={profile.department}
                onChange={(e) => setProfile({
                  ...profile,
                  department: e.target.value
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">전화번호</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({
                  ...profile,
                  phone: e.target.value
                })}
              />
            </div>
          </CardContent>
        </Card>

        {/* 비밀번호 변경 */}
        <Card>
          <CardHeader>
            <CardTitle>비밀번호 변경</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
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
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">새 비밀번호</Label>
              <Input
                id="new-password"
                type="password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">비밀번호 확인</Label>
              <Input
                id="confirm-password"
                type="password"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
