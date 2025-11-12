import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Badge } from '../ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../ui/dialog'
import { Rnd } from 'react-rnd'
import { 
  MousePointer, 
  Square, 
  Type, 
  Image, 
  Table, 
  List,
  Save, 
  Layers, 
  Eye, 
  Trash2,
  Download,
  Plus,
  LayoutGrid, 
  Smartphone, 
  Monitor, 
  ZoomIn, 
  ZoomOut, 
  Maximize,
  Minimize,
  Loader,
  Wifi,
  Battery,
  Signal,
  Volume2,
  X,
  ChevronRight,
  ChevronDown,
  Grid3X3,
  Search,
  Copy,
  Clipboard,
  Play
} from 'lucide-react'

interface Screen {
  id: string
  name: string
  iaCode: string
  description: string
  userJourney: string[]
  components: Component[]
}

interface Component {
  id: string
  type: string
  category: string
  iaCode: string
  label: string
  description: string
  x: number
  y: number
  width: number
  height: number
  relatedRequirements: string[]
  parentId?: string
  children?: string[]
  zIndex?: number
}

interface Requirement {
  id: string
  reqId: string
  serviceType: string
  name: string
  description: string
  priority: 'High' | 'Medium' | 'Low'
  status: '작성중' | '완료' | '보류'
}

const mockRequirements: Requirement[] = [
  { id: '1', reqId: 'REQ-001', serviceType: 'F/O', name: '사용자 로그인', description: '사용자가 시스템에 로그인할 수 있어야 한다.', priority: 'High', status: '완료' },
  { id: '2', reqId: 'REQ-002', serviceType: 'B/O', name: '관리자 대시보드', description: '관리자가 시스템 현황을 한눈에 파악할 수 있는 대시보드를 제공한다.', priority: 'High', status: '완료' },
  { id: '3', reqId: 'REQ-003', serviceType: 'F/O', name: '상품 목록 조회', description: '사용자가 등록된 상품 목록을 조회할 수 있어야 한다.', priority: 'Medium', status: '작성중' },
  { id: '4', reqId: 'REQ-004', serviceType: 'F/O', name: '상품 상세 조회', description: '사용자가 특정 상품의 상세 정보를 조회할 수 있어야 한다.', priority: 'Medium', status: '작성중' },
  { id: '5', reqId: 'REQ-005', serviceType: 'B/O', name: '상품 등록', description: '관리자가 새로운 상품을 등록할 수 있어야 한다.', priority: 'High', status: '완료' },
]

const componentLibrary = {
  layout: [
    { type: 'header', category: 'layout', icon: Layers, label: '헤더', description: '상단 영역, 사이트 식별/주요 내비게이션 포함', code: 'HDR-001' },
    { type: 'body', category: 'layout', icon: Square, label: '바디', description: '메인 콘텐츠 표시 영역', code: 'BDY-001' },
    { type: 'footer', category: 'layout', icon: Layers, label: '푸터', description: '하단 영역, 정보·내비게이션·정책 등', code: 'FTR-001' },
    { type: 'billboard', category: 'layout', icon: Image, label: '빌보드', description: '상단 메인 비주얼/강조 영역', code: 'BBD-001' },
    { type: 'sidebar', category: 'layout', icon: Layers, label: '사이드 메뉴', description: '화면 좌/우측에 배치된 보조 메뉴', code: 'SBR-001' },
    { type: 'grid', category: 'layout', icon: Grid3X3, label: '그리드', description: 'Content 배치용 행·열 시스템', code: 'GRD-001' },
    { type: 'container', category: 'layout', icon: Square, label: '컨테이너', description: '여러 요소를 담는 박스/섹션', code: 'CNT-001' },
    { type: 'sticky-header', category: 'layout', icon: Layers, label: '스티키 헤더', description: '스크롤 고정 헤더', code: 'STK-001' },
    { type: 'floating-nav', category: 'layout', icon: Layers, label: '플로팅 네비게이션', description: '스크롤에 따라 움직이는 메뉴', code: 'FLT-001' },
    { type: 'wrapper', category: 'layout', icon: Square, label: '래퍼', description: '레이아웃 뼈대 역할', code: 'WRP-001' },
    { type: 'mega-menu', category: 'layout', icon: Layers, label: '메가 메뉴', description: '대형 드롭다운 네비게이션', code: 'MGM-001' },
    { type: 'fab', category: 'layout', icon: Plus, label: '플로팅 액션 버튼', description: '화면 위에 떠있는 주요 기능 버튼', code: 'FAB-001' },
    { type: 'hero-video', category: 'layout', icon: Image, label: '히어로 비디오', description: '히어로/빌보드 영역 배경 영상', code: 'HVD-001' },
    { type: 'multi-column', category: 'layout', icon: Grid3X3, label: '멀티컬럼 레이아웃', description: '다단 분할 콘텐츠 영역', code: 'MCL-001' },
    { type: 'background', category: 'layout', icon: Image, label: '배경 이미지/그래픽', description: '시각효과용 배경요소', code: 'BGD-001' },
    { type: 'splash', category: 'layout', icon: Image, label: '스플래시 스크린', description: '앱/웹 실행 시 첫 화면', code: 'SPL-001' }
  ],
  navigation: [
    { type: 'gnb', category: 'navigation', icon: Layers, label: 'GNB', description: 'Global Navigation Bar, 사이트 전체 메뉴', code: 'GNB-001' },
    { type: 'lnb', category: 'navigation', icon: Layers, label: 'LNB', description: 'Local Navigation Bar, 섹션별 하위 메뉴', code: 'LNB-001' },
    { type: 'snb', category: 'navigation', icon: Layers, label: 'SNB', description: 'Side Navigation Bar, 좌우에 위치한 보조 메뉴', code: 'SNB-001' },
    { type: 'fnb', category: 'navigation', icon: Layers, label: 'FNB', description: 'Footer Navigation Bar, 하단 내비게이션', code: 'FNB-001' },
    { type: 'breadcrumb', category: 'navigation', icon: ChevronRight, label: '브레드크럼', description: '현재 위치 단계별 표시', code: 'BRD-001' },
    { type: 'tab', category: 'navigation', icon: Square, label: '탭/탭바', description: '콘텐츠 구분/전환 UI', code: 'TAB-001' },
    { type: 'accordion', category: 'navigation', icon: ChevronDown, label: '아코디언', description: '펼치고 접을 수 있는 리스트/패널', code: 'ACD-001' },
    { type: 'tree-menu', category: 'navigation', icon: ChevronDown, label: '트리 메뉴', description: '계층 구조 형태의 메뉴', code: 'TRM-001' },
    { type: 'hamburger', category: 'navigation', icon: Square, label: '햄버거 메뉴', description: '모바일·숨김 메뉴 아이콘', code: 'HMB-001' },
    { type: 'quick-menu', category: 'navigation', icon: Square, label: '퀵 메뉴', description: '바로가기 메뉴(화면붙이기/스크롤 따라다님 등)', code: 'QKM-001' },
    { type: 'pagination', category: 'navigation', icon: Square, label: '페이지네이션', description: '페이지 번호 및 이동 UI', code: 'PGN-001' },
    { type: 'anchor', category: 'navigation', icon: Square, label: '앵커 링크', description: '특정 섹션 바로가기 링크', code: 'ANC-001' },
    { type: 'indicator', category: 'navigation', icon: Square, label: '인디케이터', description: '캐러셀·슬라이드 등 현재 위치 점(dot) 등', code: 'IND-001' },
    { type: 'top-button', category: 'navigation', icon: Square, label: '탑 버튼', description: '최상단 이동 버튼', code: 'TOP-001' },
    { type: 'drawer', category: 'navigation', icon: Layers, label: '네비게이션 드로어', description: '임시 보임/숨김 사이드 메뉴', code: 'DRW-001' },
    { type: 'overflow', category: 'navigation', icon: Square, label: '오버플로우/컨텍스트 메뉴', description: '추가·보조 기능 제공 메뉴', code: 'OVF-001' }
  ],
  input: [
    { type: 'text-field', category: 'input', icon: Type, label: '텍스트 필드', description: '입력 가능한 텍스트 박스' },
    { type: 'search', category: 'input', icon: Type, label: '검색창', description: '키워드 입력/검색' },
    { type: 'label', category: 'input', icon: Type, label: '라벨', description: '입력 필드 제목/설명' },
    { type: 'placeholder', category: 'input', icon: Type, label: '플레이스홀더', description: '입력 안내 텍스트' },
    { type: 'radio', category: 'input', icon: Square, label: '라디오 버튼', description: '단일 선택형 옵션' },
    { type: 'checkbox', category: 'input', icon: Square, label: '체크 박스', description: '다중 선택형 옵션' },
    { type: 'dropdown', category: 'input', icon: ChevronDown, label: '드롭다운', description: '목록 중 선택 박스(셀렉트박스/콤보박스 포함)' },
    { type: 'multi-select', category: 'input', icon: ChevronDown, label: '멀티셀렉트', description: '다중 선택 가능한 드롭다운' },
    { type: 'toggle', category: 'input', icon: Square, label: '토글 스위치', description: 'ON/OFF 전환 버튼' },
    { type: 'slider', category: 'input', icon: Square, label: '슬라이더', description: '범위내 값 조절 바' },
    { type: 'filter', category: 'input', icon: Square, label: '필터', description: '조건별 컨텐츠 정렬/검색' },
    { type: 'tag-input', category: 'input', icon: Type, label: '태그 입력', description: '값 입력 시 태그 형태로 표시' },
    { type: 'chip', category: 'input', icon: Square, label: '칩(Chip)', description: '태그/선택값 등 작은 표식' },
    { type: 'calendar', category: 'input', icon: Square, label: '캘린더/날짜선택기', description: '날짜·시간 입력' },
    { type: 'file-upload', category: 'input', icon: Square, label: '파일 업로더', description: '파일 첨부/업로드 UI' },
    { type: 'autocomplete', category: 'input', icon: Type, label: '서치서제스트', description: '자동완성 추천 리스트' },
    { type: 'inline-edit', category: 'input', icon: Type, label: '인라인 에디팅', description: '컨텐츠 바로 수정 가능한 UI' },
    { type: 'drag-drop', category: 'input', icon: Square, label: '드래그 앤 드롭', description: '요소 이동·정렬 상호작용' }
  ],
  button: [
    { type: 'cta', category: 'button', icon: Square, label: 'CTA', description: '주요 행동 유도 버튼' },
    { type: 'icon-button', category: 'button', icon: Square, label: '아이콘 버튼', description: '아이콘 기반 동작버튼' },
    { type: 'action-button', category: 'button', icon: Square, label: '액션 버튼', description: '추가 행동 버튼' },
    { type: 'switch', category: 'button', icon: Square, label: '스위치', description: '체크박스/토글과 유사, 상태/설정 바꿈' },
    { type: 'more-button', category: 'button', icon: Square, label: '더보기 버튼', description: '추가 항목보기, ... 등' },
    { type: 'floating-button', category: 'button', icon: Plus, label: '플로팅 버튼', description: '항상 떠있는(스크롤 독립) 기능 버튼' },
    { type: 'social-share', category: 'button', icon: Square, label: '소셜 쉐어 버튼', description: 'SNS 공유 기능 버튼' }
  ],
  popup: [
    { type: 'popup', category: 'popup', icon: Square, label: '팝업', description: '새창/레이어에 띄우는 임시 콘텐츠' },
    { type: 'layer-popup', category: 'popup', icon: Square, label: '레이어 팝업', description: '화면 위 중첩 띄우는 팝업' },
    { type: 'modal', category: 'popup', icon: Square, label: '모달(Modal)', description: '행동 요구 중심, 다른 동작 불가' },
    { type: 'dimmed', category: 'popup', icon: Square, label: '딤(Dimmed Layer)', description: '팝업/모달 뒤 배경 어둡게 처리' },
    { type: 'toast', category: 'popup', icon: Square, label: '토스트/스낵바', description: '잠시 하단·중앙에 띄우는 메시지 팝업' },
    { type: 'bottom-sheet', category: 'popup', icon: Square, label: '바텀시트', description: '하단에서 올라오는 패널' },
    { type: 'alert', category: 'popup', icon: Square, label: '경고창/얼럿', description: '위험·중대한 안내/확인 창' },
    { type: 'message', category: 'popup', icon: Type, label: '안내/오류/성공 메시지', description: '정보, 에러, 확인 등 안내 및 상태 메시지' },
    { type: 'side-panel', category: 'popup', icon: Layers, label: '사이드 패널/드로어', description: '임시로 화면 측면 열리는 보조 패널' },
    { type: 'lightbox', category: 'popup', icon: Image, label: '라이트박스', description: '이미지/영상 클릭 확대/오버레이' },
    { type: 'confirm', category: 'popup', icon: Square, label: '컨펌 다이얼로그', description: '작업 확인·취소 요구' },
    { type: 'notification', category: 'popup', icon: Square, label: '알림', description: '사용자의 행동/이벤트 확인용 메시지' },
    { type: 'quick-action', category: 'popup', icon: Square, label: '퀵 액션 메뉴', description: '즉시 접근 가능 기능 메뉴' }
  ],
  information: [
    { type: 'depth', category: 'information', icon: ChevronDown, label: '뎁스', description: '계층/네비 메뉴 깊이' },
    { type: 'nav-flow', category: 'information', icon: ChevronRight, label: '네비 플로우', description: '이동 경로 및 플로우' },
    { type: 'stepper', category: 'information', icon: ChevronRight, label: '스텝퍼', description: '단계별 프로세스 표시' },
    { type: 'wizard', category: 'information', icon: ChevronRight, label: '위저드', description: '다단계 폼/작업 순차진행' },
    { type: 'timeline', category: 'information', icon: ChevronRight, label: '타임라인', description: '시간·이벤트 순서 시각화' },
    { type: 'faq', category: 'information', icon: ChevronDown, label: 'FAQ 아코디언', description: 'Q&A 접기·펼치기 FAQ 구조' },
    { type: 'onboarding', category: 'information', icon: Square, label: '온보딩', description: '첫 접속/신규 사용자 가이드 화면' },
    { type: 'empty-state', category: 'information', icon: Square, label: '빈 상태 화면', description: '비어있을 때 표시하는 안내 요소' },
    { type: 'error-page', category: 'information', icon: Square, label: '에러 페이지', description: '404, 500 등 오류/상태별 독립 페이지' },
    { type: 'success-page', category: 'information', icon: Square, label: '성공/완료 화면', description: '작업 성공, 프로세스 완료 표시' },
    { type: 'flowchart', category: 'information', icon: Square, label: '플로우차트', description: '화면/기능 흐름도식' }
  ],
  visual: [
    { type: 'banner', category: 'visual', icon: Image, label: '배너', description: '화면/섹션 상단 프로모션 영역' },
    { type: 'thumbnail', category: 'visual', icon: Image, label: '썸네일', description: '미리보기 이미지' },
    { type: 'avatar', category: 'visual', icon: Square, label: '아바타', description: '사용자·프로필 아이콘' },
    { type: 'icon-set', category: 'visual', icon: Square, label: '아이콘 세트', description: '기능/상태 시각표현 아이콘' },
    { type: 'background-image', category: 'visual', icon: Image, label: '배경 이미지/그래픽', description: '시각효과용 배경/일러스트/브랜딩 그래픽' },
    { type: 'gallery', category: 'visual', icon: Image, label: '미디어 갤러리', description: '다중 이미지/비디오 컨텐츠 뷰어' },
    { type: 'video-player', category: 'visual', icon: Image, label: '비디오 플레이어', description: '영상 재생 컴포넌트' },
    { type: 'review', category: 'visual', icon: Square, label: '리뷰/평점', description: '사용자리뷰 및 별점 표시' },
    { type: 'recommendation', category: 'visual', icon: Square, label: '추천 영역', description: '알고리즘 추천·관련 콘텐츠' },
    { type: 'rich-editor', category: 'visual', icon: Type, label: '리치 텍스트 에디터', description: '글·포맷 편집기(WYSIWYG 등)' },
    { type: 'data-viz', category: 'visual', icon: Table, label: '데이터 비주얼', description: '차트·그래프 등 시각화 영역' },
    { type: 'illustration', category: 'visual', icon: Image, label: '배경 일러스트', description: '브랜드·제품 특화 일러스트·그래픽' }
  ],
  state: [
    { type: 'loader', category: 'state', icon: Square, label: '로더/스피너', description: '로딩 상태 시각화' },
    { type: 'progress', category: 'state', icon: Square, label: '프로그레스 바', description: '작업·진행상황 시각표시' },
    { type: 'skeleton', category: 'state', icon: Square, label: '스켈레톤 UI', description: '콘텐츠 로딩중 자리표시' },
    { type: 'badge', category: 'state', icon: Square, label: '배지', description: '알림/상태 소형 시각표시' },
    { type: 'status-bar', category: 'state', icon: Square, label: '상태바', description: '앱·브라우저 상단 영역' },
    { type: 'tooltip', category: 'state', icon: Square, label: '툴팁', description: '마우스 오버시 부가정보 표시' },
    { type: 'guide-text', category: 'state', icon: Type, label: '가이드 텍스트', description: '입력 보조 설명' },
    { type: 'search-icon', category: 'state', icon: Square, label: '돋보기 아이콘', description: '검색/확대 기능 아이콘' },
    { type: 'zoom-control', category: 'state', icon: Square, label: '확대/축소 컨트롤', description: '이미지·지도 확대 축소 버튼' },
    { type: 'notification-panel', category: 'state', icon: Square, label: '알림 패널', description: '알림/이벤트 모음(종 아이콘 등)' },
    { type: 'dynamic-badge', category: 'state', icon: Square, label: '동적 배지', description: '실시간/NEW/HOT 상태 시각표' }
  ],
  interaction: [
    { type: 'carousel', category: 'interaction', icon: Square, label: '캐러셀', description: '이미지/컨텐츠 순환 슬라이드' },
    { type: 'swipe', category: 'interaction', icon: Square, label: '스와이프', description: '좌우 터치/슬라이드 제스처' },
    { type: 'hover', category: 'interaction', icon: Square, label: '호버', description: '마우스 올림 시 효과 변화' },
    { type: 'drag-drop', category: 'interaction', icon: Square, label: '드래그 앤 드롭', description: '마우스/터치로 객체 이동 기능' },
    { type: 'long-press', category: 'interaction', icon: Square, label: '롱프레스', description: '모바일에서 길게 터치 시 메뉴 활성화' },
    { type: 'expand-collapse', category: 'interaction', icon: ChevronDown, label: '접기/펼치기', description: '콘텐츠 확장/축소 UI' },
    { type: 'inline-edit', category: 'interaction', icon: Type, label: '인라인 에디팅', description: '즉시 수정 가능한 텍스트·필드' },
    { type: 'scroll-spy', category: 'interaction', icon: Square, label: '스크롤 스파이', description: '스크롤 위치에 따라 메뉴/섹션 활성' },
    { type: 'infinite-scroll', category: 'interaction', icon: Square, label: '인피니트 스크롤', description: '무한 스크롤/끝 없는 리스트' },
    { type: 'parallax', category: 'interaction', icon: Square, label: '파라allax 스크롤', description: '배경·콘텐츠 시차 스크롤 효과' }
  ],
  marketing: [
    { type: 'cookie-banner', category: 'marketing', icon: Square, label: '쿠키 배너', description: '개인정보/쿠키 사용 동의 안내' },
    { type: 'callout', category: 'marketing', icon: Square, label: '콜아웃', description: '특정 메시지/강조 박스' },
    { type: 'lead-form', category: 'marketing', icon: Type, label: '리드 폼', description: '회원가입·상담 유도 입력 폼' },
    { type: 'promotion', category: 'marketing', icon: Square, label: '프로모션 위젯', description: '이벤트·혜택 영역' },
    { type: 'social-share', category: 'marketing', icon: Square, label: '소셜 공유 버튼', description: 'SNS 연동 공유 기능' },
    { type: 'chatbot', category: 'marketing', icon: Square, label: '챗봇 위젯', description: '고객지원 챗봇' }
  ],
  etc: [
    { type: 'micro-interaction', category: 'etc', icon: Square, label: '마이크로인터랙션', description: '미세 애니메이션/반응 효과' },
    { type: 'dark-mode', category: 'etc', icon: Square, label: '다크모드 토글', description: '밝기/다크 테마 전환' },
    { type: 'sticky-cta', category: 'etc', icon: Square, label: '스티키 CTA 버튼', description: '스크롤시 항상 노출되는 주요 버튼' },
    { type: 'multi-column', category: 'etc', icon: Grid3X3, label: '멀티컬럼 레이아웃', description: '여러 열로 된 구조' }
  ]
}

const mockScreens: Screen[] = [
  {
    id: 'screen-1',
    name: '로그인 화면',
    iaCode: 'IA-001',
    description: '사용자가 시스템에 로그인하는 화면입니다.',
        userJourney: [
          '브라우저에서 로그인 URL에 접속하여 페이지를 로드합니다',
          '아이디 입력 필드에 포커스를 맞추고 사용자 아이디를 타이핑합니다',
          'Tab 키를 눌러 비밀번호 필드로 이동하고 비밀번호를 입력합니다',
          'Enter 키를 누르거나 로그인 버튼을 마우스로 클릭합니다',
          '시스템이 입력된 자격 증명을 서버로 전송하여 인증을 요청합니다',
          '서버에서 사용자 정보를 검증하고 JWT 토큰을 생성하여 반환합니다',
          '인증 성공 시 토큰을 로컬 스토리지에 저장하고 대시보드 페이지로 리다이렉트합니다',
          '인증 실패 시 입력 필드를 초기화하고 오류 메시지를 표시합니다',
          '사용자가 비밀번호를 잊은 경우 "비밀번호 찾기" 링크를 클릭할 수 있습니다'
        ],
    components: [
      { id: 'comp-1', type: 'input', category: 'Form', iaCode: 'INP-001', label: '아이디 입력', description: '사용자 아이디를 입력합니다.', x: 50, y: 50, width: 200, height: 40, relatedRequirements: ['REQ-001'] },
      { id: 'comp-2', type: 'input', category: 'Form', iaCode: 'INP-002', label: '비밀번호 입력', description: '사용자 비밀번호를 입력합니다.', x: 50, y: 100, width: 200, height: 40, relatedRequirements: ['REQ-001'] },
      { id: 'comp-3', type: 'button', category: 'UI', iaCode: 'BTN-001', label: '로그인 버튼', description: '로그인 기능을 수행합니다.', x: 50, y: 150, width: 100, height: 40, relatedRequirements: ['REQ-001'] },
    ]
  },
  {
    id: 'screen-2',
    name: '대시보드 화면',
    iaCode: 'IA-002',
    description: '로그인 후 사용자가 처음 접하는 대시보드 화면입니다.',
    userJourney: [
      'JWT 토큰 검증 후 대시보드 페이지로 자동 리다이렉트됩니다',
      '페이지 로드 시 사용자 프로필 정보를 API로 조회하여 헤더에 표시합니다',
      '좌측 사이드바의 메뉴 아이템들을 권한에 따라 동적으로 렌더링합니다',
      '메인 영역에서 프로젝트 통계, 진행률 차트, 최근 활동 등의 위젯을 로드합니다',
      '각 위젯의 데이터를 개별 API 엔드포인트에서 비동기로 가져와 표시합니다',
      '사용자가 특정 메뉴를 클릭하면 해당 페이지로 SPA 방식으로 전환합니다',
      '알림 아이콘 클릭 시 WebSocket을 통해 실시간 알림 목록을 조회합니다',
      '사용자가 로그아웃 버튼을 클릭하면 토큰을 삭제하고 로그인 페이지로 이동합니다'
    ],
    components: [
      { id: 'comp-4', type: 'header', category: 'Layout', iaCode: 'HDR-001', label: '상단 헤더', description: '페이지 상단에 위치한 헤더입니다.', x: 0, y: 0, width: 800, height: 60, relatedRequirements: ['REQ-002'] },
      { id: 'comp-5', type: 'sidebar', category: 'Layout', iaCode: 'SBR-001', label: '좌측 사이드바', description: '메뉴 네비게이션을 포함하는 사이드바입니다.', x: 0, y: 60, width: 200, height: 540, relatedRequirements: ['REQ-002'] },
      { id: 'comp-6', type: 'text', category: 'UI', iaCode: 'TXT-001', label: '환영 메시지', description: '사용자에게 환영 메시지를 표시합니다.', x: 250, y: 100, width: 300, height: 30, relatedRequirements: ['REQ-002'] },
      { id: 'comp-7', type: 'card', category: 'UI', iaCode: 'CRD-001', label: '프로젝트 카드', description: '프로젝트 정보를 표시하는 카드입니다.', x: 250, y: 150, width: 200, height: 120, relatedRequirements: ['REQ-002'] },
      { id: 'comp-8', type: 'chart', category: 'UI', iaCode: 'CHT-001', label: '진행률 차트', description: '프로젝트 진행률을 표시하는 차트입니다.', x: 470, y: 150, width: 300, height: 200, relatedRequirements: ['REQ-002'] },
    ]
  },
  {
    id: 'screen-3',
    name: '관리자 화면',
    iaCode: 'IA-003',
    description: '관리자용 사용자 목록 조회, 사용자 정보 수정, 권한 관리, 계정 상태 변경 등의 기능을 제공합니다.',
    userJourney: [
      '관리자 권한을 가진 사용자가 사이드바의 "사용자 관리" 메뉴를 클릭합니다',
      '페이지 로드 시 사용자 목록 API를 호출하여 테이블에 데이터를 렌더링합니다',
      '검색 입력 필드에 텍스트를 입력하면 디바운스된 검색 API를 호출합니다',
      '필터 드롭다운에서 권한(관리자/일반사용자) 또는 상태(활성/비활성)를 선택합니다',
      '테이블 행의 사용자명을 클릭하면 사용자 상세 정보 모달을 엽니다',
      '모달에서 사용자 정보를 수정하고 "저장" 버튼을 클릭합니다',
      '권한 변경 시 서버에 PATCH 요청을 보내고 성공 시 테이블을 업데이트합니다',
      '계정 상태 토글을 클릭하면 확인 다이얼로그를 표시하고 상태를 변경합니다',
      '변경사항 저장 시 실시간으로 테이블 데이터를 갱신하고 성공 메시지를 표시합니다'
    ],
    components: [
      { id: 'comp-9', type: 'table', category: 'UI', iaCode: 'TBL-001', label: '사용자 목록 테이블', description: '사용자 목록을 표시하는 테이블입니다.', x: 20, y: 100, width: 760, height: 400, relatedRequirements: ['REQ-003'] },
      { id: 'comp-10', type: 'input', category: 'Form', iaCode: 'INP-003', label: '검색 입력', description: '사용자 검색을 위한 입력 필드입니다.', x: 20, y: 60, width: 300, height: 40, relatedRequirements: ['REQ-003'] },
      { id: 'comp-11', type: 'select', category: 'Form', iaCode: 'SEL-001', label: '권한 필터', description: '사용자 권한별 필터링을 위한 선택 박스입니다.', x: 340, y: 60, width: 150, height: 40, relatedRequirements: ['REQ-003'] },
      { id: 'comp-12', type: 'button', category: 'UI', iaCode: 'BTN-002', label: '사용자 추가', description: '새 사용자를 추가하는 버튼입니다.', x: 650, y: 60, width: 120, height: 40, relatedRequirements: ['REQ-003'] },
    ]
  }
]

interface IADesignProps {
  onSave?: () => void
  onNextStep?: () => void
}

export function IADesign({ onSave, onNextStep }: IADesignProps) {
  const [screens, setScreens] = useState<Screen[]>(mockScreens)
  const [selectedScreen, setSelectedScreen] = useState<Screen>(screens[0])
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null)
  const [draggedComponent, setDraggedComponent] = useState<any>(null)
  const [zoom, setZoom] = useState(60)
  const [gridCols, setGridCols] = useState<1 | 2 | 3 | 4>(1)
  const [gridRows, setGridRows] = useState<1 | 2 | 3 | 4>(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const [selectedScreenForPopup, setSelectedScreenForPopup] = useState<Screen | null>(null)
  const [copiedComponent, setCopiedComponent] = useState<Component | null>(null)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const wireframeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 먼저 저장된 캔버스 상태를 확인
    const restored = restoreCanvasState()
    
    // 저장된 캔버스 상태가 없으면 기본 데이터 로드
    if (!restored) {
      const savedData = localStorage.getItem('wireframe-data')
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        setScreens(parsedData.wireframe)
        setSelectedScreen(parsedData.wireframe[0] || mockScreens[0])
      }
    }
  }, [])

  // 모드별 줌 설정
  useEffect(() => {
    if (isFullscreen) {
      setZoom(100) // 전체화면 모드 진입 시 100%로 설정 (조절 가능)
    } else {
      setZoom(60)  // 일반 모드에서는 60% 고정
    }
  }, [isFullscreen])


  const addNewScreen = () => {
    const newScreen: Screen = {
      id: `screen-${Date.now()}`,
      name: `새 화면 ${screens.length + 1}`,
      iaCode: `IA-${String(screens.length + 1).padStart(3, '0')}`,
      description: '새로운 화면 설명',
      userJourney: ['새 화면의 사용자 여정을 정의하세요'],
      components: []
    }
    setScreens([...screens, newScreen])
    setSelectedScreen(newScreen)
  }

  const updateScreen = (field: keyof Screen, value: any) => {
    setScreens(prev => prev.map(s => s.id === selectedScreen.id ? { ...s, [field]: value } : s))
    setSelectedScreen(prev => ({ ...prev!, [field]: value }))
  }

  const deleteScreen = () => {
    if (confirm(`'${selectedScreen.name}' 화면을 삭제하시겠습니까?`)) {
      setScreens(prev => prev.filter(s => s.id !== selectedScreen.id))
      setSelectedScreen(screens[0] || null)
    }
  }

  const addComponent = (type: string, category: string, iaCode: string, label: string) => {
    if (!selectedScreen) return
    const newComponent: Component = {
      id: `comp-${Date.now()}`,
      type,
      category,
      iaCode,
      label,
      description: `${label} 설명`,
      x: 50,
      y: 50,
      width: 100,
      height: 40,
      relatedRequirements: []
    }
    setScreens(prev => prev.map(s => 
      s.id === selectedScreen.id 
        ? { ...s, components: [...s.components, newComponent] } 
        : s
    ))
  }

  const updateComponent = (id: string, updates: Partial<Component>) => {
    const updatedScreens = screens.map(screen => 
      screen.id === selectedScreen.id
        ? { ...screen, components: screen.components.map(comp => 
            comp.id === id ? { ...comp, ...updates } : comp
          )}
        : screen
    )
    
    setScreens(updatedScreens)
    
    // selectedScreen도 업데이트
    const updatedScreen = updatedScreens.find(s => s.id === selectedScreen.id)
    if (updatedScreen) {
      setSelectedScreen(updatedScreen)
    }
    
    // selectedComponent도 업데이트
    if (selectedComponent && selectedComponent.id === id) {
      const updatedComponent = { ...selectedComponent, ...updates }
      setSelectedComponent(updatedComponent)
    }
  }

  const copyComponent = (componentId?: string) => {
    const targetId = componentId || selectedComponent?.id
    if (!selectedScreen || !targetId) return
    
    const componentToCopy = selectedScreen.components.find(comp => comp.id === targetId)
    if (!componentToCopy) return
    
    // 컴포넌트를 복사하여 저장 (ID는 새로 생성)
    const copiedComp = {
      ...componentToCopy,
      id: `comp-${Date.now()}-copy` // 새 ID 생성
    }
    
    setCopiedComponent(copiedComp)
    console.log('컴포넌트 복사됨:', copiedComp.label)
  }

  // 컴포넌트 자동 번호 부여 함수
  const getNextComponentNumber = (componentType: string) => {
    if (!selectedScreen) return 1
    
    // 해당 타입의 컴포넌트들을 찾아서 번호 추출
    const sameTypeComponents = selectedScreen.components.filter(comp => comp.type === componentType)
    
    if (sameTypeComponents.length === 0) return 1
    
    // 기존 컴포넌트들의 번호를 추출하여 최대값 찾기
    const numbers = sameTypeComponents.map(comp => {
      const match = comp.label.match(/\d+$/) // 끝에 있는 숫자 추출
      return match ? parseInt(match[0]) : 0
    })
    
    const maxNumber = Math.max(...numbers)
    return maxNumber + 1
  }

  // 컴포넌트 번호 재정렬 함수
  const renumberComponents = (components: Component[]) => {
    const typeGroups: { [key: string]: Component[] } = {}
    
    // 타입별로 컴포넌트 그룹화
    components.forEach(comp => {
      if (!typeGroups[comp.type]) {
        typeGroups[comp.type] = []
      }
      typeGroups[comp.type].push(comp)
    })
    
    // 각 타입별로 번호 재정렬
    Object.keys(typeGroups).forEach(type => {
      const typeComponents = typeGroups[type]
      typeComponents.forEach((comp, index) => {
        const newNumber = index + 1
        comp.label = `${type} ${newNumber}`
        comp.iaCode = `${type.toUpperCase()}-${newNumber.toString().padStart(3, '0')}`
        comp.description = `${type} ${newNumber} 설명`
      })
    })
    
    return components
  }

  // 부모-자식 관계에 따른 zIndex 계산 함수
  const calculateZIndex = (component: Component, allComponents: Component[]) => {
    // 루트 레벨 컴포넌트는 기본 zIndex
    if (!component.parentId) {
      return 10
    }
    
    // 부모 컴포넌트 찾기
    const parent = allComponents.find(comp => comp.id === component.parentId)
    if (!parent) {
      return 10
    }
    
    // 부모의 zIndex보다 높게 설정
    const parentZIndex = parent.zIndex || 10
    return parentZIndex + 10
  }

  // 모든 컴포넌트의 zIndex 업데이트
  const updateAllZIndexes = (components: Component[]) => {
    return components.map(comp => ({
      ...comp,
      zIndex: calculateZIndex(comp, components)
    }))
  }

  // 캔버스 상태 저장 함수
  const saveCanvasState = () => {
    const canvasState = {
      screens: screens,
      selectedScreen: selectedScreen,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('canvas-saved-state', JSON.stringify(canvasState))
    console.log('캔버스 상태가 저장되었습니다.')
  }

  // 저장된 캔버스 상태 복원 함수
  const restoreCanvasState = () => {
    const savedState = localStorage.getItem('canvas-saved-state')
    if (savedState) {
      try {
        const canvasState = JSON.parse(savedState)
        setScreens(canvasState.screens)
        setSelectedScreen(canvasState.selectedScreen)
        console.log('저장된 캔버스 상태가 복원되었습니다.')
        return true
      } catch (error) {
        console.error('저장된 상태 복원 중 오류:', error)
        return false
      }
    }
    return false
  }

  const pasteComponent = () => {
    if (!copiedComponent || !selectedScreen) return
    
    // 붙여넣을 위치 계산 (원본에서 약간 오프셋)
    const offsetX = 20
    const offsetY = 20
    const nextNumber = getNextComponentNumber(copiedComponent.type)
    const newComponent = {
      ...copiedComponent,
      id: `comp-${Date.now()}`,
      label: `${copiedComponent.type} ${nextNumber}`,
      x: copiedComponent.x + offsetX,
      y: copiedComponent.y + offsetY,
      parentId: undefined, // 붙여넣을 때는 독립적으로 생성
      children: [],
      zIndex: 1
    }
    
    // 새 컴포넌트 추가
    const updatedComponents = [...selectedScreen.components, newComponent]
    
    // 모든 컴포넌트의 zIndex 업데이트
    const componentsWithUpdatedZIndex = updateAllZIndexes(updatedComponents)
    
    const updatedScreens = screens.map(s => 
      s.id === selectedScreen.id 
        ? { ...s, components: componentsWithUpdatedZIndex } 
        : s
    )
    
    setScreens(updatedScreens)
    
    const updatedScreen = updatedScreens.find(s => s.id === selectedScreen.id)
    if (updatedScreen) {
      setSelectedScreen(updatedScreen)
    }
    
    setSelectedComponent(newComponent)
    console.log('컴포넌트 붙여넣기됨:', newComponent.label)
  }

  const deleteComponent = (componentId?: string) => {
    const targetId = componentId || selectedComponent?.id
    if (!selectedScreen || !targetId) return
    
    const componentToDelete = selectedScreen.components.find(comp => comp.id === targetId)
    if (!componentToDelete) return
    
    if (confirm(`'${componentToDelete.label}' 컴포넌트를 삭제하시겠습니까?`)) {
      // 컴포넌트 삭제 후 남은 컴포넌트들
      const remainingComponents = selectedScreen.components.filter(comp => comp.id !== targetId)
      
      // 번호 재정렬
      const renumberedComponents = renumberComponents([...remainingComponents])
      
      // zIndex 업데이트
      const componentsWithUpdatedZIndex = updateAllZIndexes(renumberedComponents)
      
      const updatedScreens = screens.map(screen => 
        screen.id === selectedScreen.id
          ? { ...screen, components: componentsWithUpdatedZIndex }
          : screen
      )
      
      setScreens(updatedScreens)
      
      // selectedScreen도 업데이트
      const updatedScreen = updatedScreens.find(s => s.id === selectedScreen.id)
      if (updatedScreen) {
        setSelectedScreen(updatedScreen)
      }
      
      // 삭제된 컴포넌트가 현재 선택된 컴포넌트라면 선택 해제
      if (selectedComponent?.id === targetId) {
        setSelectedComponent(null)
      }
    }
  }

  const handleDragStart = (e: React.DragEvent, componentType: any) => {
    e.dataTransfer.setData('application/json', JSON.stringify(componentType))
    setDraggedComponent(componentType)
  }

  // 드롭된 위치에서 부모가 될 수 있는 컴포넌트 찾기
  const findParentComponent = (x: number, y: number): Component | null => {
    if (!selectedScreen) return null
    
    // 컨테이너나 레이아웃 컴포넌트들을 우선적으로 찾기
    const containerTypes = ['container', 'grid', 'wrapper', 'body', 'header', 'footer', 'sidebar']
    
    // 좌표 내에 있는 컨테이너 타입 컴포넌트들을 찾기
    const potentialParents = selectedScreen.components
      .filter(comp => containerTypes.includes(comp.type))
      .filter(comp => 
        x >= comp.x && 
        x <= comp.x + comp.width && 
        y >= comp.y && 
        y <= comp.y + comp.height
      )
      .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0)) // zIndex가 높은 순으로 정렬
    
    return potentialParents.length > 0 ? potentialParents[0] : null
  }

  // 컴포넌트의 부모를 변경하는 함수
  const changeComponentParent = (componentId: string, newParentId: string | null) => {
    if (!selectedScreen) return

    const component = selectedScreen.components.find(comp => comp.id === componentId)
    if (!component) return

    // 기존 부모에서 자식 제거
    if (component.parentId) {
      const oldParent = selectedScreen.components.find(comp => comp.id === component.parentId)
      if (oldParent) {
        oldParent.children = oldParent.children?.filter(childId => childId !== componentId) || []
      }
    }

    // 새 부모에 자식 추가
    if (newParentId) {
      const newParent = selectedScreen.components.find(comp => comp.id === newParentId)
      if (newParent) {
        newParent.children = [...(newParent.children || []), componentId]
      }
    }

    // 컴포넌트의 부모 ID 업데이트
    component.parentId = newParentId

    // 모든 컴포넌트의 zIndex 업데이트
    const componentsWithUpdatedZIndex = updateAllZIndexes(selectedScreen.components)

    // 상태 업데이트
    const updatedScreens = screens.map(s => 
      s.id === selectedScreen.id 
        ? { ...s, components: componentsWithUpdatedZIndex } 
        : s
    )
    
    setScreens(updatedScreens)
    
    const updatedScreen = updatedScreens.find(s => s.id === selectedScreen.id)
    if (updatedScreen) {
      setSelectedScreen(updatedScreen)
    }
  }

  // 컴포넌트를 루트 레벨로 이동하는 함수
  const moveToRootLevel = (componentId: string) => {
    changeComponentParent(componentId, null)
  }

  // 자식 컴포넌트들을 다른 부모로 이동하는 함수
  const moveChildrenToParent = (fromParentId: string, toParentId: string) => {
    if (!selectedScreen) return

    const fromParent = selectedScreen.components.find(comp => comp.id === fromParentId)
    if (!fromParent || !fromParent.children) return

    // 모든 자식을 새 부모로 이동
    fromParent.children.forEach(childId => {
      changeComponentParent(childId, toParentId)
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!wireframeRef.current || !selectedScreen) return

    try {
      const componentData = JSON.parse(e.dataTransfer.getData('application/json'))
      if (!componentData) return

      const wireframeRect = wireframeRef.current.getBoundingClientRect()
      const x = (e.clientX - wireframeRect.left) / (zoom / 100)
      const y = (e.clientY - wireframeRect.top) / (zoom / 100)

      // 새로운 컴포넌트 생성 - 부모-자식 관계 없이 독립적으로 생성
      const nextNumber = getNextComponentNumber(componentData.type)
      const newComponent: Component = {
        id: `comp-${Date.now()}`,
        type: componentData.type,
        category: componentData.category,
        iaCode: componentData.code || componentData.iaCode || `${componentData.type.toUpperCase()}-${nextNumber.toString().padStart(3, '0')}`,
        label: `${componentData.type} ${nextNumber}`,
        description: `${componentData.type} ${nextNumber} 설명`,
        x: Math.max(0, x - 50),
        y: Math.max(0, y - 20),
        width: 100,
        height: 40,
        relatedRequirements: [],
        parentId: undefined, // 부모 없이 독립적으로 생성
        children: [],
        zIndex: 1
      }

      // 새 컴포넌트 추가
      const updatedComponents = [...selectedScreen.components, newComponent]
      
      // 모든 컴포넌트의 zIndex 업데이트
      const componentsWithUpdatedZIndex = updateAllZIndexes(updatedComponents)

      const updatedScreens = screens.map(s => 
        s.id === selectedScreen.id 
          ? { ...s, components: componentsWithUpdatedZIndex } 
          : s
      )
      
      setScreens(updatedScreens)
      
      // selectedScreen도 업데이트
      const updatedScreen = updatedScreens.find(s => s.id === selectedScreen.id)
      if (updatedScreen) {
        setSelectedScreen(updatedScreen)
      }
      
      // 새로 생성된 컴포넌트를 자동으로 선택
      setSelectedComponent(newComponent)
      setDraggedComponent(null)
    } catch (error) {
      console.error('드래그 앤 드롭 오류:', error)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleResize = useCallback((id: string, newWidth: number, newHeight: number) => {
    // 리사이즈 중에는 실시간으로 업데이트하지 않음 (성능 최적화)
    // onResizeStop에서만 최종 업데이트
  }, [])

  const handleDrag = useCallback((id: string, newX: number, newY: number) => {
    // 드래그 중에는 실시간으로 업데이트하지 않음 (성능 최적화)
    // onDragStop에서만 최종 업데이트
  }, [])

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev)
  }

  // 키보드 단축키 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 복사/붙여넣기 단축키 (컴포넌트 선택 여부와 관계없이 동작)
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'c':
            e.preventDefault()
            if (selectedComponent) {
              copyComponent()
            }
            break
          case 'v':
            e.preventDefault()
            pasteComponent()
            break
        }
        return
      }

      if (!selectedComponent) return

      const moveAmount = e.shiftKey ? 10 : 1

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          updateComponent(selectedComponent.id, { 
            y: Math.max(0, selectedComponent.y - moveAmount) 
          })
          break
        case 'ArrowDown':
          e.preventDefault()
          updateComponent(selectedComponent.id, { 
            y: selectedComponent.y + moveAmount 
          })
          break
        case 'ArrowLeft':
          e.preventDefault()
          updateComponent(selectedComponent.id, { 
            x: Math.max(0, selectedComponent.x - moveAmount) 
          })
          break
        case 'ArrowRight':
          e.preventDefault()
          updateComponent(selectedComponent.id, { 
            x: selectedComponent.x + moveAmount 
          })
          break
        case 'Delete':
        case 'Backspace':
          e.preventDefault()
          deleteComponent()
          break
        case 'Escape':
          e.preventDefault()
          setSelectedComponent(null)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedComponent, updateComponent, deleteComponent])



  const renderComponent = (component: Component) => {
    const isSelected = selectedComponent?.id === component.id
    const zoomRatio = zoom / 100
    const isParent = component.children && component.children.length > 0

    // 더 확실한 목업 디자인을 위한 스타일 함수
    const getComponentStyle = (type: string) => {
      const baseStyle = {
        position: 'absolute' as const,
        left: `${component.x * zoomRatio}px`,
        top: `${component.y * zoomRatio}px`,
        width: `${component.width * zoomRatio}px`,
        height: `${component.height * zoomRatio}px`,
        cursor: 'grab',
        fontSize: `${12 * zoomRatio}px`,
        overflow: 'hidden',
        zIndex: isSelected ? 1000 : (component.zIndex || 10),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: `${4 * zoomRatio}px`,
        boxShadow: isSelected 
          ? `0 0 0 ${2 * zoomRatio}px #3b82f6, 0 ${4 * zoomRatio}px ${8 * zoomRatio}px rgba(0,0,0,0.15)` 
          : `0 ${2 * zoomRatio}px ${4 * zoomRatio}px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)`,
        transition: 'all 0.2s ease',
        border: isSelected ? `2px solid #3b82f6` : `1px solid rgba(0,0,0,0.1)`,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }

      switch (type) {
        // 버튼 컴포넌트들
        case 'button':
        case 'cta':
        case 'action-button':
          return {
            ...baseStyle,
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            border: 'none',
            fontWeight: '600',
            textAlign: 'center' as const,
            minHeight: `${36 * zoomRatio}px`,
            minWidth: `${80 * zoomRatio}px`,
            padding: `${8 * zoomRatio}px ${16 * zoomRatio}px`,
            borderRadius: `${6 * zoomRatio}px`,
            boxShadow: `0 ${2 * zoomRatio}px ${4 * zoomRatio}px rgba(59, 130, 246, 0.3)`
          }
        
        case 'button-outline':
          return {
            ...baseStyle,
            background: 'transparent',
            color: '#3b82f6',
            border: `2px solid #3b82f6`,
            fontWeight: '600',
            textAlign: 'center' as const,
            minHeight: `${36 * zoomRatio}px`,
            minWidth: `${80 * zoomRatio}px`,
            padding: `${8 * zoomRatio}px ${16 * zoomRatio}px`,
            borderRadius: `${6 * zoomRatio}px`
          }
        
        case 'button-ghost':
          return {
            ...baseStyle,
            background: 'transparent',
            color: '#6b7280',
            border: 'none',
            fontWeight: '500',
            textAlign: 'center' as const,
            minHeight: `${32 * zoomRatio}px`,
            minWidth: `${60 * zoomRatio}px`,
            padding: `${6 * zoomRatio}px ${12 * zoomRatio}px`,
            borderRadius: `${4 * zoomRatio}px`
          }
        
        // 입력 컴포넌트들
        case 'input':
        case 'text-field':
          return {
            ...baseStyle,
            background: 'white',
            border: `1px solid #d1d5db`,
            borderRadius: `${6 * zoomRatio}px`,
            padding: `${8 * zoomRatio}px ${12 * zoomRatio}px`,
            color: '#374151',
            minHeight: `${40 * zoomRatio}px`,
            minWidth: `${200 * zoomRatio}px`,
            textAlign: 'left' as const,
            justifyContent: 'flex-start' as const
          }
        
        case 'search':
          return {
            ...baseStyle,
            background: 'white',
            border: `1px solid #d1d5db`,
            borderRadius: `${6 * zoomRatio}px`,
            padding: `${8 * zoomRatio}px ${12 * zoomRatio}px ${8 * zoomRatio}px ${32 * zoomRatio}px`,
            color: '#374151',
            minHeight: `${40 * zoomRatio}px`,
            minWidth: `${200 * zoomRatio}px`,
            textAlign: 'left' as const,
            justifyContent: 'flex-start' as const,
            position: 'relative' as const
          }
        
        case 'textarea':
          return {
            ...baseStyle,
            background: 'white',
            border: `1px solid #d1d5db`,
            borderRadius: `${6 * zoomRatio}px`,
            padding: `${12 * zoomRatio}px`,
            color: '#374151',
            minHeight: `${80 * zoomRatio}px`,
            minWidth: `${200 * zoomRatio}px`,
            textAlign: 'left' as const,
            justifyContent: 'flex-start' as const,
            alignItems: 'flex-start' as const,
            resize: 'vertical' as const
          }
        
        case 'select':
        case 'dropdown':
          return {
            ...baseStyle,
            background: 'white',
            border: `1px solid #d1d5db`,
            borderRadius: `${6 * zoomRatio}px`,
            padding: `${8 * zoomRatio}px ${12 * zoomRatio}px`,
            color: '#374151',
            minHeight: `${40 * zoomRatio}px`,
            minWidth: `${150 * zoomRatio}px`,
            textAlign: 'left' as const,
            justifyContent: 'space-between' as const,
            cursor: 'pointer'
          }
        
        case 'checkbox':
          return {
            ...baseStyle,
            background: 'white',
            border: `2px solid #d1d5db`,
            borderRadius: `${4 * zoomRatio}px`,
            minHeight: `${20 * zoomRatio}px`,
            minWidth: `${20 * zoomRatio}px`,
            padding: 0,
            justifyContent: 'center' as const,
            alignItems: 'center' as const
          }
        
        case 'radio':
          return {
            ...baseStyle,
            background: 'white',
            border: `2px solid #d1d5db`,
            borderRadius: '50%',
            minHeight: `${20 * zoomRatio}px`,
            minWidth: `${20 * zoomRatio}px`,
            padding: 0,
            justifyContent: 'center' as const,
            alignItems: 'center' as const
          }
        
        case 'switch':
          return {
            ...baseStyle,
            background: '#d1d5db',
            border: 'none',
            borderRadius: `${12 * zoomRatio}px`,
            minHeight: `${24 * zoomRatio}px`,
            minWidth: `${44 * zoomRatio}px`,
            padding: 0,
            position: 'relative' as const
          }
        
        case 'slider':
          return {
            ...baseStyle,
            background: '#e5e7eb',
            border: 'none',
            borderRadius: `${4 * zoomRatio}px`,
            minHeight: `${8 * zoomRatio}px`,
            minWidth: `${200 * zoomRatio}px`,
            position: 'relative' as const
          }
        
        // 텍스트 컴포넌트들
        case 'text':
        case 'label':
          return {
            ...baseStyle,
            background: 'transparent',
            color: '#374151',
            fontWeight: '400',
            textAlign: 'left' as const,
            padding: `${4 * zoomRatio}px ${8 * zoomRatio}px`,
            minHeight: `${20 * zoomRatio}px`,
            justifyContent: 'flex-start' as const
          }
        
        case 'heading':
        case 'title':
          return {
            ...baseStyle,
            background: 'transparent',
            color: '#111827',
            fontWeight: '700',
            fontSize: `${18 * zoomRatio}px`,
            textAlign: 'left' as const,
            padding: `${8 * zoomRatio}px 0`,
            minHeight: `${28 * zoomRatio}px`,
            justifyContent: 'flex-start' as const
          }
        
        case 'subtitle':
          return {
            ...baseStyle,
            background: 'transparent',
            color: '#6b7280',
            fontWeight: '500',
            fontSize: `${14 * zoomRatio}px`,
            textAlign: 'left' as const,
            padding: `${4 * zoomRatio}px 0`,
            minHeight: `${20 * zoomRatio}px`,
            justifyContent: 'flex-start' as const
          }
        
        // 레이아웃 컴포넌트들
        case 'header':
          return {
            ...baseStyle,
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            border: `1px solid #cbd5e1`,
            color: '#1e293b',
            fontWeight: '600',
            minHeight: `${64 * zoomRatio}px`,
            minWidth: `${400 * zoomRatio}px`,
            padding: `0 ${20 * zoomRatio}px`,
            justifyContent: 'space-between' as const,
            alignItems: 'center' as const
          }
        
        case 'footer':
          return {
            ...baseStyle,
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            color: 'white',
            border: 'none',
            minHeight: `${80 * zoomRatio}px`,
            minWidth: `${400 * zoomRatio}px`,
            padding: `${20 * zoomRatio}px`,
            justifyContent: 'center' as const,
            alignItems: 'center' as const
          }
        
        case 'sidebar':
        case 'navigation':
          return {
            ...baseStyle,
            background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
            border: `1px solid #cbd5e1`,
            color: '#475569',
            minHeight: `${200 * zoomRatio}px`,
            minWidth: `${200 * zoomRatio}px`,
            padding: `${16 * zoomRatio}px`,
            justifyContent: 'flex-start' as const,
            alignItems: 'flex-start' as const,
            flexDirection: 'column' as const
          }
        
        case 'gnb':
          return {
            ...baseStyle,
            background: 'white',
            border: `1px solid #e5e7eb`,
            color: '#374151',
            minHeight: `${56 * zoomRatio}px`,
            minWidth: `${400 * zoomRatio}px`,
            padding: `0 ${20 * zoomRatio}px`,
            justifyContent: 'space-between' as const,
            alignItems: 'center' as const,
            boxShadow: `0 ${1 * zoomRatio}px ${3 * zoomRatio}px rgba(0,0,0,0.1)`
          }
        
        // 카드 및 컨테이너 컴포넌트들
        case 'card':
          return {
            ...baseStyle,
            background: 'white',
            border: `1px solid #e5e7eb`,
            borderRadius: `${8 * zoomRatio}px`,
            padding: `${16 * zoomRatio}px`,
            color: '#374151',
            minHeight: `${120 * zoomRatio}px`,
            minWidth: `${200 * zoomRatio}px`,
            boxShadow: `0 ${1 * zoomRatio}px ${3 * zoomRatio}px rgba(0,0,0,0.1)`,
            justifyContent: 'flex-start' as const,
            alignItems: 'flex-start' as const,
            flexDirection: 'column' as const
          }
        
        case 'container':
        case 'section':
          return {
            ...baseStyle,
            background: '#f9fafb',
            border: `1px solid #e5e7eb`,
            borderRadius: `${8 * zoomRatio}px`,
            padding: `${20 * zoomRatio}px`,
            color: '#374151',
            minHeight: `${150 * zoomRatio}px`,
            minWidth: `${300 * zoomRatio}px`,
            justifyContent: 'flex-start' as const,
            alignItems: 'flex-start' as const,
            flexDirection: 'column' as const
          }
        
        case 'hero':
        case 'billboard':
          return {
            ...baseStyle,
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            border: 'none',
            borderRadius: `${12 * zoomRatio}px`,
            padding: `${40 * zoomRatio}px`,
            minHeight: `${200 * zoomRatio}px`,
            minWidth: `${400 * zoomRatio}px`,
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
            textAlign: 'center' as const,
            flexDirection: 'column' as const
          }
        
        // 미디어 컴포넌트들
        case 'image':
        case 'thumbnail':
          return {
            ...baseStyle,
            background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
            border: `2px dashed #9ca3af`,
            borderRadius: `${8 * zoomRatio}px`,
            color: '#6b7280',
            minHeight: `${120 * zoomRatio}px`,
            minWidth: `${160 * zoomRatio}px`,
            flexDirection: 'column' as const,
            gap: `${8 * zoomRatio}px`,
            alignItems: 'center' as const,
            justifyContent: 'center' as const
          }
        
        case 'video':
          return {
            ...baseStyle,
            background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
            border: `2px solid #4b5563`,
            borderRadius: `${8 * zoomRatio}px`,
            color: 'white',
            minHeight: `${120 * zoomRatio}px`,
            minWidth: `${200 * zoomRatio}px`,
            flexDirection: 'column' as const,
            gap: `${8 * zoomRatio}px`,
            alignItems: 'center' as const,
            justifyContent: 'center' as const
          }
        
        // 데이터 표시 컴포넌트들
        case 'table':
          return {
            ...baseStyle,
            background: 'white',
            border: `1px solid #d1d5db`,
            borderRadius: `${6 * zoomRatio}px`,
            color: '#374151',
            minHeight: `${120 * zoomRatio}px`,
            minWidth: `${300 * zoomRatio}px`,
            padding: `${12 * zoomRatio}px`,
            flexDirection: 'column' as const,
            alignItems: 'flex-start' as const,
            justifyContent: 'flex-start' as const,
            overflow: 'hidden'
          }
        
        case 'chart':
        case 'graph':
          return {
            ...baseStyle,
            background: 'white',
            border: `1px solid #e5e7eb`,
            borderRadius: `${8 * zoomRatio}px`,
            color: '#374151',
            minHeight: `${200 * zoomRatio}px`,
            minWidth: `${300 * zoomRatio}px`,
            padding: `${16 * zoomRatio}px`,
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
            flexDirection: 'column' as const
          }
        
        // 오버레이 컴포넌트들
        case 'modal':
        case 'popup':
        case 'dialog':
          return {
            ...baseStyle,
            background: 'white',
            border: `1px solid #d1d5db`,
            borderRadius: `${12 * zoomRatio}px`,
            color: '#374151',
            minHeight: `${200 * zoomRatio}px`,
            minWidth: `${350 * zoomRatio}px`,
            padding: `${24 * zoomRatio}px`,
            boxShadow: `0 ${20 * zoomRatio}px ${25 * zoomRatio}px -${5 * zoomRatio}px rgba(0,0,0,0.1), 0 ${10 * zoomRatio}px ${10 * zoomRatio}px -${5 * zoomRatio}px rgba(0,0,0,0.04)`,
            alignItems: 'flex-start' as const,
            justifyContent: 'flex-start' as const,
            flexDirection: 'column' as const
          }
        
        case 'tooltip':
          return {
            ...baseStyle,
            background: '#1f2937',
            color: 'white',
            border: 'none',
            borderRadius: `${6 * zoomRatio}px`,
            padding: `${8 * zoomRatio}px ${12 * zoomRatio}px`,
            minHeight: `${32 * zoomRatio}px`,
            minWidth: `${100 * zoomRatio}px`,
            fontSize: `${12 * zoomRatio}px`,
            textAlign: 'center' as const
          }
        
        case 'dropdown-menu':
          return {
            ...baseStyle,
            background: 'white',
            border: `1px solid #e5e7eb`,
            borderRadius: `${6 * zoomRatio}px`,
            color: '#374151',
            minHeight: `${120 * zoomRatio}px`,
            minWidth: `${150 * zoomRatio}px`,
            padding: `${8 * zoomRatio}px 0`,
            boxShadow: `0 ${4 * zoomRatio}px ${6 * zoomRatio}px -${1 * zoomRatio}px rgba(0,0,0,0.1)`,
            alignItems: 'flex-start' as const,
            justifyContent: 'flex-start' as const,
            flexDirection: 'column' as const
          }
        
        // 상태 표시 컴포넌트들
        case 'badge':
          return {
            ...baseStyle,
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            color: 'white',
            border: 'none',
            borderRadius: `${12 * zoomRatio}px`,
            padding: `${4 * zoomRatio}px ${8 * zoomRatio}px`,
            fontSize: `${11 * zoomRatio}px`,
            fontWeight: '500',
            minHeight: `${20 * zoomRatio}px`,
            minWidth: `${60 * zoomRatio}px`,
            textAlign: 'center' as const
          }
        
        case 'badge-success':
          return {
            ...baseStyle,
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: `${12 * zoomRatio}px`,
            padding: `${4 * zoomRatio}px ${8 * zoomRatio}px`,
            fontSize: `${11 * zoomRatio}px`,
            fontWeight: '500',
            minHeight: `${20 * zoomRatio}px`,
            minWidth: `${60 * zoomRatio}px`,
            textAlign: 'center' as const
          }
        
        case 'badge-error':
          return {
            ...baseStyle,
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            border: 'none',
            borderRadius: `${12 * zoomRatio}px`,
            padding: `${4 * zoomRatio}px ${8 * zoomRatio}px`,
            fontSize: `${11 * zoomRatio}px`,
            fontWeight: '500',
            minHeight: `${20 * zoomRatio}px`,
            minWidth: `${60 * zoomRatio}px`,
            textAlign: 'center' as const
          }
        
        case 'progress':
          return {
            ...baseStyle,
            background: '#e5e7eb',
            border: 'none',
            borderRadius: `${4 * zoomRatio}px`,
            minHeight: `${8 * zoomRatio}px`,
            minWidth: `${200 * zoomRatio}px`,
            position: 'relative' as const
          }
        
        case 'spinner':
        case 'loading':
          return {
            ...baseStyle,
            background: 'transparent',
            border: `2px solid #e5e7eb`,
            borderTop: `2px solid #3b82f6`,
            borderRadius: '50%',
            minHeight: `${24 * zoomRatio}px`,
            minWidth: `${24 * zoomRatio}px`,
            animation: 'spin 1s linear infinite'
          }
        
        case 'alert':
        case 'notification':
          return {
            ...baseStyle,
            background: '#fef3c7',
            border: `1px solid #f59e0b`,
            borderRadius: `${6 * zoomRatio}px`,
            color: '#92400e',
            minHeight: `${40 * zoomRatio}px`,
            minWidth: `${200 * zoomRatio}px`,
            padding: `${8 * zoomRatio}px ${12 * zoomRatio}px`,
            justifyContent: 'flex-start' as const,
            alignItems: 'center' as const
          }
        
        case 'alert-success':
          return {
            ...baseStyle,
            background: '#d1fae5',
            border: `1px solid #10b981`,
            borderRadius: `${6 * zoomRatio}px`,
            color: '#065f46',
            minHeight: `${40 * zoomRatio}px`,
            minWidth: `${200 * zoomRatio}px`,
            padding: `${8 * zoomRatio}px ${12 * zoomRatio}px`,
            justifyContent: 'flex-start' as const,
            alignItems: 'center' as const
          }
        
        case 'alert-error':
          return {
            ...baseStyle,
            background: '#fee2e2',
            border: `1px solid #ef4444`,
            borderRadius: `${6 * zoomRatio}px`,
            color: '#991b1b',
            minHeight: `${40 * zoomRatio}px`,
            minWidth: `${200 * zoomRatio}px`,
            padding: `${8 * zoomRatio}px ${12 * zoomRatio}px`,
            justifyContent: 'flex-start' as const,
            alignItems: 'center' as const
          }
        
        // 기본 컴포넌트
        default:
          return {
            ...baseStyle,
            background: '#f9fafb',
            color: '#6b7280',
            border: `1px solid #e5e7eb`,
            padding: `${8 * zoomRatio}px ${12 * zoomRatio}px`,
            minHeight: `${40 * zoomRatio}px`,
            minWidth: `${100 * zoomRatio}px`
          }
      }
    }

    const componentStyle = getComponentStyle(component.type)


                  return (
      <Rnd
        key={component.id}
        size={{ width: component.width * (zoom / 100), height: component.height * (zoom / 100) }}
        position={{ x: component.x * (zoom / 100), y: component.y * (zoom / 100) }}
        onDragStop={(e, d) => {
          // 드래그 완료 시 최종 위치로 업데이트 (줌 비율 역산)
          const zoomRatio = zoom / 100;
          updateComponent(component.id, { x: d.x / zoomRatio, y: d.y / zoomRatio })
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          // 리사이즈 완료 시 최종 크기와 위치로 업데이트 (줌 비율 역산)
          const zoomRatio = zoom / 100;
          updateComponent(component.id, { 
            width: ref.offsetWidth / zoomRatio, 
            height: ref.offsetHeight / zoomRatio,
            x: position.x / zoomRatio,
            y: position.y / zoomRatio
          })
        }}
        bounds="parent"
        style={componentStyle}
        className={`
          ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-50 shadow-lg' : 'hover:shadow-lg hover:ring-1 hover:ring-gray-300'}
          transition-all duration-200 cursor-pointer
          ${!isSelected ? 'hover:scale-105' : ''}
          group
        `}
        onClick={(e) => {
          e.stopPropagation()
          setSelectedComponent(component)
        }}
        onContextMenu={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setSelectedComponent(component)
          // 컨텍스트 메뉴 표시 (간단한 alert로 구현)
          const menu = document.createElement('div')
          menu.className = 'fixed bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50'
          menu.style.left = `${e.clientX}px`
          menu.style.top = `${e.clientY}px`
          
          const copyBtn = document.createElement('button')
          copyBtn.className = 'w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded flex items-center'
          copyBtn.innerHTML = '<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>복사 (Ctrl+C)'
          copyBtn.onclick = () => {
            copyComponent(component.id)
            document.body.removeChild(menu)
          }
          
          const pasteBtn = document.createElement('button')
          pasteBtn.className = 'w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded flex items-center'
          pasteBtn.innerHTML = '<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>붙여넣기 (Ctrl+V)'
          pasteBtn.onclick = () => {
            pasteComponent()
            document.body.removeChild(menu)
          }
          
          const deleteBtn = document.createElement('button')
          deleteBtn.className = 'w-full text-left px-3 py-2 text-sm hover:bg-red-100 text-red-600 rounded flex items-center'
          deleteBtn.innerHTML = '<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>삭제'
          deleteBtn.onclick = () => {
            deleteComponent(component.id)
            document.body.removeChild(menu)
          }
          
          menu.appendChild(copyBtn)
          if (copiedComponent) {
            menu.appendChild(pasteBtn)
          }
          menu.appendChild(deleteBtn)
          
          document.body.appendChild(menu)
          
          // 다른 곳 클릭 시 메뉴 제거
          const removeMenu = () => {
            if (document.body.contains(menu)) {
              document.body.removeChild(menu)
            }
            document.removeEventListener('click', removeMenu)
          }
          setTimeout(() => document.addEventListener('click', removeMenu), 100)
        }}
        resizeHandleStyles={{
          bottomRight: {
            background: '#3b82f6',
            borderRadius: '50%',
            width: '12px',
            height: '12px',
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          },
          bottomLeft: {
            background: '#3b82f6',
            borderRadius: '50%',
            width: '12px',
            height: '12px',
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          },
          topRight: {
            background: '#3b82f6',
            borderRadius: '50%',
            width: '12px',
            height: '12px',
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          },
          topLeft: {
            background: '#3b82f6',
            borderRadius: '50%',
            width: '12px',
            height: '12px',
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }
        }}
        enableResizing={{
          top: true,
          right: true,
          bottom: true,
          left: true,
          topRight: true,
          topLeft: true,
          bottomRight: true,
          bottomLeft: true,
        }}
      >
        
        {/* 최신 목업 디자인 - 컴포넌트 타입별 현실적 표현 */}
        {component.type === 'image' || component.type === 'thumbnail' ? (
          <div className="flex flex-col items-center justify-center" style={{ gap: `${8 * (zoom / 100)}px` }}>
            <Image 
              className="text-gray-400" 
              style={{ 
                width: `${32 * (zoom / 100)}px`, 
                height: `${32 * (zoom / 100)}px` 
              }} 
            />
            <span 
              className="text-gray-500" 
              style={{ fontSize: `${12 * (zoom / 100)}px` }}
            >
              이미지
            </span>
                        </div>
        ) : ['button', 'cta', 'action-button'].includes(component.type) ? (
          <div className="w-full h-full flex items-center justify-center">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-lg flex items-center justify-center"
              style={{ 
                fontSize: `${14 * (zoom / 100)}px`,
                padding: `${8 * (zoom / 100)}px ${16 * (zoom / 100)}px`,
                minWidth: `${80 * (zoom / 100)}px`,
                minHeight: `${36 * (zoom / 100)}px`,
                boxShadow: `0 ${4 * (zoom / 100)}px ${12 * (zoom / 100)}px rgba(59, 130, 246, 0.3)`
              }}
            >
              {component.label || '버튼'}
            </div>
          </div>
        ) : component.type === 'button-outline' ? (
          <div className="w-full h-full flex items-center justify-center">
            <div 
              className="border-2 border-blue-500 text-blue-500 font-medium rounded-lg flex items-center justify-center bg-white"
              style={{ 
                fontSize: `${14 * (zoom / 100)}px`,
                padding: `${8 * (zoom / 100)}px ${16 * (zoom / 100)}px`,
                minWidth: `${80 * (zoom / 100)}px`,
                minHeight: `${36 * (zoom / 100)}px`
              }}
            >
              {component.label || '아웃라인 버튼'}
            </div>
          </div>
        ) : component.type === 'button-ghost' ? (
          <div className="w-full h-full flex items-center justify-center">
            <div 
              className="text-gray-600 font-medium rounded-lg flex items-center justify-center hover:bg-gray-100"
              style={{ 
                fontSize: `${14 * (zoom / 100)}px`,
                padding: `${6 * (zoom / 100)}px ${12 * (zoom / 100)}px`,
                minWidth: `${60 * (zoom / 100)}px`,
                minHeight: `${32 * (zoom / 100)}px`
              }}
            >
              {component.label || '고스트 버튼'}
            </div>
          </div>
        ) : ['input', 'text-field'].includes(component.type) ? (
          <div className="w-full h-full flex items-center">
            <div 
              className="w-full bg-white border border-gray-300 rounded-lg flex items-center px-3"
              style={{ 
                height: `${40 * (zoom / 100)}px`,
                fontSize: `${14 * (zoom / 100)}px`
              }}
            >
              <span className="text-gray-400">
                {component.label || '입력하세요...'}
              </span>
            </div>
          </div>
        ) : component.type === 'search' ? (
          <div className="w-full h-full flex items-center">
            <div 
              className="w-full bg-white border border-gray-300 rounded-lg flex items-center px-3"
              style={{ 
                height: `${40 * (zoom / 100)}px`,
                fontSize: `${14 * (zoom / 100)}px`
              }}
            >
              <Search 
                className="text-gray-400 mr-2" 
                style={{ 
                  width: `${16 * (zoom / 100)}px`, 
                  height: `${16 * (zoom / 100)}px`
                }} 
              />
              <span className="text-gray-400">검색...</span>
            </div>
          </div>
        ) : component.type === 'textarea' ? (
          <div className="w-full h-full flex flex-col">
            <div 
              className="w-full bg-white border border-gray-300 rounded-lg p-3 flex flex-col"
              style={{ 
                minHeight: `${80 * (zoom / 100)}px`,
                fontSize: `${14 * (zoom / 100)}px`
              }}
            >
              <span className="text-gray-400 mb-2">
                {component.label || '텍스트를 입력하세요...'}
              </span>
              <div className="flex-1 bg-gray-50 rounded p-2">
                <div className="space-y-1">
                  <div className="bg-gray-200 rounded" style={{ height: `${4 * (zoom / 100)}px`, width: '80%' }}></div>
                  <div className="bg-gray-200 rounded" style={{ height: `${4 * (zoom / 100)}px`, width: '60%' }}></div>
                  <div className="bg-gray-200 rounded" style={{ height: `${4 * (zoom / 100)}px`, width: '70%' }}></div>
                </div>
              </div>
            </div>
          </div>
        ) : ['select', 'dropdown'].includes(component.type) ? (
          <div className="w-full h-full flex items-center">
            <div 
              className="w-full bg-white border border-gray-300 rounded-lg flex items-center justify-between px-3"
              style={{ 
                height: `${40 * (zoom / 100)}px`,
                fontSize: `${14 * (zoom / 100)}px`
              }}
            >
              <span className="text-gray-400">
                {component.label || '선택하세요...'}
              </span>
              <ChevronDown 
                className="text-gray-400" 
                style={{ 
                  width: `${16 * (zoom / 100)}px`, 
                  height: `${16 * (zoom / 100)}px` 
                }} 
              />
            </div>
          </div>
        ) : component.type === 'checkbox' ? (
          <div className="w-full h-full flex items-center">
            <div className="flex items-center space-x-2">
              <div 
                className="border-2 border-gray-300 rounded bg-white flex items-center justify-center"
                style={{ 
                  width: `${20 * (zoom / 100)}px`, 
                  height: `${20 * (zoom / 100)}px` 
                }}
              >
                <div 
                  className="w-2 h-2 bg-blue-500 rounded-sm"
                  style={{ 
                    width: `${8 * (zoom / 100)}px`, 
                    height: `${8 * (zoom / 100)}px` 
                  }}
                ></div>
              </div>
              <span style={{ fontSize: `${14 * (zoom / 100)}px` }}>
                {component.label || '체크박스'}
              </span>
            </div>
          </div>
        ) : component.type === 'radio' ? (
          <div className="w-full h-full flex items-center">
            <div className="flex items-center space-x-2">
              <div 
                className="border-2 border-gray-300 rounded-full bg-white flex items-center justify-center"
                style={{ 
                  width: `${20 * (zoom / 100)}px`, 
                  height: `${20 * (zoom / 100)}px` 
                }}
              >
                <div 
                  className="w-2 h-2 bg-blue-500 rounded-full"
                  style={{ 
                    width: `${8 * (zoom / 100)}px`, 
                    height: `${8 * (zoom / 100)}px` 
                  }}
                ></div>
              </div>
              <span style={{ fontSize: `${14 * (zoom / 100)}px` }}>
                {component.label || '라디오 버튼'}
              </span>
            </div>
          </div>
        ) : component.type === 'switch' ? (
          <div className="w-full h-full flex items-center">
            <div className="flex items-center space-x-2">
              <div 
                className="bg-blue-500 rounded-full relative"
                style={{ 
                  width: `${44 * (zoom / 100)}px`, 
                  height: `${24 * (zoom / 100)}px` 
                }}
              >
                <div 
                  className="bg-white rounded-full absolute top-0.5 right-0.5 shadow-lg"
                  style={{ 
                    width: `${20 * (zoom / 100)}px`, 
                    height: `${20 * (zoom / 100)}px` 
                  }}
                ></div>
              </div>
              <span style={{ fontSize: `${14 * (zoom / 100)}px` }}>
                {component.label || '스위치'}
              </span>
            </div>
          </div>
        ) : component.type === 'slider' ? (
          <div className="w-full h-full flex items-center">
            <div className="w-full relative">
              <div 
                className="bg-gray-200 rounded-full"
                style={{ height: `${8 * (zoom / 100)}px` }}
              >
                <div 
                  className="bg-blue-500 rounded-full relative"
                  style={{ 
                    width: '60%', 
                    height: '100%' 
                  }}
                >
                  <div 
                    className="bg-white border-2 border-blue-500 rounded-full absolute shadow-lg"
                    style={{ 
                      width: `${20 * (zoom / 100)}px`, 
                      height: `${20 * (zoom / 100)}px`,
                      right: `-${10 * (zoom / 100)}px`,
                      top: `-${6 * (zoom / 100)}px`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ) : ['text', 'label'].includes(component.type) ? (
          <div className="w-full h-full flex items-center">
            <span 
              className="text-gray-700"
              style={{ fontSize: `${14 * (zoom / 100)}px` }}
            >
              {component.label || '텍스트'}
            </span>
          </div>
        ) : ['heading', 'title'].includes(component.type) ? (
          <div className="w-full h-full flex items-center">
            <h1 
              className="font-bold text-gray-900"
              style={{ fontSize: `${24 * (zoom / 100)}px` }}
            >
              {component.label || '제목'}
            </h1>
          </div>
        ) : component.type === 'subtitle' ? (
          <div className="w-full h-full flex items-center">
            <h2 
              className="font-semibold text-gray-600"
              style={{ fontSize: `${18 * (zoom / 100)}px` }}
            >
              {component.label || '부제목'}
            </h2>
          </div>
        ) : component.type === 'header' ? (
          <div className="w-full h-full flex items-center justify-between px-4">
            <div className="flex items-center space-x-3">
              <div 
                className="bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ 
                  width: `${32 * (zoom / 100)}px`, 
                  height: `${32 * (zoom / 100)}px`,
                  fontSize: `${12 * (zoom / 100)}px`
                }}
              >
                L
              </div>
              <span 
                className="font-bold text-gray-900"
                style={{ fontSize: `${18 * (zoom / 100)}px` }}
              >
                Logo
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <span style={{ fontSize: `${14 * (zoom / 100)}px` }}>홈</span>
              <span style={{ fontSize: `${14 * (zoom / 100)}px` }}>제품</span>
              <span style={{ fontSize: `${14 * (zoom / 100)}px` }}>서비스</span>
              <span style={{ fontSize: `${14 * (zoom / 100)}px` }}>연락처</span>
            </div>
            <div className="flex items-center space-x-3">
              <Search 
                className="text-gray-400" 
                style={{ 
                  width: `${20 * (zoom / 100)}px`, 
                  height: `${20 * (zoom / 100)}px` 
                }} 
              />
              <div 
                className="bg-gray-300 rounded-full"
                style={{ 
                  width: `${32 * (zoom / 100)}px`, 
                  height: `${32 * (zoom / 100)}px` 
                }}
              ></div>
            </div>
          </div>
        ) : component.type === 'footer' ? (
          <div className="text-center w-full">
            <span 
              className="text-sm" 
              style={{ fontSize: `${14 * (zoom / 100)}px` }}
            >
              © 2024 Company Name. All rights reserved.
            </span>
          </div>
        ) : ['sidebar', 'navigation'].includes(component.type) ? (
          <div className="flex flex-col w-full" style={{ gap: `${12 * (zoom / 100)}px` }}>
            <div className="flex items-center" style={{ gap: `${8 * (zoom / 100)}px` }}>
              <div 
                className="bg-blue-500 rounded" 
                style={{ 
                  width: `${20 * (zoom / 100)}px`, 
                  height: `${20 * (zoom / 100)}px` 
                }}
              ></div>
              <span style={{ fontSize: `${14 * (zoom / 100)}px` }}>홈</span>
            </div>
            <div className="flex items-center" style={{ gap: `${8 * (zoom / 100)}px` }}>
              <div 
                className="bg-gray-300 rounded" 
                style={{ 
                  width: `${20 * (zoom / 100)}px`, 
                  height: `${20 * (zoom / 100)}px` 
                }}
              ></div>
              <span style={{ fontSize: `${14 * (zoom / 100)}px` }}>제품</span>
            </div>
            <div className="flex items-center" style={{ gap: `${8 * (zoom / 100)}px` }}>
              <div 
                className="bg-gray-300 rounded" 
                style={{ 
                  width: `${20 * (zoom / 100)}px`, 
                  height: `${20 * (zoom / 100)}px` 
                }}
              ></div>
              <span style={{ fontSize: `${14 * (zoom / 100)}px` }}>서비스</span>
            </div>
            <div className="flex items-center" style={{ gap: `${8 * (zoom / 100)}px` }}>
              <div 
                className="bg-gray-300 rounded" 
                style={{ 
                  width: `${20 * (zoom / 100)}px`, 
                  height: `${20 * (zoom / 100)}px` 
                }}
              ></div>
              <span style={{ fontSize: `${14 * (zoom / 100)}px` }}>연락처</span>
            </div>
          </div>
        ) : component.type === 'gnb' ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center" style={{ gap: `${24 * (zoom / 100)}px` }}>
              <span style={{ fontSize: `${14 * (zoom / 100)}px` }}>홈</span>
              <span style={{ fontSize: `${14 * (zoom / 100)}px` }}>제품</span>
              <span style={{ fontSize: `${14 * (zoom / 100)}px` }}>서비스</span>
              <span style={{ fontSize: `${14 * (zoom / 100)}px` }}>회사소개</span>
            </div>
            <div className="flex items-center" style={{ gap: `${12 * (zoom / 100)}px` }}>
              <Search 
                className="text-gray-400" 
                style={{ 
                  width: `${16 * (zoom / 100)}px`, 
                  height: `${16 * (zoom / 100)}px` 
                }} 
              />
              <div 
                className="bg-gray-300 rounded-full" 
                style={{ 
                  width: `${24 * (zoom / 100)}px`, 
                  height: `${24 * (zoom / 100)}px` 
                }}
              ></div>
            </div>
          </div>
        ) : component.type === 'card' ? (
          <div className="w-full h-full flex flex-col" style={{ gap: `${12 * (zoom / 100)}px` }}>
            <div 
              className="bg-gray-200 rounded" 
              style={{ 
                width: '100%', 
                height: `${60 * (zoom / 100)}px` 
              }}
            ></div>
            <div className="space-y-2">
              <div 
                className="bg-gray-200 rounded" 
                style={{ 
                  width: '80%', 
                  height: `${12 * (zoom / 100)}px` 
                }}
              ></div>
              <div 
                className="bg-gray-200 rounded" 
                style={{ 
                  width: '60%', 
                  height: `${12 * (zoom / 100)}px` 
                }}
              ></div>
            </div>
          </div>
        ) : ['container', 'section'].includes(component.type) ? (
          <div className="w-full h-full flex flex-col" style={{ gap: `${16 * (zoom / 100)}px` }}>
            <div 
              className="bg-gray-200 rounded" 
              style={{ 
                width: '100%', 
                height: `${40 * (zoom / 100)}px` 
              }}
            ></div>
            <div className="grid grid-cols-2 gap-4 flex-1">
              <div 
                className="bg-gray-100 rounded" 
                style={{ height: `${60 * (zoom / 100)}px` }}
              ></div>
              <div 
                className="bg-gray-100 rounded" 
                style={{ height: `${60 * (zoom / 100)}px` }}
              ></div>
            </div>
          </div>
        ) : ['hero', 'billboard'].includes(component.type) ? (
          <div className="text-center w-full">
            <h1 
              className="font-bold mb-4" 
              style={{ fontSize: `${24 * (zoom / 100)}px` }}
            >
              {component.label || '메인 제목'}
            </h1>
            <p 
              className="mb-6 opacity-90" 
              style={{ fontSize: `${16 * (zoom / 100)}px` }}
            >
              부제목 또는 설명 텍스트
            </p>
            <div 
              className="bg-white text-blue-600 px-6 py-2 rounded inline-block" 
              style={{ fontSize: `${14 * (zoom / 100)}px` }}
            >
              시작하기
            </div>
          </div>
        ) : component.type === 'video' ? (
          <div className="flex flex-col items-center justify-center" style={{ gap: `${8 * (zoom / 100)}px` }}>
            <Play 
              className="text-white" 
              style={{ 
                width: `${32 * (zoom / 100)}px`, 
                height: `${32 * (zoom / 100)}px` 
              }} 
            />
            <span 
              className="text-white" 
              style={{ fontSize: `${12 * (zoom / 100)}px` }}
            >
              비디오
            </span>
          </div>
        ) : ['chart', 'graph'].includes(component.type) ? (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div 
              className="bg-gray-200 rounded" 
              style={{ 
                width: '80%', 
                height: `${60 * (zoom / 100)}px` 
              }}
            ></div>
            <span 
              className="text-gray-500 mt-2" 
              style={{ fontSize: `${12 * (zoom / 100)}px` }}
            >
              차트
            </span>
          </div>
        ) : ['modal', 'popup', 'dialog'].includes(component.type) ? (
          <div className="w-full h-full flex flex-col p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 
                className="font-semibold text-gray-900"
                style={{ fontSize: `${18 * (zoom / 100)}px` }}
              >
                {component.label || '모달 제목'}
              </h3>
              <X 
                className="text-gray-400" 
                style={{ 
                  width: `${24 * (zoom / 100)}px`, 
                  height: `${24 * (zoom / 100)}px` 
                }} 
              />
            </div>
            <div className="flex-1 mb-4">
              <p 
                className="text-gray-600"
                style={{ fontSize: `${14 * (zoom / 100)}px` }}
              >
                모달 내용이 여기에 표시됩니다.
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <div 
                className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700"
                style={{ fontSize: `${12 * (zoom / 100)}px` }}
              >
                취소
              </div>
              <div 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                style={{ fontSize: `${12 * (zoom / 100)}px` }}
              >
                확인
              </div>
            </div>
          </div>
        ) : component.type === 'tooltip' ? (
          <div className="w-full h-full flex items-center justify-center">
            <div 
              className="bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg"
              style={{ fontSize: `${12 * (zoom / 100)}px` }}
            >
              {component.label || '툴팁 텍스트'}
            </div>
          </div>
        ) : component.type === 'dropdown-menu' ? (
          <div className="w-full h-full flex flex-col p-2">
            <div 
              className="bg-gray-100 rounded px-3 py-2 mb-1"
              style={{ 
                height: `${32 * (zoom / 100)}px`,
                fontSize: `${14 * (zoom / 100)}px`
              }}
            >
              메뉴 항목 1
            </div>
            <div 
              className="bg-gray-100 rounded px-3 py-2 mb-1"
              style={{ 
                height: `${32 * (zoom / 100)}px`,
                fontSize: `${14 * (zoom / 100)}px`
              }}
            >
              메뉴 항목 2
            </div>
            <div 
              className="bg-gray-100 rounded px-3 py-2"
              style={{ 
                height: `${32 * (zoom / 100)}px`,
                fontSize: `${14 * (zoom / 100)}px`
              }}
            >
              메뉴 항목 3
            </div>
          </div>
        ) : ['badge', 'badge-success', 'badge-error'].includes(component.type) ? (
          <div className="w-full h-full flex items-center justify-center">
            <div 
              className={`px-3 py-1 rounded-full font-medium ${
                component.type === 'badge-success' ? 'bg-green-500' : 
                component.type === 'badge-error' ? 'bg-red-500' : 'bg-yellow-500'
              } text-white`}
              style={{ fontSize: `${11 * (zoom / 100)}px` }}
            >
              {component.label || '배지'}
            </div>
          </div>
        ) : ['spinner', 'loading'].includes(component.type) ? (
          <div className="w-full h-full flex items-center justify-center">
            <div 
              className="border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"
              style={{ 
                width: `${32 * (zoom / 100)}px`, 
                height: `${32 * (zoom / 100)}px` 
              }}
            ></div>
          </div>
        ) : ['alert', 'alert-success', 'alert-error'].includes(component.type) ? (
          <div className="w-full h-full flex items-center">
            <div 
              className={`border rounded-lg p-3 flex items-center ${
                component.type === 'alert-success' ? 'bg-green-50 border-green-200' : 
                component.type === 'alert-error' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <div 
                className="w-2 h-2 rounded-full mr-2"
                style={{ 
                  backgroundColor: component.type === 'alert-success' ? '#10b981' : 
                                 component.type === 'alert-error' ? '#ef4444' : '#f59e0b'
                }}
              ></div>
              <span 
                className={`${
                  component.type === 'alert-success' ? 'text-green-800' : 
                  component.type === 'alert-error' ? 'text-red-800' : 'text-yellow-800'
                }`}
                style={{ fontSize: `${12 * (zoom / 100)}px` }}
              >
                {component.label || '알림 메시지'}
              </span>
            </div>
          </div>
        ) : component.type === 'table' ? (
          <div className="w-full">
            <div 
              className="grid grid-cols-3 mb-2" 
              style={{ gap: `${8 * (zoom / 100)}px` }}
            >
              <div 
                className="bg-gray-200 rounded" 
                style={{ height: `${12 * (zoom / 100)}px` }}
              ></div>
              <div 
                className="bg-gray-200 rounded" 
                style={{ height: `${12 * (zoom / 100)}px` }}
              ></div>
              <div 
                className="bg-gray-200 rounded" 
                style={{ height: `${12 * (zoom / 100)}px` }}
              ></div>
    </div>
            <div 
              className="grid grid-cols-3" 
              style={{ gap: `${8 * (zoom / 100)}px` }}
            >
              <div 
                className="bg-gray-100 rounded" 
                style={{ height: `${12 * (zoom / 100)}px` }}
              ></div>
              <div 
                className="bg-gray-100 rounded" 
                style={{ height: `${12 * (zoom / 100)}px` }}
              ></div>
              <div 
                className="bg-gray-100 rounded" 
                style={{ height: `${12 * (zoom / 100)}px` }}
              ></div>
                        </div>
              </div>
        ) : component.type === 'progress' ? (
          <div 
            className="w-full bg-gray-200 rounded-full" 
            style={{ height: `${8 * (zoom / 100)}px` }}
          >
            <div 
              className="bg-blue-500 rounded-full" 
              style={{ 
                height: `${8 * (zoom / 100)}px`, 
                width: '60%' 
              }}
            ></div>
          </div>
        ) : component.type === 'badge' ? (
          <span 
            className="font-medium" 
            style={{ fontSize: `${12 * (zoom / 100)}px` }}
          >
            NEW
          </span>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span 
              className="text-gray-500"
              style={{ fontSize: `${12 * (zoom / 100)}px` }}
            >
              {component.label || component.type}
            </span>
          </div>
        )}
        
        {/* 자식 컴포넌트들은 캔버스 레벨에서 독립적으로 렌더링됨 */}
      </Rnd>
    )
  }

  const renderPropertiesPanel = () => {
    if (!selectedComponent) return null
    
                  return (
      <div className="space-y-6">
        {/* 기본 정보 섹션 */}
    <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 border-b pb-2">기본 정보</h4>
          
          <div className="grid grid-cols-2 gap-3">
      <div>
              <Label htmlFor="comp-type" className="text-xs text-gray-600">타입</Label>
              <div className="mt-1 px-3 py-2 bg-gray-50 rounded-md text-sm font-medium text-gray-700">
                {selectedComponent.type}
            </div>
          </div>
            <div>
              <Label htmlFor="comp-category" className="text-xs text-gray-600">카테고리</Label>
              <div className="mt-1 px-3 py-2 bg-gray-50 rounded-md text-sm font-medium text-gray-700">
                {selectedComponent.category}
        </div>
    </div>
          </div>

      <div>
            <Label htmlFor="comp-label" className="text-xs text-gray-600">라벨</Label>
        <Input
              id="comp-label" 
              value={selectedComponent.label} 
              onChange={(e) => updateComponent(selectedComponent.id, { label: e.target.value })}
              className="mt-1"
        />
      </div>
      
      <div>
            <Label htmlFor="comp-iaCode" className="text-xs text-gray-600">IA 코드</Label>
        <Input
              id="comp-iaCode" 
              value={selectedComponent.iaCode} 
              onChange={(e) => updateComponent(selectedComponent.id, { iaCode: e.target.value })}
              className="mt-1"
        />
      </div>

      <div>
            <Label htmlFor="comp-description" className="text-xs text-gray-600">설명</Label>
        <Textarea
              id="comp-description" 
              value={selectedComponent.description} 
              onChange={(e) => updateComponent(selectedComponent.id, { description: e.target.value })}
              className="mt-1"
          rows={3}
        />
          </div>
      </div>
      
        {/* 위치 및 크기 섹션 */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 border-b pb-2">위치 및 크기</h4>
          
          <div className="grid grid-cols-2 gap-3">
        <div>
              <Label htmlFor="comp-x" className="text-xs text-gray-600">X 좌표</Label>
          <Input
                id="comp-x" 
            type="number"
                value={Math.round(selectedComponent.x)} 
                onChange={(e) => updateComponent(selectedComponent.id, { x: parseInt(e.target.value) || 0 })}
                className="mt-1"
          />
        </div>
        <div>
              <Label htmlFor="comp-y" className="text-xs text-gray-600">Y 좌표</Label>
          <Input
                id="comp-y" 
            type="number"
                value={Math.round(selectedComponent.y)} 
                onChange={(e) => updateComponent(selectedComponent.id, { y: parseInt(e.target.value) || 0 })}
                className="mt-1"
          />
        </div>
      </div>
      
          <div className="grid grid-cols-2 gap-3">
        <div>
              <Label htmlFor="comp-width" className="text-xs text-gray-600">너비</Label>
          <Input
                id="comp-width" 
            type="number"
                value={Math.round(selectedComponent.width)} 
                onChange={(e) => updateComponent(selectedComponent.id, { width: parseInt(e.target.value) || 100 })}
                className="mt-1"
          />
        </div>
        <div>
              <Label htmlFor="comp-height" className="text-xs text-gray-600">높이</Label>
          <Input
                id="comp-height" 
            type="number"
                value={Math.round(selectedComponent.height)} 
                onChange={(e) => updateComponent(selectedComponent.id, { height: parseInt(e.target.value) || 40 })}
                className="mt-1"
          />
            </div>
        </div>
      </div>

        {/* 요구사항 연결 섹션 */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 border-b pb-2">요구사항 연결</h4>
      
      <div>
            <Label htmlFor="comp-reqs" className="text-xs text-gray-600">관련 요구사항</Label>
            <Select
              value={selectedComponent.relatedRequirements[0] || ''}
              onValueChange={(value) => updateComponent(selectedComponent.id, { relatedRequirements: [value] })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="요구사항 선택" />
          </SelectTrigger>
          <SelectContent>
                {mockRequirements.map(req => (
                  <SelectItem key={req.id} value={req.reqId}>
                    {req.reqId} - {req.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
          </div>
      </div>
      
        {/* 부모-자식 관계 섹션 */}
        
        {/* 액션 버튼 섹션 */}
      <div className="pt-4 border-t space-y-2">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              const saveData = {
                wireframe: screens,
                timestamp: new Date().toISOString(),
                project: 'SI Project Management Dashboard'
              }
              localStorage.setItem('wireframe-data', JSON.stringify(saveData))
              
              // 캔버스 상태도 함께 저장
              saveCanvasState()
              
              alert('와이어프레임이 저장되었습니다.')
            }}
          >
          <Save className="w-4 h-4 mr-2" />
          저장
        </Button>
        <Button 
          variant="outline" 
          className="w-full text-red-600 border-red-200 hover:bg-red-50"
          onClick={deleteComponent}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          삭제
        </Button>
      </div>
    </div>
  )
  }

  const filterComponents = (components: any[], query: string) => {
    if (!query.trim()) return components
    return components.filter(component => 
      component.label.toLowerCase().includes(query.toLowerCase()) ||
      component.description.toLowerCase().includes(query.toLowerCase()) ||
      component.type.toLowerCase().includes(query.toLowerCase())
    )
  }

  // 계층 구조를 재귀적으로 렌더링하는 함수
  const renderLayerItem = (component: Component, depth: number = 0) => {
    const isSelected = selectedComponent?.id === component.id
    const hasChildren = component.children && component.children.length > 0
    const childComponents = selectedScreen?.components.filter(comp => comp.parentId === component.id) || []
    
    return (
      <div key={component.id}>
        <div
          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors group ${
            isSelected 
              ? 'bg-blue-100 border border-blue-300' 
              : 'hover:bg-gray-50 border border-transparent'
          }`}
          style={{ paddingLeft: `${8 + depth * 20}px` }}
          onClick={() => setSelectedComponent(component)}
        >
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {hasChildren && (
              <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
            )}
            {!hasChildren && (
              <div className="w-3 h-3 flex-shrink-0" />
            )}
            <div className="w-4 h-4 bg-gray-300 rounded flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium truncate">{component.label}</p>
              <p className="text-xs text-gray-500 truncate">{component.type}</p>
              {component.parentId && (
                <p className="text-xs text-blue-500 truncate">
                  부모: {selectedScreen?.components.find(p => p.id === component.parentId)?.label}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-1 flex-shrink-0">
            <Badge variant="outline" className="text-xs">
              {component.iaCode}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                copyComponent(component.id)
              }}
            >
              <Copy className="w-3 h-3 text-blue-500" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                deleteComponent(component.id)
              }}
            >
              <Trash2 className="w-3 h-3 text-red-500" />
            </Button>
          </div>
        </div>
        
        {/* 자식 컴포넌트들 재귀적으로 렌더링 */}
        {hasChildren && (
          <div className="ml-4">
            {childComponents.map(child => renderLayerItem(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  const renderComponentList = () => {
    if (!selectedScreen || selectedScreen.components.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Layers className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">캔버스에 컴포넌트가 없습니다</p>
          <p className="text-xs mt-1">컴포넌트를 드래그하여 추가하세요</p>
        </div>
      )
    }

    const clearAllComponents = () => {
      if (window.confirm('캔버스의 모든 컴포넌트를 삭제하시겠습니까?')) {
        const updatedScreens = screens.map(screen => 
          screen.id === selectedScreen.id 
            ? { ...screen, components: [] }
            : screen
        )
        setScreens(updatedScreens)
        
        // 선택된 화면도 업데이트
        const updatedSelectedScreen = updatedScreens.find(screen => screen.id === selectedScreen.id)
        if (updatedSelectedScreen) {
          setSelectedScreen(updatedSelectedScreen)
        }
        
        setSelectedComponent(null)
      }
    }

    return (
      <div className="space-y-2">
        {/* 전체 삭제 버튼 */}
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-gray-700">
            캔버스 컴포넌트 ({selectedScreen.components.length})
          </h4>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={pasteComponent}
              disabled={!copiedComponent}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
            >
              <Clipboard className="w-3 h-3 mr-1" />
              붙여넣기
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={clearAllComponents}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              전체 삭제
            </Button>
          </div>
        </div>
        
        {/* 부모-자식 관계 관리 컨트롤 */}
        {selectedComponent && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">계층 관계 관리</h4>
            <div className="space-y-2">
              {/* 부모 설정 */}
              <div>
                <Label className="text-xs text-gray-600">부모 설정</Label>
                <Select
                  value={selectedComponent.parentId || 'none'}
                  onValueChange={(value) => changeComponentParent(selectedComponent.id, value === 'none' ? null : value)}
                >
                  <SelectTrigger className="mt-1 h-8">
                    <SelectValue placeholder="부모 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">루트 레벨 (부모 없음)</SelectItem>
                    {selectedScreen.components
                      .filter(comp => comp.id !== selectedComponent.id && 
                        ['container', 'grid', 'wrapper', 'body', 'header', 'footer', 'sidebar'].includes(comp.type))
                      .map(comp => (
                        <SelectItem key={comp.id} value={comp.id}>
                          {comp.label} ({comp.type})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* 자식 추가 */}
              <div>
                <Label className="text-xs text-gray-600">자식 추가</Label>
                <Select
                  onValueChange={(childId) => {
                    if (childId && childId !== 'none') {
                      changeComponentParent(childId, selectedComponent.id)
                    }
                  }}
                >
                  <SelectTrigger className="mt-1 h-8">
                    <SelectValue placeholder="자식으로 추가할 컴포넌트 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedScreen.components
                      .filter(comp => comp.id !== selectedComponent.id && comp.parentId !== selectedComponent.id)
                      .map(comp => (
                        <SelectItem key={comp.id} value={comp.id}>
                          {comp.label} ({comp.type})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* 계층 구조로 컴포넌트 렌더링 */}
        {selectedScreen.components
          .filter(comp => !comp.parentId) // 부모가 없는 컴포넌트들만 먼저 렌더링
          .map(component => renderLayerItem(component))}
      </div>
    )
  }

  const renderComponentLibrary = (isCompact: boolean) => {
    const categoryNames = {
      layout: '레이아웃',
      navigation: '내비게이션',
      input: '입력/상호작용',
      button: '버튼 & 액션',
      popup: '팝업/오버레이',
      information: '정보 구조 & 프로세스',
      visual: '시각 요소/미디어',
      state: '상태 & 피드백',
      interaction: '상호작용 & 제스처',
      marketing: '마케팅 & 정책',
      etc: '기타/확장'
    }
          
          return (
      <Accordion type="multiple" defaultValue={['layout', 'navigation', 'input']} className="w-full">
        {(() => {
          const filteredCategories = Object.entries(componentLibrary).map(([categoryKey, components]) => {
            const filteredComponents = filterComponents(components, searchQuery)
            return { categoryKey, filteredComponents }
          }).filter(({ filteredComponents }) => filteredComponents.length > 0)

          if (filteredCategories.length === 0 && searchQuery.trim()) {
            return (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">검색 결과가 없습니다</p>
                <p className="text-xs mt-1">다른 키워드로 검색해보세요</p>
              </div>
            )
          }

          return filteredCategories.map(({ categoryKey, filteredComponents }) => (
            <AccordionItem key={categoryKey} value={categoryKey}>
              <AccordionTrigger className="text-sm font-medium">
                {categoryNames[categoryKey as keyof typeof categoryNames]} ({filteredComponents.length})
              </AccordionTrigger>
              <AccordionContent>
                <div className={`grid ${isCompact ? 'grid-cols-1' : 'grid-cols-2'} gap-2 mt-2`}>
                  {filteredComponents.map((component, index) => {
                  const IconComponent = component.icon
                  return (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, component)}
                          className="p-2 border rounded-lg cursor-grab active:cursor-grabbing hover:bg-gray-50 flex items-center space-x-2 transition-colors"
                        >
                          <IconComponent className="w-4 h-4 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium truncate">{component.label}</p>
                            <p className="text-xs text-gray-500 truncate">{component.description}</p>
            </div>
              </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{component.label} - {component.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
          ))
        })()}
      </Accordion>
    )
  }

  const CanvasContent = ({ isFullscreenMode = false }) => (
    <div className="flex-1 relative overflow-auto p-4" onDrop={handleDrop} onDragOver={handleDragOver}>
      <div 
        ref={wireframeRef}
        className={`relative bg-white border border-gray-300 shadow-lg mx-auto 
          grid 
          ${gridRows === 1 ? 'grid-rows-1' : gridRows === 2 ? 'grid-rows-2' : gridRows === 3 ? 'grid-rows-3' : 'grid-rows-4'}
          ${gridCols === 1 ? 'grid-cols-1' : gridCols === 2 ? 'grid-cols-2' : gridCols === 3 ? 'grid-cols-3' : 'grid-cols-4'}
        `}
        style={{ 
          width: `${800 * (zoom / 100)}px`, 
          height: `${600 * (zoom / 100)}px`,
          transformOrigin: 'top left',
          backgroundSize: `${(800 / gridCols) * (zoom / 100)}px ${(600 / gridRows) * (zoom / 100)}px`,
          backgroundImage: `linear-gradient(to right, #eee 1px, transparent 1px), linear-gradient(to bottom, #eee 1px, transparent 1px)`
        }}
        onClick={() => setSelectedComponent(null)}
      >
        {/* 모든 컴포넌트를 평등하게 렌더링 */}
        {selectedScreen?.components.map(renderComponent)}
      </div>
    </div>
  )

  // 전체화면 컴포넌트
  const FullscreenCanvas = () => (
    <TooltipProvider>
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        {/* 전체화면 헤더 */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">
              {selectedScreen.name}
            </h1>
            <Badge className="bg-blue-600">
              {selectedScreen.iaCode}
            </Badge>
            <span className="text-sm text-gray-600">
              {selectedScreen.components.length}개 컴포넌트
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {/* 줌 컨트롤 - 전체화면 모드에서만 표시 */}
            {isFullscreen ? (
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setZoom(Math.max(50, zoom - 10))}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm min-w-[40px] text-center">
                  {zoom}%
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setZoom(Math.min(200, zoom + 10))
                  }
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  줌: {zoom}%
                </span>
              </div>
            )}
            
            {/* 그리드 컨트롤 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm">세로:</span>
              {[1, 2, 3, 4].map((rows) => (
                <Button
                  key={rows}
                  size="sm"
                  variant={
                    gridRows === rows
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    setGridRows(rows as 1 | 2 | 3 | 4)
                  }
                  className="px-2"
                >
                  {rows}
                </Button>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">가로:</span>
              {[1, 2, 3, 4].map((cols) => (
                <Button
                  key={cols}
                  size="sm"
                  variant={
                    gridCols === cols
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    setGridCols(cols as 1 | 2 | 3 | 4)
                  }
                  className="px-2"
                >
                  {cols}
                </Button>
              ))}
            </div>
            <Button
              onClick={toggleFullscreen}
              variant="outline"
            >
              <X className="w-4 h-4 mr-2" />
              닫기
            </Button>
          </div>
        </div>
        
        {/* 전체화면 메인 영역 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 중앙 캔버스 영역 */}
          <div className="flex-1 flex flex-col bg-gray-100">
            <CanvasContent isFullscreenMode={true} />
          </div>
          
          {/* 우측 컴포넌트 라이브러리 + 속성 패널 */}
          <div className="w-80 border-l bg-gray-50 overflow-y-auto flex-shrink-0 flex flex-col">
            {/* 컴포넌트 라이브러리 */}
            <div className="border-b bg-gray-50">
              <div className="p-4">
                <h3 className="font-medium mb-3">
                  컴포넌트 라이브러리
                </h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="컴포넌트 검색..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                    }}
                    onCompositionStart={(e) => {
                      setIsComposing(true)
                      e.currentTarget.focus()
                    }}
                    onCompositionEnd={(e) => {
                      setIsComposing(false)
                      setSearchQuery(e.currentTarget.value)
                      e.currentTarget.focus()
                    }}
                    onKeyDown={(e) => {
                      e.currentTarget.focus()
                    }}
                    onInput={(e) => {
                      e.currentTarget.focus()
                    }}
                    className="pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    autoComplete="off"
                    spellCheck="false"
                  />
                </div>
              </div>
              <div className="px-4 pb-4 max-h-80 overflow-y-auto">
                {renderComponentLibrary(false)}
              </div>
            </div>
            
            {/* 캔버스 컴포넌트 리스트 */}
            <div className="border-b bg-gray-50">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">캔버스 컴포넌트</h3>
                  <Badge variant="outline" className="text-xs">
                    {selectedScreen?.components.length || 0}개
                  </Badge>
                </div>
              </div>
              <div className="px-4 pb-4 h-[300px] overflow-y-auto">
                {renderComponentList()}
              </div>
            </div>
            
            {/* 속성 패널 */}
              <div className="flex-1 p-4">
                <h3 className="font-medium mb-3">속성 패널</h3>
              {selectedComponent ? (
                <div>
                  <div className="flex items-center justify-between mb-4 p-2 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-blue-800">
                        {selectedComponent.label} 선택됨
                      </span>
                    </div>
                  <Badge variant="outline" className="text-xs">
                    {selectedComponent.iaCode}
                  </Badge>
                </div>
                {renderPropertiesPanel()}
              </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center py-4 text-gray-500">
                  <MousePointer className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">컴포넌트를 선택하세요</p>
                </div>

              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );

  // 전체화면 모드인 경우 전체화면 컴포넌트 렌더링
  if (isFullscreen) {
    return <FullscreenCanvas />;
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">IA Design</h2>
            <p className="text-gray-600 mt-1">
              인터랙션 아키텍처 설계 및 와이어프레임을 구성할 수 있습니다
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={addNewScreen}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              화면 추가
            </Button>
            <Button
              onClick={toggleFullscreen}
              variant="outline"
            >
              <Maximize className="w-4 h-4 mr-2" />
              전체 화면
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Screen List */}
          <div className="col-span-3">
            {/* Screen List */}
            <Card>
              <CardHeader>
                <CardTitle>화면 목록</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {screens.map((screen) => (
                  <div
                    key={screen.id}
                    className={`rounded-lg border ${
                      selectedScreen.id === screen.id
                        ? "bg-blue-50 border-blue-200"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="p-3">
                    <div
                        className="cursor-pointer"
                      onClick={() => setSelectedScreen(screen)}
                    >
                        <h4 className="font-medium text-sm">
                          {screen.name}
                        </h4>
                        <Badge
                          variant="outline"
                          className="mt-1 text-xs"
                        >
                        {screen.iaCode}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-2">
                        {screen.components.length}개 컴포넌트
                      </p>
                      </div>
                      
                      <div className="mt-2 flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              상세보기
                            </Button>
                          </DialogTrigger>
                          <DialogContent 
                            className="z-[9999] bg-white rounded-lg shadow-2xl border-2 border-gray-500 p-0 max-w-lg"
                            style={{ 
                              position: 'fixed',
                              top: 'calc(50% + 330px)',
                              left: 'calc(50% + 160px)',
                              transform: 'translate(-50%, -50%)',
                              zIndex: 9999,
                              width: 'min(80vw, 32rem)',
                              height: 'auto',
                              maxHeight: '75vh',
                              margin: '1rem',
                              overflow: 'hidden',
                              display: 'flex',
                              flexDirection: 'column'
                            }}
                          >
                            <DialogHeader className="border-b border-gray-400 bg-white pb-4 px-6 pt-6">
                              <DialogTitle className="text-xl mb-2">
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Layers className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <span className="font-bold text-gray-900">{screen.name}</span>
                                    <Badge variant="secondary" className="ml-2 text-sm">{screen.iaCode}</Badge>
                                  </div>
                                </div>
                              </DialogTitle>
                              <DialogDescription className="text-gray-600 text-base text-left">
                                화면의 상세 정보와 사용자 여정을 확인할 수 있습니다.
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4 flex-1 overflow-y-auto px-6 pb-4 bg-white">
                              {/* 화면 정보 카드 */}
                              <div className="bg-white rounded-lg p-3 border border-gray-300">
                                <h3 className="text-base font-semibold mb-2 text-gray-900 flex items-center">
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                                  화면 정보
                                </h3>
                                <div className="space-y-2">
                                  <div>
                                    <span className="text-xs font-medium text-gray-600">화면명</span>
                                    <p className="text-gray-900 font-medium text-sm">{screen.name}</p>
                                  </div>
                                  <div>
                                    <span className="text-xs font-medium text-gray-600">설명</span>
                                    <p className="text-gray-700 text-sm">{screen.description}</p>
                                  </div>
                                </div>
                              </div>

                              {/* 사용자 여정 카드 */}
                              <div className="bg-white rounded-lg p-3 border border-gray-300">
                                <h3 className="text-base font-semibold mb-3 text-gray-900 flex items-center">
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                                  사용자 여정
                                </h3>
                                <div className="space-y-2">
                                  {screen.userJourney.map((step, index) => (
                                    <div key={index} className="flex items-start space-x-2 p-2 bg-gray-50 rounded-lg border border-gray-300">
                                      <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                                        {index + 1}
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-gray-800 text-xs leading-relaxed font-medium">{step}</p>
                                        {index < screen.userJourney.length - 1 && (
                                          <div className="w-px h-3 bg-blue-200 ml-3 mt-1"></div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    
                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center justify-between w-full px-3 pb-2 text-xs text-gray-600 hover:text-gray-800">
                        <span>상세 설명</span>
                        <ChevronDown className="w-3 h-3" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-3 pb-3">
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {screen.description}
                        </p>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Center - Canvas */}
          <div className="col-span-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedScreen.name}</CardTitle>
                    <Badge className="mt-2 bg-blue-600">
                      {selectedScreen.iaCode}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* 줌 컨트롤 */}
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setZoom(Math.max(50, zoom - 10))
                        }
                      >
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <span className="text-sm min-w-[40px] text-center">
                        {zoom}%
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setZoom(Math.min(200, zoom + 10))
                        }
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* 그리드 컨트롤 */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">세로:</span>
                      {[1, 2, 3, 4].map((rows) => (
                        <Button
                          key={rows}
                          size="sm"
                          variant={
                            gridRows === rows
                              ? "default"
                              : "outline"
                          }
                          onClick={() =>
                            setGridRows(rows as 1 | 2 | 3 | 4)
                          }
                          className="px-2"
                        >
                          {rows}
                        </Button>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">가로:</span>
                      {[1, 2, 3, 4].map((cols) => (
                        <Button
                          key={cols}
                          size="sm"
                          variant={
                            gridCols === cols
                              ? "default"
                              : "outline"
                          }
                          onClick={() =>
                            setGridCols(cols as 1 | 2 | 3 | 4)
                          }
                          className="px-2"
                        >
                          {cols}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CanvasContent />
              </CardContent>
            </Card>

            {/* Canvas Components List - 캔버스 아래로 이동 */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>캔버스 컴포넌트</span>
                  <Badge variant="outline" className="text-xs">
                    {selectedScreen?.components.length || 0}개
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[400px] overflow-y-auto">
                {renderComponentList()}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Component Library + Properties Panel */}
          <div className="col-span-3 space-y-4">
            {/* Component Library */}
            <Card>
              <CardHeader>
                <CardTitle>컴포넌트 라이브러리</CardTitle>
                <div className="relative mt-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="컴포넌트 검색..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                    }}
                    onCompositionStart={(e) => {
                      setIsComposing(true)
                      e.currentTarget.focus()
                    }}
                    onCompositionEnd={(e) => {
                      setIsComposing(false)
                      setSearchQuery(e.currentTarget.value)
                      e.currentTarget.focus()
                    }}
                    onKeyDown={(e) => {
                      e.currentTarget.focus()
                    }}
                    onInput={(e) => {
                      e.currentTarget.focus()
                    }}
                    className="pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    autoComplete="off"
                    spellCheck="false"
                  />
                </div>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                {renderComponentLibrary(false)}
              </CardContent>
            </Card>


            {/* Properties Panel */}
            <Card>
              <CardHeader>
                <CardTitle>속성 패널</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedComponent ? (
                  <div>
                    <div className="flex items-center justify-between mb-4 p-2 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-blue-800">
                          {selectedComponent.label} 선택됨
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {selectedComponent.iaCode}
                      </Badge>
                    </div>
                    <div className="mb-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                      ID: {selectedComponent.id} | 타입: {selectedComponent.type}
                    </div>
                    {renderPropertiesPanel()}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center py-4 text-gray-500">
                    <MousePointer className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">컴포넌트를 선택하세요</p>
                    </div>

                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
          <Button 
            onClick={() => setShowSaveDialog(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            저장 및 다음 단계
          </Button>
        </div>
      </div>

      {/* Save Confirmation Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg border border-gray-200 shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">저장 확인</h3>
            <p className="text-gray-600 mb-8">
              IA 설계를 저장하고 다음 단계로 진행하시겠습니까?
            </p>
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowSaveDialog(false)}
              >
                취소
              </Button>
              <Button 
                variant="default" 
                onClick={() => {
                  setShowSaveDialog(false)
                  onSave?.()
                  onNextStep?.()
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                저장 및 다음 단계
              </Button>
            </div>
          </div>
        </div>
      )}
    </TooltipProvider>
  );
}
