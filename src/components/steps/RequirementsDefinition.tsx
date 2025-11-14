import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Checkbox } from '../ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Upload, Download, Plus, Search, Filter, Edit, Trash2, MoreHorizontal, Save, Sparkles } from 'lucide-react'
import { FileAnalysisResult } from '../../services/aiService'

interface Requirement {
  id: string
  reqId: string
  serviceType: string
  name: string
  description: string
  priority: 'High' | 'Medium' | 'Low'
  status: string
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert'
  estimatedHours: number
  aiAnalyzed: boolean
}

const mockRequirements: Requirement[] = [
  {
    id: '1',
    reqId: 'REQ-001',
    serviceType: 'F/O',
    name: '사용자 로그인 기능',
    description: '사용자가 이메일과 비밀번호로 로그인할 수 있는 기능',
    priority: 'High',
    status: '진행중',
    difficulty: 'Medium',
    estimatedHours: 16,
    aiAnalyzed: true
  },
  {
    id: '2',
    reqId: 'REQ-002',
    serviceType: 'B/O',
    name: '상품 관리 기능',
    description: '관리자가 상품을 등록, 수정, 삭제할 수 있는 기능',
    priority: 'High',
    status: '완료',
    difficulty: 'Medium',
    estimatedHours: 24,
    aiAnalyzed: true
  },
  {
    id: '3',
    reqId: 'REQ-003',
    serviceType: 'API/RFC',
    name: '결제 API 연동',
    description: '외부 결제 시스템과 연동하여 결제 처리',
    priority: 'Medium',
    status: '대기',
    difficulty: 'Hard',
    estimatedHours: 32,
    aiAnalyzed: true
  },
  {
    id: '4',
    reqId: 'REQ-004',
    serviceType: 'AI',
    name: '상품 추천 알고리즘',
    description: '사용자 구매 이력 기반 상품 추천',
    priority: 'Low',
    status: '검토중',
    difficulty: 'Expert',
    estimatedHours: 48,
    aiAnalyzed: true
  }
]

const serviceTypeOptions = ['전체', 'F/O', 'B/O', 'API/RFC', 'AI', '기타']
const priorityOptions = ['All', 'High', 'Medium', 'Low']
const difficultyOptions = ['Easy', 'Medium', 'Hard', 'Expert']

// AI 분석 함수들
const analyzeDifficulty = (req: Partial<Requirement>): 'Easy' | 'Medium' | 'Hard' | 'Expert' => {
  const name = req.name?.toLowerCase() || ''
  const description = req.description?.toLowerCase() || ''
  const serviceType = req.serviceType || ''
  
  // 키워드 기반 난이도 분석
  const expertKeywords = ['ai', '알고리즘', '머신러닝', '딥러닝', '추천', '분석', '예측', '자동화', '복잡한', '고급']
  const hardKeywords = ['api', '연동', '통합', '보안', '인증', '암호화', '결제', '실시간', '동시성', '성능']
  const mediumKeywords = ['로그인', '회원가입', '관리', '등록', '수정', '삭제', '조회', '검색', '필터']
  const easyKeywords = ['표시', '보기', '목록', '리스트', '단순', '기본', '정적']
  
  const text = `${name} ${description}`.toLowerCase()
  
  // Expert 레벨 체크
  if (expertKeywords.some(keyword => text.includes(keyword)) || serviceType === 'AI') {
    return 'Expert'
  }
  
  // Hard 레벨 체크
  if (hardKeywords.some(keyword => text.includes(keyword)) || serviceType === 'API/RFC') {
    return 'Hard'
  }
  
  // Medium 레벨 체크
  if (mediumKeywords.some(keyword => text.includes(keyword)) || serviceType === 'B/O') {
    return 'Medium'
  }
  
  // Easy 레벨 (기본값)
  return 'Easy'
}

const analyzeEstimatedHours = (req: Partial<Requirement>): number => {
  const difficulty = analyzeDifficulty(req)
  const name = req.name?.toLowerCase() || ''
  const description = req.description?.toLowerCase() || ''
  const serviceType = req.serviceType || ''
  
  // 기본 시간 (난이도별)
  const baseHours = {
    'Easy': 4,
    'Medium': 16,
    'Hard': 32,
    'Expert': 64
  }
  
  let hours = baseHours[difficulty]
  
  // 서비스 타입별 조정
  if (serviceType === 'F/O') hours *= 0.8  // 프론트엔드는 상대적으로 빠름
  if (serviceType === 'B/O') hours *= 1.2  // 백오피스는 복잡함
  if (serviceType === 'API/RFC') hours *= 1.5  // API 연동은 시간이 많이 걸림
  if (serviceType === 'AI') hours *= 2.0  // AI 기능은 가장 복잡함
  
  // 키워드별 추가 시간
  const text = `${name} ${description}`.toLowerCase()
  
  if (text.includes('실시간') || text.includes('동시성')) hours *= 1.3
  if (text.includes('보안') || text.includes('암호화')) hours *= 1.2
  if (text.includes('통합') || text.includes('연동')) hours *= 1.4
  if (text.includes('복잡한') || text.includes('고급')) hours *= 1.3
  
  // 최소/최대 시간 제한
  return Math.max(2, Math.min(120, Math.round(hours)))
}

interface RequirementsDefinitionProps {
  onSave?: () => void
  onNextStep?: () => void
}

export function RequirementsDefinition({ onSave, onNextStep }: RequirementsDefinitionProps) {
  const [requirements, setRequirements] = useState<Requirement[]>([])
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [serviceFilter, setServiceFilter] = useState('전체')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Requirement>>({})
  const [hasAnalysisData, setHasAnalysisData] = useState(false)

  const getServiceTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'F/O': return 'bg-blue-100 text-blue-800'
      case 'B/O': return 'bg-purple-100 text-purple-800'
      case 'API/RFC': return 'bg-green-100 text-green-800'
      case 'AI': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyBadgeColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-blue-100 text-blue-800'
      case 'Hard': return 'bg-orange-100 text-orange-800'
      case 'Expert': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getHoursBadgeColor = (hours: number) => {
    if (hours <= 8) return 'bg-green-100 text-green-800'
    if (hours <= 24) return 'bg-blue-100 text-blue-800'
    if (hours <= 48) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }

  const filteredRequirements = requirements.filter(req => {
    const matchesSearch = req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.reqId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesService = serviceFilter === '전체' || req.serviceType === serviceFilter
    const matchesPriority = priorityFilter === 'All' || req.priority === priorityFilter
    
    return matchesSearch && matchesService && matchesPriority
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(filteredRequirements.map(req => req.id))
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id])
    } else {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id))
    }
  }

  const addNewRow = () => {
    const newReq: Requirement = {
      id: Date.now().toString(),
      reqId: `REQ-${String(requirements.length + 1).padStart(3, '0')}`,
      serviceType: 'F/O',
      name: '새 요구사항',
      description: '요구사항 설명을 입력하세요',
      priority: 'Medium',
      status: '작성중',
      difficulty: 'Medium',
      estimatedHours: 16,
      aiAnalyzed: false
    }
    setRequirements([...requirements, newReq])
  }

  const analyzeRequirement = (req: Requirement) => {
    const difficulty = analyzeDifficulty(req)
    const estimatedHours = analyzeEstimatedHours(req)
    
    setRequirements(prev => prev.map(r => 
      r.id === req.id 
        ? { ...r, difficulty, estimatedHours, aiAnalyzed: true }
        : r
    ))
  }

  const analyzeAllRequirements = () => {
    setRequirements(prev => prev.map(req => {
      const difficulty = analyzeDifficulty(req)
      const estimatedHours = analyzeEstimatedHours(req)
      return { ...req, difficulty, estimatedHours, aiAnalyzed: true }
    }))
  }

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Excel 파일 읽기 시뮬레이션
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        // 실제로는 xlsx 라이브러리를 사용해야 함
        console.log('Excel 파일 업로드:', file.name)
        alert('Excel 파일이 업로드되었습니다. (시뮬레이션)')
      } catch (error) {
        console.error('Excel 파일 읽기 오류:', error)
        alert('Excel 파일 읽기에 실패했습니다.')
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleExcelDownload = () => {
    // Excel 다운로드 시뮬레이션
    const csvContent = [
      ['번호', '요구사항 ID', '서비스 구분', '요구사항명', '상세설명', '우선순위', '상태'],
      ...requirements.map((req, index) => [
        index + 1,
        req.reqId,
        req.serviceType,
        req.name,
        req.description,
        req.priority,
        req.status
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'requirements.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleBulkEdit = () => {
    if (selectedRows.length === 0) {
      alert('편집할 항목을 선택해주세요.')
      return
    }
    // 일괄 편집 모달 또는 기능 구현
    alert(`${selectedRows.length}개 항목을 일괄 편집합니다.`)
  }

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      alert('삭제할 항목을 선택해주세요.')
      return
    }
    if (confirm(`${selectedRows.length}개 항목을 삭제하시겠습니까?`)) {
      setRequirements(prev => prev.filter(req => !selectedRows.includes(req.id)))
      setSelectedRows([])
    }
  }

  const handleEdit = (req: Requirement) => {
    setEditingId(req.id)
    setEditForm({
      reqId: req.reqId,
      serviceType: req.serviceType,
      name: req.name,
      description: req.description,
      priority: req.priority,
      status: req.status,
      difficulty: req.difficulty,
      estimatedHours: req.estimatedHours
    })
  }

  const handleSaveEdit = () => {
    if (!editingId || !editForm.name || !editForm.description) {
      alert('필수 항목을 모두 입력해주세요.')
      return
    }

    setRequirements(prev => prev.map(req => 
      req.id === editingId 
        ? { ...req, ...editForm }
        : req
    ))
    setEditingId(null)
    setEditForm({})
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`"${name}" 요구사항을 삭제하시겠습니까?`)) {
      setRequirements(prev => prev.filter(req => req.id !== id))
      setSelectedRows(prev => prev.filter(rowId => rowId !== id))
    }
  }

  // 분석 결과를 Requirement 형식으로 변환
  const convertAnalysisToRequirements = (analysisResults: FileAnalysisResult[]): Requirement[] => {
    const newRequirements: Requirement[] = []
    
    // 기존 요구사항의 최대 번호 찾기
    const existingMaxNum = requirements.length > 0 
      ? Math.max(...requirements.map(r => {
          const match = r.reqId.match(/REQ-(\d+)/)
          return match ? parseInt(match[1]) : 0
        }))
      : 0
    
    let reqCounter = existingMaxNum + 1

    analysisResults.forEach((analysis, fileIndex) => {
      // 기능 요구사항 처리
      if (analysis.requirementsSummary?.functionalRequirements) {
        analysis.requirementsSummary.functionalRequirements.forEach((reqText) => {
          const serviceType = determineServiceType(reqText, 'F/O')
          const name = extractRequirementName(reqText)
          const req: Requirement = {
            id: `req-${Date.now()}-${reqCounter}`,
            reqId: `REQ-${String(reqCounter).padStart(3, '0')}`,
            serviceType: serviceType,
            name: name,
            description: generateStandardDescription(serviceType, name, reqText),
            priority: determinePriority(reqText),
            status: '작성중',
            difficulty: analyzeDifficulty({ name: name, description: reqText, serviceType: serviceType }),
            estimatedHours: analyzeEstimatedHours({ name: name, description: reqText, serviceType: serviceType }),
            aiAnalyzed: true
          }
          newRequirements.push(req)
          reqCounter++
        })
      }

      // 비기능 요구사항 처리
      if (analysis.requirementsSummary?.nonFunctionalRequirements) {
        analysis.requirementsSummary.nonFunctionalRequirements.forEach((reqText) => {
          const name = extractRequirementName(reqText)
          const req: Requirement = {
            id: `req-${Date.now()}-${reqCounter}`,
            reqId: `REQ-${String(reqCounter).padStart(3, '0')}`,
            serviceType: 'B/O',
            name: name,
            description: generateStandardDescription('B/O', name, reqText),
            priority: determinePriority(reqText),
            status: '작성중',
            difficulty: analyzeDifficulty({ name: name, description: reqText, serviceType: 'B/O' }),
            estimatedHours: analyzeEstimatedHours({ name: name, description: reqText, serviceType: 'B/O' }),
            aiAnalyzed: true
          }
          newRequirements.push(req)
          reqCounter++
        })
      }

      // 시스템 요구사항 처리
      if (analysis.requirementsSummary?.systemRequirements) {
        analysis.requirementsSummary.systemRequirements.forEach((reqText) => {
          const name = extractRequirementName(reqText)
          const req: Requirement = {
            id: `req-${Date.now()}-${reqCounter}`,
            reqId: `REQ-${String(reqCounter).padStart(3, '0')}`,
            serviceType: 'B/O',
            name: name,
            description: generateStandardDescription('B/O', name, reqText),
            priority: determinePriority(reqText),
            status: '작성중',
            difficulty: analyzeDifficulty({ name: name, description: reqText, serviceType: 'B/O' }),
            estimatedHours: analyzeEstimatedHours({ name: name, description: reqText, serviceType: 'B/O' }),
            aiAnalyzed: true
          }
          newRequirements.push(req)
          reqCounter++
        })
      }

      // 비즈니스 요구사항 처리
      if (analysis.requirementsSummary?.businessRequirements) {
        analysis.requirementsSummary.businessRequirements.forEach((reqText) => {
          const name = extractRequirementName(reqText)
          const req: Requirement = {
            id: `req-${Date.now()}-${reqCounter}`,
            reqId: `REQ-${String(reqCounter).padStart(3, '0')}`,
            serviceType: 'B/O',
            name: name,
            description: generateStandardDescription('B/O', name, reqText),
            priority: determinePriority(reqText),
            status: '작성중',
            difficulty: analyzeDifficulty({ name: name, description: reqText, serviceType: 'B/O' }),
            estimatedHours: analyzeEstimatedHours({ name: name, description: reqText, serviceType: 'B/O' }),
            aiAnalyzed: true
          }
          newRequirements.push(req)
          reqCounter++
        })
      }

      // 기술적 요구사항 처리
      if (analysis.technicalRequirements) {
        analysis.technicalRequirements.forEach((reqText) => {
          const serviceType = determineServiceType(reqText, 'API/RFC')
          const name = extractRequirementName(reqText)
          const req: Requirement = {
            id: `req-${Date.now()}-${reqCounter}`,
            reqId: `REQ-${String(reqCounter).padStart(3, '0')}`,
            serviceType: serviceType,
            name: name,
            description: generateStandardDescription(serviceType, name, reqText),
            priority: determinePriority(reqText),
            status: '작성중',
            difficulty: analyzeDifficulty({ name: name, description: reqText, serviceType: serviceType }),
            estimatedHours: analyzeEstimatedHours({ name: name, description: reqText, serviceType: serviceType }),
            aiAnalyzed: true
          }
          newRequirements.push(req)
          reqCounter++
        })
      }

      // 사용자 스토리 처리
      if (analysis.userStories) {
        analysis.userStories.forEach((storyText) => {
          const name = extractRequirementName(storyText)
          const req: Requirement = {
            id: `req-${Date.now()}-${reqCounter}`,
            reqId: `REQ-${String(reqCounter).padStart(3, '0')}`,
            serviceType: 'F/O',
            name: name,
            description: generateStandardDescription('F/O', name, storyText),
            priority: determinePriority(storyText),
            status: '작성중',
            difficulty: analyzeDifficulty({ name: name, description: storyText, serviceType: 'F/O' }),
            estimatedHours: analyzeEstimatedHours({ name: name, description: storyText, serviceType: 'F/O' }),
            aiAnalyzed: true
          }
          newRequirements.push(req)
          reqCounter++
        })
      }
    })

    return newRequirements
  }

  // 요구사항 텍스트에서 이름 추출
  const extractRequirementName = (text: string): string => {
    // 첫 30자 또는 첫 문장을 이름으로 사용
    const firstSentence = text.split(/[\.\n]/)[0].trim()
    if (firstSentence.length <= 30) {
      return firstSentence
    }
    return firstSentence.substring(0, 30) + '...'
  }

  // 서비스 타입과 요구사항명을 기반으로 표준 상세설명 생성
  const generateStandardDescription = (serviceType: string, requirementName: string, originalText?: string): string => {
    const name = requirementName.trim()
    const lowerName = name.toLowerCase()
    
    // 서비스 타입별 기본 설명 템플릿
    let baseTemplate = ''
    let actionVerb = '수행'
    
    // 요구사항명에서 동사 추출 및 액션 동사 결정
    if (lowerName.includes('로그인') || lowerName.includes('인증')) {
      actionVerb = '로그인'
    } else if (lowerName.includes('등록') || lowerName.includes('생성') || lowerName.includes('추가')) {
      actionVerb = '등록'
    } else if (lowerName.includes('수정') || lowerName.includes('변경') || lowerName.includes('업데이트')) {
      actionVerb = '수정'
    } else if (lowerName.includes('삭제') || lowerName.includes('제거')) {
      actionVerb = '삭제'
    } else if (lowerName.includes('조회') || lowerName.includes('검색') || lowerName.includes('목록')) {
      actionVerb = '조회'
    } else if (lowerName.includes('다운로드') || lowerName.includes('내보내기')) {
      actionVerb = '다운로드'
    } else if (lowerName.includes('업로드') || lowerName.includes('가져오기')) {
      actionVerb = '업로드'
    } else if (lowerName.includes('연동') || lowerName.includes('통합')) {
      actionVerb = '연동'
    } else if (lowerName.includes('결제') || lowerName.includes('주문')) {
      actionVerb = '처리'
    } else if (lowerName.includes('알림') || lowerName.includes('알림')) {
      actionVerb = '발송'
    } else if (lowerName.includes('보고서') || lowerName.includes('리포트')) {
      actionVerb = '생성'
    } else if (lowerName.includes('권한') || lowerName.includes('접근')) {
      actionVerb = '관리'
    } else if (lowerName.includes('설정') || lowerName.includes('환경')) {
      actionVerb = '설정'
    } else if (lowerName.includes('모니터링') || lowerName.includes('감시')) {
      actionVerb = '모니터링'
    } else if (lowerName.includes('백업') || lowerName.includes('복구')) {
      actionVerb = '수행'
    } else if (lowerName.includes('알림') || lowerName.includes('공지')) {
      actionVerb = '발송'
    }
    
    // 서비스 타입별 설명 템플릿
    switch (serviceType) {
      case 'F/O':
        if (lowerName.includes('로그인') || lowerName.includes('인증')) {
          baseTemplate = `사용자가 이메일과 비밀번호를 입력하여 시스템에 ${actionVerb}할 수 있는 프론트엔드 기능입니다.`
        } else if (lowerName.includes('회원가입') || lowerName.includes('가입')) {
          baseTemplate = `신규 사용자가 회원 정보를 입력하여 시스템에 가입할 수 있는 프론트엔드 기능입니다.`
        } else if (lowerName.includes('검색') || lowerName.includes('조회')) {
          baseTemplate = `사용자가 검색 조건을 입력하여 원하는 정보를 ${actionVerb}할 수 있는 프론트엔드 기능입니다.`
        } else if (lowerName.includes('목록') || lowerName.includes('리스트')) {
          baseTemplate = `데이터를 목록 형태로 표시하고 사용자가 ${actionVerb}할 수 있는 프론트엔드 기능입니다.`
        } else if (lowerName.includes('상세') || lowerName.includes('정보')) {
          baseTemplate = `선택한 항목의 상세 정보를 표시하는 프론트엔드 기능입니다.`
        } else if (lowerName.includes('다운로드') || lowerName.includes('내보내기')) {
          baseTemplate = `사용자가 데이터를 파일 형태로 ${actionVerb}할 수 있는 프론트엔드 기능입니다.`
        } else if (lowerName.includes('업로드') || lowerName.includes('파일')) {
          baseTemplate = `사용자가 파일을 선택하여 시스템에 ${actionVerb}할 수 있는 프론트엔드 기능입니다.`
        } else {
          baseTemplate = `사용자가 ${name}을(를) ${actionVerb}할 수 있는 프론트엔드 기능입니다.`
        }
        break
        
      case 'B/O':
        if (lowerName.includes('관리') || lowerName.includes('관리자')) {
          baseTemplate = `관리자가 ${name.replace(/관리|관리자/g, '').trim()}을(를) 등록, 수정, 삭제, 조회할 수 있는 백오피스 기능입니다.`
        } else if (lowerName.includes('등록') || lowerName.includes('생성')) {
          baseTemplate = `관리자가 ${name.replace(/등록|생성/g, '').trim()} 정보를 ${actionVerb}할 수 있는 백오피스 기능입니다.`
        } else if (lowerName.includes('수정') || lowerName.includes('변경')) {
          baseTemplate = `관리자가 ${name.replace(/수정|변경/g, '').trim()} 정보를 ${actionVerb}할 수 있는 백오피스 기능입니다.`
        } else if (lowerName.includes('삭제')) {
          baseTemplate = `관리자가 ${name.replace(/삭제/g, '').trim()}을(를) ${actionVerb}할 수 있는 백오피스 기능입니다.`
        } else if (lowerName.includes('조회') || lowerName.includes('검색')) {
          baseTemplate = `관리자가 ${name.replace(/조회|검색/g, '').trim()}을(를) ${actionVerb}할 수 있는 백오피스 기능입니다.`
        } else if (lowerName.includes('권한') || lowerName.includes('접근')) {
          baseTemplate = `시스템의 사용자 권한 및 접근 제어를 ${actionVerb}하는 백오피스 기능입니다.`
        } else if (lowerName.includes('설정') || lowerName.includes('환경')) {
          baseTemplate = `시스템의 ${name}을(를) ${actionVerb}하는 백오피스 기능입니다.`
        } else if (lowerName.includes('보고서') || lowerName.includes('리포트')) {
          baseTemplate = `${name}을(를) ${actionVerb}하여 관리자가 확인할 수 있는 백오피스 기능입니다.`
        } else if (lowerName.includes('모니터링') || lowerName.includes('감시')) {
          baseTemplate = `시스템의 상태 및 성능을 ${actionVerb}하는 백오피스 기능입니다.`
        } else {
          baseTemplate = `관리자가 ${name}을(를) ${actionVerb}할 수 있는 백오피스 기능입니다.`
        }
        break
        
      case 'API/RFC':
        if (lowerName.includes('연동') || lowerName.includes('통합')) {
          baseTemplate = `외부 시스템과의 API 연동을 통해 ${name.replace(/연동|통합/g, '').trim()}을(를) ${actionVerb}하는 기능입니다.`
        } else if (lowerName.includes('결제')) {
          baseTemplate = `외부 결제 시스템과의 API 연동을 통해 결제를 ${actionVerb}하는 기능입니다.`
        } else if (lowerName.includes('인증') || lowerName.includes('로그인')) {
          baseTemplate = `외부 인증 시스템과의 API 연동을 통해 사용자 인증을 ${actionVerb}하는 기능입니다.`
        } else if (lowerName.includes('데이터') || lowerName.includes('정보')) {
          baseTemplate = `외부 시스템으로부터 데이터를 수신하거나 전송하는 API 연동 기능입니다.`
        } else {
          baseTemplate = `${name}을(를) ${actionVerb}하는 API 연동 기능입니다.`
        }
        break
        
      case 'AI':
        if (lowerName.includes('추천')) {
          baseTemplate = `사용자 데이터를 분석하여 ${name.replace(/추천/g, '').trim()}을(를) 추천하는 AI 기반 기능입니다.`
        } else if (lowerName.includes('분석')) {
          baseTemplate = `데이터를 분석하여 인사이트를 제공하는 AI 기반 기능입니다.`
        } else if (lowerName.includes('예측')) {
          baseTemplate = `과거 데이터를 기반으로 미래를 ${actionVerb}하는 AI 기반 기능입니다.`
        } else if (lowerName.includes('자동화')) {
          baseTemplate = `AI를 활용하여 ${name.replace(/자동화/g, '').trim()}을(를) 자동으로 ${actionVerb}하는 기능입니다.`
        } else {
          baseTemplate = `${name}을(를) ${actionVerb}하는 AI 기반 기능입니다.`
        }
        break
        
      default:
        baseTemplate = `${name}을(를) ${actionVerb}하는 기능입니다.`
    }
    
    // 원본 텍스트가 있고 더 구체적인 정보가 있으면 일부 반영
    if (originalText && originalText.length > 50) {
      const firstSentence = originalText.split(/[\.\n]/)[0].trim()
      if (firstSentence.length > 20 && firstSentence.length < 100) {
        // 원본의 첫 문장을 참고하여 설명 보강
        return `${baseTemplate} ${firstSentence}`
      }
    }
    
    return baseTemplate
  }

  // 서비스 타입 결정
  const determineServiceType = (text: string, defaultType: string): string => {
    const lowerText = text.toLowerCase()
    
    if (lowerText.includes('api') || lowerText.includes('연동') || lowerText.includes('rfc')) {
      return 'API/RFC'
    }
    if (lowerText.includes('ai') || lowerText.includes('알고리즘') || lowerText.includes('머신러닝') || lowerText.includes('추천')) {
      return 'AI'
    }
    if (lowerText.includes('프론트') || lowerText.includes('화면') || lowerText.includes('ui') || lowerText.includes('사용자 인터페이스')) {
      return 'F/O'
    }
    
    return defaultType
  }

  // 우선순위 결정
  const determinePriority = (text: string): 'High' | 'Medium' | 'Low' => {
    const lowerText = text.toLowerCase()
    
    if (lowerText.includes('필수') || lowerText.includes('중요') || lowerText.includes('반드시') || lowerText.includes('보안') || lowerText.includes('인증')) {
      return 'High'
    }
    if (lowerText.includes('선택') || lowerText.includes('옵션') || lowerText.includes('추가')) {
      return 'Low'
    }
    
    return 'Medium'
  }

  // localStorage에서 분석 결과 로드
  const loadAnalysisResults = (): FileAnalysisResult[] => {
    try {
      const stored = localStorage.getItem('fileAnalysisResults')
      if (stored) {
        const data = JSON.parse(stored)
        return data.files?.map((f: any) => f.analysis).filter((a: any) => a) || []
      }
    } catch (error) {
      console.error('분석 결과 로드 오류:', error)
    }
    return []
  }

  // 분석 결과 기반 자동 생성
  const generateRequirementsFromAnalysis = () => {
    const analysisResults = loadAnalysisResults()
    
    if (analysisResults.length === 0) {
      alert('분석된 파일이 없습니다. 먼저 파일 업로드 페이지에서 파일을 분석해주세요.')
      return
    }

    const newRequirements = convertAnalysisToRequirements(analysisResults)
    
    if (newRequirements.length === 0) {
      alert('분석 결과에서 요구사항을 추출할 수 없습니다.')
      return
    }

    // 파일 분석 결과로 완전히 교체 (기존 요구사항 무시)
    setRequirements(newRequirements)
    
    // localStorage에 저장 (파일 분석에서 생성된 것임을 표시)
    const dataToSave = {
      requirements: newRequirements,
      savedAt: new Date().toISOString(),
      fromFileAnalysis: true
    }
    localStorage.setItem('requirementsData', JSON.stringify(dataToSave))

    alert(`${newRequirements.length}개의 요구사항이 파일 분석 결과에서 생성되었습니다.`)
  }

  // localStorage에서 요구사항 복원 및 파일 분석 결과 자동 업데이트
  useEffect(() => {
    // 1. 파일 분석 결과 확인 (우선순위 1)
    const analysisResults = loadAnalysisResults()
    setHasAnalysisData(analysisResults.length > 0)
    
    // 2. 파일 업로드에서 "저장 및 다음단계" 클릭 시 자동 반영
    try {
      const stored = localStorage.getItem('fileAnalysisResults')
      if (stored) {
        const data = JSON.parse(stored)
        
        // 파일 분석 결과가 있고 shouldAutoUpdate 플래그가 있으면 파일 분석 결과만 사용
        if (data.shouldAutoUpdate && analysisResults.length > 0) {
          // 자동 업데이트 플래그 제거
          data.shouldAutoUpdate = false
          localStorage.setItem('fileAnalysisResults', JSON.stringify(data))
          
          // 파일 분석 결과에서 요구사항 생성 (기존 요구사항 무시)
          const newRequirements = convertAnalysisToRequirements(analysisResults)
          
          if (newRequirements.length > 0) {
            // 파일 분석 결과만 사용
            setRequirements(newRequirements)
            
            // localStorage에 저장 (기존 요구사항 덮어쓰기)
            const dataToSave = {
              requirements: newRequirements,
              savedAt: new Date().toISOString(),
              fromFileAnalysis: true // 파일 분석에서 생성된 것임을 표시
            }
            localStorage.setItem('requirementsData', JSON.stringify(dataToSave))
            
            console.log(`✅ ${newRequirements.length}개의 요구사항이 파일 분석 결과에서 자동으로 생성되었습니다.`)
          }
          return // 파일 분석 결과를 사용했으므로 여기서 종료
        }
        
        // 파일 분석 결과가 있지만 shouldAutoUpdate 플래그가 없는 경우
        // (이전에 이미 업데이트된 경우) - 파일 분석 결과 기반 요구사항 사용
        if (analysisResults.length > 0) {
          const newRequirements = convertAnalysisToRequirements(analysisResults)
          if (newRequirements.length > 0) {
            // 기존 localStorage의 요구사항 확인
            try {
              const reqStored = localStorage.getItem('requirementsData')
              if (reqStored) {
                const reqData = JSON.parse(reqStored)
                // 파일 분석에서 생성된 요구사항이면 그대로 사용
                if (reqData.fromFileAnalysis && reqData.requirements) {
                  setRequirements(reqData.requirements)
                  return
                }
              }
            } catch (error) {
              // 무시하고 계속 진행
            }
            
            // 파일 분석 결과 사용
            setRequirements(newRequirements)
            return
          }
        }
      }
    } catch (error) {
      console.error('파일 분석 결과 처리 오류:', error)
    }

    // 3. 파일 분석 결과가 없을 때만 기존 요구사항 복원 (우선순위 2)
    try {
      const stored = localStorage.getItem('requirementsData')
      if (stored) {
        const data = JSON.parse(stored)
        // 파일 분석에서 생성된 요구사항이 아닌 경우에만 복원
        if (data.requirements && data.requirements.length > 0 && !data.fromFileAnalysis) {
          setRequirements(data.requirements)
        }
      }
    } catch (error) {
      console.error('요구사항 복원 오류:', error)
    }
  }, [])

  // requirements 상태 변경 시 localStorage에 저장
  useEffect(() => {
    if (requirements.length > 0) {
      // 기존 데이터에서 fromFileAnalysis 플래그 확인
      let fromFileAnalysis = false
      try {
        const stored = localStorage.getItem('requirementsData')
        if (stored) {
          const data = JSON.parse(stored)
          fromFileAnalysis = data.fromFileAnalysis || false
        }
      } catch (error) {
        // 무시
      }
      
      const dataToSave = {
        requirements,
        savedAt: new Date().toISOString(),
        fromFileAnalysis: fromFileAnalysis,
        shouldAutoUpdateMenu: true // 메뉴 구조 자동 업데이트 플래그
      }
      localStorage.setItem('requirementsData', JSON.stringify(dataToSave))
    }
  }, [requirements])

  return (
    <div className="space-y-6">
      {/* Top Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">요구사항 정의서</h2>
          <p className="text-gray-600 mt-1">프로젝트 요구사항을 정의하고 관리하세요</p>
        </div>
        <div className="flex items-center space-x-3">
              <div>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleExcelUpload}
                  className="hidden"
                  id="excel-upload"
                />
                <Button 
                  variant="outline" 
                  className="flex items-center space-x-2"
                  onClick={() => document.getElementById('excel-upload')?.click()}
                >
                  <Upload className="w-4 h-4" />
                  <span>Excel 업로드</span>
                </Button>
              </div>
              <Button 
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                onClick={handleExcelDownload}
              >
                <Download className="w-4 h-4" />
                <span>Excel 다운로드</span>
              </Button>
              <Button 
                variant="secondary" 
                onClick={addNewRow}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>행 추가</span>
              </Button>
              {hasAnalysisData && (
                <Button 
                  variant="default" 
                  onClick={generateRequirementsFromAnalysis}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>분석 결과로 자동 생성</span>
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={analyzeAllRequirements}
                className="flex items-center space-x-2 bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
              >
                <span>🤖</span>
                <span>AI 분석</span>
              </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Filter Bar */}
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="요구사항 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                {serviceTypeOptions.map((option) => (
                  <Button
                    key={option}
                    variant={serviceFilter === option ? "default" : "outline"}
                    size="sm"
                    onClick={() => setServiceFilter(option)}
                    className={serviceFilter === option ? "bg-blue-600" : ""}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>우선순위: {priorityFilter}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {priorityOptions.map((priority) => (
                  <DropdownMenuItem
                    key={priority}
                    onClick={() => setPriorityFilter(priority)}
                  >
                    {priority}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Data Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedRows.length === filteredRequirements.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-16">번호</TableHead>
                  <TableHead className="w-32">요구사항 ID</TableHead>
                  <TableHead className="w-32">서비스 구분</TableHead>
                  <TableHead>요구사항명</TableHead>
                  <TableHead className="w-96">상세설명</TableHead>
                  <TableHead className="w-24">우선순위</TableHead>
                  <TableHead className="w-24">난이도</TableHead>
                  <TableHead className="w-24">예상시간</TableHead>
                  <TableHead className="w-24">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequirements.map((req, index) => (
                  <TableRow
                    key={req.id}
                    className={`hover:bg-gray-50 ${selectedRows.includes(req.id) ? 'bg-blue-50' : ''} ${editingId === req.id ? 'bg-yellow-50' : ''}`}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(req.id)}
                        onCheckedChange={(checked) => handleSelectRow(req.id, checked as boolean)}
                        disabled={editingId === req.id}
                      />
                    </TableCell>
                    <TableCell className="text-center text-gray-600">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      {editingId === req.id ? (
                        <Input
                          value={editForm.reqId || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, reqId: e.target.value }))}
                          className="w-24 text-xs"
                        />
                      ) : (
                        <Badge variant="outline" className="font-mono">
                          {req.reqId}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === req.id ? (
                        <select
                          value={editForm.serviceType || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, serviceType: e.target.value }))}
                          className="px-2 py-1 border rounded text-xs"
                        >
                          {serviceTypeOptions.filter(opt => opt !== '전체').map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <Badge className={getServiceTypeBadgeColor(req.serviceType)}>
                          {req.serviceType}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {editingId === req.id ? (
                        <Input
                          value={editForm.name || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full"
                        />
                      ) : (
                        req.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === req.id ? (
                        <Input
                          value={editForm.description || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full"
                        />
                      ) : (
                        <div className="max-w-xs truncate" title={req.description}>
                          {req.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === req.id ? (
                        <select
                          value={editForm.priority || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, priority: e.target.value as 'High' | 'Medium' | 'Low' }))}
                          className="px-2 py-1 border rounded text-xs"
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      ) : (
                        <Badge className={getPriorityBadgeColor(req.priority)}>
                          {req.priority}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === req.id ? (
                        <select
                          value={editForm.difficulty || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' | 'Expert' }))}
                          className="px-2 py-1 border rounded text-xs"
                        >
                          {difficultyOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <Badge className={getDifficultyBadgeColor(req.difficulty)}>
                            {req.difficulty}
                          </Badge>
                          {!req.aiAnalyzed && (
                            <button
                              onClick={() => analyzeRequirement(req)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                              title="AI 분석"
                            >
                              🤖
                            </button>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === req.id ? (
                        <Input
                          type="number"
                          value={editForm.estimatedHours || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) || 0 }))}
                          className="w-16 text-xs"
                          min="1"
                          max="120"
                        />
                      ) : (
                        <div className="flex items-center space-x-1">
                          <Badge className={getHoursBadgeColor(req.estimatedHours)}>
                            {req.estimatedHours}h
                          </Badge>
                          {!req.aiAnalyzed && (
                            <button
                              onClick={() => analyzeRequirement(req)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                              title="AI 분석"
                            >
                              🤖
                            </button>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === req.id ? (
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            onClick={handleSaveEdit}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            저장
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                          >
                            취소
                          </Button>
                        </div>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem 
                              className="flex items-center space-x-2"
                              onClick={() => handleEdit(req)}
                            >
                              <Edit className="w-4 h-4" />
                              <span>편집</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="flex items-center space-x-2 text-red-600"
                              onClick={() => handleDelete(req.id, req.name)}
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>삭제</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Selection Actions */}
          {selectedRows.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-800">
                {selectedRows.length}개 항목이 선택되었습니다
              </span>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" onClick={handleBulkEdit}>
                  일괄 편집
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={handleBulkDelete}
                >
                  일괄 삭제
                </Button>
              </div>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              1-{filteredRequirements.length} of {requirements.length}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                이전
              </Button>
              <Button variant="outline" size="sm" disabled>
                다음
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <Button 
          onClick={() => {
            // 요구사항 데이터 저장
            const dataToSave = {
              requirements,
              savedAt: new Date().toISOString(),
              shouldAutoUpdateMenu: true // 메뉴구조에 자동 반영 플래그
            }
            localStorage.setItem('requirementsData', JSON.stringify(dataToSave))
            
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