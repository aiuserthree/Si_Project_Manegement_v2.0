import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Checkbox } from '../ui/checkbox'
import { Alert, AlertDescription } from '../ui/alert'
import { Loader2, Eye, EyeOff, Shield, Zap } from 'lucide-react'

interface LoginScreenProps {
  onLoginSuccess: (user: any) => void
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  const validateForm = () => {
    // 개발용: 최소한의 검증만 수행
    if (!formData.email && !formData.password) {
      setError('이메일과 비밀번호를 입력해주세요.')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setError('')

    try {
      // 실제 로그인 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 로그인 성공 시뮬레이션
      const user = {
        id: 'user-001',
        email: formData.email,
        name: '김프로젝트',
        role: 'project-manager',
        avatar: '/avatars/default.png'
      }

      // JWT 토큰 시뮬레이션
      const token = 'mock-jwt-token-' + Date.now()
      const refreshToken = 'mock-refresh-token-' + Date.now()

      // 토큰 저장
      localStorage.setItem('accessToken', token)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('user', JSON.stringify(user))

      onLoginSuccess(user)
    } catch (err) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            SI Project Manager
          </h1>
          <p className="text-gray-600">
            AI 기반 SI 프로젝트 워크플로우 자동화 플랫폼
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center">로그인</CardTitle>
            <CardDescription className="text-center">
              계정에 로그인하여 프로젝트를 시작하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력하세요"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    disabled={isLoading}
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleInputChange('rememberMe', checked as boolean)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    로그인 상태 유지
                  </Label>
                </div>
                <Button variant="link" className="p-0 h-auto text-sm text-blue-600">
                  비밀번호 찾기
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    로그인 중...
                  </>
                ) : (
                  '로그인'
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11 mt-2"
                onClick={() => {
                  setFormData({
                    email: 'test@example.com',
                    password: 'test123',
                    rememberMe: false
                  })
                }}
                disabled={isLoading}
              >
                테스트 계정 입력
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                계정이 없으신가요?{' '}
                <Button variant="link" className="p-0 h-auto text-sm text-blue-600">
                  회원가입
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <Zap className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">AI 자동 분석</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">보안 관리</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
