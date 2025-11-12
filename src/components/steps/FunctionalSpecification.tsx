import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Download, FileText, RefreshCw, CheckCircle2, FileSpreadsheet } from 'lucide-react'
import { Alert, AlertDescription } from '../ui/alert'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

interface MenuNode {
  id: string
  name: string
  depth1: string
  depth2: string
  depth3: string
  depth4: string
  depth5: string
  screenName: string
  accessLevel: 'all' | 'login'
  hasAdmin: boolean
  division?: 'FO' | 'BO'
  expanded?: boolean
  children?: MenuNode[]
}

// division 자동 판단 함수
const inferDivision = (node: MenuNode): 'FO' | 'BO' => {
  if (node.division) {
    return node.division
  }
  
  const screenName = node.screenName.toLowerCase()
  const depth1 = node.depth1.toLowerCase()
  
  if (screenName.includes('/admin') || 
      screenName.includes('admin') ||
      depth1.includes('관리') ||
      depth1.includes('설정') ||
      depth1.includes('시스템') ||
      node.hasAdmin) {
    return 'BO'
  }
  
  return 'FO'
}

interface ScreenSpec {
  screenId: string
  screenName: string
  mainFeatures: string[]
  description: string
  functions: Array<{
    number: number
    category: string
    name: string
    description: string
    note: string
  }>
}

interface FunctionalSpecificationProps {
  onSave?: () => void
  onNextStep?: () => void
}

// 메뉴 구조 데이터 가져오기
const getMenuData = (): MenuNode[] => {
  // localStorage에서 저장된 메뉴 구조 데이터 가져오기
  try {
    const savedData = localStorage.getItem('menuStructure')
    if (savedData) {
      const parsed = JSON.parse(savedData)
      if (parsed.menuStructure && Array.isArray(parsed.menuStructure)) {
        return parsed.menuStructure
      }
    }
  } catch (error) {
    console.error('Failed to load menu structure from localStorage:', error)
  }
  
  // 기본 mock 데이터 (localStorage에 데이터가 없는 경우)
  return [
    {
      id: '1',
      name: '홈',
      depth1: '홈',
      depth2: '',
      depth3: '',
      depth4: '',
      depth5: '',
      screenName: '/',
      accessLevel: 'all',
      hasAdmin: false,
      expanded: true,
      children: []
    },
    {
      id: '2',
      name: '사용자 관리',
      depth1: '관리',
      depth2: '사용자 관리',
      depth3: '',
      depth4: '',
      depth5: '',
      screenName: '/admin/users',
      accessLevel: 'login',
      hasAdmin: true,
      expanded: true,
      children: [
        {
          id: '2-1',
          name: '사용자 목록',
          depth1: '관리',
          depth2: '사용자 관리',
          depth3: '사용자 목록',
          depth4: '',
          depth5: '',
          screenName: '/admin/users/list',
          accessLevel: 'login',
          hasAdmin: true,
          expanded: false,
          children: []
        },
        {
          id: '2-2',
          name: '사용자 등록',
          depth1: '관리',
          depth2: '사용자 관리',
          depth3: '사용자 등록',
          depth4: '',
          depth5: '',
          screenName: '/admin/users/create',
          accessLevel: 'login',
          hasAdmin: true,
          expanded: false,
          children: []
        }
      ]
    },
    {
      id: '3',
      name: '프로젝트 관리',
      depth1: '프로젝트',
      depth2: '',
      depth3: '',
      depth4: '',
      depth5: '',
      screenName: '/projects',
      accessLevel: 'login',
      hasAdmin: false,
      expanded: true,
      children: [
        {
          id: '3-1',
          name: '프로젝트 목록',
          depth1: '프로젝트',
          depth2: '프로젝트 목록',
          depth3: '',
          depth4: '',
          depth5: '',
          screenName: '/projects/list',
          accessLevel: 'login',
          hasAdmin: false,
          expanded: false,
          children: []
        },
        {
          id: '3-2',
          name: '프로젝트 생성',
          depth1: '프로젝트',
          depth2: '프로젝트 생성',
          depth3: '',
          depth4: '',
          depth5: '',
          screenName: '/projects/create',
          accessLevel: 'login',
          hasAdmin: false,
          expanded: false,
          children: []
        }
      ]
    }
  ]
}

// 메뉴 노드를 평면화하여 화면 목록 생성
const flattenMenuNodes = (nodes: MenuNode[]): MenuNode[] => {
  const screens: MenuNode[] = []
  
  const traverse = (node: MenuNode) => {
    // 자식이 없는 노드만 화면으로 간주
    if (!node.children || node.children.length === 0) {
      screens.push(node)
    }
    
    if (node.children) {
      node.children.forEach(traverse)
    }
  }
  
  nodes.forEach(traverse)
  return screens
}

// 화면ID 생성 ({FO|BO}_{대분류}_{중분류}_{화면번호})
const generateScreenId = (node: MenuNode, index: number): string => {
  const depth1 = node.depth1 || 'MAIN'
  const depth2 = node.depth2 || 'DEFAULT'
  const screenNum = String(index + 1).padStart(2, '0')
  
  // division에 따라 FO 또는 BO로 시작
  const division = inferDivision(node)
  const prefix = division === 'BO' ? 'BO' : 'FO'
  
  // 영문 변환 (간단한 매핑)
  const toEnglish = (text: string): string => {
    const mapping: { [key: string]: string } = {
      '홈': 'HOME',
      '관리': 'ADMIN',
      '사용자 관리': 'USER',
      '사용자 목록': 'LIST',
      '사용자 등록': 'CREATE',
      '프로젝트': 'PROJECT',
      '프로젝트 목록': 'LIST',
      '프로젝트 생성': 'CREATE',
      '대시보드': 'DASHBOARD',
      '설정': 'SETTINGS'
    }
    
    return mapping[text] || text.toUpperCase().replace(/\s+/g, '_')
  }
  
  const d1 = toEnglish(depth1)
  const d2 = depth2 ? toEnglish(depth2) : 'DEFAULT'
  
  return `${prefix}_${d1}_${d2}_${screenNum}`
}

// 화면 유형 추론
const inferScreenType = (node: MenuNode): 'list' | 'detail' | 'create' | 'dashboard' | 'settings' => {
  const name = node.name.toLowerCase()
  const screenName = node.screenName.toLowerCase()
  
  if (name.includes('목록') || name.includes('리스트') || name.includes('list')) {
    return 'list'
  } else if (name.includes('상세') || name.includes('detail')) {
    return 'detail'
  } else if (name.includes('등록') || name.includes('생성') || name.includes('작성') || name.includes('create') || name.includes('new')) {
    return 'create'
  } else if (name.includes('대시보드') || name.includes('dashboard') || name === '홈' || screenName === '/') {
    return 'dashboard'
  } else if (name.includes('설정') || name.includes('settings')) {
    return 'settings'
  }
  
  return 'list' // 기본값
}

// 화면 유형별 기능 추론
const inferFunctions = (node: MenuNode, screenType: string): Array<{
  category: string
  name: string
  description: string
  note: string
}> => {
  const functions: Array<{ category: string; name: string; description: string; note: string }> = []
  let funcNumber = 1
  
  switch (screenType) {
    case 'list':
      functions.push(
        { category: '조회', name: '목록 조회', description: `사용자가 ${node.name} 목록을 조회할 수 있습니다.`, note: '' },
        { category: '조회', name: '검색', description: `사용자가 키워드, 필터 조건을 입력하여 ${node.name}을 검색할 수 있습니다.`, note: '' },
        { category: '조회', name: '정렬', description: `사용자가 목록을 다양한 기준(날짜, 이름 등)으로 정렬할 수 있습니다.`, note: '' },
        { category: '조회', name: '페이징', description: `목록이 많을 경우 페이지 단위로 나누어 조회할 수 있습니다.`, note: '' },
        { category: '네비게이션', name: '상세 이동', description: `목록 항목을 클릭하면 해당 항목의 상세 화면으로 이동합니다.`, note: '' },
        { category: '권한', name: '접근 권한 확인', description: `사용자의 권한에 따라 접근 가능 여부를 확인합니다.`, note: node.hasAdmin ? '관리자만 접근 가능' : '' }
      )
      break
      
    case 'detail':
      functions.push(
        { category: '조회', name: '상세 정보 조회', description: `사용자가 ${node.name}의 상세 정보를 조회할 수 있습니다.`, note: '' },
        { category: '수정', name: '정보 수정', description: `권한이 있는 사용자가 ${node.name} 정보를 수정할 수 있습니다.`, note: '' },
        { category: '삭제', name: '삭제', description: `권한이 있는 사용자가 ${node.name}을 삭제할 수 있습니다.`, note: '' },
        { category: '네비게이션', name: '이전/다음 이동', description: `이전 항목 또는 다음 항목으로 이동할 수 있습니다.`, note: '' },
        { category: '권한', name: '접근 권한 확인', description: `사용자의 권한에 따라 접근 가능 여부를 확인합니다.`, note: node.hasAdmin ? '관리자만 접근 가능' : '' }
      )
      break
      
    case 'create':
      functions.push(
        { category: '입력', name: '정보 입력', description: `사용자가 ${node.name}에 필요한 정보를 입력할 수 있습니다.`, note: '' },
        { category: '유효성', name: '입력값 검증', description: `입력된 값이 유효한지 검증하고, 오류가 있으면 사용자에게 알립니다.`, note: '' },
        { category: '입력', name: '임시 저장', description: `작성 중인 내용을 임시로 저장하여 나중에 이어서 작성할 수 있습니다.`, note: '' },
        { category: '입력', name: '제출', description: `입력한 정보를 제출하여 ${node.name}을 생성합니다.`, note: '' },
        { category: '알림', name: '성공/실패 알림', description: `제출 성공 또는 실패 시 사용자에게 알림을 표시합니다.`, note: '' },
        { category: '권한', name: '접근 권한 확인', description: `사용자의 권한에 따라 접근 가능 여부를 확인합니다.`, note: node.hasAdmin ? '관리자만 접근 가능' : '' }
      )
      break
      
    case 'dashboard':
      functions.push(
        { category: '조회', name: '통계 조회', description: `사용자가 주요 통계 정보를 조회할 수 있습니다.`, note: '' },
        { category: '조회', name: '차트 표시', description: `데이터를 시각적으로 표현한 차트를 표시합니다.`, note: '' },
        { category: '조회', name: '기간 필터', description: `통계 데이터를 특정 기간으로 필터링하여 조회할 수 있습니다.`, note: '' },
        { category: '네비게이션', name: '메뉴 이동', description: `다양한 메뉴로 이동할 수 있는 네비게이션을 제공합니다.`, note: '' },
        { category: '권한', name: '접근 권한 확인', description: `사용자의 권한에 따라 접근 가능 여부를 확인합니다.`, note: node.accessLevel === 'login' ? '로그인 필요' : '' }
      )
      break
      
    case 'settings':
      functions.push(
        { category: '조회', name: '설정 조회', description: `사용자가 현재 설정 정보를 조회할 수 있습니다.`, note: '' },
        { category: '수정', name: '설정 수정', description: `사용자가 설정 정보를 수정할 수 있습니다.`, note: '' },
        { category: '입력', name: '설정 저장', description: `수정한 설정 정보를 저장합니다.`, note: '' },
        { category: '유효성', name: '입력값 검증', description: `입력된 설정 값이 유효한지 검증합니다.`, note: '' },
        { category: '권한', name: '접근 권한 확인', description: `사용자의 권한에 따라 접근 가능 여부를 확인합니다.`, note: node.hasAdmin ? '관리자만 접근 가능' : '' }
      )
      break
  }
  
  // 모든 화면에 공통 기능 추가
  functions.push(
    { category: '알림', name: '오류 처리', description: `시스템 오류 발생 시 사용자에게 적절한 오류 메시지를 표시합니다.`, note: '' }
  )
  
  return functions.map((func, idx) => ({
    ...func,
    number: funcNumber++
  }))
}

// 주요 기능 추출
const generateMainFeatures = (functions: Array<{ category: string; name: string; description: string }>): string[] => {
  const mainCategories = ['조회', '입력', '수정', '삭제']
  const mainFeatures: string[] = []
  
  functions.forEach(func => {
    if (mainCategories.includes(func.category) && mainFeatures.length < 5) {
      mainFeatures.push(func.name)
    }
  })
  
  // 주요 기능이 3개 미만이면 추가
  if (mainFeatures.length < 3) {
    functions.slice(0, 3 - mainFeatures.length).forEach(func => {
      if (!mainFeatures.includes(func.name)) {
        mainFeatures.push(func.name)
      }
    })
  }
  
  return mainFeatures.slice(0, 5)
}

// 화면 설명 생성
const generateDescription = (node: MenuNode, screenType: string): string => {
  const descriptions: { [key: string]: string } = {
    list: `${node.name} 화면은 사용자가 ${node.depth1 || '시스템'}의 ${node.name} 목록을 조회하고 검색할 수 있는 화면입니다. 사용자는 목록에서 원하는 항목을 찾아 상세 정보를 확인하거나 필요한 작업을 수행할 수 있습니다.`,
    detail: `${node.name} 화면은 특정 항목의 상세 정보를 조회하고, 권한이 있는 경우 수정하거나 삭제할 수 있는 화면입니다. 사용자는 이 화면에서 항목의 모든 세부 정보를 확인하고 필요한 작업을 수행할 수 있습니다.`,
    create: `${node.name} 화면은 새로운 항목을 등록하거나 생성하는 화면입니다. 사용자는 필요한 정보를 입력하고 유효성 검증을 거쳐 새로운 항목을 생성할 수 있습니다.`,
    dashboard: `${node.name} 화면은 시스템의 주요 정보와 통계를 한눈에 볼 수 있는 대시보드 화면입니다. 사용자는 이 화면에서 전체적인 현황을 파악하고 필요한 메뉴로 빠르게 이동할 수 있습니다.`,
    settings: `${node.name} 화면은 시스템 설정을 조회하고 수정할 수 있는 화면입니다. 사용자는 이 화면에서 자신의 권한에 맞는 설정을 변경할 수 있습니다.`
  }
  
  return descriptions[screenType] || `${node.name} 화면입니다.`
}

// 기능정의서 생성
const generateFunctionalSpec = (menuData: MenuNode[], projectName: string, author: string, division?: 'all' | 'FO' | 'BO'): string => {
  let screens = flattenMenuNodes(menuData)
  
  // division 필터링
  if (division && division !== 'all') {
    screens = screens.filter(screen => inferDivision(screen) === division)
  }
  const today = new Date().toISOString().split('T')[0]
  
  // division에 따라 제목 변경 (all인 경우 FO 기본값)
  const titlePrefix = division && division !== 'all' ? division : 'FO'
  let markdown = `# 01_${titlePrefix}_PCMobile 기능 정의서\n\n`
  markdown += `| 항목 | 내용 |\n`
  markdown += `|------|------|\n`
  markdown += `| 프로젝트명 | ${projectName} |\n`
  markdown += `| 작성일 | ${today} |\n`
  markdown += `| 작성자 | ${author} |\n`
  markdown += `| 버전 | v1.0 |\n\n`
  
  markdown += `## 버전 히스토리\n`
  markdown += `| 버전 | 작성일 | 작성자 | 변경 내용 |\n`
  markdown += `|------|--------|--------|-----------|\n`
  markdown += `| v1.0 | ${today} | ${author} | 초안 작성 |\n\n`
  markdown += `---\n\n`
  
  screens.forEach((screen, index) => {
    const screenType = inferScreenType(screen)
    const screenId = generateScreenId(screen, index)
    const functions = inferFunctions(screen, screenType)
    const mainFeatures = generateMainFeatures(functions)
    const description = generateDescription(screen, screenType)
    
    markdown += `## ${index + 1}. ${screen.name}\n\n`
    markdown += `### ${index + 1}.1 화면 정보\n`
    markdown += `- **화면ID**: ${screenId}\n`
    markdown += `- **화면명**: ${screen.name}\n\n`
    
    markdown += `### ${index + 1}.2 주요기능\n`
    mainFeatures.forEach(feature => {
      markdown += `- ${feature}\n`
    })
    markdown += `\n`
    
    markdown += `### ${index + 1}.3 화면 설명\n`
    markdown += `${description}\n\n`
    
    markdown += `### ${index + 1}.4 상세 기능 목록\n`
    markdown += `| 번호 | 구분 | 기능명 | 기능 설명 | 비고 |\n`
    markdown += `|------|------|--------|-----------|------|\n`
    functions.forEach(func => {
      markdown += `| ${func.number} | ${func.category} | ${func.name} | ${func.description} | ${func.note || ''} |\n`
    })
    markdown += `\n`
    
    markdown += `---\n\n`
  })
  
  return markdown
}

export function FunctionalSpecification({ onSave, onNextStep }: FunctionalSpecificationProps) {
  const [menuData, setMenuData] = useState<MenuNode[]>([])
  const [projectName, setProjectName] = useState('SI Project Manager')
  const [author, setAuthor] = useState('시스템 관리자')
  const [generatedSpec, setGeneratedSpec] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'FO' | 'BO'>('all')

  useEffect(() => {
    // 메뉴 데이터 로드
    const data = getMenuData()
    setMenuData(data)
  }, [])

  const handleGenerate = () => {
    setIsGenerating(true)
    setIsGenerated(false)
    
    // 비동기로 생성 (실제로는 더 복잡한 로직이 필요할 수 있음)
    setTimeout(() => {
      const spec = generateFunctionalSpec(menuData, projectName, author, activeTab)
      setGeneratedSpec(spec)
      setIsGenerating(false)
      setIsGenerated(true)
    }, 500)
  }

  const handleDownload = () => {
    const blob = new Blob([generatedSpec], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `01_PCMobile_기능정의서_v1.0.md`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleDownloadExcel = () => {
    const screens = flattenMenuNodes(menuData)
    let filteredScreens = screens
    
    // division 필터링
    if (activeTab && activeTab !== 'all') {
      filteredScreens = screens.filter(screen => inferDivision(screen) === activeTab)
    }
    
    const titlePrefix = activeTab && activeTab !== 'all' ? activeTab : 'FO'
    const today = new Date().toISOString().split('T')[0]
    
    // 워크북 생성
    const workbook = XLSX.utils.book_new()
    
    // 1. 프로젝트 정보 시트
    const projectInfo = [
      ['항목', '내용'],
      ['프로젝트명', projectName],
      ['작성일', today],
      ['작성자', author],
      ['버전', 'v1.0'],
      ['구분', titlePrefix]
    ]
    const projectSheet = XLSX.utils.aoa_to_sheet(projectInfo)
    XLSX.utils.book_append_sheet(workbook, projectSheet, '프로젝트 정보')
    
    // 2. 화면 목록 시트
    const screenList = [
      ['번호', '화면ID', '화면명', '구분', '주요기능', '화면 설명']
    ]
    
    filteredScreens.forEach((screen, index) => {
      const screenType = inferScreenType(screen)
      const screenId = generateScreenId(screen, index)
      const functions = inferFunctions(screen, screenType)
      const mainFeatures = generateMainFeatures(functions)
      const description = generateDescription(screen, screenType)
      const division = inferDivision(screen)
      
      screenList.push([
        index + 1,
        screenId,
        screen.name,
        division,
        mainFeatures.join(', '),
        description
      ])
    })
    
    const screenListSheet = XLSX.utils.aoa_to_sheet(screenList)
    // 컬럼 너비 설정
    screenListSheet['!cols'] = [
      { wch: 8 },  // 번호
      { wch: 20 }, // 화면ID
      { wch: 20 }, // 화면명
      { wch: 8 },  // 구분
      { wch: 40 }, // 주요기능
      { wch: 60 }  // 화면 설명
    ]
    XLSX.utils.book_append_sheet(workbook, screenListSheet, '화면 목록')
    
    // 3. 상세 기능 목록 시트
    const functionList = [
      ['화면ID', '화면명', '번호', '구분', '기능명', '기능 설명', '비고']
    ]
    
    filteredScreens.forEach((screen, screenIndex) => {
      const screenType = inferScreenType(screen)
      const screenId = generateScreenId(screen, screenIndex)
      const functions = inferFunctions(screen, screenType)
      
      functions.forEach((func, funcIndex) => {
        functionList.push([
          screenId,
          screen.name,
          func.number,
          func.category,
          func.name,
          func.description,
          func.note || ''
        ])
      })
    })
    
    const functionListSheet = XLSX.utils.aoa_to_sheet(functionList)
    // 컬럼 너비 설정
    functionListSheet['!cols'] = [
      { wch: 20 }, // 화면ID
      { wch: 20 }, // 화면명
      { wch: 8 },  // 번호
      { wch: 12 }, // 구분
      { wch: 25 }, // 기능명
      { wch: 50 }, // 기능 설명
      { wch: 20 }  // 비고
    ]
    XLSX.utils.book_append_sheet(workbook, functionListSheet, '상세 기능 목록')
    
    // 엑셀 파일 생성 및 다운로드
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(blob, `01_PCMobile_기능정의서_v1.0.xlsx`)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">기능정의서 자동생성</h1>
          <p className="text-gray-600 mt-2">메뉴 구조를 기반으로 기능정의서를 자동 생성합니다.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>프로젝트 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="projectName">프로젝트명</Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="프로젝트명을 입력하세요"
              />
            </div>
            <div>
              <Label htmlFor="author">작성자</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="작성자명을 입력하세요"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>메뉴 구조 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'FO' | 'BO')} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="FO">FO</TabsTrigger>
              <TabsTrigger value="BO">BO</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-0">
              <div className="space-y-2">
                {(() => {
                  const allScreens = flattenMenuNodes(menuData)
                  const filteredScreens = activeTab === 'all' 
                    ? allScreens 
                    : allScreens.filter(screen => inferDivision(screen) === activeTab)
                  
                  return (
                    <>
                      <p className="text-sm text-gray-600">
                        {activeTab === 'all' 
                          ? `총 ${allScreens.length}개의 화면이 감지되었습니다.`
                          : `${activeTab} 구분: ${filteredScreens.length}개의 화면이 감지되었습니다.`
                        }
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {filteredScreens.slice(0, 10).map((screen, idx) => (
                          <Badge key={screen.id} variant="outline">
                            {screen.name} ({inferDivision(screen)})
                          </Badge>
                        ))}
                        {filteredScreens.length > 10 && (
                          <Badge variant="outline">+{filteredScreens.length - 10}개 더</Badge>
                        )}
                      </div>
                    </>
                  )
                })()}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || menuData.length === 0}
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              생성 중...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              기능정의서 생성
            </>
          )}
        </Button>
        
        {isGenerated && (
          <>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Markdown 다운로드
            </Button>
            <Button
              onClick={handleDownloadExcel}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel 다운로드
            </Button>
          </>
        )}
      </div>

      {isGenerated && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              생성된 기능정의서
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertDescription>
                기능정의서가 성공적으로 생성되었습니다. 다운로드 버튼을 클릭하여 Markdown 파일 또는 Excel 파일로 저장하세요.
              </AlertDescription>
            </Alert>
            <Tabs value={activeTab} onValueChange={(value) => {
              setActiveTab(value as 'all' | 'FO' | 'BO')
              // 탭 변경 시 해당 division의 기능정의서 재생성
              const spec = generateFunctionalSpec(menuData, projectName, author, value as 'all' | 'FO' | 'BO')
              setGeneratedSpec(spec)
            }} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="all">전체</TabsTrigger>
                <TabsTrigger value="FO">FO</TabsTrigger>
                <TabsTrigger value="BO">BO</TabsTrigger>
              </TabsList>
              <TabsContent value={activeTab} className="mt-0">
                <div className="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
                  <pre className="text-xs whitespace-pre-wrap font-mono">
                    {generatedSpec}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onSave}>
          저장
        </Button>
        <Button onClick={onNextStep}>
          다음 단계
        </Button>
      </div>
    </div>
  )
}

