import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Checkbox } from '../ui/checkbox'
import { Alert, AlertDescription } from '../ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Loader2, Eye, EyeOff, Shield, Users, ArrowLeft, FileText, X } from 'lucide-react'

interface SignUpScreenProps {
  onSignUpSuccess?: (user: any) => void
  onNavigateToLogin?: () => void
}

export function SignUpScreen({ onSignUpSuccess, onNavigateToLogin }: SignUpScreenProps) {
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
  const [showTermsDialog, setShowTermsDialog] = useState(false)
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false)

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
                        setShowTermsDialog(true)
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
                        setShowPrivacyDialog(true)
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

      {/* 이용약관 모달 팝업 */}
      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent className="!max-w-[500px] !w-[85vw] !h-[60vh] !max-h-[60vh] !flex !flex-col !overflow-hidden !p-0 !gap-0 !fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !z-[99999]" style={{ width: '85vw', maxWidth: '500px', height: '60vh', maxHeight: '60vh' }}>
          <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0 border-b">
            <DialogTitle>이용약관</DialogTitle>
            <DialogDescription>
              최종 수정일: 2025년 1월 19일
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4" style={{ maxHeight: 'calc(60vh - 180px)' }}>
            <div className="prose max-w-none space-y-6 text-sm">
            {/* 제1조 목적 */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">제1조 (목적)</h2>
              <p className="text-gray-700 leading-relaxed">
                본 약관은 SI Project Manager(이하 "회사")가 제공하는 AI 기반 SI 프로젝트 워크플로우 자동화 플랫폼(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            {/* 제2조 정의 */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">제2조 (정의)</h2>
              <div className="space-y-3 text-gray-700">
                <p>본 약관에서 사용하는 용어의 정의는 다음과 같습니다:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>"서비스"란 회사가 제공하는 AI 기반 프로젝트 관리 및 워크플로우 자동화 플랫폼을 의미합니다.</li>
                  <li>"이용자"란 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 의미합니다.</li>
                  <li>"회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며, 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 의미합니다.</li>
                  <li>"아이디(ID)"란 회원의 식별과 서비스 이용을 위하여 회원이 정하고 회사가 승인하는 문자와 숫자의 조합을 의미합니다.</li>
                  <li>"비밀번호"란 회원이 부여받은 아이디와 일치된 회원임을 확인하고 회원의 권익 보호를 위하여 회원이 정한 문자와 숫자의 조합을 의미합니다.</li>
                  <li>"콘텐츠"란 서비스를 통해 제공되는 모든 정보, 텍스트, 그래픽, 링크 등을 의미합니다.</li>
                </ol>
              </div>
            </section>

            {/* 제3조 약관의 게시와 개정 */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">제3조 (약관의 게시와 개정)</h2>
              <div className="space-y-3 text-gray-700">
                <p>① 회사는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.</p>
                <p>② 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.</p>
                <p>③ 회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 서비스 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.</p>
                <p>④ 회원은 개정된 약관에 동의하지 않을 경우 회원 탈퇴를 요청할 수 있으며, 개정된 약관의 적용일자 이후에도 서비스를 계속 이용할 경우 약관의 변경사항에 동의한 것으로 간주됩니다.</p>
              </div>
            </section>

            {/* 제4조 서비스의 제공 및 변경 */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">제4조 (서비스의 제공 및 변경)</h2>
              <div className="space-y-3 text-gray-700">
                <p>① 회사는 다음과 같은 서비스를 제공합니다:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>프로젝트 문서 업로드 및 분석 서비스</li>
                  <li>AI 기반 요구사항 분석 및 질의서 생성</li>
                  <li>메뉴 구조 설계 및 기능 정의서 자동 생성</li>
                  <li>인력 관리 및 프로젝트 일정 관리(WBS)</li>
                  <li>피그마 메이크 프롬프트 자동 생성</li>
                  <li>개발 문서 편집 및 개발 가이드 생성</li>
                </ul>
                <p>② 회사는 서비스의 내용을 변경할 수 있으며, 변경 시에는 사전에 공지합니다.</p>
                <p>③ 회사는 운영상, 기술상의 필요에 따라 제공하는 전부 또는 일부의 서비스를 변경할 수 있습니다.</p>
              </div>
            </section>

            {/* 제5조 서비스의 중단 */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">제5조 (서비스의 중단)</h2>
              <div className="space-y-3 text-gray-700">
                <p>① 회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.</p>
                <p>② 회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여 배상합니다. 단, 회사가 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.</p>
                <p>③ 사업종목의 전환, 사업의 포기, 업체 간의 통합 등의 이유로 서비스를 제공할 수 없게 되는 경우에는 회사는 제8조에 정한 방법으로 이용자에게 통지하고 당초 회사에서 제시한 조건에 따라 소비자에게 보상합니다.</p>
              </div>
            </section>

            {/* 제6조 회원가입 */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">제6조 (회원가입)</h2>
              <div className="space-y-3 text-gray-700">
                <p>① 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.</p>
                <p>② 회사는 제1항과 같이 회원가입을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>가입신청자가 본 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                  <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
                  <li>기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</li>
                </ul>
                <p>③ 회원가입계약의 성립 시기는 회사의 승낙이 회원에게 도달한 시점으로 합니다.</p>
              </div>
            </section>

            {/* 제7조 회원정보의 변경 */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">제7조 (회원정보의 변경)</h2>
              <div className="space-y-3 text-gray-700">
                <p>① 회원은 개인정보관리화면을 통하여 언제든지 본인의 개인정보를 열람하고 수정할 수 있습니다. 다만, 서비스 관리를 위해 필요한 실명, 아이디 등은 수정이 불가능합니다.</p>
                <p>② 회원은 회원가입신청 시 기재한 사항이 변경되었을 경우 온라인으로 수정을 하거나 전자우편 기타 방법으로 회사에 대하여 그 변경사항을 알려야 합니다.</p>
                <p>③ 제2항의 변경사항을 회사에 알리지 않아 발생한 불이익에 대하여 회사는 책임을 지지 않습니다.</p>
              </div>
            </section>

            {/* 제8조 개인정보보호 */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">제8조 (개인정보보호)</h2>
              <div className="space-y-3 text-gray-700">
                <p>① 회사는 이용자의 개인정보 수집 시 서비스 제공을 위하여 필요한 범위에서 최소한의 개인정보를 수집합니다.</p>
                <p>② 회사는 회원가입 시 구매계약이행에 필요한 정보를 미리 수집하지 않습니다.</p>
                <p>③ 회사는 이용자의 개인정보를 수집·이용하는 때에는 당해 이용자에게 그 목적을 고지하고 동의를 받습니다.</p>
                <p>④ 회사는 수집된 개인정보를 목적 외의 용도로 이용할 수 없으며, 새로운 이용목적이 발생한 경우 또는 제3자에게 제공하는 경우에는 이용·제공 단계에서 당해 이용자에게 그 목적을 고지하고 동의를 받습니다.</p>
                <p>⑤ 회사는 개인정보 보호를 위하여 이용자의 개인정보를 처리하는 자를 최소한으로 제한하여야 하며, 개인정보의 분실·도난·유출·위조·변조 등으로 인한 이용자의 손해에 대하여 모든 책임을 집니다.</p>
              </div>
            </section>

            {/* 제9조 회원의 의무 */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">제9조 (회원의 의무)</h2>
              <div className="space-y-3 text-gray-700">
                <p>① 회원은 다음 행위를 하여서는 안 됩니다:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>신청 또는 변경 시 허위내용의 등록</li>
                  <li>타인의 정보 도용</li>
                  <li>회사가 게시한 정보의 변경</li>
                  <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                  <li>회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                  <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                  <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 공개 또는 게시하는 행위</li>
                </ul>
              </div>
            </section>

            {/* 제10조 저작권의 귀속 및 이용제한 */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">제10조 (저작권의 귀속 및 이용제한)</h2>
              <div className="space-y-3 text-gray-700">
                <p>① 회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다.</p>
                <p>② 이용자는 회사를 이용함으로써 얻은 정보 중 회사에 지적재산권이 귀속된 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.</p>
                <p>③ 회사는 약정에 따라 이용자에게 귀속된 저작권을 사용하는 경우 당해 이용자에게 통보하여야 합니다.</p>
              </div>
            </section>

            {/* 제11조 분쟁의 해결 */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">제11조 (분쟁의 해결)</h2>
              <div className="space-y-3 text-gray-700">
                <p>① 회사와 이용자는 서비스와 관련하여 발생한 분쟁을 원만하게 해결하기 위하여 필요한 모든 노력을 하여야 합니다.</p>
                <p>② 제1항의 규정에도 불구하고 분쟁으로 인하여 소송이 제기될 경우 소송은 회사의 본사 소재지를 관할하는 법원의 관할로 합니다.</p>
              </div>
            </section>

            {/* 부칙 */}
            <section className="pt-6 border-t">
              <p className="text-sm text-gray-600">
                본 약관은 2025년 1월 19일부터 시행됩니다.
              </p>
            </section>
            </div>
          </div>
          <DialogFooter className="px-6 pb-6 pt-4 flex-shrink-0 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowTermsDialog(false)
                handleInputChange('agreeToTerms', false)
              }}
            >
              동의안함
            </Button>
            <Button 
              onClick={() => {
                setShowTermsDialog(false)
                handleInputChange('agreeToTerms', true)
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              동의함
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 개인정보처리방침 모달 팝업 */}
      <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
        <DialogContent className="!max-w-[500px] !w-[85vw] !h-[60vh] !max-h-[60vh] !flex !flex-col !overflow-hidden !p-0 !gap-0 !fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !z-[99999]" style={{ width: '85vw', maxWidth: '500px', height: '60vh', maxHeight: '60vh' }}>
          <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0 border-b">
            <DialogTitle>개인정보처리방침</DialogTitle>
            <DialogDescription>
              최종 수정일: 2025년 1월 19일
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4" style={{ maxHeight: 'calc(60vh - 180px)' }}>
            <div className="prose max-w-none space-y-6 text-sm">
            {/* 제1조 개인정보의 처리목적 */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">제1조 (개인정보의 처리목적)</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                SI Project Manager(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
              </p>
              <div className="space-y-3 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">1. 홈페이지 회원 가입 및 관리</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지 목적</li>
                    <li>각종 고지·통지, 고충처리 등을 목적</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">2. 재화 또는 서비스 제공</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>서비스 제공, 콘텐츠 제공, 맞춤 서비스 제공, 본인인증 등을 목적</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">3. 마케팅 및 광고에의 활용</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>신규 서비스(제품) 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및 참여기회 제공 등을 목적</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 제2조 개인정보의 처리 및 보유기간 */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">제2조 (개인정보의 처리 및 보유기간)</h2>
              <div className="space-y-3 text-gray-700">
                <p>① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
                <p>② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>홈페이지 회원 가입 및 관리:</strong> 회원 탈퇴 시까지 (다만, 관계 법령 위반에 따른 수사·조사 등이 진행중인 경우에는 해당 수사·조사 종료 시까지)</li>
                  <li><strong>재화 또는 서비스 제공:</strong> 재화·서비스 공급완료 및 요금결제·정산 완료 시까지</li>
                  <li><strong>마케팅 및 광고에의 활용:</strong> 회원 탈퇴 시까지 또는 동의 철회 시까지</li>
                </ul>
              </div>
            </section>

            {/* 제3조 처리하는 개인정보의 항목 */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">제3조 (처리하는 개인정보의 항목)</h2>
              <div className="space-y-3 text-gray-700">
                <p>회사는 다음의 개인정보 항목을 처리하고 있습니다:</p>
                <div>
                  <h3 className="font-semibold mb-2">1. 홈페이지 회원 가입 및 관리</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>필수항목: 이메일, 비밀번호, 이름</li>
                    <li>선택항목: 전화번호, 소속 회사명</li>
                    <li>자동 수집 항목: IP주소, 쿠키, MAC주소, 서비스 이용 기록, 접속 로그, 기기정보</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">2. 재화 또는 서비스 제공</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>필수항목: 이메일, 이름, 서비스 이용 기록</li>
                    <li>선택항목: 결제정보(신용카드번호, 계좌정보 등)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 제4조 개인정보의 제3자 제공 */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">제4조 (개인정보의 제3자 제공)</h2>
              <div className="space-y-3 text-gray-700">
                <p>① 회사는 정보주체의 개인정보를 제1조(개인정보의 처리목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</p>
                <p>② 회사는 원칙적으로 정보주체의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>정보주체가 사전에 동의한 경우</li>
                  <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                </ul>
              </div>
            </section>

            {/* 제5조 개인정보처리의 위탁 */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">제5조 (개인정보처리의 위탁)</h2>
              <div className="space-y-3 text-gray-700">
                <p>① 회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">위탁받는 자</th>
                        <th className="text-left p-2">위탁업무 내용</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">클라우드 서비스 제공업체</td>
                        <td className="p-2">서버 운영 및 데이터 저장</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">이메일 발송 서비스 제공업체</td>
                        <td className="p-2">이메일 발송 및 관리</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>② 회사는 위탁계약 체결 시 개인정보 보호법 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.</p>
                <p>③ 위탁업무의 내용이나 수탁자가 변경될 경우에는 지체 없이 본 개인정보처리방침을 통하여 공개하겠습니다.</p>
              </div>
            </section>

            {/* 제6조 정보주체의 권리·의무 및 그 행사방법 */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">제6조 (정보주체의 권리·의무 및 그 행사방법)</h2>
              <div className="space-y-3 text-gray-700">
                <p>① 정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>개인정보 처리정지 요구권</li>
                  <li>개인정보 열람요구권</li>
                  <li>개인정보 정정·삭제요구권</li>
                  <li>개인정보 처리정지 요구권</li>
                </ul>
                <p>② 제1항에 따른 권리 행사는 회사에 대해 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.</p>
                <p>③ 정보주체가 개인정보의 오류에 대한 정정을 요청한 경우에는 정정을 완료하기 전까지 당해 개인정보를 이용하거나 제공하지 않습니다.</p>
                <p>④ 제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다.</p>
              </div>
            </section>

            {/* 제7조 개인정보의 파기 */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">제7조 (개인정보의 파기)</h2>
              <div className="space-y-3 text-gray-700">
                <p>① 회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.</p>
                <p>② 개인정보 파기의 절차 및 방법은 다음과 같습니다:</p>
                <div>
                  <h3 className="font-semibold mb-2">1. 파기절차</h3>
                  <p className="ml-4">회사는 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">2. 파기방법</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>전자적 파일 형태: 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제</li>
                    <li>기록물, 인쇄물, 서면 등: 분쇄하거나 소각하여 파기</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 제8조 개인정보 보호책임자 */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">제8조 (개인정보 보호책임자)</h2>
              <div className="space-y-3 text-gray-700">
                <p>① 회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div>
                      <strong>▶ 개인정보 보호책임자</strong>
                      <ul className="list-none space-y-1 ml-4 mt-1">
                        <li>• 성명: [담당자명]</li>
                        <li>• 직책: [직책]</li>
                        <li>• 연락처: [이메일], [전화번호]</li>
                      </ul>
                    </div>
                    <div>
                      <strong>▶ 개인정보 보호 담당부서</strong>
                      <ul className="list-none space-y-1 ml-4 mt-1">
                        <li>• 부서명: [부서명]</li>
                        <li>• 담당자: [담당자명]</li>
                        <li>• 연락처: [이메일], [전화번호]</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <p>② 정보주체께서는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다.</p>
              </div>
            </section>

            {/* 제9조 개인정보의 안전성 확보조치 */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">제9조 (개인정보의 안전성 확보조치)</h2>
              <div className="space-y-3 text-gray-700">
                <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>관리적 조치:</strong> 내부관리계획 수립·시행, 정기적 직원 교육 등</li>
                  <li><strong>기술적 조치:</strong> 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치</li>
                  <li><strong>물리적 조치:</strong> 전산실, 자료보관실 등의 접근통제</li>
                </ul>
              </div>
            </section>

            {/* 제10조 개인정보처리방침 변경 */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">제10조 (개인정보처리방침 변경)</h2>
              <div className="space-y-3 text-gray-700">
                <p>이 개인정보처리방침은 2025년 1월 19일부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p>
              </div>
            </section>

            {/* 부칙 */}
            <section className="pt-6 border-t">
              <p className="text-sm text-gray-600">
                본 개인정보처리방침은 2025년 1월 19일부터 시행됩니다.
              </p>
            </section>
            </div>
          </div>
          <DialogFooter className="px-6 pb-6 pt-4 flex-shrink-0 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowPrivacyDialog(false)
                handleInputChange('agreeToPrivacy', false)
              }}
            >
              동의안함
            </Button>
            <Button 
              onClick={() => {
                setShowPrivacyDialog(false)
                handleInputChange('agreeToPrivacy', true)
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              동의함
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

