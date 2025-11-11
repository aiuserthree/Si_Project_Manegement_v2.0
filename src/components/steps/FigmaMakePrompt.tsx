import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Save, Copy, Sparkles, Download, RefreshCw, CheckCircle } from 'lucide-react'
import { Function } from './WBSGantt'

interface FigmaMakePromptProps {
  onSave?: () => void
  onNextStep?: () => void
}

// 기능정의서 데이터 (실제로는 전역 상태나 API에서 가져와야 함)
const mockFunctions: Function[] = [
  {
    id: '1',
    functionId: 'FN-001-001',
    name: '사용자 로그인',
    description: '이메일/비밀번호를 통한 사용자 인증 기능',
    priority: 'Critical',
    requiredRoles: ['기획자', '디자이너', '개발자'],
    tasks: [],
    division: 'FO',
    depth1: '인증',
    depth2: '로그인',
    depth3: '일반 로그인',
    page: '로그인',
    platform: 'Web',
    spec: '1차',
    note: ''
  },
  {
    id: '2',
    functionId: 'FN-002-001',
    name: '대시보드',
    description: '프로젝트 현황 및 통계 정보 표시',
    priority: 'High',
    requiredRoles: ['기획자', '디자이너', '퍼블리셔', '개발자'],
    tasks: [],
    division: 'FO',
    depth1: '대시보드',
    depth2: '메인',
    depth3: '통계',
    page: '대시보드',
    platform: 'Web',
    spec: '1차',
    note: ''
  }
]

export function FigmaMakePrompt({ onSave, onNextStep }: FigmaMakePromptProps) {
  const [functions, setFunctions] = useState<Function[]>(mockFunctions)
  const [selectedFunction, setSelectedFunction] = useState<string>('all')
  const [promptType, setPromptType] = useState<'screen' | 'component' | 'flow'>('screen')
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('')
  const [copied, setCopied] = useState(false)

  // 기능정의서 데이터 로드 (실제로는 전역 상태나 API에서 가져와야 함)
  useEffect(() => {
    // TODO: 실제 데이터 소스에서 가져오기
    // const savedFunctions = getFunctionsFromGlobalState()
    // setFunctions(savedFunctions)
  }, [])

  // 피그마 메이크 프롬프트 생성
  const generatePrompt = () => {
    const targetFunctions = selectedFunction === 'all' 
      ? functions 
      : functions.filter(f => f.id === selectedFunction)

    if (targetFunctions.length === 0) {
      setGeneratedPrompt('선택된 기능이 없습니다.')
      return
    }

    let prompt = ''

    if (promptType === 'screen') {
      // 화면 단위 프롬프트 생성
      prompt = `# Figma Make 프롬프트 - 화면 설계\n\n`
      prompt += `## 프로젝트 개요\n`
      prompt += `다음 기능정의서를 기반으로 Figma 화면을 설계해주세요.\n\n`
      
      targetFunctions.forEach((func, index) => {
        prompt += `### ${index + 1}. ${func.name} (${func.functionId})\n`
        prompt += `- **구분**: ${func.division || 'N/A'}\n`
        prompt += `- **메뉴 구조**: ${func.depth1 || ''} > ${func.depth2 || ''} > ${func.depth3 || ''}\n`
        prompt += `- **페이지**: ${func.page || 'N/A'}\n`
        prompt += `- **플랫폼**: ${func.platform || 'N/A'}\n`
        prompt += `- **설명**: ${func.description}\n`
        prompt += `- **우선순위**: ${func.priority}\n`
        prompt += `- **필요 역할**: ${func.requiredRoles.join(', ')}\n\n`
        
        if (func.tasks && func.tasks.length > 0) {
          prompt += `**작업 리스트**:\n`
          func.tasks.forEach((task, taskIdx) => {
            prompt += `  ${taskIdx + 1}. ${task.taskName} (${task.role})\n`
            if (task.estimatedDays) {
              prompt += `     - 예상 기간: ${task.estimatedDays}일\n`
            }
          })
          prompt += `\n`
        }
      })

      prompt += `## 디자인 요구사항\n`
      prompt += `1. 각 화면은 기능정의서의 요구사항을 정확히 반영해야 합니다.\n`
      prompt += `2. 사용자 경험(UX)을 고려한 직관적인 레이아웃을 구성하세요.\n`
      prompt += `3. 일관된 디자인 시스템을 적용하세요.\n`
      prompt += `4. 반응형 디자인을 고려하세요.\n`
      prompt += `5. 접근성(A11y) 가이드라인을 준수하세요.\n\n`

      prompt += `## 생성 요청\n`
      prompt += `위 기능정의서를 기반으로 Figma에서 다음을 생성해주세요:\n`
      prompt += `- 각 기능별 화면 와이어프레임\n`
      prompt += `- 주요 컴포넌트 설계\n`
      prompt += `- 사용자 플로우 다이어그램\n`
      prompt += `- 상호작용 스펙 정의\n`

    } else if (promptType === 'component') {
      // 컴포넌트 단위 프롬프트 생성
      prompt = `# Figma Make 프롬프트 - 컴포넌트 설계\n\n`
      prompt += `## 컴포넌트 설계 요청\n\n`
      
      targetFunctions.forEach((func, index) => {
        prompt += `### ${index + 1}. ${func.name} 관련 컴포넌트\n`
        prompt += `**기능 ID**: ${func.functionId}\n`
        prompt += `**설명**: ${func.description}\n\n`
        
        prompt += `**필요한 컴포넌트**:\n`
        if (func.requiredRoles.includes('디자이너')) {
          prompt += `- 입력 폼 컴포넌트\n`
          prompt += `- 버튼 컴포넌트\n`
          prompt += `- 카드/컨테이너 컴포넌트\n`
        }
        if (func.requiredRoles.includes('퍼블리셔')) {
          prompt += `- 레이아웃 컴포넌트\n`
          prompt += `- 네비게이션 컴포넌트\n`
        }
        prompt += `\n`
      })

      prompt += `## 컴포넌트 설계 가이드\n`
      prompt += `1. 재사용 가능한 컴포넌트로 설계하세요.\n`
      prompt += `2. 컴포넌트 변형(Variants)을 활용하세요.\n`
      prompt += `3. Auto Layout을 적극 활용하세요.\n`
      prompt += `4. 디자인 토큰(색상, 타이포그래피, 간격)을 정의하세요.\n`

    } else if (promptType === 'flow') {
      // 플로우 단위 프롬프트 생성
      prompt = `# Figma Make 프롬프트 - 사용자 플로우 설계\n\n`
      prompt += `## 사용자 플로우 설계 요청\n\n`
      
      targetFunctions.forEach((func, index) => {
        prompt += `### ${index + 1}. ${func.name} 플로우\n`
        prompt += `**기능**: ${func.name}\n`
        prompt += `**경로**: ${func.depth1 || ''} > ${func.depth2 || ''} > ${func.depth3 || ''}\n`
        prompt += `**설명**: ${func.description}\n\n`
        
        if (func.tasks && func.tasks.length > 0) {
          prompt += `**작업 단계**:\n`
          func.tasks.forEach((task, taskIdx) => {
            prompt += `  ${taskIdx + 1}. ${task.taskName} (${task.role})\n`
          })
          prompt += `\n`
        }
      })

      prompt += `## 플로우 설계 가이드\n`
      prompt += `1. 사용자의 목표를 달성하는 최적의 경로를 설계하세요.\n`
      prompt += `2. 각 화면 간 전환을 명확히 표시하세요.\n`
      prompt += `3. 예외 상황(에러, 빈 상태 등)을 고려하세요.\n`
      prompt += `4. 사용자 피드백(로딩, 성공/실패 메시지)을 포함하세요.\n`
    }

    setGeneratedPrompt(prompt)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([generatedPrompt], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `figma-make-prompt-${new Date().toISOString().split('T')[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">피그마 메이크 프롬프트 자동생성</h2>
          <p className="text-gray-600 mt-1">기능정의서 작업 리스트를 기반으로 피그마 메이크 프롬프트 생성</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={generatePrompt} className="bg-blue-600 hover:bg-blue-700">
            <Sparkles className="w-4 h-4 mr-2" />
            프롬프트 생성
          </Button>
        </div>
      </div>

      {/* 설정 카드 */}
      <Card>
        <CardHeader>
          <CardTitle>프롬프트 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="function-select">기능 선택</Label>
              <Select value={selectedFunction} onValueChange={setSelectedFunction}>
                <SelectTrigger id="function-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 기능</SelectItem>
                  {functions.map(func => (
                    <SelectItem key={func.id} value={func.id}>
                      {func.functionId} - {func.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="prompt-type">프롬프트 유형</Label>
              <Select value={promptType} onValueChange={(value: any) => setPromptType(value)}>
                <SelectTrigger id="prompt-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="screen">화면 설계</SelectItem>
                  <SelectItem value="component">컴포넌트 설계</SelectItem>
                  <SelectItem value="flow">사용자 플로우</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 선택된 기능 미리보기 */}
          {selectedFunction !== 'all' && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">선택된 기능</h3>
              {functions
                .filter(f => f.id === selectedFunction)
                .map(func => (
                  <div key={func.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{func.functionId}</Badge>
                      <span className="font-medium">{func.name}</span>
                      <Badge>{func.priority}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{func.description}</p>
                    <div className="flex gap-2 flex-wrap">
                      {func.requiredRoles.map(role => (
                        <Badge key={role} variant="secondary">{role}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 생성된 프롬프트 */}
      {generatedPrompt && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>생성된 프롬프트</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      복사됨
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      복사
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  다운로드
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={generatedPrompt}
              onChange={(e) => setGeneratedPrompt(e.target.value)}
              className="min-h-[500px] font-mono text-sm"
              placeholder="프롬프트가 여기에 표시됩니다..."
            />
          </CardContent>
        </Card>
      )}

      {/* 기능 목록 카드 */}
      <Card>
        <CardHeader>
          <CardTitle>기능정의서 목록</CardTitle>
          <p className="text-sm text-gray-600 mt-1">프롬프트 생성에 사용될 기능 목록</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {functions.map(func => (
              <div key={func.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{func.functionId}</Badge>
                      <span className="font-semibold">{func.name}</span>
                      <Badge>{func.priority}</Badge>
                      {func.division && (
                        <Badge variant="secondary">{func.division}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{func.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {func.depth1 && <span>{func.depth1}</span>}
                      {func.depth2 && <span>› {func.depth2}</span>}
                      {func.depth3 && <span>› {func.depth3}</span>}
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {func.requiredRoles.map(role => (
                        <Badge key={role} variant="secondary" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <Button
          onClick={() => {
            onSave?.()
            onNextStep?.()
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Save className="w-4 h-4 mr-2" />
          저장 및 다음 단계
        </Button>
      </div>
    </div>
  )
}

