import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { 
  FileText, 
  Building, 
  Code, 
  Database, 
  Zap, 
  Save, 
  Download,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Table,
  Link,
  Image,
  Eye,
  Edit3
} from 'lucide-react'

interface Document {
  id: string
  name: string
  type: 'requirement' | 'design' | 'api' | 'database' | 'test'
  content: string
  lastModified: string
  status: 'draft' | 'review' | 'approved'
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: '요구사항 명세서',
    type: 'requirement',
    content: `# 요구사항 명세서

## 1. 프로젝트 개요
- **프로젝트명**: SI Project Management Dashboard
- **개발기간**: 2024.01.01 ~ 2024.06.30
- **개발팀**: SI개발팀

## 2. 기능 요구사항

### 2.1 사용자 관리
- 사용자 등록/수정/삭제
- 권한 관리 (관리자, 일반사용자)
- 로그인/로그아웃

### 2.2 프로젝트 관리
- 프로젝트 생성/수정/삭제
- 프로젝트 상태 관리
- 진행률 추적

### 2.3 대시보드
- 프로젝트 현황 조회
- 통계 정보 표시
- 알림 기능

## 3. 비기능 요구사항
- **성능**: 응답시간 3초 이내
- **보안**: 사용자 인증 및 권한 관리
- **호환성**: Chrome, Firefox, Safari 지원`,
    lastModified: '2024-02-21 15:30',
    status: 'approved'
  },
  {
    id: '2',
    name: '시스템 설계서',
    type: 'design',
    content: `# 시스템 설계서

## 1. 아키텍처 개요
- **아키텍처 패턴**: MVC (Model-View-Controller)
- **프론트엔드**: React + TypeScript
- **백엔드**: Node.js + Express
- **데이터베이스**: PostgreSQL

## 2. 데이터베이스 설계

### 2.1 사용자 테이블 (users)
| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | SERIAL | PRIMARY KEY | 사용자 ID |
| username | VARCHAR(50) | UNIQUE, NOT NULL | 사용자명 |
| email | VARCHAR(100) | UNIQUE, NOT NULL | 이메일 |
| password | VARCHAR(255) | NOT NULL | 비밀번호 |
| role | VARCHAR(20) | NOT NULL | 권한 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일시 |

### 2.2 프로젝트 테이블 (projects)
| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | SERIAL | PRIMARY KEY | 프로젝트 ID |
| name | VARCHAR(100) | NOT NULL | 프로젝트명 |
| description | TEXT | | 설명 |
| status | VARCHAR(20) | NOT NULL | 상태 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일시 |

## 3. API 설계
- **Base URL**: /api/v1
- **인증**: JWT Token
- **응답 형식**: JSON`,
    lastModified: '2024-02-21 14:20',
    status: 'review'
  },
  {
    id: '3',
    name: 'API 명세서',
    type: 'api',
    content: `# API 명세서

## 1. 인증 API

### POST /api/auth/login
사용자 로그인

**Request Body:**
\`\`\`json
{
  "username": "string",
  "password": "string"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "token": "jwt_token",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
\`\`\`

## 2. 프로젝트 API

### GET /api/projects
프로젝트 목록 조회

**Query Parameters:**
- page: 페이지 번호 (기본값: 1)
- limit: 페이지당 항목 수 (기본값: 10)
- status: 프로젝트 상태 필터

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": 1,
        "name": "프로젝트명",
        "description": "설명",
        "status": "active",
        "created_at": "2024-02-21T15:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
\`\`\`

### POST /api/projects
프로젝트 생성

**Request Body:**
\`\`\`json
{
  "name": "string",
  "description": "string",
  "status": "string"
}
\`\`\``,
    lastModified: '2024-02-21 13:45',
    status: 'draft'
  },
  {
    id: '4',
    name: '데이터베이스 설계서',
    type: 'database',
    content: `# 데이터베이스 설계서

## 1. ERD (Entity Relationship Diagram)

\`\`\`
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Users    │    │  Projects   │    │   Tasks     │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ id (PK)     │    │ id (PK)     │    │ id (PK)     │
│ username    │    │ name        │    │ title       │
│ email       │    │ description │    │ description │
│ password    │    │ status      │    │ status      │
│ role        │    │ created_at  │    │ project_id  │
│ created_at  │    └─────────────┘    │ user_id     │
└─────────────┘           │           │ created_at  │
         │                │           └─────────────┘
         │                │                   │
         └────────────────┼───────────────────┘
                         │
                    ┌─────────────┐
                    │ ProjectUser │
                    ├─────────────┤
                    │ project_id  │
                    │ user_id     │
                    │ role        │
                    └─────────────┘
\`\`\`

## 2. 테이블 상세 설계

### 2.1 users 테이블
- **목적**: 사용자 정보 관리
- **인덱스**: username, email (UNIQUE)

### 2.2 projects 테이블
- **목적**: 프로젝트 정보 관리
- **인덱스**: name, status

### 2.3 tasks 테이블
- **목적**: 작업 정보 관리
- **외래키**: project_id → projects.id, user_id → users.id

## 3. 데이터 타입 정의
- **SERIAL**: 자동 증가 정수
- **VARCHAR(n)**: 가변 길이 문자열 (최대 n자)
- **TEXT**: 긴 텍스트
- **TIMESTAMP**: 날짜와 시간`,
    lastModified: '2024-02-21 12:15',
    status: 'approved'
  },
  {
    id: '5',
    name: '테스트 계획서',
    type: 'test',
    content: `# 테스트 계획서

## 1. 테스트 개요
- **테스트 목적**: SI Project Management Dashboard의 품질 보증
- **테스트 범위**: 전체 시스템 기능
- **테스트 기간**: 2024.06.01 ~ 2024.06.15

## 2. 테스트 유형

### 2.1 단위 테스트 (Unit Test)
- **대상**: 개별 함수, 메서드
- **도구**: Jest, React Testing Library
- **목표 커버리지**: 80% 이상

### 2.2 통합 테스트 (Integration Test)
- **대상**: 모듈 간 연동
- **도구**: Supertest
- **시나리오**: API 엔드포인트 테스트

### 2.3 시스템 테스트 (System Test)
- **대상**: 전체 시스템
- **도구**: Cypress
- **시나리오**: 사용자 시나리오 기반

### 2.4 사용자 수용 테스트 (UAT)
- **대상**: 실제 사용자
- **방법**: 베타 테스트
- **기간**: 1주일

## 3. 테스트 케이스

### 3.1 로그인 기능
| 테스트 ID | 테스트 케이스 | 예상 결과 |
|-----------|---------------|-----------|
| TC001 | 유효한 계정으로 로그인 | 로그인 성공 |
| TC002 | 잘못된 비밀번호로 로그인 | 로그인 실패 |
| TC003 | 존재하지 않는 계정으로 로그인 | 로그인 실패 |

### 3.2 프로젝트 관리
| 테스트 ID | 테스트 케이스 | 예상 결과 |
|-----------|---------------|-----------|
| TC004 | 새 프로젝트 생성 | 프로젝트 생성 성공 |
| TC005 | 프로젝트 정보 수정 | 수정 성공 |
| TC006 | 프로젝트 삭제 | 삭제 성공 |`,
    lastModified: '2024-02-21 11:30',
    status: 'draft'
  }
]

interface DocumentEditorProps {
  onSave?: () => void
  onNextStep?: () => void
}

export function DocumentEditor({ onSave, onNextStep }: DocumentEditorProps) {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const [selectedDoc, setSelectedDoc] = useState<Document>(documents[0])
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(selectedDoc.content)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')

  // localStorage에서 저장된 문서 데이터 복원
  useEffect(() => {
    try {
      const stored = localStorage.getItem('documentEditorData')
      if (stored) {
        const data = JSON.parse(stored)
        if (data.documents && data.documents.length > 0) {
          setDocuments(data.documents)
          if (data.selectedDocId) {
            const doc = data.documents.find((d: Document) => d.id === data.selectedDocId)
            if (doc) {
              setSelectedDoc(doc)
              setContent(doc.content)
            }
          }
          console.log('문서 편집 데이터가 복원되었습니다.')
        }
      }
    } catch (error) {
      console.error('문서 편집 데이터 복원 오류:', error)
    }
  }, [])

  // documents가 업데이트되면 현재 선택된 문서의 content도 업데이트 (자동 업데이트 후 반영)
  useEffect(() => {
    if (documents.length > 0 && selectedDoc.id) {
      const currentDoc = documents.find(doc => doc.id === selectedDoc.id)
      if (currentDoc && currentDoc.content !== selectedDoc.content) {
        // documents 배열의 문서가 업데이트되었지만 selectedDoc와 content가 아직 반영되지 않은 경우
        setContent(currentDoc.content)
        setSelectedDoc(currentDoc)
      }
    }
  }, [documents, selectedDoc.id])

  // 문서 내용이 변경될 때마다 localStorage에 자동 저장
  useEffect(() => {
    if (documents.length > 0 && content !== selectedDoc.content) {
      try {
        // 현재 선택된 문서의 내용도 업데이트
        const updatedDocs = documents.map(doc => 
          doc.id === selectedDoc.id ? { ...doc, content, lastModified: new Date().toLocaleString('ko-KR') } : doc
        )
        
        const documentData = {
          documents: updatedDocs,
          selectedDocId: selectedDoc.id,
          savedAt: new Date().toISOString()
        }
        localStorage.setItem('documentEditorData', JSON.stringify(documentData))
        
        // documents 상태도 업데이트 (무한 루프 방지)
        setDocuments(prevDocs => {
          const hasChanges = prevDocs.some((doc, idx) => 
            doc.id === updatedDocs[idx]?.id && doc.content !== updatedDocs[idx]?.content
          )
          return hasChanges ? updatedDocs : prevDocs
        })
        
        // selectedDoc도 업데이트
        const updatedDoc = updatedDocs.find(doc => doc.id === selectedDoc.id)
        if (updatedDoc && updatedDoc.content !== selectedDoc.content) {
          setSelectedDoc(updatedDoc)
        }
      } catch (error) {
        console.error('문서 편집 데이터 자동 저장 오류:', error)
      }
    }
  }, [content])

  // 이전 프로세스 데이터로 문서 자동 업데이트
  useEffect(() => {
    try {
      const promptStored = localStorage.getItem('figmaMakePromptState')
      if (promptStored) {
        const promptData = JSON.parse(promptStored)
        
        // 자동 업데이트 플래그 확인
        if (promptData.shouldAutoUpdateDocument) {
          setDocuments(prevDocuments => {
            const updatedDocs = [...prevDocuments]
            const currentSelectedDocId = selectedDoc.id
            
            // 1. 요구사항 명세서 업데이트 (id: '1')
            try {
              const requirementsStored = localStorage.getItem('requirementsData')
              if (requirementsStored) {
                const requirementsData = JSON.parse(requirementsStored)
                if (requirementsData.requirements && requirementsData.requirements.length > 0) {
                  let requirementContent = `# 요구사항 명세서\n\n`
                  requirementContent += `## 1. 프로젝트 개요\n`
                  requirementContent += `- **작성일**: ${new Date().toLocaleDateString('ko-KR')}\n`
                  requirementContent += `- **총 요구사항 수**: ${requirementsData.requirements.length}개\n\n`
                  
                  requirementContent += `## 2. 기능 요구사항\n\n`
                  
                  // 서비스 타입별로 그룹화
                  const byServiceType: Record<string, any[]> = {}
                  requirementsData.requirements.forEach((req: any) => {
                    const type = req.serviceType || '기타'
                    if (!byServiceType[type]) byServiceType[type] = []
                    byServiceType[type].push(req)
                  })
                  
                  Object.keys(byServiceType).forEach(serviceType => {
                    requirementContent += `### 2.${Object.keys(byServiceType).indexOf(serviceType) + 1} ${serviceType} 요구사항\n\n`
                    byServiceType[serviceType].forEach((req: any, idx: number) => {
                      requirementContent += `#### ${req.reqId || `REQ-${idx + 1}`}: ${req.name}\n`
                      requirementContent += `- **우선순위**: ${req.priority || 'Medium'}\n`
                      requirementContent += `- **상세설명**: ${req.description || ''}\n`
                      requirementContent += `- **예상 작업량**: ${req.estimatedHours || 0}시간\n\n`
                    })
                  })
                  
                  const reqDocIndex = updatedDocs.findIndex(doc => doc.id === '1')
                  if (reqDocIndex >= 0) {
                    updatedDocs[reqDocIndex] = {
                      ...updatedDocs[reqDocIndex],
                      content: requirementContent,
                      lastModified: new Date().toLocaleString('ko-KR')
                    }
                  }
                }
              }
            } catch (error) {
              console.error('요구사항 명세서 업데이트 오류:', error)
            }
            
            // 2. 시스템 설계서 업데이트 (id: '2')
            try {
              const functionalSpecStored = localStorage.getItem('functionalSpecificationData')
              const menuStored = localStorage.getItem('menuStructureData')
              
              if (functionalSpecStored || menuStored) {
                let designContent = `# 시스템 설계서\n\n`
                designContent += `## 1. 아키텍처 개요\n`
                designContent += `- **프로젝트명**: ${functionalSpecStored ? JSON.parse(functionalSpecStored).projectName || 'SI Project Manager' : 'SI Project Manager'}\n`
                designContent += `- **작성일**: ${new Date().toLocaleDateString('ko-KR')}\n\n`
                
                if (menuStored) {
                  const menuData = JSON.parse(menuStored)
                  if (menuData.menuData && menuData.menuData.length > 0) {
                    designContent += `## 2. 메뉴 구조\n\n`
                    
                    const flattenMenu = (nodes: any[], depth: number = 1): string => {
                      let result = ''
                      nodes.forEach(node => {
                        const prefix = '  '.repeat(depth - 1) + '- '
                        result += `${prefix}${node.name} (${node.screenName || '/'})\n`
                        if (node.children && node.children.length > 0) {
                          result += flattenMenu(node.children, depth + 1)
                        }
                      })
                      return result
                    }
                    
                    designContent += flattenMenu(menuData.menuData)
                    designContent += `\n`
                  }
                }
                
                if (functionalSpecStored) {
                  const funcSpecData = JSON.parse(functionalSpecStored)
                  if (funcSpecData.screens && funcSpecData.screens.length > 0) {
                    designContent += `## 3. 화면별 기능 설계\n\n`
                    funcSpecData.screens.forEach((screen: any, idx: number) => {
                      designContent += `### 3.${idx + 1} ${screen.name}\n`
                      designContent += `- **화면 ID**: ${screen.screenId || ''}\n`
                      designContent += `- **구분**: ${screen.division || 'FO'}\n`
                      designContent += `- **경로**: ${screen.depth1 || ''} > ${screen.depth2 || ''} > ${screen.depth3 || ''}\n`
                      if (screen.functions && screen.functions.length > 0) {
                        designContent += `- **주요 기능**:\n`
                        screen.functions.forEach((func: any) => {
                          designContent += `  - ${func.name}: ${func.description}\n`
                        })
                      }
                      designContent += `\n`
                    })
                  }
                }
                
                const designDocIndex = updatedDocs.findIndex(doc => doc.id === '2')
                if (designDocIndex >= 0) {
                  updatedDocs[designDocIndex] = {
                    ...updatedDocs[designDocIndex],
                    content: designContent,
                    lastModified: new Date().toLocaleString('ko-KR')
                  }
                }
              }
            } catch (error) {
              console.error('시스템 설계서 업데이트 오류:', error)
            }
            
            // 3. API 명세서 업데이트 (id: '3')
            try {
              const requirementsStored = localStorage.getItem('requirementsData')
              if (requirementsStored) {
                const requirementsData = JSON.parse(requirementsStored)
                const apiRequirements = requirementsData.requirements?.filter((req: any) => 
                  req.serviceType === 'API' || req.serviceType === 'API/RFC'
                ) || []
                
                if (apiRequirements.length > 0) {
                  let apiContent = `# API 명세서\n\n`
                  apiContent += `## 1. API 개요\n`
                  apiContent += `- **Base URL**: /api/v1\n`
                  apiContent += `- **인증**: JWT Token\n`
                  apiContent += `- **응답 형식**: JSON\n\n`
                  
                  apiContent += `## 2. API 목록\n\n`
                  apiRequirements.forEach((req: any, idx: number) => {
                    apiContent += `### 2.${idx + 1} ${req.name}\n`
                    apiContent += `**요구사항 ID**: ${req.reqId || `REQ-${idx + 1}`}\n\n`
                    apiContent += `**설명**: ${req.description || ''}\n\n`
                    apiContent += `**우선순위**: ${req.priority || 'Medium'}\n\n`
                    apiContent += `---\n\n`
                  })
                  
                  const apiDocIndex = updatedDocs.findIndex(doc => doc.id === '3')
                  if (apiDocIndex >= 0) {
                    updatedDocs[apiDocIndex] = {
                      ...updatedDocs[apiDocIndex],
                      content: apiContent,
                      lastModified: new Date().toLocaleString('ko-KR')
                    }
                  }
                }
              }
            } catch (error) {
              console.error('API 명세서 업데이트 오류:', error)
            }
            
            // 4. 데이터베이스 설계서 업데이트 (id: '4')
            try {
              const functionalSpecStored = localStorage.getItem('functionalSpecificationData')
              const requirementsStored = localStorage.getItem('requirementsData')
              
              if (functionalSpecStored || requirementsStored) {
                let dbContent = `# 데이터베이스 설계서\n\n`
                dbContent += `## 1. 데이터베이스 개요\n`
                dbContent += `- **DBMS**: PostgreSQL\n`
                dbContent += `- **작성일**: ${new Date().toLocaleDateString('ko-KR')}\n\n`
                
                dbContent += `## 2. 주요 엔티티\n\n`
                dbContent += `### 2.1 요구사항 기반 엔티티\n\n`
                
                if (requirementsStored) {
                  const requirementsData = JSON.parse(requirementsStored)
                  if (requirementsData.requirements && requirementsData.requirements.length > 0) {
                    const entities = new Set<string>()
                    requirementsData.requirements.forEach((req: any) => {
                      // 요구사항명에서 엔티티 추출 (간단한 추론)
                      const name = req.name.toLowerCase()
                      if (name.includes('사용자') || name.includes('회원')) entities.add('users')
                      if (name.includes('프로젝트')) entities.add('projects')
                      if (name.includes('작업') || name.includes('태스크')) entities.add('tasks')
                      if (name.includes('파일') || name.includes('문서')) entities.add('files')
                    })
                    
                    Array.from(entities).forEach((entity, idx) => {
                      dbContent += `#### ${entity} 테이블\n`
                      dbContent += `| 컬럼명 | 타입 | 제약조건 | 설명 |\n`
                      dbContent += `|--------|------|----------|------|\n`
                      dbContent += `| id | SERIAL | PRIMARY KEY | ${entity} ID |\n`
                      dbContent += `| created_at | TIMESTAMP | DEFAULT NOW() | 생성일시 |\n`
                      dbContent += `| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일시 |\n\n`
                    })
                  }
                }
                
                const dbDocIndex = updatedDocs.findIndex(doc => doc.id === '4')
                if (dbDocIndex >= 0) {
                  updatedDocs[dbDocIndex] = {
                    ...updatedDocs[dbDocIndex],
                    content: dbContent,
                    lastModified: new Date().toLocaleString('ko-KR')
                  }
                }
              }
            } catch (error) {
              console.error('데이터베이스 설계서 업데이트 오류:', error)
            }
            
            // 5. 테스트 계획서 업데이트 (id: '5')
            try {
              const wbsStored = localStorage.getItem('wbsData')
              if (wbsStored) {
                const wbsData = JSON.parse(wbsStored)
                if (wbsData.functions && wbsData.functions.length > 0) {
                  let testContent = `# 테스트 계획서\n\n`
                  testContent += `## 1. 테스트 개요\n`
                  testContent += `- **테스트 목적**: 프로젝트 품질 보증\n`
                  testContent += `- **작성일**: ${new Date().toLocaleDateString('ko-KR')}\n`
                  testContent += `- **총 기능 수**: ${wbsData.functions.length}개\n\n`
                  
                  testContent += `## 2. 기능별 테스트 계획\n\n`
                  wbsData.functions.forEach((func: any, idx: number) => {
                    testContent += `### 2.${idx + 1} ${func.name} (${func.functionId || `FN-${idx + 1}`})\n`
                    testContent += `- **설명**: ${func.description || ''}\n`
                    testContent += `- **우선순위**: ${func.priority || 'Medium'}\n`
                    if (func.tasks && func.tasks.length > 0) {
                      testContent += `- **작업 수**: ${func.tasks.length}개\n`
                    }
                    testContent += `\n`
                  })
                  
                  testContent += `## 3. 테스트 유형\n\n`
                  testContent += `### 3.1 단위 테스트\n`
                  testContent += `- **대상**: 개별 함수, 메서드\n`
                  testContent += `- **도구**: Jest, React Testing Library\n\n`
                  testContent += `### 3.2 통합 테스트\n`
                  testContent += `- **대상**: 모듈 간 연동\n`
                  testContent += `- **도구**: Supertest\n\n`
                  testContent += `### 3.3 시스템 테스트\n`
                  testContent += `- **대상**: 전체 시스템\n`
                  testContent += `- **도구**: Cypress\n\n`
                  
                  const testDocIndex = updatedDocs.findIndex(doc => doc.id === '5')
                  if (testDocIndex >= 0) {
                    updatedDocs[testDocIndex] = {
                      ...updatedDocs[testDocIndex],
                      content: testContent,
                      lastModified: new Date().toLocaleString('ko-KR')
                    }
                  }
                }
              }
            } catch (error) {
              console.error('테스트 계획서 업데이트 오류:', error)
            }
            
            // 플래그 제거
            promptData.shouldAutoUpdateDocument = false
            localStorage.setItem('figmaMakePromptState', JSON.stringify(promptData))
            
            console.log('모든 문서가 이전 프로세스 데이터로 자동 업데이트되었습니다.')
            
            // 현재 선택된 문서가 업데이트되었다면 content와 selectedDoc도 즉시 업데이트
            const updatedDoc = updatedDocs.find(doc => doc.id === currentSelectedDocId)
            if (updatedDoc) {
              // setState는 비동기이므로 즉시 반영을 위해 setTimeout 사용
              setTimeout(() => {
                setContent(updatedDoc.content)
                setSelectedDoc(updatedDoc)
              }, 0)
            }
            
            return updatedDocs
          })
        }
      }
    } catch (error) {
      console.error('문서 자동 업데이트 오류:', error)
    }
  }, [])

  const updateDocument = (docId: string, newContent: string) => {
    const updatedDocs = documents.map(doc => 
      doc.id === docId 
        ? { ...doc, content: newContent, lastModified: new Date().toLocaleString('ko-KR') }
        : doc
    )
    setDocuments(updatedDocs)
    setSelectedDoc(updatedDocs.find(doc => doc.id === docId) || selectedDoc)
  }

  const handleSave = () => {
    updateDocument(selectedDoc.id, content)
    setIsEditing(false)
    alert('문서가 저장되었습니다.')
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${selectedDoc.name}.md`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportAll = () => {
    const allDocuments = documents.map(doc => ({
      name: doc.name,
      content: doc.content,
      lastModified: doc.lastModified
    }))
    
    const exportData = {
      project: 'SI Project Management Dashboard',
      exportDate: new Date().toISOString(),
      documents: allDocuments
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'project-documents.json')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDocumentSelect = (doc: Document) => {
    setSelectedDoc(doc)
    setContent(doc.content)
    setIsEditing(false)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'requirement': return <FileText className="w-4 h-4" />
      case 'design': return <Building className="w-4 h-4" />
      case 'api': return <Code className="w-4 h-4" />
      case 'database': return <Database className="w-4 h-4" />
      case 'test': return <Zap className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }


  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || doc.type === filterType
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">개발 문서</h2>
          <p className="text-gray-600 mt-1">
            프로젝트 개발 과정에서 생성되는 모든 문서를 관리하고 편집할 수 있습니다
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => {
              // 문서 편집 데이터를 localStorage에 저장
              try {
                const documentData = {
                  documents,
                  selectedDocId: selectedDoc.id,
                  savedAt: new Date().toISOString(),
                  shouldAutoUpdateGuide: true // 개발가이드 페이지에 자동 반영 플래그
                }
                localStorage.setItem('documentEditorData', JSON.stringify(documentData))
                console.log('문서 편집 데이터가 localStorage에 저장되었습니다.')
              } catch (error) {
                console.error('문서 편집 데이터 저장 오류:', error)
              }
              
              onSave?.()
              onNextStep?.()
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            저장 및 다음 단계
          </Button>
          <Button variant="outline" onClick={handleExportAll}>
            <Download className="w-4 h-4 mr-2" />
            전체 내보내기
          </Button>
          <Button onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            다운로드
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Document List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>문서 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="문서 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <Label>문서 유형</Label>
                  <select
                    className="w-full mt-1 p-2 border rounded-md"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">전체</option>
                    <option value="requirement">요구사항</option>
                    <option value="design">설계</option>
                    <option value="api">API</option>
                    <option value="database">데이터베이스</option>
                    <option value="test">테스트</option>
                  </select>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                        selectedDoc.id === doc.id ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => handleDocumentSelect(doc)}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        {getTypeIcon(doc.type)}
                        <h3 className="font-medium text-sm">{doc.name}</h3>
                      </div>
                      <div className="flex items-center justify-end">
                        <span className="text-xs text-gray-500">{doc.lastModified}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(selectedDoc.type)}
                  <CardTitle>{selectedDoc.name}</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
                        저장
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        <Eye className="w-4 h-4 mr-2" />
                        미리보기
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      편집
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg">
                    <Button size="sm" variant="outline">
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Underline className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-6 bg-gray-300" />
                    <Button size="sm" variant="outline">
                      <List className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <ListOrdered className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Table className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Link className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Image className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="w-full aspect-square overflow-hidden">
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full h-full font-mono text-sm resize-none overflow-y-auto"
                      placeholder="마크다운 형식으로 문서를 작성하세요..."
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-square overflow-hidden">
                  <div className="w-full h-full overflow-y-auto prose max-w-none">
                    <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg">
                      {content}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  )
}