# SI Project Management Dashboard v2.0

[![Netlify Status](https://api.netlify.com/api/v1/badges/si-project-dashboard/deploy-status)](https://app.netlify.com/sites/si-project-dashboard/deploys)

**🌐 라이브 데모**: 
- [넷리파이](https://si-project-dashboard.netlify.app) | [Vercel](https://si-project-dashboard-i1amybgor-juns-projects-de45794f.vercel.app)

SI 프로젝트 관리를 위한 종합 대시보드 시스템입니다. 프로젝트 기획부터 개발, 배포까지의 전체 프로세스를 체계적으로 관리할 수 있습니다.

## 🚀 주요 기능

### 1. 프로젝트 기획
- **요구사항 정의**: 기능별 요구사항 관리 및 우선순위 설정
- **질문지**: 프로젝트 이해를 위한 체계적인 질문지 시스템
- **메뉴 구조**: 사이트맵 및 네비게이션 구조 설계

### 2. 디자인 및 설계
- **IA 설계**: 인터랙션 아키텍처 설계 및 와이어프레임 구성
- **컴포넌트 라이브러리**: 30+ 종류의 현실적인 UI 컴포넌트 목업
- **드래그 앤 드롭**: 직관적인 와이어프레임 편집
- **부모-자식 계층 구조**: 컴포넌트 간 계층 관계 관리
- **복사/붙여넣기**: Ctrl+C/V 및 우클릭 메뉴 지원
- **자동 번호 부여**: 동일 타입 컴포넌트 자동 번호링

### 3. 문서 관리
- **개발 문서**: 프로젝트 문서 작성 및 관리
- **상세 개발 가이드**: 단계별 개발 가이드 및 코드 템플릿
- **내보내기**: 다양한 형식으로 문서 내보내기

## 🛠️ 기술 스택

- **Frontend**: React 18, TypeScript, Vite
- **UI Library**: shadcn/ui, Tailwind CSS
- **Icons**: Lucide React
- **Drag & Drop**: react-rnd
- **Markdown**: react-markdown, remark-gfm
- **Code Highlighting**: react-syntax-highlighter

## 📦 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/aiuserthree/Si_Project_Manegement_v2.0.git
cd Si_Project_Manegement_v2.0
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 브라우저에서 확인
```
http://localhost:3000
```

## 🎯 주요 컴포넌트

### 버튼 컴포넌트
- Primary Button: 그라데이션 배경 + 그림자 효과
- Outline Button: 테두리 + 투명 배경
- Ghost Button: 미니멀 디자인

### 입력 컴포넌트
- Input/Text Field: 실제 입력 필드 모양
- Search: 검색 아이콘 + 입력 필드
- Textarea: 다중 라인 + 텍스트 시뮬레이션
- Select/Dropdown: 화살표 아이콘 + 선택 상태
- Checkbox/Radio: 체크/선택 상태 표시
- Switch: 활성화 상태 + 슬라이더
- Slider: 진행바 + 핸들

### 레이아웃 컴포넌트
- Header: 로고 + 네비게이션 + 검색/프로필
- Footer: 저작권 텍스트
- Sidebar/Navigation: 아이콘 + 메뉴 항목
- Card: 이미지 영역 + 텍스트 라인
- Modal/Dialog: 제목 + 내용 + 버튼

### 상태 표시 컴포넌트
- Badge: 색상별 배지 (성공/에러/일반)
- Progress: 진행바
- Spinner/Loading: 회전 애니메이션
- Alert: 색상별 알림 + 아이콘

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── ui/                 # shadcn/ui 컴포넌트
│   ├── steps/              # 메인 단계별 컴포넌트
│   │   ├── IADesign.tsx    # IA 설계 및 와이어프레임
│   │   ├── DocumentEditor.tsx
│   │   ├── DevelopmentGuide.tsx
│   │   └── ...
│   └── layout/             # 레이아웃 컴포넌트
├── docs/                   # 문서 및 가이드
├── public/                 # 정적 파일
└── styles/                 # 스타일 파일
```

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: Blue (#3b82f6)
- **Success**: Green (#10b981)
- **Error**: Red (#ef4444)
- **Warning**: Yellow (#f59e0b)
- **Gray**: 다양한 회색 톤

### 타이포그래피
- **Heading**: 24px, Bold
- **Subtitle**: 18px, Semibold
- **Body**: 14px, Regular
- **Caption**: 12px, Regular

## 🚀 배포

### 🌐 라이브 데모
**넷리파이 배포**: [https://si-project-dashboard.netlify.app](https://si-project-dashboard.netlify.app)
**Vercel 배포**: [https://si-project-dashboard-i1amybgor-juns-projects-de45794f.vercel.app](https://si-project-dashboard-i1amybgor-juns-projects-de45794f.vercel.app)

### Vercel 배포
```bash
npm run build
vercel --prod
```

### Netlify 배포
```bash
npm run build
netlify deploy --prod --dir=dist
```

## 📝 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 연락처

프로젝트 링크: [https://github.com/aiuserthree/Si_Project_Manegement_v2.0](https://github.com/aiuserthree/Si_Project_Manegement_v2.0)

---

**SI Project Management Dashboard v2.0** - 체계적인 프로젝트 관리의 시작
