import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Checkbox } from '../ui/checkbox'
import { Alert, AlertDescription } from '../ui/alert'
import { Loader2, Eye, EyeOff, Shield, Users, ArrowLeft } from 'lucide-react'

interface SignUpScreenProps {
  onSignUpSuccess?: (user: any) => void
  onNavigateToLogin?: () => void
  onNavigateToTerms?: () => void
  onNavigateToPrivacy?: () => void
}

export function SignUpScreen({ onSignUpSuccess, onNavigateToLogin, onNavigateToTerms, onNavigateToPrivacy }: SignUpScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    agreeToPrivacy: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('이름을 입력해주세요.')
      return false
    }

    if (!formData.email.trim()) {
      setError('이메일을 입력해주세요.')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('올바른 이메일 형식을 입력해주세요.')
      return false
    }

    if (!formData.password) {
      setError('비밀번호를 입력해주세요.')
      return false
    }

    if (formData.password.length < 8) {
      setError('비밀번호는 최소 8자 이상이어야 합니다.')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return false
    }

    if (!formData.agreeToTerms || !formData.agreeToPrivacy) {
      setError('이용약관 및 개인정보처리방침에 동의해주세요.')
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
      // 실제 회원가입 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 회원가입 성공 시뮬레이션
      const user = {
        id: 'user-new-' + Date.now(),
        email: formData.email,
        name: formData.name,
        role: 'user',
        avatar: '/avatars/default.png'
      }

      // JWT 토큰 시뮬레이션
      const token = 'mock-jwt-token-' + Date.now()
      const refreshToken = 'mock-refresh-token-' + Date.now()

      // 토큰 저장
      localStorage.setItem('accessToken', token)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('user', JSON.stringify(user))

      setSuccess(true)
      
      // 성공 후 자동 로그인 처리
      setTimeout(() => {
        onSignUpSuccess?.(user)
      }, 1000)
    } catch (err) {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMicrosoftTeamsSignUp = async () => {
    setIsLoading(true)
    setError('')

    try {
      // Microsoft Teams OAuth 회원가입 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Microsoft Teams 회원가입 성공 시뮬레이션
      const user = {
        id: 'user-teams-new-' + Date.now(),
        email: 'user@teams.microsoft.com',
        name: 'Teams 사용자',
        role: 'user',
        avatar: '/avatars/teams.png',
        loginMethod: 'microsoft-teams'
      }

      // JWT 토큰 시뮬레이션
      const token = 'mock-jwt-token-teams-' + Date.now()
      const refreshToken = 'mock-refresh-token-teams-' + Date.now()

      // 토큰 저장
      localStorage.setItem('accessToken', token)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('user', JSON.stringify(user))

      setSuccess(true)
      
      setTimeout(() => {
        onSignUpSuccess?.(user)
      }, 1000)
    } catch (err) {
      setError('Microsoft Teams 회원가입에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">회원가입 완료!</h2>
              <p className="text-gray-600 mb-6">
                회원가입이 완료되었습니다. 잠시 후 자동으로 로그인됩니다.
              </p>
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
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

        {/* Sign Up Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">회원가입</CardTitle>
                <CardDescription className="mt-1">
                  새 계정을 만들어 프로젝트를 시작하세요
                </CardDescription>
              </div>
              {onNavigateToLogin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNavigateToLogin}
                  className="text-gray-600"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  로그인
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

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
                    placeholder="최소 8자 이상"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 다시 입력하세요"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    disabled={isLoading}
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                    disabled={isLoading}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed">
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm text-blue-600"
                      onClick={(e) => {
                        e.preventDefault()
                        if (onNavigateToTerms) {
                          onNavigateToTerms()
                        }
                      }}
                      disabled={isLoading}
                    >
                      이용약관
                    </Button>
                    에 동의합니다 (필수)
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="privacy"
                    checked={formData.agreeToPrivacy}
                    onCheckedChange={(checked) => handleInputChange('agreeToPrivacy', checked as boolean)}
                    disabled={isLoading}
                    className="mt-1"
                  />
                  <Label htmlFor="privacy" className="text-sm leading-relaxed">
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm text-blue-600"
                      onClick={(e) => {
                        e.preventDefault()
                        if (onNavigateToPrivacy) {
                          onNavigateToPrivacy()
                        }
                      }}
                      disabled={isLoading}
                    >
                      개인정보처리방침
                    </Button>
                    에 동의합니다 (필수)
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    가입 중...
                  </>
                ) : (
                  '회원가입'
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">또는</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11"
                onClick={handleMicrosoftTeamsSignUp}
                disabled={isLoading}
              >
                <Users className="mr-2 h-4 w-4" />
                Microsoft Teams로 가입
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                이미 계정이 있으신가요?{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-sm text-blue-600"
                  onClick={() => {
                    if (onNavigateToLogin) {
                      onNavigateToLogin()
                    }
                  }}
                  disabled={isLoading}
                >
                  로그인
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

