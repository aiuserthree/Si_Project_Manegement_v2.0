# SI Project Manager 플랫폼 완성 프롬프트

## 🎯 프로젝트 개요

**SI Project Manager**는 AI 기반 SI 프로젝트 워크플로우 자동화 플랫폼으로, 7단계 순차적 프로세스를 통해 자유형식 요구사항부터 개발 가이드까지 완전한 문서화 체계를 제공합니다.

### 현재 구현 상태
- ✅ **React + Vite + TypeScript** 기반 프론트엔드
- ✅ **Shadcn/ui + Tailwind CSS** UI 컴포넌트 시스템
- ✅ **7단계 워크플로우** UI 구현 완료
- ✅ **PhaseTracker** 진행 상태 표시
- ✅ **MainLayout** 통합 레이아웃
- ✅ **StepNavigation** 단계별 네비게이션

## 🚀 구현 완료된 기능들

### 1. Step 1: FileUpload 컴포넌트
```typescript
// 구현된 기능:
- 드래그&드롭 파일 업로드
- 다중 파일 형식 지원 (Excel, Word, PDF, 이미지)
- 업로드 진행률 표시
- 파일 미리보기 및 삭제
- 파일 크기 및 형식 표시
```

### 2. Step 2: Questionnaire 컴포넌트
```typescript
// 구현 예정 기능:
- 업계 표준 질의서 자동 생성
- 실시간 편집 가능한 폼
- 질문 카테고리화 (필수/선택/권장)
- 자동 저장 (3초 디바운싱)
```

### 3. Step 3: RequirementsDefinition 컴포넌트
```typescript
// 구현된 기능:
- 요구사항 테이블 UI
- 서비스 구분 (F/O, B/O, API/RFC, AI)
- 우선순위 설정 (High/Medium/Low)
- 상태 관리 (진행중/완료/보류)
- AI 분석 상태 표시
- 예상 작업 시간 추정
- 검색 및 필터링
- Excel import/export 기능
```

### 4. Step 4: MenuStructure 컴포넌트
```typescript
// 구현 예정 기능:
- 5단계 메뉴 계층 구조
- 트리 뷰 에디터
- 드래그&드롭 재배치
- 접근 권한 설정
- 관리 기능 토글
```

### 5. Step 5: IADesign 컴포넌트 (대부분 구현됨)
```typescript
// 구현된 기능:
- 드래그앤드롭 와이어프레임 빌더
- 8개 카테고리 컴포넌트 라이브러리
- 실시간 컴포넌트 편집
- IA Code 자동 생성 시스템
- 요구사항 자동 매핑
- 반응형 캔버스 (PC/Tablet/Mobile)
- 그리드 시스템 (1x1 ~ 4x4)
- 컴포넌트 이동/리사이즈
- 속성 패널 편집
- 전체화면 모드
- 줌 인/아웃 기능
```

### 6. Step 6: DocumentEditor 컴포넌트
```typescript
// 구현 예정 기능:
- 5종 개발 문서 편집
- 프로젝트 명세서
- 시스템 아키텍처
- 기술 스택
- ERD
- API 명세서
- 마크다운/리치텍스트 에디터
```

### 7. Step 7: DevelopmentGuide 컴포넌트
```typescript
// 구현 예정 기능:
- Cursor IDE 개발 가이드 생성
- 화면별 컴포넌트 명세
- 코드 템플릿
- 데이터베이스 가이드
- 테스트 시나리오
```

## 📋 Cursor 명령 프롬프트

### 기본 설정 및 초기화
```bash
# 프로젝트 기술 스택 확인
- React 18.3.1 + Vite 6.3.5 + TypeScript
- Shadcn/ui + Tailwind CSS
- Lucide React 아이콘
- React Hook Form + Zod
- React RND (드래그앤드롭)

# 현재 패키지.json 의존성
@radix-ui/* (모든 UI 컴포넌트)
react-hook-form, react-rnd, recharts
class-variance-authority, clsx, tailwind-merge
```

### 1. 컴포넌트 라이브러리 확장
```typescript
// IADesign 컴포넌트의 컴포넌트 라이브러리 확장 요청
"현재 IADesign.tsx에 구현된 componentLibrary를 확장해주세요:

1. 각 카테고리별 컴포넌트 추가:
   - layout: container, section, wrapper
   - navigation: dropdown, breadcrumb, pagination
   - input: checkbox, radio, select, datepicker
   - button: primary, secondary, icon, toggle
   - popup: modal, tooltip, notification
   - media: video, audio, gallery
   - state: loading, error, empty, success
   - data: chart, table, list, card

2. 각 컴포넌트에 다음 속성 추가:
   - 기본 크기 (width, height)
   - 색상 테마 (primary, secondary, accent)
   - 아이콘 매핑
   - 설명 텍스트
   - IA Code 템플릿"
```

### 2. 요구사항 정의서 고도화
```typescript
// RequirementsDefinition 컴포넌트 기능 확장
"현재 RequirementsDefinition.tsx를 다음과 같이 개선해주세요:

1. AI 자동 분석 기능:
   - 질의서 답변 기반 요구사항 자동 도출
   - 서비스 구분 자동 분류
   - 우선순위 자동 제안
   - 예상 작업 시간 AI 추정

2. 고급 편집 기능:
   - 인라인 셀 편집
   - 행 추가/삭제/복사
   - 정렬 및 필터링
   - 검색 기능 강화
   - Excel import/export

3. 데이터 검증:
   - 필수 필드 검증
   - 중복 요구사항 ID 체크
   - 형식 검증 (REQ-001 형식)
   - 자동 저장 기능"
```

### 3. 메뉴구조도 컴포넌트 구현
```typescript
// MenuStructure 컴포넌트 새로 구현
"새로운 MenuStructure.tsx 컴포넌트를 구현해주세요:

1. 5단계 메뉴 계층 구조:
   - 1-5 Depth 메뉴명 입력
   - 화면명 자동 생성
   - 접근 권한 (전체/로그인)
   - 관리 기능 (Y/N)

2. 트리 뷰 에디터:
   - 계층적 트리 구조 표시
   - 드래그&드롭으로 메뉴 재배치
   - 노드 추가/삭제/편집
   - 접기/펼치기 기능

3. 요구사항 연동:
   - 요구사항 ID 자동 매핑
   - F/O, B/O 자동 구분
   - 관련 요구사항 표시

4. Export 기능:
   - Excel 다운로드
   - JSON 형식 내보내기"
```

### 4. 질의서 컴포넌트 구현
```typescript
// Questionnaire 컴포넌트 새로 구현
"새로운 Questionnaire.tsx 컴포넌트를 구현해주세요:

1. 질의서 구조:
   - 프로젝트 개요 (목적, 사용자 규모, 일정)
   - 기능 요구사항 (핵심 기능, 권한, 연동)
   - 비기능 요구사항 (성능, 보안, 확장성)

2. AI 자동 생성:
   - 업로드 파일 분석 기반 질문 생성
   - 업계별 맞춤 질문 템플릿
   - 질문 카테고리화 (필수/선택/권장)

3. 편집 기능:
   - 실시간 폼 편집
   - 질문 추가/삭제/수정
   - 답변 자동 저장 (디바운싱)
   - 진행률 표시

4. 검증 및 완성도:
   - 필수 질문 답변 체크
   - 완성도 퍼센트 표시
   - 다음 단계 활성화 조건"
```

### 5. 문서 에디터 컴포넌트 구현
```typescript
// DocumentEditor 컴포넌트 새로 구현
"새로운 DocumentEditor.tsx 컴포넌트를 구현해주세요:

1. 5종 개발 문서:
   - 프로젝트 명세서
   - 시스템 아키텍처
   - 기술 스택
   - ERD
   - API 명세서

2. 문서별 독립 에디터:
   - 마크다운/리치텍스트 에디터
   - 다이어그램 도구 (Mermaid)
   - 코드 블록 지원
   - 이미지 업로드

3. AI 자동 생성:
   - 이전 단계 문서 통합 분석
   - 업계 표준 템플릿 적용
   - 기술 스택 자동 추천

4. Export 기능:
   - PDF/Word 다운로드
   - 마크다운 내보내기
   - 버전 관리"
```

### 6. 개발 가이드 컴포넌트 구현
```typescript
// DevelopmentGuide 컴포넌트 새로 구현
"새로운 DevelopmentGuide.tsx 컴포넌트를 구현해주세요:

1. 통합 분석 및 가이드 생성:
   - 요구사항 정의서 분석
   - 메뉴구조도 분석
   - IA 및 화면설계 분석
   - 5종 개발 문서 분석

2. 화면별 개발 가이드:
   - IA Code별 컴포넌트 명세
   - 상태 관리 로직
   - API 연동 방법
   - 이벤트 핸들링

3. 코드 템플릿:
   - React 컴포넌트 템플릿
   - API 서비스 템플릿
   - 테스트 코드 템플릿

4. Cursor IDE 연동:
   - 프로젝트 구조 export
   - 의존성 목록
   - 환경 설정 파일
   - 개발 순서 가이드"
```

### 7. 데이터 관리 및 상태 관리
```typescript
// 전역 상태 관리 구현
"Zustand를 사용한 전역 상태 관리를 구현해주세요:

1. 프로젝트 상태:
   - 현재 단계
   - 단계별 완료 상태
   - 전체 진행률

2. 데이터 상태:
   - 업로드된 파일들
   - 질의서 답변
   - 요구사항 목록
   - 메뉴 구조
   - IA 설계 데이터
   - 개발 문서들

3. UI 상태:
   - 로딩 상태
   - 에러 상태
   - 저장 상태
   - 편집 모드

4. 자동 저장:
   - 로컬 스토리지 백업
   - 실시간 저장
   - 변경 감지"
```

### 8. AI 연동 및 자동화
```typescript
// AI 기능 구현
"OpenAI API 연동을 구현해주세요:

1. 파일 분석 AI:
   - 업로드 파일 내용 분석
   - 핵심 요구사항 추출
   - 업계별 패턴 인식

2. 질의서 생성 AI:
   - 누락 정보 파악
   - 맞춤 질문 생성
   - 답변 검증

3. 문서 생성 AI:
   - 요구사항 기반 문서 자동 생성
   - 템플릿 기반 내용 생성
   - 기술 스택 추천

4. 코드 생성 AI:
   - 컴포넌트 코드 자동 생성
   - API 명세서 생성
   - 테스트 코드 생성"
```

### 9. UI/UX 개선
```typescript
// 사용자 경험 개선
"현재 UI를 다음과 같이 개선해주세요:

1. 반응형 디자인:
   - 모바일 최적화
   - 태블릿 지원
   - 데스크톱 확장

2. 접근성:
   - 키보드 네비게이션
   - 스크린 리더 지원
   - 색상 대비 개선

3. 성능 최적화:
   - 컴포넌트 메모이제이션
   - 지연 로딩
   - 가상화 스크롤

4. 사용자 피드백:
   - 로딩 인디케이터
   - 성공/에러 알림
   - 진행률 표시"
```

### 10. 테스트 및 배포
```typescript
// 테스트 및 배포 설정
"테스트 환경을 구축해주세요:

1. 단위 테스트:
   - Jest + React Testing Library
   - 컴포넌트 테스트
   - 유틸리티 함수 테스트

2. 통합 테스트:
   - E2E 테스트 (Playwright)
   - 사용자 플로우 테스트
   - API 연동 테스트

3. 배포 설정:
   - Vercel 배포 설정
   - 환경 변수 관리
   - CI/CD 파이프라인

4. 성능 모니터링:
   - 번들 크기 분석
   - 성능 메트릭 수집
   - 에러 추적"
```

## 🎯 구현 우선순위

### Phase 1: 핵심 기능 완성 (1주)
1. ✅ IADesign 컴포넌트 고도화
2. 🔄 RequirementsDefinition 고급 기능 추가
3. 📝 MenuStructure 컴포넌트 구현
4. 📝 Questionnaire 컴포넌트 구현

### Phase 2: 문서 시스템 (1주)
1. 📝 DocumentEditor 컴포넌트 구현
2. 📝 DevelopmentGuide 컴포넌트 구현
3. 🔄 AI 연동 기능 구현
4. 🔄 전역 상태 관리 구현

### Phase 3: 최적화 및 배포 (1주)
1. 🔄 UI/UX 개선
2. 🔄 성능 최적화
3. 🔄 테스트 환경 구축
4. 🔄 배포 설정

## 📝 추가 구현 가이드

### 컴포넌트 구조 패턴
```typescript
// 모든 Step 컴포넌트는 다음 패턴을 따라야 함
interface StepComponentProps {
  onSave?: (data: any) => void
  onNext?: () => void
  onPrevious?: () => void
  initialData?: any
}

export function StepComponent({ onSave, onNext, onPrevious, initialData }: StepComponentProps) {
  // 1. 상태 관리
  const [data, setData] = useState(initialData || {})
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // 2. 자동 저장
  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasChanges && onSave) {
        onSave(data)
        setHasChanges(false)
      }
    }, 3000)
    return () => clearTimeout(timer)
  }, [data, hasChanges, onSave])

  // 3. UI 렌더링
  return (
    <div className="space-y-6">
      {/* 컴포넌트 내용 */}
    </div>
  )
}
```

### 데이터 타입 정의
```typescript
// 공통 타입 정의
export interface ProjectData {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
  steps: {
    fileUpload: FileUploadData
    questionnaire: QuestionnaireData
    requirements: RequirementsData
    menuStructure: MenuStructureData
    iaDesign: IADesignData
    documents: DocumentsData
    developmentGuide: DevelopmentGuideData
  }
}

export interface StepProgress {
  step: number
  completed: boolean
  progress: number
  lastUpdated: Date
}
```

### API 연동 패턴
```typescript
// API 서비스 패턴
class ProjectService {
  async saveProjectData(projectId: string, stepData: any): Promise<void> {
    // API 호출 로직
  }

  async generateAI(step: string, data: any): Promise<any> {
    // AI 생성 API 호출
  }

  async exportDocument(type: string, data: any): Promise<Blob> {
    // 문서 내보내기 API 호출
  }
}
```

## 🚀 실행 명령어

```bash
# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 컴포넌트 추가 (Shadcn/ui)
npx shadcn-ui@latest add [component-name]

# 의존성 설치
npm install [package-name]
```

## 📋 체크리스트

### 현재 완료된 항목
- [x] 기본 프로젝트 구조 설정
- [x] MainLayout 및 네비게이션 구현
- [x] PhaseTracker 진행 상태 표시
- [x] FileUpload 컴포넌트 구현
- [x] RequirementsDefinition 기본 구현
- [x] IADesign 드래그앤드롭 빌더 구현

### 구현 필요 항목
- [ ] Questionnaire 컴포넌트 구현
- [ ] MenuStructure 트리 에디터 구현
- [ ] DocumentEditor 마크다운 에디터 구현
- [ ] DevelopmentGuide AI 가이드 구현
- [ ] 전역 상태 관리 (Zustand) 구현
- [ ] AI API 연동 구현
- [ ] 자동 저장 기능 구현
- [ ] Excel/PDF Export 기능 구현
- [ ] 반응형 디자인 최적화
- [ ] 성능 최적화
- [ ] 테스트 환경 구축

---

**이 프롬프트를 사용하여 SI Project Manager 플랫폼을 단계별로 완성해주세요. 각 단계는 독립적으로 구현 가능하며, 사용자 피드백을 받아 지속적으로 개선할 수 있습니다.**
