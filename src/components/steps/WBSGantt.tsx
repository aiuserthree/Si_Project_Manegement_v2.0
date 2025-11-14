import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Checkbox } from '../ui/checkbox'
import { Save, Download, RefreshCw, Calendar, Users, Clock, BarChart3, UserCheck } from 'lucide-react'
import { Resource, ResourceRole, ResourceGrade } from './ResourceManagement'
import { WBSGanttTable } from './WBSGanttTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export interface Function {
  id: string
  functionId: string
  name: string
  description: string
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  requiredRoles: ResourceRole[]
  tasks: WBSTask[]
  // WBS 표 구조 추가
  division?: 'FO' | 'BO' // 구분
  depth1?: string // 1depth
  depth2?: string // 2depth
  depth3?: string // 3depth
  page?: string // 페이지
  platform?: 'Web' | 'Mobile' | 'Both' // Platform
  spec?: '1차' | '2차' // Spec
  note?: string // 비고
}

export interface WBSTask {
  id: string
  functionId: string
  role: ResourceRole
  taskName: string
  assignedResourceId?: string
  assignedResourceName?: string
  resourceGrade?: ResourceGrade
  estimatedDays: number
  startDate?: Date
  endDate?: Date
  dependencies?: string[]
  status: 'not-started' | 'in-progress' | 'completed'
  // WBS 표 구조 추가
  progress?: number // 진행률 (0.0 ~ 1.0)
  reviewStatus?: '대기' | '검수 요청' | '검수 진행중' | '검수완료' // 검수 상태
  reviewCompleteDate?: Date // 검수 완료일
}

interface WBSGanttProps {
  onSave?: () => void
  onNextStep?: () => void
}

// 등급별 기본 소요 기간 (일 단위)
const gradeBasedDuration: Record<ResourceGrade, Record<ResourceRole, number>> = {
  '초급': {
    '기획자': 5,
    '디자이너': 4,
    '퍼블리셔': 3,
    '개발자': 6
  },
  '중급': {
    '기획자': 3,
    '디자이너': 2,
    '퍼블리셔': 2,
    '개발자': 4
  },
  '고급': {
    '기획자': 2,
    '디자이너': 1,
    '퍼블리셔': 1,
    '개발자': 2
  }
}

// 기능별 필수 역할 정의 (페이지명, 기능명, 세부내용, division 모두 고려)
const getRequiredRolesForFunction = (func: Partial<Function>): ResourceRole[] => {
  const name = (func.name || '').toLowerCase()
  const description = (func.description || '').toLowerCase()
  const page = (func.page || '').toLowerCase()
  const division = func.division
  
  // 모든 기능에는 기본적으로 기획이 필요
  const roles: ResourceRole[] = ['기획자']
  
  // FO (프론트엔드)인 경우 대부분 디자인과 퍼블리셔가 필요
  if (division === 'FO') {
    // 예외: 순수 API 호출만 하는 경우나 데이터 처리만 하는 경우
    const isPureDataProcessing = name.includes('api 호출') || 
                                 name.includes('데이터 처리') || 
                                 name.includes('데이터 변환') ||
                                 (name.includes('조회') && !name.includes('화면') && !name.includes('목록'))
    
    if (!isPureDataProcessing) {
      // FO는 대부분 UI가 있으므로 디자인과 퍼블리셔 필요
      if (!roles.includes('디자이너')) {
        roles.push('디자이너')
      }
      if (!roles.includes('퍼블리셔')) {
        roles.push('퍼블리셔')
      }
    }
  }
  
  // BO (백오피스)인 경우도 화면이 있으면 디자인과 퍼블리셔 필요
  if (division === 'BO') {
    // BO에서도 화면이 있는 경우 (대부분)
    const hasScreen = !name.includes('api') && 
                      !name.includes('배치') && 
                      !name.includes('스케줄러') &&
                      !description.includes('api만') &&
                      !description.includes('배치 작업')
    
    if (hasScreen) {
      if (!roles.includes('디자이너')) {
        roles.push('디자이너')
      }
      if (!roles.includes('퍼블리셔')) {
        roles.push('퍼블리셔')
      }
    }
  }
  
  // 기능명, 설명, 페이지명에서 키워드 분석
  const allText = `${name} ${description} ${page}`.toLowerCase()
  
  // UI/화면 관련 키워드
  if (allText.includes('화면') || allText.includes('디자인') || allText.includes('ui') || 
      allText.includes('ux') || allText.includes('와이어프레임') || allText.includes('레이아웃') ||
      allText.includes('목록') || allText.includes('리스트') || allText.includes('상세') ||
      allText.includes('등록') || allText.includes('수정') || allText.includes('조회')) {
    if (!roles.includes('디자이너')) {
      roles.push('디자이너')
    }
    if (!roles.includes('퍼블리셔')) {
      roles.push('퍼블리셔')
    }
  }
  
  // 개발/구현 관련 기능
  if (allText.includes('개발') || allText.includes('구현') || allText.includes('api') || 
      allText.includes('연동') || allText.includes('기능') || allText.includes('처리') ||
      allText.includes('저장') || allText.includes('생성') || allText.includes('수정') ||
      allText.includes('삭제') || allText.includes('업로드') || allText.includes('다운로드')) {
    if (!roles.includes('개발자')) {
      roles.push('개발자')
    }
  }
  
  // 순수 문서/기획 작업만 있는 경우 (매우 드묾)
  const isPurePlanning = allText.includes('문서') && 
                         !allText.includes('화면') && 
                         !allText.includes('개발') &&
                         !allText.includes('구현') &&
                         division !== 'FO'
  
  if (isPurePlanning) {
    // 기획자만 (디자인, 퍼블, 개발 제거)
    return ['기획자']
  }
  
  // FO인 경우 개발자도 기본적으로 필요 (대부분)
  if (division === 'FO' && !roles.includes('개발자')) {
    // 예외: 순수 정적 페이지나 정보 표시만 하는 경우
    const isStaticPage = name.includes('안내') || 
                         name.includes('소개') || 
                         (name.includes('조회') && description.includes('표시만'))
    
    if (!isStaticPage) {
      roles.push('개발자')
    }
  }
  
  // BO인 경우도 대부분 개발자 필요
  if (division === 'BO' && !roles.includes('개발자')) {
    // 예외: 순수 문서 작업
    const isDocumentOnly = name.includes('문서') && !allText.includes('화면')
    
    if (!isDocumentOnly) {
      roles.push('개발자')
    }
  }
  
  // 프론트, 백오피스 모두 개발 작업이 없으면 추가 (검수 전에 개발이 필요)
  // 단, 순수 문서/기획 작업만 있는 경우는 제외
  if (!roles.includes('개발자') && !isPurePlanning) {
    // 화면이나 기능이 있는 경우 개발자 필요
    if (allText.includes('화면') || allText.includes('기능') || 
        allText.includes('등록') || allText.includes('수정') || 
        allText.includes('삭제') || allText.includes('조회') ||
        allText.includes('처리') || allText.includes('저장')) {
      roles.push('개발자')
    }
  }
  
  return roles
}

// Mock 기능 데이터 (실제로는 기능정의서에서 가져와야 함)
const mockFunctions: Function[] = [
  {
    id: '1',
    functionId: 'FN-001-001',
    name: '사용자 로그인',
    description: '사용자가 이메일과 비밀번호로 로그인할 수 있는 기능',
    priority: 'Critical',
    requiredRoles: ['기획자', '디자이너', '퍼블리셔', '개발자'],
    tasks: [],
    division: 'FO',
    depth1: '사용자 관리',
    depth2: '인증',
    depth3: '로그인',
    page: '로그인',
    platform: 'Web',
    spec: '1차',
    note: ''
  },
  {
    id: '2',
    functionId: 'FN-002-001',
    name: '파일 업로드',
    description: '드래그앤드롭 파일 업로드 기능',
    priority: 'High',
    requiredRoles: ['기획자', '디자이너', '퍼블리셔', '개발자'],
    tasks: [],
    division: 'FO',
    depth1: '파일 관리',
    depth2: '업로드',
    depth3: '파일 업로드',
    page: '업로드',
    platform: 'Web',
    spec: '1차',
    note: ''
  },
  {
    id: '3',
    functionId: 'FN-003-001',
    name: '질의서 자동 생성',
    description: 'AI 기반 질의서 생성 기능',
    priority: 'Critical',
    requiredRoles: ['기획자', '개발자'],
    tasks: [],
    division: 'BO',
    depth1: '프로젝트 관리',
    depth2: '질의서',
    depth3: '자동 생성',
    page: '목록',
    platform: 'Web',
    spec: '1차',
    note: ''
  },
  {
    id: '4',
    functionId: 'FN-004-001',
    name: '요구사항 정의서 관리',
    description: '요구사항 정의서 생성 및 관리',
    priority: 'High',
    requiredRoles: ['기획자', '개발자'],
    tasks: [],
    division: 'BO',
    depth1: '프로젝트 관리',
    depth2: '요구사항',
    depth3: '정의서 관리',
    page: '목록',
    platform: 'Web',
    spec: '1차',
    note: ''
  },
  {
    id: '5',
    functionId: 'FN-005-001',
    name: '메뉴구조도 설계',
    description: '시스템 메뉴 구조 설계 기능',
    priority: 'High',
    requiredRoles: ['기획자', '디자이너'],
    tasks: [],
    division: 'BO',
    depth1: '시스템 설계',
    depth2: '메뉴',
    depth3: '구조 설계',
    page: '설계',
    platform: 'Web',
    spec: '1차',
    note: ''
  }
]

export function WBSGantt({ onSave, onNextStep }: WBSGanttProps) {
  const [functions, setFunctions] = useState<Function[]>([])
  const [assignedResources, setAssignedResources] = useState<Resource[]>([])
  const [projectStartDate, setProjectStartDate] = useState<Date>(new Date())
  const [autoAssignEnabled, setAutoAssignEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isAutoAssigning, setIsAutoAssigning] = useState(false)

  // localStorage에서 데이터 복원 (한 번에 처리하여 성능 최적화)
  useEffect(() => {
    const loadData = () => {
      try {
        // WBS 데이터 먼저 확인 (더 완전한 데이터)
        const wbsStored = localStorage.getItem('wbsData')
        if (wbsStored) {
          const wbsData = JSON.parse(wbsStored)
          if (wbsData.functions && wbsData.functions.length > 0) {
            // Date 문자열을 Date 객체로 변환 (배치 처리)
            const restoredFunctions = wbsData.functions.map((func: any) => ({
              ...func,
              tasks: func.tasks.map((task: any) => ({
                ...task,
                startDate: task.startDate ? new Date(task.startDate) : undefined,
                endDate: task.endDate ? new Date(task.endDate) : undefined,
                reviewCompleteDate: task.reviewCompleteDate ? new Date(task.reviewCompleteDate) : undefined
              }))
            }))
            setFunctions(restoredFunctions)
            if (wbsData.projectStartDate) {
              setProjectStartDate(new Date(wbsData.projectStartDate))
            }
            if (wbsData.assignedResources && wbsData.assignedResources.length > 0) {
              setAssignedResources(wbsData.assignedResources)
            }
            setIsLoading(false)
            return
          }
        }
        
        // WBS 데이터가 없으면 인력관리 데이터만 로드
        const resourceStored = localStorage.getItem('resourceManagementData')
        if (resourceStored) {
          const resourceData = JSON.parse(resourceStored)
          if (resourceData.assignedResources && resourceData.assignedResources.length > 0) {
            setAssignedResources(resourceData.assignedResources)
          }
        }
        
        // 기능정의서 데이터가 있으면 로드
        const funcSpecStored = localStorage.getItem('functionalSpecificationData')
        if (funcSpecStored) {
          const funcSpecData = JSON.parse(funcSpecStored)
          if (funcSpecData.functions && funcSpecData.functions.length > 0) {
            setFunctions(funcSpecData.functions)
          }
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('데이터 복원 오류:', error)
        setIsLoading(false)
      }
    }
    
    // 다음 프레임에서 실행하여 초기 렌더링 블로킹 방지
    requestAnimationFrame(() => {
      setTimeout(loadData, 0)
    })
  }, [])

  // 역할 순서 정의 (작업 순서)
  const roleOrder: ResourceRole[] = ['기획자', '디자이너', '퍼블리셔', '개발자']
  
  // 역할별 작업 생성 및 의존성 설정
  const createTasksWithDependencies = (func: Function, resources: Resource[]): WBSTask[] => {
    const tasks: WBSTask[] = []
    const taskMap = new Map<ResourceRole, WBSTask>()
    
    // 역할 순서대로 작업 생성
    roleOrder.forEach((role, roleIndex) => {
      // 해당 역할이 필요한지 확인
      if (!func.requiredRoles.includes(role)) {
        return
      }
      
      // 해당 역할의 인력 찾기
      const availableResource = resources.find(r => r.role === role)
      
      // 이전 작업 찾기 (의존성 설정)
      let dependencies: string[] = []
      if (roleIndex > 0) {
        // 이전 역할의 작업 찾기
        const prevRole = roleOrder[roleIndex - 1]
        const prevTask = taskMap.get(prevRole)
        if (prevTask) {
          dependencies = [prevTask.id]
        }
      }
      
      const taskId = `${func.id}-${role}-${Date.now()}-${roleIndex}`
      const task: WBSTask = {
        id: taskId,
        functionId: func.id,
        role: role,
        taskName: `${func.name} - ${role} 작업`,
        assignedResourceId: availableResource?.id,
        assignedResourceName: availableResource?.name,
        resourceGrade: availableResource?.grade,
        estimatedDays: availableResource 
          ? gradeBasedDuration[availableResource.grade][role]
          : gradeBasedDuration['중급'][role],
        status: 'not-started',
        dependencies: dependencies,
        progress: 0,
        reviewStatus: '대기'
      }
      
      tasks.push(task)
      taskMap.set(role, task)
    })
    
    // 검수 작업 자동 생성 (개발 작업이 있는 경우에만)
    const devTask = taskMap.get('개발자')
    if (devTask) {
      const reviewTask: WBSTask = {
        id: `${func.id}-검수-${Date.now()}`,
        functionId: func.id,
        role: '개발자' as ResourceRole,
        taskName: `${func.name} - 검수 작업`,
        estimatedDays: 3,
        status: 'not-started',
        dependencies: [devTask.id], // 개발 작업 후에 검수
        progress: 0,
        reviewStatus: '대기'
      }
      tasks.push(reviewTask)
    }
    
    return tasks
  }

  // 기능별 WBS 자동 생성
  const generateWBS = () => {
    const updatedFunctions = functions.map(func => {
      const tasks = createTasksWithDependencies(func, assignedResources)
      return { ...func, tasks }
    })
    
    // 날짜 계산
    const functionsWithDates = calculateDates(updatedFunctions)
    setFunctions(functionsWithDates)
  }

  // 날짜 계산 (FO와 BO 분리하여 동시 시작, 최대 기간 제한 없이 자연스럽게 배치)
  const calculateDates = (funcs: Function[]): Function[] => {
    // FO와 BO로 분리
    const foFunctions = funcs.filter(func => func.division === 'FO')
    const boFunctions = funcs.filter(func => func.division === 'BO')
    const otherFunctions = funcs.filter(func => !func.division || (func.division !== 'FO' && func.division !== 'BO'))
    
    // 각 기능의 작업 날짜 계산 (의존성 고려, 최대 기간 제한 없음)
    const calculateFunctionTasks = (func: Function, functionStartDate: Date): WBSTask[] => {
      const updatedTasks: WBSTask[] = []
      const processed = new Set<string>()
      const queue: WBSTask[] = []
      
      // 의존성이 없는 작업부터 시작
      func.tasks.forEach(task => {
        if (!task.dependencies || task.dependencies.length === 0) {
          queue.push(task)
        }
      })
      
      // 큐가 빌 때까지 처리
      while (queue.length > 0) {
        const task = queue.shift()!
        if (processed.has(task.id)) continue
        
        // 의존성 확인
        let taskStartDate = new Date(functionStartDate)
        if (task.dependencies && task.dependencies.length > 0) {
          // 의존 작업 중 가장 늦게 끝나는 작업 찾기
          let maxDepEndDate: Date | null = null
          task.dependencies.forEach(depId => {
            const depTask = updatedTasks.find(t => t.id === depId)
            if (depTask && depTask.endDate) {
              const depEndDate = new Date(depTask.endDate)
              if (!maxDepEndDate || depEndDate > maxDepEndDate) {
                maxDepEndDate = depEndDate
              }
            }
          })
          
          if (maxDepEndDate) {
            taskStartDate = new Date(maxDepEndDate)
            taskStartDate.setDate(taskStartDate.getDate() + 1) // 다음날 시작
          }
        }
        
        const startDate = new Date(taskStartDate)
        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + task.estimatedDays)
        
        const updatedTask: WBSTask = {
          ...task,
          startDate,
          endDate
        }
        
        updatedTasks.push(updatedTask)
        processed.add(task.id)
        
        // 이 작업에 의존하는 다른 작업들을 큐에 추가
        func.tasks.forEach(otherTask => {
          if (otherTask.dependencies && otherTask.dependencies.includes(task.id)) {
            // 모든 의존 작업이 처리되었는지 확인
            const allDepsProcessed = otherTask.dependencies.every(depId => processed.has(depId))
            if (allDepsProcessed && !processed.has(otherTask.id)) {
              queue.push(otherTask)
            }
          }
        })
      }
      
      // 처리되지 않은 작업들도 추가 (순환 의존성 방지)
      func.tasks.forEach(task => {
        if (!processed.has(task.id)) {
          let taskStartDate = new Date(functionStartDate)
          if (task.dependencies && task.dependencies.length > 0) {
            const depTask = updatedTasks.find(t => t.id === task.dependencies![0])
            if (depTask && depTask.endDate) {
              taskStartDate = new Date(depTask.endDate)
              taskStartDate.setDate(taskStartDate.getDate() + 1)
            }
          }
          
          const startDate = new Date(taskStartDate)
          const endDate = new Date(startDate)
          endDate.setDate(endDate.getDate() + task.estimatedDays)
          
          updatedTasks.push({
            ...task,
            startDate,
            endDate
          })
        }
      })
      
      return updatedTasks
    }
    
    // FO 기능들을 순차적으로 진행 (첫 번째 기능의 모든 작업이 끝나면 다음 기능 시작)
    let foCurrentDate = new Date(projectStartDate)
    const foResults: Function[] = []
    
    for (const func of foFunctions) {
      const result = {
        ...func,
        tasks: calculateFunctionTasks(func, new Date(foCurrentDate))
      }
      foResults.push(result)
      
      // 이 기능의 모든 작업 중 가장 늦게 끝나는 작업의 종료일을 찾아서 다음 기능의 시작일로 설정
      if (result.tasks.length > 0) {
        let maxEndDate: Date | null = null
        result.tasks.forEach(task => {
          if (task.endDate && (!maxEndDate || task.endDate > maxEndDate)) {
            maxEndDate = task.endDate
          }
        })
        if (maxEndDate) {
          foCurrentDate = new Date(maxEndDate)
          foCurrentDate.setDate(foCurrentDate.getDate() + 1) // 다음날 시작
        }
      }
    }
    
    // BO 기능들도 순차적으로 진행 (첫 번째 기능의 모든 작업이 끝나면 다음 기능 시작)
    // FO와 동시에 시작하지만, BO 그룹 내에서는 순차적으로 진행
    let boCurrentDate = new Date(projectStartDate) // FO와 동시에 시작
    const boResults: Function[] = []
    
    for (const func of boFunctions) {
      const result = {
        ...func,
        tasks: calculateFunctionTasks(func, new Date(boCurrentDate))
      }
      boResults.push(result)
      
      // 이 기능의 모든 작업 중 가장 늦게 끝나는 작업의 종료일을 찾아서 다음 기능의 시작일로 설정
      if (result.tasks.length > 0) {
        let maxEndDate: Date | null = null
        result.tasks.forEach(task => {
          if (task.endDate && (!maxEndDate || task.endDate > maxEndDate)) {
            maxEndDate = task.endDate
          }
        })
        if (maxEndDate) {
          boCurrentDate = new Date(maxEndDate)
          boCurrentDate.setDate(boCurrentDate.getDate() + 1) // 다음날 시작
        }
      }
    }
    
    // 기타 기능들도 프로젝트 시작일부터 시작
    const otherResults = otherFunctions.map(func => ({
      ...func,
      tasks: calculateFunctionTasks(func, new Date(projectStartDate))
    }))
    
    // 결과 합치기
    return [...foResults, ...boResults, ...otherResults]
  }

  // 기능정의서 데이터를 Function 형식으로 변환
  const convertFunctionalSpecToFunctions = (): Function[] => {
    try {
      const stored = localStorage.getItem('functionalSpecificationData')
      if (!stored) {
        return []
      }
      
      const data = JSON.parse(stored)
      if (!data.screens || data.screens.length === 0) {
        return []
      }
      
      const convertedFunctions: Function[] = []
      let functionCounter = 1
      
      data.screens.forEach((screen: any) => {
        // 각 화면의 기능들을 Function으로 변환
        screen.functions.forEach((func: any) => {
          const functionId = `FN-${String(functionCounter).padStart(3, '0')}`
          
          const division = screen.division === 'BO' ? 'BO' : 'FO'
          
          // Function 객체를 먼저 생성 (역할 추론을 위해)
          const functionItem: Function = {
            id: `${screen.id}-${func.number}`,
            functionId: functionId,
            name: func.name,
            description: func.description,
            priority: 'Medium',
            requiredRoles: [], // 임시로 빈 배열
            tasks: [],
            division: division,
            depth1: screen.depth1 || '',
            depth2: screen.depth2 || '',
            depth3: screen.depth3 || screen.name,
            page: screen.name,
            platform: 'Web',
            spec: '1차',
            note: func.note || ''
          }
          
          // 페이지명, 기능명, 세부내용, division을 모두 고려하여 역할 추론
          const requiredRoles = getRequiredRolesForFunction(functionItem)
          functionItem.requiredRoles = requiredRoles
          
          // 우선순위 추론
          let priority: 'Critical' | 'High' | 'Medium' | 'Low' = 'Medium'
          if (func.category === '권한' || func.category === '보안') {
            priority = 'Critical'
          } else if (func.category === '입력' || func.category === '생성') {
            priority = 'High'
          } else if (func.category === '조회') {
            priority = 'Low'
          }
          functionItem.priority = priority
          
          convertedFunctions.push(functionItem)
          functionCounter++
        })
      })
      
      return convertedFunctions
    } catch (error) {
      console.error('기능정의서 데이터 변환 오류:', error)
      return []
    }
  }

  // 자동 배치 실행
  const handleAutoAssign = async () => {
    if (isAutoAssigning) return
    
    setIsAutoAssigning(true)
    
    try {
      // localStorage에서 최신 인력관리 데이터 읽기
      let currentAssignedResources = assignedResources
      try {
        const resourceStored = localStorage.getItem('resourceManagementData')
        if (resourceStored) {
          const resourceData = JSON.parse(resourceStored)
          if (resourceData.assignedResources && resourceData.assignedResources.length > 0) {
            currentAssignedResources = resourceData.assignedResources
            setAssignedResources(currentAssignedResources)
          } else {
            alert('먼저 인력 관리에서 프로젝트에 인력을 투입해주세요.')
            setIsAutoAssigning(false)
            return
          }
        } else {
          if (assignedResources.length === 0) {
            alert('먼저 인력 관리에서 프로젝트에 인력을 투입해주세요.')
            setIsAutoAssigning(false)
            return
          }
        }
      } catch (error) {
        console.error('인력관리 데이터 읽기 오류:', error)
        if (assignedResources.length === 0) {
          alert('인력 관리 데이터를 불러올 수 없습니다.')
          setIsAutoAssigning(false)
          return
        }
      }
      
      // 비동기로 처리하여 UI가 블로킹되지 않도록
      await new Promise(resolve => setTimeout(resolve, 0))
      
      // localStorage에서 최신 기능정의서 데이터 읽기
      const functionalSpecFunctions = convertFunctionalSpecToFunctions()
      
      if (functionalSpecFunctions.length === 0) {
        alert('기능정의서 데이터가 없습니다. 먼저 기능정의서를 생성하고 저장해주세요.')
        setIsAutoAssigning(false)
        return
      }
      
      // 비동기로 처리하여 UI가 블로킹되지 않도록
      await new Promise(resolve => setTimeout(resolve, 0))
      
      // WBS 생성 (직접 계산하여 상태 업데이트)
      const updatedFunctions = functionalSpecFunctions.map(func => {
        const tasks = createTasksWithDependencies(func, currentAssignedResources)
        return { ...func, tasks }
      })
      
      // 비동기로 처리하여 UI가 블로킹되지 않도록
      await new Promise(resolve => setTimeout(resolve, 0))
      
      // 날짜 계산
      const functionsWithDates = calculateDates(updatedFunctions)
      
      // 상태 업데이트
      setFunctions(functionsWithDates)
      
      // 자동배치 후 즉시 localStorage에 저장
      try {
        const wbsData = {
          functions: functionsWithDates.map(func => ({
            ...func,
            tasks: func.tasks.map(task => ({
              ...task,
              // Date 객체를 ISO 문자열로 변환
              startDate: task.startDate ? task.startDate.toISOString() : undefined,
              endDate: task.endDate ? task.endDate.toISOString() : undefined,
              reviewCompleteDate: task.reviewCompleteDate ? task.reviewCompleteDate.toISOString() : undefined
            }))
          })),
          projectStartDate: projectStartDate.toISOString(),
          assignedResources: currentAssignedResources,
          savedAt: new Date().toISOString()
        }
        localStorage.setItem('wbsData', JSON.stringify(wbsData))
        console.log('자동배치 후 WBS 데이터가 localStorage에 저장되었습니다.')
      } catch (error) {
        console.error('자동배치 후 WBS 데이터 저장 오류:', error)
      }
      
      alert(`${functionalSpecFunctions.length}개의 기능이 WBS에 자동으로 배치되었습니다.`)
    } finally {
      setIsAutoAssigning(false)
    }
  }

  // 수동 인력 배정
  const handleManualAssign = (taskId: string, resourceId: string) => {
    const resource = assignedResources.find(r => r.id === resourceId)
    if (!resource) return
    
    const updatedFunctions = functions.map(func => ({
      ...func,
      tasks: func.tasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            assignedResourceId: resource.id,
            assignedResourceName: resource.name,
            resourceGrade: resource.grade,
            estimatedDays: gradeBasedDuration[resource.grade][resource.role]
          }
        }
        return task
      })
    }))
    
    const functionsWithDates = calculateDates(updatedFunctions)
    setFunctions(functionsWithDates)
  }

  // 파트별 인력 자동 배치
  const handlePartAutoAssign = async (partRole: ResourceRole) => {
    if (isAutoAssigning) return
    
    setIsAutoAssigning(true)
    
    try {
      // localStorage에서 최신 인력관리 데이터 읽기
      let currentAssignedResources = assignedResources
      try {
        const resourceStored = localStorage.getItem('resourceManagementData')
        if (resourceStored) {
          const resourceData = JSON.parse(resourceStored)
          if (resourceData.assignedResources && resourceData.assignedResources.length > 0) {
            currentAssignedResources = resourceData.assignedResources
            setAssignedResources(currentAssignedResources)
          } else {
            alert('먼저 인력 관리에서 프로젝트에 인력을 투입해주세요.')
            setIsAutoAssigning(false)
            return
          }
        } else {
          if (assignedResources.length === 0) {
            alert('먼저 인력 관리에서 프로젝트에 인력을 투입해주세요.')
            setIsAutoAssigning(false)
            return
          }
        }
      } catch (error) {
        console.error('인력관리 데이터 읽기 오류:', error)
        if (assignedResources.length === 0) {
          alert('인력 관리 데이터를 불러올 수 없습니다.')
          setIsAutoAssigning(false)
          return
        }
      }

      // 해당 파트의 인력 찾기
      const partResource = currentAssignedResources.find(r => r.role === partRole)
      if (!partResource) {
        alert(`${partRole} 인력이 투입되지 않았습니다. 먼저 인력 관리에서 ${partRole} 인력을 투입해주세요.`)
        setIsAutoAssigning(false)
        return
      }

      // 비동기로 처리하여 UI가 블로킹되지 않도록
      await new Promise(resolve => setTimeout(resolve, 0))

      // 해당 역할의 작업에 인력 배정
      const updatedFunctions = functions.map(func => {
        const updatedTasks = func.tasks.map(task => {
          // 해당 역할의 작업인 경우에만 배정
          if (task.role === partRole) {
            return {
              ...task,
              assignedResourceId: partResource.id,
              assignedResourceName: partResource.name,
              resourceGrade: partResource.grade,
              estimatedDays: gradeBasedDuration[partResource.grade][partRole]
            }
          }
          return task
        })

        // 해당 역할의 작업이 없고, 기능에 해당 역할이 필요한 경우 작업 추가
        const hasPartTask = updatedTasks.some(t => t.role === partRole)
        if (!hasPartTask && func.requiredRoles.includes(partRole)) {
          // 역할 순서에 따라 의존성 설정
          const roleIndex = roleOrder.indexOf(partRole)
          let dependencies: string[] = []
          
          if (roleIndex > 0) {
            // 이전 역할의 작업 찾기
            const prevRole = roleOrder[roleIndex - 1]
            const prevTask = updatedTasks.find(t => t.role === prevRole)
            if (prevTask) {
              dependencies = [prevTask.id]
            }
          }
          
          const newTask: WBSTask = {
            id: `${func.id}-${partRole}-${Date.now()}`,
            functionId: func.id,
            role: partRole,
            taskName: `${func.name} - ${partRole} 작업`,
            assignedResourceId: partResource.id,
            assignedResourceName: partResource.name,
            resourceGrade: partResource.grade,
            estimatedDays: gradeBasedDuration[partResource.grade][partRole],
            status: 'not-started',
            dependencies: dependencies,
            progress: 0,
            reviewStatus: '대기'
          }
          updatedTasks.push(newTask)
        }

        return { ...func, tasks: updatedTasks }
      })

      // 비동기로 처리하여 UI가 블로킹되지 않도록
      await new Promise(resolve => setTimeout(resolve, 0))

      // 날짜 재계산
      const functionsWithDates = calculateDates(updatedFunctions)
      setFunctions(functionsWithDates)

      // localStorage에 저장
      try {
        const wbsData = {
          functions: functionsWithDates.map(func => ({
            ...func,
            tasks: func.tasks.map(task => ({
              ...task,
              startDate: task.startDate ? task.startDate.toISOString() : undefined,
              endDate: task.endDate ? task.endDate.toISOString() : undefined,
              reviewCompleteDate: task.reviewCompleteDate ? task.reviewCompleteDate.toISOString() : undefined
            }))
          })),
          projectStartDate: projectStartDate.toISOString(),
          assignedResources: currentAssignedResources,
          savedAt: new Date().toISOString()
        }
        localStorage.setItem('wbsData', JSON.stringify(wbsData))
      } catch (error) {
        console.error('WBS 데이터 저장 오류:', error)
      }

      // 배정된 작업 수 계산
      const assignedCount = functionsWithDates.reduce((count, func) => {
        return count + func.tasks.filter(t => t.role === partRole && t.assignedResourceId).length
      }, 0)

      alert(`${partRole} 인력이 ${assignedCount}개의 작업에 배정되었습니다.`)
    } finally {
      setIsAutoAssigning(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-700'
      case 'High': return 'bg-orange-100 text-orange-700'
      case 'Medium': return 'bg-yellow-100 text-yellow-700'
      case 'Low': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getRoleColor = (role: ResourceRole) => {
    switch (role) {
      case '기획자': return 'bg-purple-100 text-purple-700'
      case '디자이너': return 'bg-pink-100 text-pink-700'
      case '퍼블리셔': return 'bg-green-100 text-green-700'
      case '개발자': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return '-'
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }

  // 엑셀 다운로드 함수
  const handleExcelDownload = () => {
    const workbook = XLSX.utils.book_new()

    // 전체, FO, BO 각각 시트 생성
    const divisions = [
      { name: '전체', functions: functions },
      { name: 'FO', functions: functions.filter(f => f.division === 'FO') },
      { name: 'BO', functions: functions.filter(f => f.division === 'BO') }
    ]

    divisions.forEach(({ name, functions: funcs }) => {
      if (funcs.length === 0) return

      // 헤더 행 생성
      const headers = [
        ['구분', '1depth', '2depth', '3depth', '페이지', '기능 정의', '세부 내용', 'Platform', 'Spec', '비고', 
         '업무구분', 
         '기획-담당자', '기획-진행률', '기획-시작일', '기획-완료예정일', '기획-검수 상태', '기획-검수 완료일',
         '디자인-담당자', '디자인-진행률', '디자인-시작일', '디자인-완료예정일', '디자인-검수 상태', '디자인-검수 완료일',
         '퍼블리싱-담당자', '퍼블리싱-진행률', '퍼블리싱-시작일', '퍼블리싱-완료예정일', '퍼블리싱-검수 상태', '퍼블리싱-검수 완료일',
         '개발-담당자', '개발-진행률', '개발-시작일', '개발-완료예정일',
         '검수-담당자', '검수-진행률', '검수-시작일', '검수-완료예정일', '검수-검수 상태', '검수-검수 완료일']
      ]

      const data: any[] = [headers[0]]

      // 각 기능별 데이터 행 생성
      funcs.forEach(func => {
        const tasksByType: Record<string, WBSTask | null> = {
          '기획': null,
          '디자인': null,
          '퍼블리싱': null,
          '개발': null,
          '검수': null
        }

        func.tasks.forEach(task => {
          const workType = task.role === '기획자' ? '기획' :
                          task.role === '디자이너' ? '디자인' :
                          task.role === '퍼블리셔' ? '퍼블리싱' :
                          task.role === '개발자' ? '개발' : '검수'
          if (!tasksByType[workType]) {
            tasksByType[workType] = task
          }
        })

        const formatDate = (date: Date | undefined) => {
          if (!date) return ''
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          return `${year}-${month}-${day}`
        }

        const row = [
          func.division || '',
          func.depth1 || '',
          func.depth2 || '',
          func.depth3 || '',
          func.page || '',
          func.name,
          func.description,
          func.platform || '',
          func.spec || '',
          func.note || '',
          '', // 업무구분
          // 기획
          tasksByType['기획']?.assignedResourceName || '',
          tasksByType['기획']?.progress ? `${(tasksByType['기획'].progress * 100).toFixed(0)}%` : '0%',
          formatDate(tasksByType['기획']?.startDate),
          formatDate(tasksByType['기획']?.endDate),
          tasksByType['기획']?.reviewStatus || '대기',
          formatDate(tasksByType['기획']?.reviewCompleteDate),
          // 디자인
          tasksByType['디자인']?.assignedResourceName || '',
          tasksByType['디자인']?.progress ? `${(tasksByType['디자인'].progress * 100).toFixed(0)}%` : '0%',
          formatDate(tasksByType['디자인']?.startDate),
          formatDate(tasksByType['디자인']?.endDate),
          tasksByType['디자인']?.reviewStatus || '대기',
          formatDate(tasksByType['디자인']?.reviewCompleteDate),
          // 퍼블리싱
          tasksByType['퍼블리싱']?.assignedResourceName || '',
          tasksByType['퍼블리싱']?.progress ? `${(tasksByType['퍼블리싱'].progress * 100).toFixed(0)}%` : '0%',
          formatDate(tasksByType['퍼블리싱']?.startDate),
          formatDate(tasksByType['퍼블리싱']?.endDate),
          tasksByType['퍼블리싱']?.reviewStatus || '대기',
          formatDate(tasksByType['퍼블리싱']?.reviewCompleteDate),
          // 개발
          tasksByType['개발']?.assignedResourceName || '',
          tasksByType['개발']?.progress ? `${(tasksByType['개발'].progress * 100).toFixed(0)}%` : '0%',
          formatDate(tasksByType['개발']?.startDate),
          formatDate(tasksByType['개발']?.endDate),
          // 검수
          tasksByType['검수']?.assignedResourceName || '',
          tasksByType['검수']?.progress ? `${(tasksByType['검수'].progress * 100).toFixed(0)}%` : '0%',
          formatDate(tasksByType['검수']?.startDate),
          formatDate(tasksByType['검수']?.endDate),
          tasksByType['검수']?.reviewStatus || '대기',
          formatDate(tasksByType['검수']?.reviewCompleteDate)
        ]
        data.push(row)
      })

      const worksheet = XLSX.utils.aoa_to_sheet(data)
      
      // 컬럼 너비 설정
      const colWidths = [
        { wch: 8 },  // 구분
        { wch: 12 }, // 1depth
        { wch: 12 }, // 2depth
        { wch: 12 }, // 3depth
        { wch: 8 },  // 페이지
        { wch: 20 }, // 기능 정의
        { wch: 30 }, // 세부 내용
        { wch: 6 },  // Platform
        { wch: 5 },  // Spec
        { wch: 15 }, // 비고
        { wch: 8 },  // 업무구분
        { wch: 10 }, // 기획-담당자
        { wch: 8 },  // 기획-진행률
        { wch: 11 }, // 기획-시작일
        { wch: 11 }, // 기획-완료예정일
        { wch: 10 }, // 기획-검수 상태
        { wch: 11 }, // 기획-검수 완료일
        { wch: 10 }, // 디자인-담당자
        { wch: 8 },  // 디자인-진행률
        { wch: 11 }, // 디자인-시작일
        { wch: 11 }, // 디자인-완료예정일
        { wch: 10 }, // 디자인-검수 상태
        { wch: 11 }, // 디자인-검수 완료일
        { wch: 10 }, // 퍼블리싱-담당자
        { wch: 8 },  // 퍼블리싱-진행률
        { wch: 11 }, // 퍼블리싱-시작일
        { wch: 11 }, // 퍼블리싱-완료예정일
        { wch: 10 }, // 퍼블리싱-검수 상태
        { wch: 11 }, // 퍼블리싱-검수 완료일
        { wch: 10 }, // 개발-담당자
        { wch: 8 },  // 개발-진행률
        { wch: 11 }, // 개발-시작일
        { wch: 11 }, // 개발-완료예정일
        { wch: 10 }, // 검수-담당자
        { wch: 8 },  // 검수-진행률
        { wch: 11 }, // 검수-시작일
        { wch: 11 }, // 검수-완료예정일
        { wch: 10 }, // 검수-검수 상태
        { wch: 11 }  // 검수-검수 완료일
      ]
      worksheet['!cols'] = colWidths

      XLSX.utils.book_append_sheet(workbook, worksheet, name)
    })

    // 엑셀 파일 생성 및 다운로드
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const fileName = `WBS_${new Date().toISOString().split('T')[0]}.xlsx`
    saveAs(blob, fileName)
  }

  // 예상 기간 계산 (메모이제이션)
  const totalDuration = useMemo(() => {
    let maxEndDate: Date | null = null
    functions.forEach(func => {
      func.tasks.forEach(task => {
        if (task.endDate && (!maxEndDate || task.endDate > maxEndDate)) {
          maxEndDate = task.endDate
        }
      })
    })
    
    if (!maxEndDate || !projectStartDate) return 0
    const diffTime = maxEndDate.getTime() - projectStartDate.getTime()
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    // 최대 기간 제한 없이 실제 계산된 기간 반환
    return totalDays
  }, [functions, projectStartDate])

  // 간트차트용 데이터 준비 (메모이제이션)
  const allTasks = useMemo(() => {
    const tasks: (WBSTask & { functionName: string; functionId: string })[] = []
    functions.forEach(func => {
      func.tasks.forEach(task => {
        tasks.push({
          ...task,
          functionName: func.name,
          functionId: func.functionId
        })
      })
    })
    return tasks
  }, [functions])

  // 간트차트 날짜 범위 계산 (메모이제이션)
  const dateRange = useMemo(() => {
    if (allTasks.length === 0) {
      return { start: new Date(), end: new Date(), days: 0 }
    }

    let minDate = projectStartDate
    let maxDate = projectStartDate

    allTasks.forEach(task => {
      if (task.startDate && task.startDate < minDate) {
        minDate = task.startDate
      }
      if (task.endDate && task.endDate > maxDate) {
        maxDate = task.endDate
      }
    })

    const days = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return { start: minDate, end: maxDate, days }
  }, [allTasks, projectStartDate])

  // 날짜를 픽셀 위치로 변환
  const dateToPosition = (date: Date, dateRange: { start: Date; end: Date; days: number }, chartWidth: number) => {
    const diffTime = date.getTime() - dateRange.start.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return (diffDays / dateRange.days) * chartWidth
  }

  // 작업 기간을 픽셀 너비로 변환
  const durationToWidth = (startDate: Date, endDate: Date, dateRange: { start: Date; end: Date; days: number }, chartWidth: number) => {
    const startPos = dateToPosition(startDate, dateRange, chartWidth)
    const endPos = dateToPosition(endDate, dateRange, chartWidth)
    return Math.max(endPos - startPos, 20) // 최소 20px
  }

  // 상태별 색상
  const getStatusColor = (status: string, role: ResourceRole) => {
    const roleColors: Record<ResourceRole, string> = {
      '기획자': '#9333ea',
      '디자이너': '#ec4899',
      '퍼블리셔': '#10b981',
      '개발자': '#3b82f6'
    }

    const baseColor = roleColors[role] || '#6b7280'
    
    switch (status) {
      case 'completed':
        return baseColor
      case 'in-progress':
        return baseColor + '80' // 50% opacity
      case 'not-started':
        return baseColor + '40' // 25% opacity
      default:
        return baseColor + '40'
    }
  }

  // 진행률에 따른 배경색 (가이드 기준)
  const getProgressColor = (progress: number) => {
    if (progress >= 1.0) return '#D9EAD3' // 완료: 연한 녹색
    if (progress > 0) return '#FFF2CC' // 진행중: 연한 노랑
    return '#FFFFFF' // 미시작: 흰색
  }

  // 업무 역할을 가이드 역할로 매핑
  const mapRoleToWorkType = (role: ResourceRole): '기획' | '디자인' | '퍼블리싱' | '개발' | '검수' => {
    switch (role) {
      case '기획자': return '기획'
      case '디자이너': return '디자인'
      case '퍼블리셔': return '퍼블리싱'
      case '개발자': return '개발'
      default: return '기획'
    }
  }

  // 간트차트 렌더링 (WBS 표 구조)
  const renderGanttChart = () => {
    const labelWidth = 600 // 상세 정보를 표시하기 위해 넓게 설정
    const rowHeight = 80 // 상세 정보를 표시하기 위해 높게 설정
    const chartWidth = Math.max(1000, dateRange.days * 20) // 날짜에 따라 동적 계산

    if (allTasks.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>작업이 생성되지 않았습니다.</p>
          <p className="text-sm mt-1">"자동 배치" 버튼을 클릭하여 WBS를 생성하세요.</p>
        </div>
      )
    }

    // 날짜 라벨 생성 (일 단위로 그리드 표시, 주 단위로 라벨)
    const allDates: Date[] = []
    const weekLabels: { date: Date; position: number }[] = []
    const currentDate = new Date(dateRange.start)
    let dayIndex = 0
    
    while (currentDate <= dateRange.end) {
      allDates.push(new Date(currentDate))
      // 주 단위로 라벨 추가
      if (dayIndex % 7 === 0 || dayIndex === 0) {
        weekLabels.push({
          date: new Date(currentDate),
          position: dayIndex
        })
      }
      currentDate.setDate(currentDate.getDate() + 1)
      dayIndex++
    }

    const today = new Date()
    const todayPosition = dateToPosition(today, dateRange, chartWidth)

    return (
      <div className="border rounded-lg bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <div style={{ minWidth: `${labelWidth + chartWidth}px`, position: 'relative' }}>
            {/* 헤더: 상세 정보 컬럼 + 날짜 그리드 */}
            <div className="sticky top-0 z-20 bg-white border-b" style={{ height: '80px' }}>
              {/* 왼쪽 상세 정보 헤더 */}
              <div
                className="absolute left-0 top-0 bottom-0 bg-gray-50 border-r z-30 grid grid-cols-6 gap-2 px-3 py-2"
                style={{ width: `${labelWidth}px` }}
              >
                <div className="text-xs font-semibold text-gray-700 flex items-center">기능명</div>
                <div className="text-xs font-semibold text-gray-700 flex items-center">작업명</div>
                <div className="text-xs font-semibold text-gray-700 flex items-center">역할</div>
                <div className="text-xs font-semibold text-gray-700 flex items-center">담당자</div>
                <div className="text-xs font-semibold text-gray-700 flex items-center">기간</div>
                <div className="text-xs font-semibold text-gray-700 flex items-center">상태</div>
              </div>
              
              {/* 날짜 그리드 */}
              <div className="relative" style={{ marginLeft: `${labelWidth}px`, height: '100%' }}>
                {/* 주 단위 라벨 */}
                {weekLabels.map((week, idx) => {
                  const position = (week.position / dateRange.days) * chartWidth
                  return (
                    <div
                      key={idx}
                      className="absolute top-0 bottom-0 border-l border-gray-200 flex items-center px-2"
                      style={{ left: `${position}px` }}
                    >
                      <span className="text-xs font-medium text-gray-700">
                        {week.date.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}
                      </span>
                    </div>
                  )
                })}
                
                {/* 오늘 날짜 표시선 */}
                {today >= dateRange.start && today <= dateRange.end && (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-40"
                    style={{ left: `${todayPosition}px` }}
                  >
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
                      오늘
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 간트차트 바디 */}
            <div className="relative">
              {/* 그리드 배경 */}
              <div className="absolute" style={{ left: `${labelWidth}px`, right: 0, top: 0, bottom: 0 }}>
                {allDates.map((date, idx) => {
                  const position = (idx / dateRange.days) * chartWidth
                  return (
                    <div
                      key={idx}
                      className="absolute top-0 bottom-0 border-l border-gray-100"
                      style={{ left: `${position}px`, width: '1px' }}
                    />
                  )
                })}
              </div>

              {/* 작업 행 */}
              {allTasks.map((task, taskIndex) => {
                if (!task.startDate || !task.endDate) return null

                const left = dateToPosition(task.startDate, dateRange, chartWidth)
                const width = durationToWidth(task.startDate, task.endDate, dateRange, chartWidth)
                const func = functions.find(f => f.id === task.functionId)

                return (
                  <div
                    key={task.id}
                    className="relative border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    style={{ height: `${rowHeight}px` }}
                  >
                    {/* 작업 상세 정보 (왼쪽 고정) */}
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-white border-r border-gray-200 z-10 sticky left-0 grid grid-cols-6 gap-2 px-3 py-2"
                      style={{ width: `${labelWidth}px` }}
                    >
                      {/* 기능명 */}
                      <div className="flex flex-col justify-center min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {task.functionName}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {func?.functionId}
                        </div>
                      </div>
                      
                      {/* 작업명 */}
                      <div className="flex flex-col justify-center min-w-0">
                        <div className="text-sm text-gray-700 truncate">
                          {task.taskName}
                        </div>
                      </div>
                      
                      {/* 역할 */}
                      <div className="flex items-center">
                        <Badge
                          className={getRoleColor(task.role)}
                          style={{ fontSize: '11px', padding: '3px 8px' }}
                        >
                          {task.role}
                        </Badge>
                        {task.resourceGrade && (
                          <Badge variant="outline" className="ml-1 text-xs">
                            {task.resourceGrade}
                          </Badge>
                        )}
                      </div>
                      
                      {/* 담당자 */}
                      <div className="flex items-center min-w-0">
                        {task.assignedResourceName ? (
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm text-gray-900 truncate">
                              {task.assignedResourceName}
                            </span>
                          </div>
                        ) : (
                          <Select
                            value={task.assignedResourceId || ''}
                            onValueChange={(value) => handleManualAssign(task.id, value)}
                            onOpenChange={(open) => {
                              if (open) {
                                // 드롭다운 열 때 z-index 조정
                              }
                            }}
                          >
                            <SelectTrigger className="w-full h-8 text-xs">
                              <SelectValue placeholder="인력 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {assignedResources
                                .filter(r => r.role === task.role)
                                .map(resource => (
                                  <SelectItem key={resource.id} value={resource.id}>
                                    {resource.name} ({resource.grade})
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                      
                      {/* 기간 */}
                      <div className="flex flex-col justify-center">
                        <div className="text-sm font-medium text-gray-900">
                          {task.estimatedDays}일
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(task.startDate)} ~ {formatDate(task.endDate)}
                        </div>
                      </div>
                      
                      {/* 상태 */}
                      <div className="flex items-center">
                        <Select
                          value={task.status}
                          onValueChange={(value: any) => {
                            const updatedFunctions = functions.map(f =>
                              f.id === task.functionId
                                ? {
                                    ...f,
                                    tasks: f.tasks.map(t =>
                                      t.id === task.id ? { ...t, status: value } : t
                                    )
                                  }
                                : f
                            )
                            setFunctions(updatedFunctions)
                          }}
                        >
                          <SelectTrigger className="w-full h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not-started">대기</SelectItem>
                            <SelectItem value="in-progress">진행중</SelectItem>
                            <SelectItem value="completed">완료</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* 간트 바 */}
                    <div
                      className="absolute rounded-md cursor-pointer hover:shadow-lg transition-all group"
                      style={{
                        left: `${labelWidth + left}px`,
                        top: '10px',
                        width: `${Math.max(width, 30)}px`,
                        height: '60px',
                        backgroundColor: getStatusColor(task.status, task.role),
                        border: '2px solid rgba(255,255,255,0.3)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                      title={`${task.taskName}\n기간: ${formatDate(task.startDate)} ~ ${formatDate(task.endDate)}\n소요일: ${task.estimatedDays}일\n상태: ${task.status === 'completed' ? '완료' : task.status === 'in-progress' ? '진행중' : '대기'}`}
                    >
                      <div className="h-full flex items-center justify-center px-2">
                        {width > 60 && (
                          <span className="text-xs font-semibold text-white drop-shadow-sm">
                            {task.estimatedDays}일
                          </span>
                        )}
                      </div>
                      {/* 상태 표시 */}
                      <div className="absolute -top-1 -right-1">
                        {task.status === 'completed' && (
                          <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                        {task.status === 'in-progress' && (
                          <div className="w-3 h-3 bg-yellow-500 rounded-full border-2 border-white animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 로딩 중일 때 간단한 UI 표시
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 relative">
      {/* 로딩 오버레이 */}
      {isAutoAssigning && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">인력 배치 중...</p>
            <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요</p>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">WBS</h2>
          <p className="text-gray-600 mt-1">기능별 작업 분해 및 인력 배정</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 border-r pr-2 mr-2">
            <Button 
              onClick={() => handlePartAutoAssign('기획자')} 
              variant="outline"
              className="bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700"
              disabled={isAutoAssigning}
            >
              {isAutoAssigning ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <UserCheck className="w-4 h-4 mr-2" />
              )}
              기획 배치
            </Button>
            <Button 
              onClick={() => handlePartAutoAssign('디자이너')} 
              variant="outline"
              className="bg-pink-50 hover:bg-pink-100 border-pink-200 text-pink-700"
              disabled={isAutoAssigning}
            >
              {isAutoAssigning ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <UserCheck className="w-4 h-4 mr-2" />
              )}
              디자인 배치
            </Button>
            <Button 
              onClick={() => handlePartAutoAssign('퍼블리셔')} 
              variant="outline"
              className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
              disabled={isAutoAssigning}
            >
              {isAutoAssigning ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <UserCheck className="w-4 h-4 mr-2" />
              )}
              퍼블 배치
            </Button>
            <Button 
              onClick={() => handlePartAutoAssign('개발자')} 
              variant="outline"
              className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
              disabled={isAutoAssigning}
            >
              {isAutoAssigning ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <UserCheck className="w-4 h-4 mr-2" />
              )}
              개발 배치
            </Button>
          </div>
          <Button 
            onClick={handleAutoAssign} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isAutoAssigning}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isAutoAssigning ? 'animate-spin' : ''}`} />
            {isAutoAssigning ? '배치 중...' : '전체 자동 배치'}
          </Button>
          <Button variant="outline" onClick={handleExcelDownload}>
            <Download className="w-4 h-4 mr-2" />
            엑셀 다운로드
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">총 기능 수</p>
                <p className="text-2xl font-bold">{functions.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">총 작업 수</p>
                <p className="text-2xl font-bold">
                  {functions.reduce((sum, f) => sum + f.tasks.length, 0)}
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">투입 인력</p>
                <p className="text-2xl font-bold">{assignedResources.length}명</p>
              </div>
              <Users className="w-8 h-8 text-purple-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">예상 기간</p>
                <p className="text-2xl font-bold">{totalDuration}일</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* WBS 표 (가이드 구조) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <CardTitle>WBS</CardTitle>
          </div>
          <p className="text-sm text-gray-600 mt-1">가이드에 따른 WBS 표 구조</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="FO">FO</TabsTrigger>
              <TabsTrigger value="BO">BO</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <WBSGanttTable 
                functions={functions} 
                onUpdate={setFunctions} 
              />
            </TabsContent>
            
            <TabsContent value="FO" className="mt-0">
              <WBSGanttTable 
                functions={functions.filter(f => f.division === 'FO')} 
                onUpdate={(updatedFunctions) => {
                  // FO 함수만 업데이트
                  const foIds = new Set(updatedFunctions.map(f => f.id))
                  const updatedAllFunctions = functions.map(f => 
                    foIds.has(f.id) 
                      ? updatedFunctions.find(uf => uf.id === f.id) || f
                      : f
                  )
                  setFunctions(updatedAllFunctions)
                }} 
              />
            </TabsContent>
            
            <TabsContent value="BO" className="mt-0">
              <WBSGanttTable 
                functions={functions.filter(f => f.division === 'BO')} 
                onUpdate={(updatedFunctions) => {
                  // BO 함수만 업데이트
                  const boIds = new Set(updatedFunctions.map(f => f.id))
                  const updatedAllFunctions = functions.map(f => 
                    boIds.has(f.id) 
                      ? updatedFunctions.find(uf => uf.id === f.id) || f
                      : f
                  )
                  setFunctions(updatedAllFunctions)
                }} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <Button
          onClick={() => {
            // WBS 데이터를 localStorage에 저장 (현재 상태를 확실히 저장)
            try {
              // 현재 functions 상태를 직접 사용하여 저장
              const currentFunctions = functions.length > 0 ? functions : []
              
              const wbsData = {
                functions: currentFunctions.map(func => ({
                  ...func,
                  tasks: func.tasks.map(task => ({
                    ...task,
                    // Date 객체를 ISO 문자열로 변환
                    startDate: task.startDate ? task.startDate.toISOString() : undefined,
                    endDate: task.endDate ? task.endDate.toISOString() : undefined,
                    reviewCompleteDate: task.reviewCompleteDate ? task.reviewCompleteDate.toISOString() : undefined
                  }))
                })),
                projectStartDate: projectStartDate.toISOString(),
                assignedResources: assignedResources.length > 0 ? assignedResources : [],
                savedAt: new Date().toISOString(),
                shouldAutoUpdateFigma: true // 피그마 메이크 프롬프트 페이지에 자동 반영 플래그
              }
              localStorage.setItem('wbsData', JSON.stringify(wbsData))
              console.log(`WBS 데이터가 localStorage에 저장되었습니다. (${currentFunctions.length}개 기능)`)
            } catch (error) {
              console.error('WBS 데이터 저장 오류:', error)
              alert('WBS 데이터 저장 중 오류가 발생했습니다.')
              return
            }
            
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

