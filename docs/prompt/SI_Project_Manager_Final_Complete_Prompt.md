# SI Project Manager 플랫폼 - 최종 완성 프롬프트

## 🎯 프로젝트 개요

SI Project Manager는 AI 기반 SI 프로젝트 워크플로우 자동화 플랫폼으로, 자유형식 요구사항부터 개발 가이드까지 완전한 문서화 체계를 제공하는 통합 플랫폼입니다.

### 핵심 가치
- **순차적 워크플로우 자동화**: 7단계 체계적 프로세스
- **업계 표준화된 템플릿**: 검증된 질의서 및 문서 템플릿
- **완전한 편집 기능**: 모든 단계에서 실시간 편집 지원
- **AI 기반 문서 자동 생성**: OpenAI GPT-4/Claude API 활용
- **Cursor IDE 연동**: 개발 환경 직접 연동

---

## 🏗️ 7단계 워크플로우

### Step 1: 파일 업로드 및 AI 분석 (FE-M001)
**목적**: 다양한 형식의 프로젝트 문서를 AI로 분석하여 구조화된 정보 추출

**핵심 기능**:
- 드래그&드롭 파일 업로드 (Excel, Word, PDF, 이미지, 텍스트)
- AI 기반 문서 내용 분석 및 요약
- 분석 결과 4개 탭으로 구조화 표시 (요약, 상세, 추천 질문, 연관 요구사항)
- 프로젝트 전체 요약 생성

**기술 스택**:
- React 18 + TypeScript
- @dnd-kit/core (드래그&드롭)
- pdfjs-dist (PDF 파싱), xlsx (Excel), mammoth (Word), tesseract.js (이미지)
- OpenAI API 연동

### Step 2: 질의서 생성 및 편집 (FE-M002)
**목적**: 파일 분석 결과를 바탕으로 누락된 정보를 파악하고 체계적인 질의서 제공

**핵심 기능**:
- AI 자동 질문 생성 (필수/선택/권장 카테고리)
- 실시간 편집 및 자동 저장 (3초 디바운싱)
- 완성도 검증 및 진행률 표시
- Excel 다운로드 기능

**기술 스택**:
- React Hook Form + Zod validation
- Monaco Editor (질문 편집)
- OpenAI API (질문 생성)

### Step 3: 요구사항 정의서 관리 (FE-M003)
**목적**: 질의서 답변을 체계적인 요구사항 정의서로 변환

**핵심 기능**:
- 표준 템플릿 기반 요구사항 자동 생성
- 6개 필드 구조 (번호, ID, 서비스구분, 요구사항명, 상세설명, 우선순위)
- 인라인 셀 편집 및 Excel import/export
- 서비스 구분 4종 (F/O, B/O, API/RFC, AI)

**기술 스택**:
- @tanstack/react-table (데이터 테이블)
- xlsx (Excel 처리)
- OpenAI API (요구사항 도출)

### Step 4: 메뉴구조도 설계 (FE-M004)
**목적**: 요구사항을 바탕으로 시스템의 메뉴 구조를 시각적으로 설계

**핵심 기능**:
- 5단계 계층 구조 트리 뷰 에디터
- 드래그&드롭 메뉴 재배치
- 접근 권한 설정 (전체/로그인)
- 관리 기능 토글 및 시각적 미리보기

**기술 스택**:
- react-arborist (트리 뷰)
- @dnd-kit/core (드래그&드롭)
- React Hook Form (메뉴 편집)

### Step 5: IA 디자인 및 와이어프레임 (FE-M005)
**목적**: 메뉴구조도를 바탕으로 각 화면의 정보구조 설계 및 와이어프레임 제작

**핵심 기능**:
- 드래그앤드롭 와이어프레임 빌더
- 8개 카테고리 컴포넌트 라이브러리 (Layout, Navigation, Content, Form, Feedback, Data, Media, Utility)
- IA Code 자동 생성 (SCR-001, FRM-001-01 형식)
- 반응형 캔버스 (PC/Tablet/Mobile)

**기술 스택**:
- react-rnd (드래그&드롭)
- @dnd-kit/core (컴포넌트 라이브러리)
- Zustand (상태 관리)

### Step 6: 개발 문서 편집 (FE-M006)
**목적**: 프로젝트 개발에 필요한 5종 개발 문서 생성 및 관리

**핵심 기능**:
- 5종 개발 문서 (프로젝트 명세서, 시스템 아키텍처, 기술 스택, ERD, API 명세서)
- 마크다운/리치텍스트 에디터 (Monaco Editor + Tiptap)
- 다이어그램 도구 (Mermaid.js)
- PDF/Word export 기능

**기술 스택**:
- Monaco Editor (마크다운)
- Tiptap (리치텍스트)
- Mermaid.js (다이어그램)
- html-pdf, mammoth (내보내기)

### Step 7: 개발 가이드 생성 (FE-M007)
**목적**: 모든 단계의 문서를 통합하여 Cursor IDE에서 바로 사용할 수 있는 완전한 개발 가이드 생성

**핵심 기능**:
- 화면별 컴포넌트 명세 생성
- 코드 템플릿 (React, API, 테스트)
- 데이터베이스 가이드 및 Cursor IDE 연동 파일
- 프로젝트 구조 및 설정 파일 생성

**기술 스택**:
- OpenAI API (코드 생성)
- Monaco Editor (코드 에디터)
- JSZip (프로젝트 압축)
- FileSaver (다운로드)

---

## 🛠️ 공통 기능 (FE-M008)

### 진행 상태 추적
- 7단계 진행 상태 실시간 표시
- 단계별 완성도 및 예상 시간 표시
- 마일스톤 달성 알림

### 단계별 네비게이션
- 직관적인 단계 간 이동
- 접근 권한 체크 및 의존성 검증
- 키보드 네비게이션 지원

### 자동 저장
- 3-5초 간격 자동 저장
- 로컬 스토리지 백업
- 서버 동기화 및 충돌 해결

### 데이터 내보내기
- 단계별 결과 내보내기
- 전체 프로젝트 ZIP 다운로드
- 다양한 형식 지원 (Excel, PDF, JSON)

---

## 🔧 기술 아키텍처

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **UI Library**: Shadcn/ui + Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Tables**: @tanstack/react-table
- **Editors**: Monaco Editor, Tiptap
- **Drag & Drop**: @dnd-kit/core
- **Diagrams**: Mermaid.js
- **File Processing**: xlsx, pdfjs-dist, mammoth, tesseract.js

### Backend (API)
- **Framework**: NestJS
- **Database**: PostgreSQL + Redis
- **AI Integration**: OpenAI GPT-4/Claude API
- **File Storage**: AWS S3
- **Queue**: Bull
- **Authentication**: JWT

### 개발 도구
- **Testing**: Jest + Testing Library
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript
- **Bundling**: Vite
- **Package Manager**: npm

---

## 📊 모듈별 개발 일정

| Phase | 기간 | 모듈 | 담당 역할 | 우선순위 |
|-------|------|------|-----------|----------|
| Phase 1 | 1주 | SH-M004, SH-M003, SH-M002, SH-M001 | UI 개발자, 프론트엔드 아키텍트, 백엔드 개발자, AI 개발자 | P0 |
| Phase 2 | 1주 | FE-M008, FE-M001 | 프론트엔드 개발자 | P0 |
| Phase 3 | 2주 | FE-M002, FE-M003, FE-M004 | 프론트엔드 개발자 | P0 |
| Phase 4 | 2주 | FE-M005, FE-M006, FE-M007 | UI/UX 개발자, 프론트엔드 개발자 | P0-P1 |
| Phase 5 | 1주 | 통합 테스트 및 최적화 | 전체 팀 | - |

---

## 🎨 UI/UX 가이드라인

### 디자인 원칙
- **일관성**: 모든 단계에서 동일한 디자인 언어 사용
- **직관성**: 사용자가 쉽게 이해할 수 있는 인터페이스
- **효율성**: 최소한의 클릭으로 원하는 작업 수행
- **피드백**: 모든 사용자 액션에 대한 명확한 피드백

### 색상 시스템
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Neutral**: Gray (#6B7280)

### 타이포그래피
- **Heading**: Inter, 24px, 32px, 48px
- **Body**: Inter, 14px, 16px, 18px
- **Code**: JetBrains Mono, 14px

### 컴포넌트 라이브러리
- Shadcn/ui 기반 재사용 가능한 컴포넌트
- Tailwind CSS 유틸리티 클래스 활용
- 반응형 디자인 (Mobile First)

---

## 🔒 보안 및 성능

### 보안 요구사항
- **인증**: JWT 기반 토큰 인증
- **권한**: 프로젝트별 접근 권한 관리
- **데이터 보호**: 업로드 파일 암호화 저장, HTTPS 통신
- **입력 검증**: XSS/CSRF 방지, 입력 데이터 삭제화

### 성능 목표
- **응답 시간**: 페이지 로딩 3초 이내, AI 분석 30초 이내
- **처리량**: 동시 사용자 100명 지원
- **데이터 용량**: 프로젝트당 최대 1GB, 파일당 최대 100MB
- **가용성**: 99.9% 업타임 목표

### 최적화 전략
- **코드 스플리팅**: Dynamic imports로 번들 크기 최적화
- **캐싱**: 메모리 및 로컬 스토리지 캐싱
- **가상화**: 대량 데이터 리스트 가상 스크롤링
- **디바운싱**: 자동 저장 및 검색 디바운싱

---

## 🧪 테스트 전략

### 단위 테스트
- **커버리지**: 85% 이상
- **도구**: Jest + Testing Library
- **범위**: 모든 컴포넌트, 훅, 서비스

### 통합 테스트
- **API 테스트**: Supertest 활용
- **모듈 간 통합**: 인터페이스 테스트
- **데이터 플로우**: 상태 관리 테스트

### E2E 테스트
- **도구**: Playwright
- **시나리오**: 전체 워크플로우 테스트
- **브라우저**: Chrome, Firefox, Safari, Edge

### 목업 및 테스트 데이터
- **MSW**: API 목업
- **Fixtures**: 테스트 데이터
- **Storybook**: 컴포넌트 문서화

---

## 📦 배포 및 모니터링

### 배포 환경
- **Frontend**: Vercel/Netlify
- **Backend**: AWS ECS/Docker
- **Database**: AWS RDS PostgreSQL
- **Storage**: AWS S3
- **CDN**: CloudFront

### 환경 변수
```env
# AI 서비스
VITE_OPENAI_API_KEY=your_api_key_here
VITE_AI_MODEL=gpt-4o-mini

# 파일 처리
VITE_MAX_FILE_SIZE_MB=100
VITE_SUPPORTED_FILE_TYPES=pdf,doc,docx,xls,xlsx,ppt,pptx,txt,jpg,png

# 자동 저장
VITE_AUTO_SAVE_INTERVAL=3000
VITE_MAX_VERSION_HISTORY=100
```

### 모니터링
- **로그**: Winston + ELK Stack
- **메트릭**: Prometheus + Grafana
- **알림**: Slack/Email 통합
- **에러 추적**: Sentry

---

## 🚀 개발 시작 가이드

### 1. 프로젝트 설정
```bash
# 저장소 클론
git clone <repository-url>
cd si-project-manager

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일에 API 키 등 설정

# 개발 서버 시작
npm run dev
```

### 2. 개발 워크플로우
```bash
# 기능 브랜치 생성
git checkout -b feature/FE-M001-file-upload

# 개발 및 테스트
npm run test
npm run lint
npm run type-check

# 커밋 및 푸시
git add .
git commit -m "feat: 파일 업로드 기능 구현"
git push origin feature/FE-M001-file-upload
```

### 3. 모듈별 개발 순서
1. **SH-M004**: UILibraryModule (공통 UI 컴포넌트)
2. **SH-M003**: StateManagementModule (전역 상태 관리)
3. **SH-M002**: FileParserModule (파일 파싱 유틸리티)
4. **SH-M001**: AIServiceModule (AI 서비스 통합)
5. **FE-M008**: CommonModules (공통 모듈들)
6. **FE-M001~FE-M007**: 각 워크플로우 단계 모듈

---

## 📚 문서 및 리소스

### 설계 문서
- `docs/specification/project_specification.md`: 프로젝트 명세서
- `docs/modules/INDEX.md`: 모듈 설계 인덱스
- `docs/modules/FE-M00X-*.md`: 각 모듈별 상세 설계서

### 개발 가이드
- `docs/plan/si-manager-plan-updated_20250919.md`: 기획 문서
- `docs/plan/ia-design-cursor-guide.md`: IA 디자인 가이드
- `AI_FEATURES_README.md`: AI 기능 구현 가이드

### 코드 예시
```typescript
// 파일 업로드 컴포넌트 예시
const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  onFilesSelected,
  isUploading,
  acceptedTypes,
  maxFileSize
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFilesSelected,
    accept: acceptedTypes,
    maxSize: maxFileSize * 1024 * 1024
  });

  return (
    <div {...getRootProps()} className="upload-area">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>파일을 여기에 놓으세요...</p>
      ) : (
        <p>파일을 드래그하거나 클릭하여 업로드하세요</p>
      )}
    </div>
  );
};
```

---

## 🎯 성공 지표 (KPIs)

### 사용자 경험
- **완료율**: 7단계 워크플로우 완료율 80% 이상
- **사용 시간**: 숙련자 기준 2시간 이내 완료
- **재사용률**: 프로젝트 재사용률 70% 이상

### 기술 성능
- **응답 시간**: 평균 응답 시간 2초 이내
- **에러율**: 시스템 에러율 1% 이하
- **가용성**: 99.9% 업타임 달성

### 비즈니스 임팩트
- **시간 절약**: 기존 대비 60% 시간 단축
- **품질 향상**: 요구사항 누락률 50% 감소
- **사용자 만족도**: NPS 점수 70점 이상

---

이 프롬프트는 SI Project Manager 플랫폼의 완전한 개발 가이드로, 모든 모듈의 상세 설계서와 함께 즉시 개발을 시작할 수 있는 구체적인 정보를 제공합니다. 각 모듈은 독립적으로 개발 가능하며, 명확한 인터페이스를 통해 통합됩니다.
