# IA 디자인 도구 구현 가이드 (Next.js + Nest.js)

## 🎯 프로젝트 개요
인터랙션 아키텍처(IA) 설계를 위한 드래그앤드롭 와이어프레임 빌더 구현

## 📁 프로젝트 구조

```
ia-design-tool/
├── frontend/                 # Next.js 14 + TypeScript
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── store/
│   ├── types/
│   └── utils/
└── backend/                 # Nest.js + TypeScript
    └── src/
        ├── modules/
        ├── dto/
        └── entities/
```

## 🚀 구현 단계

### 1단계: 프로젝트 초기화

#### Frontend 설정
```bash
npx create-next-app@latest frontend --typescript --tailwind --app
cd frontend
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install zustand axios lucide-react
npx shadcn-ui@latest init
npx shadcn-ui@latest add card button input label textarea select badge
npx shadcn-ui@latest add accordion collapsible tooltip dialog sheet
```

#### Backend 설정
```bash
nest new backend
cd backend
npm install @nestjs/typeorm typeorm mysql2
npm install @nestjs/swagger swagger-ui-express
npm install class-validator class-transformer
```

### 2단계: 타입 정의

#### `frontend/types/ia-design.types.ts`
```typescript
// 화면 인터페이스
export interface Screen {
  id: string;
  name: string;
  iaCode: string;
  description: string;
  components: Component[];
  createdAt?: Date;
  updatedAt?: Date;
}

// 컴포넌트 인터페이스
export interface Component {
  id: string;
  type: string;
  category: ComponentCategory;
  iaCode: string;
  label: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
  relatedRequirements: string[];
  properties?: Record<string, any>;
  zIndex?: number;
}

// 요구사항 인터페이스
export interface Requirement {
  id: string;
  reqId: string;
  serviceType: "F/O" | "B/O" | "API/RFC" | "AI";
  name: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  status: "진행중" | "완료" | "대기" | "검토중";
}

// 컴포넌트 카테고리
export enum ComponentCategory {
  LAYOUT = "layout",
  NAVIGATION = "navigation",
  INPUT = "input",
  BUTTON = "button",
  POPUP = "popup",
  MEDIA = "media",
  STATE = "state",
  DATA = "data"
}

// 드래그 상태
export interface DragState {
  isDragging: boolean;
  isResizing: boolean;
  dragStart: { x: number; y: number };
  resizeHandle: string;
}
```

### 3단계: 컴포넌트 라이브러리 정의

#### `frontend/constants/component-library.ts`
```typescript
import { 
  Layout, Square, Columns, Grid3X3, Image,
  Menu, List, Navigation, ChevronDown, MoreHorizontal,
  Type, Search, FileText, Calendar, Upload,
  Zap, Settings, Plus, Share,
  Layers, Bell, Info, AlertTriangle,
  Video, User, Star, Tag,
  Loader, Archive, XCircle, Table, Filter
} from 'lucide-react';

export const componentLibrary = {
  layout: [
    {
      type: "header",
      icon: Layout,
      label: "헤더",
      description: "상단 영역, 사이트 식별/주요 내비게이션 포함",
    },
    {
      type: "footer",
      icon: Layout,
      label: "푸터",
      description: "하단 영역, 정보·내비게이션·정책 등",
    },
    {
      type: "sidebar",
      icon: Columns,
      label: "사이드바",
      description: "화면 좌/우측에 배치된 보조 메뉴",
    },
    {
      type: "container",
      icon: Square,
      label: "컨테이너",
      description: "여러 요소를 담는 박스/섹션",
    },
    {
      type: "grid",
      icon: Grid3X3,
      label: "그리드",
      description: "Content 배치용 행·열 시스템",
    },
  ],
  navigation: [
    {
      type: "gnb",
      icon: Menu,
      label: "GNB",
      description: "Global Navigation Bar, 사이트 전체 메뉴",
    },
    {
      type: "lnb",
      icon: List,
      label: "LNB",
      description: "Local Navigation Bar, 섹션별 하위 메뉴",
    },
    {
      type: "breadcrumb",
      icon: Navigation,
      label: "브레드크럼",
      description: "현재 위치 단계별 표시",
    },
    {
      type: "tab",
      icon: Layers,
      label: "탭",
      description: "콘텐츠 구분/전환 UI",
    },
    {
      type: "pagination",
      icon: MoreHorizontal,
      label: "페이지네이션",
      description: "페이지 번호 및 이동 UI",
    },
  ],
  // ... 나머지 카테고리들
};
```

### 4단계: 상태 관리 (Zustand Store)

#### `frontend/store/ia-design.store.ts`
```typescript
import { create } from 'zustand';
import { Screen, Component, Requirement } from '@/types/ia-design.types';

interface IADesignState {
  // 상태
  screens: Screen[];
  selectedScreen: Screen | null;
  selectedComponent: Component | null;
  requirements: Requirement[];
  zoom: number;
  gridCols: 1 | 2 | 3 | 4;
  gridRows: 1 | 2 | 3 | 4;
  isFullscreen: boolean;
  
  // 액션
  addScreen: (screen: Screen) => void;
  selectScreen: (screen: Screen) => void;
  updateScreen: (screen: Screen) => void;
  deleteScreen: (screenId: string) => void;
  
  addComponent: (component: Component) => void;
  selectComponent: (component: Component | null) => void;
  updateComponent: (component: Component) => void;
  deleteComponent: (componentId: string) => void;
  moveComponent: (componentId: string, x: number, y: number) => void;
  resizeComponent: (componentId: string, width: number, height: number, x?: number, y?: number) => void;
  
  setZoom: (zoom: number) => void;
  setGrid: (cols: number, rows: number) => void;
  toggleFullscreen: () => void;
}

export const useIADesignStore = create<IADesignState>((set, get) => ({
  screens: [],
  selectedScreen: null,
  selectedComponent: null,
  requirements: [],
  zoom: 100,
  gridCols: 1,
  gridRows: 1,
  isFullscreen: false,
  
  addScreen: (screen) => set((state) => ({
    screens: [...state.screens, screen]
  })),
  
  selectScreen: (screen) => set({ 
    selectedScreen: screen,
    selectedComponent: null 
  }),
  
  updateScreen: (screen) => set((state) => ({
    screens: state.screens.map(s => s.id === screen.id ? screen : s),
    selectedScreen: screen
  })),
  
  deleteScreen: (screenId) => set((state) => ({
    screens: state.screens.filter(s => s.id !== screenId),
    selectedScreen: state.selectedScreen?.id === screenId ? null : state.selectedScreen
  })),
  
  addComponent: (component) => set((state) => {
    if (!state.selectedScreen) return state;
    
    const updatedScreen = {
      ...state.selectedScreen,
      components: [...state.selectedScreen.components, component]
    };
    
    return {
      screens: state.screens.map(s => s.id === updatedScreen.id ? updatedScreen : s),
      selectedScreen: updatedScreen
    };
  }),
  
  // ... 나머지 액션 구현
}));
```

### 5단계: 메인 캔버스 컴포넌트

#### `frontend/components/ia-design/canvas.tsx`
```typescript
'use client';

import { useRef, useCallback, useEffect } from 'react';
import { useIADesignStore } from '@/store/ia-design.store';
import { Component } from '@/types/ia-design.types';

export function Canvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const {
    selectedScreen,
    selectedComponent,
    zoom,
    gridCols,
    gridRows,
    selectComponent,
    moveComponent,
    resizeComponent
  } = useIADesignStore();

  // 드래그 상태
  const [dragState, setDragState] = useState({
    isDragging: false,
    isResizing: false,
    dragStart: { x: 0, y: 0 },
    resizeHandle: '',
  });

  // 드래그앤드롭 핸들러
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // 그리드 스냅
    if (gridCols > 1 || gridRows > 1) {
      const columnWidth = rect.width / gridCols;
      const rowHeight = rect.height / gridRows;
      const gridCol = Math.floor(x / columnWidth);
      const gridRow = Math.floor(y / rowHeight);
      x = gridCol * columnWidth + 20;
      y = gridRow * rowHeight + 20;
    }

    // 컴포넌트 생성 로직
    // ...
  }, [gridCols, gridRows]);

  // 컴포넌트 이동
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!selectedComponent || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();

    if (dragState.isDragging) {
      const newX = e.clientX - rect.left - dragState.dragStart.x;
      const newY = e.clientY - rect.top - dragState.dragStart.y;

      // 경계 제한
      const constrainedX = Math.max(0, Math.min(newX, rect.width - selectedComponent.width));
      const constrainedY = Math.max(0, Math.min(newY, rect.height - selectedComponent.height));

      moveComponent(selectedComponent.id, constrainedX, constrainedY);
    }

    if (dragState.isResizing) {
      // 리사이즈 로직
      handleResize(e, rect);
    }
  }, [selectedComponent, dragState]);

  // 리사이즈 핸들러
  const handleResize = useCallback((e: MouseEvent, rect: DOMRect) => {
    if (!selectedComponent) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let newWidth = selectedComponent.width;
    let newHeight = selectedComponent.height;
    let newX = selectedComponent.x;
    let newY = selectedComponent.y;

    switch (dragState.resizeHandle) {
      case 'nw': // 북서 (왼쪽 위)
        newWidth = Math.max(50, selectedComponent.x + selectedComponent.width - mouseX);
        newHeight = Math.max(30, selectedComponent.y + selectedComponent.height - mouseY);
        newX = Math.max(0, Math.min(mouseX, selectedComponent.x + selectedComponent.width - 50));
        newY = Math.max(0, Math.min(mouseY, selectedComponent.y + selectedComponent.height - 30));
        break;
      // ... 나머지 7방향 핸들
    }

    resizeComponent(selectedComponent.id, newWidth, newHeight, newX, newY);
  }, [selectedComponent, dragState.resizeHandle]);

  // 그리드 오버레이 렌더링
  const renderGridOverlay = () => {
    if (gridCols === 1 && gridRows === 1) return null;

    const lines = [];
    
    // 세로 그리드 라인
    for (let i = 1; i < gridCols; i++) {
      lines.push(
        <div
          key={`col-${i}`}
          className="absolute top-0 bottom-0 border-l-2 border-dashed border-blue-300 opacity-50"
          style={{ left: `${(100 / gridCols) * i}%` }}
        />
      );
    }

    // 가로 그리드 라인
    for (let i = 1; i < gridRows; i++) {
      lines.push(
        <div
          key={`row-${i}`}
          className="absolute left-0 right-0 border-t-2 border-dashed border-blue-300 opacity-50"
          style={{ top: `${(100 / gridRows) * i}%` }}
        />
      );
    }

    return lines;
  };

  // 컴포넌트 렌더링
  const renderComponents = () => {
    if (!selectedScreen) return null;

    return selectedScreen.components.map((component) => (
      <ComponentElement
        key={component.id}
        component={component}
        isSelected={selectedComponent?.id === component.id}
        onSelect={() => selectComponent(component)}
        onMouseDown={(e) => handleComponentMouseDown(component, e)}
        onResizeMouseDown={(handle, e) => handleResizeMouseDown(component, handle, e)}
      />
    ));
  };

  return (
    <div
      ref={canvasRef}
      className="relative bg-white border-2 border-dashed border-gray-300"
      style={{
        width: `${1024 * (zoom / 100)}px`,
        height: `${768 * (zoom / 100)}px`,
        transform: `scale(${zoom / 100})`,
        transformOrigin: 'top left'
      }}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {renderGridOverlay()}
      {renderComponents()}
    </div>
  );
}
```

### 6단계: 컴포넌트 엘리먼트

#### `frontend/components/ia-design/component-element.tsx`
```typescript
interface ComponentElementProps {
  component: Component;
  isSelected: boolean;
  onSelect: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onResizeMouseDown: (handle: string, e: React.MouseEvent) => void;
}

export function ComponentElement({ 
  component, 
  isSelected, 
  onSelect, 
  onMouseDown,
  onResizeMouseDown 
}: ComponentElementProps) {
  const IconComponent = getComponentIcon(component.type);

  return (
    <div
      className={`absolute border-2 select-none ${
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-lg z-10"
          : "border-gray-300 bg-white hover:border-gray-400 z-0"
      } transition-all group cursor-move`}
      style={{
        left: component.x,
        top: component.y,
        width: component.width,
        height: component.height,
      }}
      onMouseDown={onMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* 컴포넌트 내용 */}
      <div className="flex items-center justify-center h-full pointer-events-none">
        <IconComponent className="w-4 h-4 mr-1" />
        <span className="truncate text-xs">{component.label}</span>
      </div>

      {/* IA Code 라벨 */}
      <div className="absolute -top-6 left-0 bg-blue-600 text-white px-2 py-1 rounded text-xs">
        {component.iaCode}
      </div>

      {/* 삭제 버튼 */}
      <button
        className="absolute -top-8 -right-8 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          // 삭제 로직
        }}
      >
        <X className="w-3 h-3" />
      </button>

      {/* 리사이즈 핸들 (8방향) */}
      {isSelected && (
        <>
          {/* 모서리 핸들 */}
          <ResizeHandle position="nw" onMouseDown={onResizeMouseDown} />
          <ResizeHandle position="ne" onMouseDown={onResizeMouseDown} />
          <ResizeHandle position="sw" onMouseDown={onResizeMouseDown} />
          <ResizeHandle position="se" onMouseDown={onResizeMouseDown} />
          
          {/* 변 중앙 핸들 */}
          <ResizeHandle position="n" onMouseDown={onResizeMouseDown} />
          <ResizeHandle position="s" onMouseDown={onResizeMouseDown} />
          <ResizeHandle position="e" onMouseDown={onResizeMouseDown} />
          <ResizeHandle position="w" onMouseDown={onResizeMouseDown} />
        </>
      )}
    </div>
  );
}
```

### 7단계: 속성 패널

#### `frontend/components/ia-design/properties-panel.tsx`
```typescript
export function PropertiesPanel() {
  const { selectedComponent, updateComponent, requirements } = useIADesignStore();

  if (!selectedComponent) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MousePointer className="w-8 h-8 mx-auto mb-2" />
        <p className="text-sm">컴포넌트를 선택하세요</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* IA Code */}
      <div>
        <Label>IA Code</Label>
        <Input
          value={selectedComponent.iaCode}
          readOnly
          className="bg-gray-50"
        />
      </div>

      {/* Label */}
      <div>
        <Label>Label/Text</Label>
        <Input
          value={selectedComponent.label}
          onChange={(e) => updateComponent({
            ...selectedComponent,
            label: e.target.value
          })}
        />
      </div>

      {/* Description */}
      <div>
        <Label>설명</Label>
        <Textarea
          value={selectedComponent.description}
          onChange={(e) => updateComponent({
            ...selectedComponent,
            description: e.target.value
          })}
          rows={3}
        />
      </div>

      {/* Size & Position */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Width</Label>
          <Input
            type="number"
            value={selectedComponent.width}
            onChange={(e) => updateComponent({
              ...selectedComponent,
              width: parseInt(e.target.value)
            })}
          />
        </div>
        <div>
          <Label>Height</Label>
          <Input
            type="number"
            value={selectedComponent.height}
            onChange={(e) => updateComponent({
              ...selectedComponent,
              height: parseInt(e.target.value)
            })}
          />
        </div>
      </div>

      {/* Related Requirements */}
      <div>
        <Label>연관 요구사항</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedComponent.relatedRequirements.map((reqId) => {
            const requirement = requirements.find(r => r.reqId === reqId);
            return (
              <Badge key={reqId} variant="outline" className="text-xs">
                {reqId}: {requirement?.name || "알 수 없음"}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t space-y-2">
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          저장
        </Button>
        <Button
          variant="outline"
          className="w-full text-red-600"
          onClick={() => deleteComponent(selectedComponent.id)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          삭제
        </Button>
      </div>
    </div>
  );
}
```

### 8단계: 백엔드 API 구현

#### `backend/src/modules/screens/screens.controller.ts`
```typescript
@Controller('api/screens')
export class ScreensController {
  constructor(private readonly screensService: ScreensService) {}

  @Get()
  findAll() {
    return this.screensService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.screensService.findOne(id);
  }

  @Post()
  create(@Body() createScreenDto: CreateScreenDto) {
    return this.screensService.create(createScreenDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateScreenDto: UpdateScreenDto) {
    return this.screensService.update(id, updateScreenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.screensService.remove(id);
  }
}
```

#### `backend/src/modules/components/components.service.ts`
```typescript
@Injectable()
export class ComponentsService {
  // IA Code 자동 생성
  generateIACode(type: string, screenCode: string, existingComponents: Component[]): string {
    const prefix = type.toUpperCase().substring(0, 3);
    const sameTypeComponents = existingComponents.filter(c => 
      c.iaCode.startsWith(`${prefix}-${screenCode}`)
    );
    const sequence = String(sameTypeComponents.length + 1).padStart(2, '0');
    return `${prefix}-${screenCode}-${sequence}`;
  }

  // 요구사항 자동 매핑
  autoMapRequirements(componentType: string, componentLabel: string): string[] {
    const mappedReqs: string[] = [];
    
    // 키워드 기반 매핑
    const mappingRules = {
      'login': 'REQ-001',
      '로그인': 'REQ-001',
      'product': 'REQ-002',
      '상품': 'REQ-002',
      'payment': 'REQ-003',
      '결제': 'REQ-003',
      'recommend': 'REQ-004',
      '추천': 'REQ-004',
    };

    for (const [keyword, reqId] of Object.entries(mappingRules)) {
      if (componentType.toLowerCase().includes(keyword) || 
          componentLabel.toLowerCase().includes(keyword)) {
        mappedReqs.push(reqId);
      }
    }

    return mappedReqs.length > 0 ? mappedReqs : ['REQ-001'];
  }
}
```

### 9단계: 유틸리티 함수들

#### `frontend/utils/ia-helpers.ts`
```typescript
// 컴포넌트 아이콘 가져오기
export function getComponentIcon(type: string): any {
  for (const category of Object.values(componentLibrary)) {
    const comp = category.find((c) => c.type === type);
    if (comp) return comp.icon;
  }
  return Square;
}

// 그리드 스냅 계산
export function snapToGrid(
  value: number, 
  gridSize: number, 
  canvasSize: number
): number {
  const cellSize = canvasSize / gridSize;
  return Math.round(value / cellSize) * cellSize;
}

// 경계 제한
export function constrainBounds(
  x: number, 
  y: number, 
  width: number, 
  height: number,
  canvasWidth: number,
  canvasHeight: number
) {
  return {
    x: Math.max(0, Math.min(x, canvasWidth - width)),
    y: Math.max(0, Math.min(y, canvasHeight - height)),
  };
}
```

### 10단계: 메인 페이지 통합

#### `frontend/app/ia-design/page.tsx`
```typescript
'use client';

import { useEffect } from 'react';
import { Canvas } from '@/components/ia-design/canvas';
import { ComponentLibrary } from '@/components/ia-design/component-library';
import { PropertiesPanel } from '@/components/ia-design/properties-panel';
import { ScreenList } from '@/components/ia-design/screen-list';
import { Toolbar } from '@/components/ia-design/toolbar';
import { FullscreenMode } from '@/components/ia-design/fullscreen-mode';
import { useIADesignStore } from '@/store/ia-design.store';

export default function IADesignPage() {
  const { isFullscreen, loadInitialData } = useIADesignStore();

  useEffect(() => {
    // 초기 데이터 로드
    loadInitialData();
  }, []);

  if (isFullscreen) {
    return <FullscreenMode />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">IA Design</h1>
          <p className="text-gray-600 mt-1">
            인터랙션 아키텍처 설계 및 와이어프레임 구성
          </p>
        </div>

        {/* Toolbar */}
        <Toolbar />

        {/* Main Layout */}
        <div className="grid grid-cols-12 gap-6 mt-6">
          {/* Left Sidebar - Screen List */}
          <div className="col-span-3">
            <ScreenList />
          </div>

          {/* Center - Canvas */}
          <div className="col-span-6">
            <Canvas />
          </div>

          {/* Right Sidebar */}
          <div className="col-span-3 space-y-4">
            <ComponentLibrary />
            <PropertiesPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 🔑 핵심 기능 구현 포인트

### 드래그앤드롭 최적화
- `useCallback`으로 이벤트 핸들러 메모이제이션
- `document` 레벨 이벤트 리스너로 부드러운 드래그
- `pointer-events` 제어로 드래그 중 하위 요소 클릭 방지

### 리사이즈 핸들 구현
- 8방향 핸들 (nw, n, ne, e, se, s, sw, w)
- 최소 크기 제한 (width: 50px, height: 30px)
- 캔버스 경계 벗어나지 않도록 제한

### 그리드 시스템
- 1x1 ~ 4x4 그리드 지원
- 그리드 스냅 옵션
- 시각적 그리드 오버레이

### 성능 최적화
- 가상화 스크롤 (많은 컴포넌트 처리)
- 디바운싱 (연속적인 업데이트)
- 메모이제이션 (불필요한 렌더링 방지)

## 📝 추가 구현 사항

### 실시간 협업
- WebSocket 기반 실시간 동기화
- 다중 사용자 커서 표시
- 충돌 해결 메커니즘

### 버전 관리
- 변경 이력 저장
- 실행 취소/재실행 기능
- 스냅샷 저장/복원

### 내보내기 기능
- JSON 형식 내보내기
- 이미지(PNG/SVG) 내보내기
- PDF 문서 생성

### 템플릿 시스템
- 사전 정의된 레이아웃 템플릿
- 커스텀 템플릿 저장
- 템플릿 마켓플레이스

## 🚦 구현 순서

1. **기본 구조 설정** (1-2일)
   - 프로젝트 초기화
   - 타입 정의
   - 기본 레이아웃

2. **핵심 기능 구현** (3-4일)
   - 드래그앤드롭
   - 캔버스 컴포넌트
   - 컴포넌트 라이브러리

3. **상호작용 구현** (2-3일)
   - 컴포넌트 이동/리사이즈
   - 속성 편집
   - 그리드 시스템

4. **백엔드 연동** (2일)
   - API 구현
   - 데이터 저장/불러오기

5. **최적화 및 마무리** (1-2일)
   - 성능 최적화
   - 버그 수정
   - UI/UX 개선

## 🎯 체크리스트

- [ ] 프로젝트 초기 설정 완료
- [ ] 타입 정의 완료
- [ ] 컴포넌트 라이브러리 구현
- [ ] 드래그앤드롭 기능 구현
- [ ] 캔버스 렌더링 구현
- [ ] 컴포넌트 이동/리사이즈 구현
- [ ] 속성 패널 구현
- [ ] 그리드 시스템 구현
- [ ] 전체화면 모드 구현
- [ ] 백엔드 API 구현
- [ ] 데이터 저장/불러오기 구현
- [ ] 요구사항 자동 매핑 구현
- [ ] IA Code 자동 생성 구현
- [ ] 성능 최적화
- [ ] 테스트 작성