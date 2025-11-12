import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Button } from '../ui/button'
import { Lightbulb, CheckCircle, Save } from 'lucide-react'

interface Question {
  id: string
  type: 'required' | 'optional' | 'recommended'
  category: string
  subCategory: string
  question: string
  inputType: 'text' | 'textarea' | 'select' | 'radio'
  options?: string[]
  aiSuggestion?: string
  answer?: string
}

const questions: Question[] = [
  // 기획 부문 질의사항
  {
    id: 'plan-1',
    type: 'required',
    category: '기획 부문 질의사항',
    subCategory: '프로젝트 개요 및 목표',
    question: '현재 홈페이지에서 가장 개선이 필요하다고 생각하시는 부분은 무엇인가요?',
    inputType: 'textarea',
    aiSuggestion: '사용자 경험 개선, 반응형 디자인, 로딩 속도 최적화 등'
  },
  {
    id: 'plan-2',
    type: 'required',
    category: '기획 부문 질의사항',
    subCategory: '프로젝트 개요 및 목표',
    question: '이번 리뉴얼을 통해 달성하고자 하는 주요 목표는 무엇인가요?',
    inputType: 'textarea',
    aiSuggestion: '브랜드 이미지 개선, 사용자 만족도 향상, 매출 증대 등'
  },
  {
    id: 'plan-3',
    type: 'required',
    category: '기획 부문 질의사항',
    subCategory: '프로젝트 개요 및 목표',
    question: '타겟 사용자층은 어떻게 되나요? (연령대, 성별, 국내/해외 비율 등)',
    inputType: 'textarea',
    aiSuggestion: '주요 고객층의 연령대, 성별, 지역 분포 등을 상세히 설명해 주세요'
  },
  {
    id: 'plan-4',
    type: 'required',
    category: '기획 부문 질의사항',
    subCategory: '프로젝트 개요 및 목표',
    question: '경쟁사 대비 (주)OOO만의 차별화 포인트는 무엇인가요?',
    inputType: 'textarea',
    aiSuggestion: '고유한 서비스, 특별한 경험, 독창적인 기능 등을 설명해 주세요'
  },
  {
    id: 'plan-5',
    type: 'required',
    category: '기획 부문 질의사항',
    subCategory: '콘텐츠 구성',
    question: '현재 사이트 구조 중 유지해야 할 메뉴와 개편이 필요한 메뉴를 구분해 주실 수 있나요?',
    inputType: 'textarea',
    aiSuggestion: '기존 메뉴 구조를 분석하여 유지/개편/신규 메뉴를 구분해 주세요'
  },
  {
    id: 'plan-6',
    type: 'optional',
    category: '기획 부문 질의사항',
    subCategory: '콘텐츠 구성',
    question: '콘텐츠 구성에 있어 멀티미디어 자료(사진/영상) 제공 여부를 알려 주세요.',
    inputType: 'radio',
    options: ['기존 자료 활용', '새로 촬영 필요', '편집 작업 필요', '추후 협의']
  },
  {
    id: 'plan-7',
    type: 'optional',
    category: '기획 부문 질의사항',
    subCategory: '콘텐츠 관리',
    question: '웹사이트 콘텐츠 업데이트 주기는 어떻게 되나요?',
    inputType: 'select',
    options: ['매일', '주 1-2회', '월 1-2회', '분기별', '필요시에만']
  },
  {
    id: 'plan-8',
    type: 'optional',
    category: '기획 부문 질의사항',
    subCategory: '마케팅 및 프로모션',
    question: '웹사이트를 통해 진행하고 싶은 마케팅 활동이 있으신가요?',
    inputType: 'textarea',
    aiSuggestion: '이벤트, 프로모션, 회원 관리, SNS 연동 등을 설명해 주세요'
  },
  
  // 디자인 부문 질의사항
  {
    id: 'design-1',
    type: 'required',
    category: '디자인 부문 질의사항',
    subCategory: '디자인 컨셉 및 방향성',
    question: '리뉴얼된 웹사이트에서 추구하는 디자인 컨셉은 무엇인가요?',
    inputType: 'textarea',
    aiSuggestion: '모던, 미니멀, 럭셔리, 친근함, 전문성 등 키워드로 설명해 주세요'
  },
  {
    id: 'design-2',
    type: 'required',
    category: '디자인 부문 질의사항',
    subCategory: '디자인 컨셉 및 방향성',
    question: '(주)OOO의 브랜드 이미지를 표현할 수 있는 핵심 키워드 3가지는 무엇인가요?',
    inputType: 'textarea',
    aiSuggestion: '브랜드의 핵심 가치와 이미지를 나타내는 키워드 3개를 제시해 주세요'
  },
  {
    id: 'design-3',
    type: 'optional',
    category: '디자인 부문 질의사항',
    subCategory: '디자인 컨셉 및 방향성',
    question: '현재 브랜드 가이드라인이 있다면 공유해 주실 수 있나요? (로고, 컬러, 폰트 등)',
    inputType: 'radio',
    options: ['있음 (제공 가능)', '있음 (제공 불가)', '없음', '신규 제작 필요']
  },
  {
    id: 'design-4',
    type: 'optional',
    category: '디자인 부문 질의사항',
    subCategory: '반응형 디자인',
    question: '주요 사용자들이 이용하는 디바이스 비율은 어떻게 되나요? (PC vs 모바일 vs 태블릿)',
    inputType: 'select',
    options: ['PC 70% 이상', '모바일 70% 이상', '태블릿 30% 이상', '균등 분포', '확인 필요']
  },
  
  // 퍼블리싱 부문 질의사항
  {
    id: 'publish-1',
    type: 'required',
    category: '퍼블리싱 부문 질의사항',
    subCategory: '기술 방향',
    question: '리뉴얼 사이트의 UI/UX 변화는 레퍼런스 사이트의 인터렉션 컨셉 정도로 생각하면 될까요?',
    inputType: 'radio',
    options: ['네, 그 정도면 충분합니다', '더 많은 인터렉션이 필요합니다', '최소한의 인터렉션만 원합니다', '추후 협의']
  },
  {
    id: 'publish-2',
    type: 'optional',
    category: '퍼블리싱 부문 질의사항',
    subCategory: '기술 방향',
    question: '특별히 적용하고 싶은 인터렉션이 있다면 알려주세요.',
    inputType: 'textarea',
    aiSuggestion: '애니메이션, 호버 효과, 스크롤 효과, 모달, 슬라이더 등을 설명해 주세요'
  },
  {
    id: 'publish-3',
    type: 'optional',
    category: '퍼블리싱 부문 질의사항',
    subCategory: '개발환경',
    question: '서버 사양 및 운영체계에 대해 알려주세요.',
    inputType: 'textarea',
    aiSuggestion: '서버 OS, 웹서버, 데이터베이스, 예상 트래픽 등을 설명해 주세요'
  },
  
  // 개발 및 기술 부문 질의사항
  {
    id: 'dev-1',
    type: 'required',
    category: '개발 및 기술 부문 질의사항',
    subCategory: '기술 요구사항',
    question: '웹사이트 개발 시 필요한 기술 스택은 무엇인가요?',
    inputType: 'radio',
    options: ['정적 웹사이트 (HTML/CSS/JS)', '동적 웹사이트 (Backend 포함)', 'CMS 기반 (WordPress 등)', 'SPA (React/Vue/Angular)']
  },
  {
    id: 'dev-2',
    type: 'optional',
    category: '개발 및 기술 부문 질의사항',
    subCategory: '기술 요구사항',
    question: '기존 시스템과 연동이 필요한가요?',
    inputType: 'radio',
    options: ['예', '아니오', '확인 필요']
  },
  {
    id: 'dev-3',
    type: 'optional',
    category: '개발 및 기술 부문 질의사항',
    subCategory: '기술 요구사항',
    question: '다국어 지원이 필요한가요?',
    inputType: 'radio',
    options: ['한국어만', '영어 포함', '3개국어 이상', '확인 필요']
  },
  {
    id: 'dev-4',
    type: 'optional',
    category: '개발 및 기술 부문 질의사항',
    subCategory: '관리자 기능',
    question: '관리자 페이지가 필요한가요?',
    inputType: 'radio',
    options: ['필요', '불필요', '확인 필요']
  },
  {
    id: 'dev-5',
    type: 'optional',
    category: '개발 및 기술 부문 질의사항',
    subCategory: '보안 및 성능',
    question: 'SSL 인증서가 필요한가요?',
    inputType: 'radio',
    options: ['필요', '불필요', '확인 필요']
  },
  {
    id: 'dev-6',
    type: 'optional',
    category: '개발 및 기술 부문 질의사항',
    subCategory: '보안 및 성능',
    question: '웹사이트 로딩 속도에 대한 요구사항이 있나요?',
    inputType: 'select',
    options: ['3초 이내', '5초 이내', '10초 이내', '특별한 요구사항 없음', '확인 필요']
  },
  
  // 프로젝트 운영 및 관리
  {
    id: 'manage-1',
    type: 'optional',
    category: '프로젝트 운영 및 관리',
    subCategory: '프로젝트 관리',
    question: '프로젝트 진행 시 선호하는 커뮤니케이션 방식은 무엇인가요?',
    inputType: 'radio',
    options: ['이메일', '전화', '화상회의', '메신저', '대면 미팅']
  },
  {
    id: 'manage-2',
    type: 'optional',
    category: '프로젝트 운영 및 관리',
    subCategory: '프로젝트 관리',
    question: '주요 의사결정권자와 실무 담당자를 구분해 주실 수 있나요?',
    inputType: 'textarea',
    aiSuggestion: '의사결정권자와 실무 담당자의 역할과 연락처를 명시해 주세요'
  },
  {
    id: 'manage-3',
    type: 'optional',
    category: '프로젝트 운영 및 관리',
    subCategory: '프로젝트 관리',
    question: '테스트 및 피드백 제공 가능한 인원은 몇 명인가요?',
    inputType: 'select',
    options: ['1명', '2-3명', '4-5명', '6명 이상', '확인 필요']
  }
]

interface QuestionnaireProps {
  onSave?: () => void
  onNextStep?: () => void
}

export function Questionnaire({ onSave, onNextStep }: QuestionnaireProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState('기획 부문 질의사항')

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const getQuestionsByType = (type: string) => {
    return questions.filter(q => q.type === type)
  }

  const getQuestionsByCategory = () => {
    const categories = [...new Set(questions.map(q => q.category))]
    return categories.map(category => ({
      category,
      questions: questions.filter(q => q.category === category)
    }))
  }

  const getCompletionStats = (type: string) => {
    const typeQuestions = getQuestionsByType(type)
    const answeredCount = typeQuestions.filter(q => answers[q.id]).length
    return {
      answered: answeredCount,
      total: typeQuestions.length,
      percentage: typeQuestions.length > 0 ? Math.round((answeredCount / typeQuestions.length) * 100) : 0
    }
  }

  const getBorderColor = (type: Question['type']) => {
    switch (type) {
      case 'required': return 'border-l-red-500'
      case 'optional': return 'border-l-blue-500'
      case 'recommended': return 'border-l-green-500'
      default: return 'border-l-gray-300'
    }
  }

  const handleSaveClick = () => {
    // 저장 로직 실행
    onSave?.()
    // 다음 단계로 이동
    onNextStep?.()
  }

  const renderInput = (question: Question) => {
    const value = answers[question.id] || ''

    switch (question.inputType) {
      case 'text':
        return (
          <Input
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="답변을 입력하세요"
            className="mt-3"
          />
        )
      
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="상세한 답변을 입력하세요"
            className="mt-3 h-32 resize-none"
          />
        )
      
      case 'select':
        return (
          <Select value={value} onValueChange={(val) => handleAnswerChange(question.id, val)}>
            <SelectTrigger className="mt-3">
              <SelectValue placeholder="옵션을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      
      case 'radio':
        return (
          <RadioGroup 
            value={value} 
            onValueChange={(val) => handleAnswerChange(question.id, val)}
            className="mt-3"
          >
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )
      
      default:
        return null
    }
  }

  const requiredStats = getCompletionStats('required')
  const optionalStats = getCompletionStats('optional')
  const recommendedStats = getCompletionStats('recommended')
  
  const getCategoryStats = (category: string) => {
    const categoryQuestions = questions.filter(q => q.category === category)
    const answeredCount = categoryQuestions.filter(q => answers[q.id]).length
    return {
      answered: answeredCount,
      total: categoryQuestions.length,
      percentage: categoryQuestions.length > 0 ? Math.round((answeredCount / categoryQuestions.length) * 100) : 0
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">프로젝트 질의서</h2>
          <p className="text-gray-600 mt-1">프로젝트의 요구사항을 파악하기 위한 질문에 답변해 주세요</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-end space-x-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const suggestions = [
                      '프로젝트의 주요 사용자 그룹은 누구인가요?',
                      '시스템의 예상 사용자 수는 얼마나 되나요?',
                      '데이터 보안 요구사항이 있나요?',
                      '모바일 지원이 필요한가요?',
                      '다국어 지원이 필요한가요?'
                    ]
                    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
                    alert(`AI 제안: ${randomSuggestion}`)
                  }}
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  AI 제안
                </Button>
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>자동 저장됨</span>
                </div>
              </div>
            </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="overflow-x-auto mb-6">
                <TabsList className="inline-flex w-auto min-w-full h-auto p-1">
                  {getQuestionsByCategory().map((categoryGroup) => {
                    const stats = getCategoryStats(categoryGroup.category)
                    const categoryName = categoryGroup.category.replace(' 질의사항', '')
                    return (
                      <TabsTrigger 
                        key={categoryGroup.category} 
                        value={categoryGroup.category} 
                        className="relative px-3 py-2 h-auto min-w-[120px] flex-shrink-0"
                      >
                        <div className="flex flex-col items-center space-y-1">
                          <span className="text-xs font-medium whitespace-nowrap">{categoryName}</span>
                          <Badge 
                            variant={stats.percentage === 100 ? 'default' : stats.percentage > 0 ? 'secondary' : 'outline'}
                            className="text-xs px-1 py-0"
                          >
                            {stats.answered}/{stats.total}
                          </Badge>
                        </div>
                      </TabsTrigger>
                    )
                  })}
                </TabsList>
              </div>

              {getQuestionsByCategory().map((categoryGroup) => (
                <TabsContent key={categoryGroup.category} value={categoryGroup.category} className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {categoryGroup.category}
                    </h3>
                    <p className="text-sm text-gray-600">
                      총 {categoryGroup.questions.length}개 질문
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {categoryGroup.questions.map((question, questionIndex) => (
                      <Card key={question.id} className={`border-l-4 ${getBorderColor(question.type)}`}>
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <Badge 
                                    variant={question.type === 'required' ? 'destructive' : question.type === 'optional' ? 'secondary' : 'outline'}
                                    className="text-xs"
                                  >
                                    {question.type === 'required' ? '필수' : question.type === 'optional' ? '선택' : '권장'}
                                  </Badge>
                                  <span className="text-sm text-gray-500">
                                    {question.subCategory}
                                  </span>
                                </div>
                                <h4 className="font-medium text-gray-900 mb-3">
                                  {question.question}
                                </h4>
                                
                                {question.aiSuggestion && (
                                  <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-start space-x-2">
                                    <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <p className="text-xs font-medium text-blue-800 mb-1">AI 제안</p>
                                      <p className="text-sm text-blue-700">{question.aiSuggestion}</p>
                                    </div>
                                  </div>
                                )}
                                
                                {renderInput(question)}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>진행 상황</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeDasharray={`${((requiredStats.answered + optionalStats.answered + recommendedStats.answered) / (requiredStats.total + optionalStats.total + recommendedStats.total)) * 100}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-900">
                    {Math.round(((requiredStats.answered + optionalStats.answered + recommendedStats.answered) / (requiredStats.total + optionalStats.total + recommendedStats.total)) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">필수</span>
                  <span className="text-sm text-gray-600">
                    {requiredStats.answered}/{requiredStats.total} 완료
                  </span>
                </div>
                <Progress value={requiredStats.percentage} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">선택</span>
                  <span className="text-sm text-gray-600">
                    {optionalStats.answered}/{optionalStats.total} 완료
                  </span>
                </div>
                <Progress value={optionalStats.percentage} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">권장</span>
                  <span className="text-sm text-gray-600">
                    {recommendedStats.answered}/{recommendedStats.total} 완료
                  </span>
                </div>
                <Progress value={recommendedStats.percentage} className="h-2" />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">카테고리별 진행률</h4>
              <div className="space-y-3">
                {getQuestionsByCategory().map((categoryGroup) => {
                  const stats = getCategoryStats(categoryGroup.category)
                  const isActive = activeTab === categoryGroup.category
                  return (
                    <div 
                      key={categoryGroup.category}
                      className={`p-2 rounded-lg cursor-pointer transition-colors ${
                        isActive ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveTab(categoryGroup.category)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-medium ${
                          isActive ? 'text-blue-700' : 'text-gray-700'
                        }`}>
                          {categoryGroup.category.replace(' 질의사항', '')}
                        </span>
                        <span className={`text-xs ${
                          isActive ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {stats.answered}/{stats.total}
                        </span>
                      </div>
                      <Progress 
                        value={stats.percentage} 
                        className={`h-1.5 ${
                          isActive ? '[&>div]:bg-blue-500' : ''
                        }`} 
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <Button 
            onClick={handleSaveClick}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            저장 및 다음 단계
          </Button>
        </div>
      </div>
      </div>

    </div>
  )
}