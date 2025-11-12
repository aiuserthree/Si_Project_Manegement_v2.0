import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Alert, AlertDescription } from '../ui/alert'
import { Loader2, Shield, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react'

interface ForgotPasswordScreenProps {
  onNavigateToLogin?: () => void
}

export function ForgotPasswordScreen({ onNavigateToLogin }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('이메일을 입력해주세요.')
      return
    }

    if (!validateEmail(email)) {
      setError('올바른 이메일 형식을 입력해주세요.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // 실제 비밀번호 재설정 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 성공 시뮬레이션
      setSuccess(true)
    } catch (err) {
      setError('비밀번호 재설정 요청에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
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

          {/* Success Card */}
          <Card className="shadow-xl border-0">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">이메일을 확인해주세요</h2>
                <p className="text-gray-600 mb-6">
                  <strong>{email}</strong>로 비밀번호 재설정 링크를 보냈습니다.
                  <br />
                  이메일을 확인하고 링크를 클릭하여 비밀번호를 재설정해주세요.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={onNavigateToLogin}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                  >
                    로그인으로 돌아가기
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSuccess(false)
                      setEmail('')
                    }}
                    className="w-full h-11"
                  >
                    다른 이메일로 시도
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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

        {/* Forgot Password Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <div>
              <CardTitle className="text-2xl">비밀번호 찾기</CardTitle>
              <CardDescription className="mt-1">
                등록된 이메일로 비밀번호 재설정 링크를 보내드립니다
              </CardDescription>
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
                <Label htmlFor="email">이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError('')
                    }}
                    disabled={isLoading}
                    className="h-11 pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  가입 시 사용한 이메일 주소를 입력해주세요
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    전송 중...
                  </>
                ) : (
                  '비밀번호 재설정 링크 보내기'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                이메일을 받지 못하셨나요?{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-sm text-blue-600"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  다시 보내기
                </Button>
              </p>
            </div>

            <div className="mt-4 pt-4 border-t">
              <Button
                variant="ghost"
                className="w-full text-sm text-gray-600"
                onClick={onNavigateToLogin}
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                로그인으로 돌아가기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

