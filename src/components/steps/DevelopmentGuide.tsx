import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Checkbox } from '../ui/checkbox'
import { Textarea } from '../ui/textarea'
import { 
  ChevronRight, 
  ChevronDown, 
  Monitor, 
  Code, 
  Database, 
  TestTube,
  Search,
  Copy,
  Download,
  Terminal,
  CheckCircle,
  BookOpen,
  FileText,
  Settings,
  Shield,
  LogIn,
  LayoutDashboard,
  Zap,
  TestTube2,
  Bug,
  CheckSquare
} from 'lucide-react'

interface GuideSection {
  id: string
  title: string
  icon: any
  progress: number
  expanded: boolean
  subsections: GuideSubsection[]
}

interface GuideSubsection {
  id: string
  title: string
  content: string
  codeTemplate: string
  testScenario?: string
  requirements: string[]
  implemented: boolean
}

interface IACode {
  id: string
  iaCode: string
  description: string
  component: string
  requirements: string[]
  implemented: boolean
}

const mockGuideData: GuideSection[] = [
  {
    id: '1',
    title: '인증 시스템',
    icon: Shield,
    progress: 80,
    expanded: true,
    subsections: [
      {
        id: '1-1',
        title: '인증 API 구현',
        content: `# 인증 API 구현 가이드

## 엔드포인트 목록
- POST /api/auth/login - 로그인
- POST /api/auth/logout - 로그아웃  
- POST /api/auth/refresh - 토큰 갱신
- GET /api/auth/me - 현재 사용자 정보

## 인증 방식
JWT (JSON Web Token) 기반 인증을 사용합니다.

## 보안 고려사항
- 비밀번호 해싱 (bcrypt)
- 토큰 만료 시간 설정
- Refresh Token 로테이션`,
        codeTemplate: `// auth.service.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await axios.post(\`\${API_BASE_URL}/auth/login\`, credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    await axios.post(\`\${API_BASE_URL}/auth/logout\`);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axios.post(\`\${API_BASE_URL}/auth/refresh\`, {
      refreshToken
    });
    return response.data;
  },

  async getCurrentUser() {
    const response = await axios.get(\`\${API_BASE_URL}/auth/me\`);
    return response.data;
  }
};`,
        testScenario: `// auth.test.ts
import { authService } from './auth.service';

describe('Auth Service', () => {
  test('로그인 성공', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const result = await authService.login(credentials);
    
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
    expect(result.user.email).toBe(credentials.email);
  });

  test('로그아웃 성공', async () => {
    await expect(authService.logout()).resolves.not.toThrow();
  });
});`,
        requirements: ['REQ-001', 'REQ-002'],
        implemented: true
      }
    ]
  },
  {
    id: '2',
    title: '로그인 화면',
    icon: LogIn,
    progress: 90,
    expanded: true,
    subsections: [
      {
        id: '2-1',
        title: '로그인 화면 구현',
        content: `# 로그인 화면 구현 가이드

## 개요
사용자 인증을 위한 로그인 화면을 구현합니다.

## 주요 기능
- 이메일/비밀번호 입력
- 로그인 처리
- 유효성 검사
- 에러 처리

## UI/UX 요구사항
- 반응형 디자인
- 접근성 고려
- 로딩 상태 표시
- 에러 메시지 표시

## 보안 고려사항
- 비밀번호 암호화
- CSRF 토큰
- Rate limiting`,
        codeTemplate: `// LoginForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/services/auth.service';

const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다.'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login(data);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      // 로그인 성공 후 리다이렉트
      window.location.href = '/dashboard';
    } catch (err) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>로그인</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              이메일
            </label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              placeholder="이메일을 입력하세요"
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              {...form.register('password')}
              placeholder="비밀번호를 입력하세요"
            />
            {form.formState.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}`,
        testScenario: `// LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from './LoginForm';
import { authService } from '@/services/auth.service';

jest.mock('@/services/auth.service');

describe('LoginForm', () => {
  test('로그인 폼 렌더링', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText('이메일')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
  });

  test('유효성 검사', async () => {
    render(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: '로그인' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('올바른 이메일 형식이 아닙니다.')).toBeInTheDocument();
      expect(screen.getByText('비밀번호는 최소 6자 이상이어야 합니다.')).toBeInTheDocument();
    });
  });

  test('로그인 성공', async () => {
    const mockLogin = jest.mocked(authService.login);
    mockLogin.mockResolvedValue({
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh-token',
      user: { id: '1', email: 'test@example.com', name: 'Test User' }
    });

    render(<LoginForm />);
    
    fireEvent.change(screen.getByLabelText('이메일'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText('비밀번호'), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: '로그인' }));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });
});`,
        requirements: ['REQ-003', 'REQ-004'],
        implemented: true
      }
    ]
  },
  {
    id: '3',
    title: '대시보드',
    icon: LayoutDashboard,
    progress: 70,
    expanded: false,
    subsections: [
      {
        id: '3-1',
        title: '대시보드 구현',
        content: `# 대시보드 구현 가이드

## 개요
사용자가 로그인 후 볼 수 있는 메인 대시보드 화면입니다.

## 주요 기능
- 요약 통계 표시
- 최근 활동 목록
- 빠른 액션 버튼
- 사용자 정보 표시

## 레이아웃 구성
- 헤더: 네비게이션, 사용자 메뉴
- 사이드바: 메인 메뉴
- 메인 콘텐츠: 대시보드 위젯들
- 푸터: 부가 정보

## 성능 최적화
- 데이터 지연 로딩
- 캐싱 전략
- 이미지 최적화`,
        codeTemplate: `// Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Activity,
  Plus,
  MoreHorizontal
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalProjects: number;
  activeProjects: number;
  completedTasks: number;
}

interface RecentActivity {
  id: string;
  type: 'project' | 'task' | 'user';
  title: string;
  timestamp: string;
  status: 'completed' | 'in-progress' | 'pending';
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedTasks: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      // API 호출로 대시보드 데이터 로드
      const [statsData, activitiesData] = await Promise.all([
        fetch('/api/dashboard/stats').then(res => res.json()),
        fetch('/api/dashboard/activities').then(res => res.json())
      ]);
      
      setStats(statsData);
      setRecentActivities(activitiesData);
    } catch (error) {
      console.error('대시보드 데이터 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend }: {
    title: string;
    value: number;
    icon: React.ComponentType<any>;
    trend?: number;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {trend && (
          <p className="text-xs text-muted-foreground">
            <span className={trend > 0 ? 'text-green-600' : 'text-red-600'}>
              {trend > 0 ? '+' : ''}{trend}%
            </span> 지난 주 대비
          </p>
        )}
      </CardContent>
    </Card>
  );

  const ActivityItem = ({ activity }: { activity: RecentActivity }) => (
    <div className="flex items-center space-x-4 py-3">
      <div className="w-2 h-2 bg-blue-500 rounded-full" />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{activity.title}</p>
        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
      </div>
      <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
        {activity.status === 'completed' ? '완료' : 
         activity.status === 'in-progress' ? '진행중' : '대기'}
      </Badge>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">대시보드</h1>
          <p className="text-muted-foreground">프로젝트 현황을 한눈에 확인하세요</p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            새 프로젝트
          </Button>
          <Button variant="outline">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="총 사용자"
          value={stats.totalUsers}
          icon={Users}
          trend={12}
        />
        <StatCard
          title="총 프로젝트"
          value={stats.totalProjects}
          icon={FileText}
          trend={8}
        />
        <StatCard
          title="진행중인 프로젝트"
          value={stats.activeProjects}
          icon={Activity}
          trend={-2}
        />
        <StatCard
          title="완료된 작업"
          value={stats.completedTasks}
          icon={TrendingUp}
          trend={15}
        />
      </div>

      {/* 최근 활동 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>빠른 액션</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              새 문서 작성
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              팀원 초대
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              보고서 생성
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}`,
        testScenario: `// Dashboard.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { Dashboard } from './Dashboard';

// Mock fetch
global.fetch = jest.fn();

describe('Dashboard', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  test('대시보드 로딩 상태 표시', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('로딩 중...')).toBeInTheDocument();
  });

  test('통계 카드 렌더링', async () => {
    const mockStats = {
      totalUsers: 150,
      totalProjects: 25,
      activeProjects: 8,
      completedTasks: 120
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockStats)
    }).mockResolvedValueOnce({
      json: () => Promise.resolve([])
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('총 사용자')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
      expect(screen.getByText('총 프로젝트')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
    });
  });

  test('최근 활동 목록 렌더링', async () => {
    const mockActivities = [
      {
        id: '1',
        type: 'project',
        title: '새 프로젝트 생성',
        timestamp: '2시간 전',
        status: 'completed'
      }
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({})
    }).mockResolvedValueOnce({
      json: () => Promise.resolve(mockActivities)
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('새 프로젝트 생성')).toBeInTheDocument();
      expect(screen.getByText('2시간 전')).toBeInTheDocument();
      expect(screen.getByText('완료')).toBeInTheDocument();
    });
  });
});`,
        requirements: ['REQ-005', 'REQ-006'],
        implemented: false
      }
    ]
  },
  {
    id: '4',
    title: '단위 테스트',
    icon: TestTube2,
    progress: 60,
    expanded: false,
    subsections: [
      {
        id: '4-1',
        title: '테스트 환경 설정',
        content: `# 테스트 환경 설정 가이드

## 테스트 도구 스택
- **Jest**: JavaScript 테스트 프레임워크
- **React Testing Library**: React 컴포넌트 테스트 라이브러리
- **@testing-library/jest-dom**: Jest DOM 매처 확장
- **MSW (Mock Service Worker)**: API 모킹 라이브러리

## 테스트 설정 파일
- jest.config.js: Jest 설정
- setupTests.ts: 테스트 환경 초기화
- test-utils.tsx: 커스텀 테스트 유틸리티

## 테스트 작성 원칙
- **AAA 패턴**: Arrange, Act, Assert
- **사용자 중심 테스트**: 사용자 관점에서 테스트 작성
- **의미있는 테스트명**: 테스트의 목적을 명확히 표현
- **독립적인 테스트**: 각 테스트는 독립적으로 실행 가능`,
        codeTemplate: `// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/setupTests.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

// src/setupTests.ts
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// MSW 서버 시작
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// src/test-utils.tsx
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };`,
        testScenario: `// 테스트 실행 명령어
npm test                    # 모든 테스트 실행
npm test -- --watch        # 감시 모드로 테스트 실행
npm test -- --coverage     # 커버리지와 함께 테스트 실행
npm test -- --verbose      # 상세한 출력으로 테스트 실행

// 특정 파일 테스트
npm test Button.test.tsx

// 특정 패턴 매칭 테스트
npm test -- --testNamePattern="should render"`,
        requirements: ['REQ-007'],
        implemented: true
      },
      {
        id: '4-2',
        title: '컴포넌트 테스트',
        content: `# React 컴포넌트 테스트 가이드 (2024 업계 표준)

## 테스트 철학 (Testing Philosophy)
- **사용자 중심 테스트**: 사용자가 실제로 경험하는 방식으로 테스트
- **구현 세부사항 무시**: 내부 구현보다는 사용자 인터페이스에 집중
- **접근성 우선**: 모든 사용자가 접근 가능한 컴포넌트 개발
- **성능 고려**: 렌더링 성능과 메모리 사용량 최적화

## 테스트 카테고리 (2024 업데이트)
1. **렌더링 테스트**: 컴포넌트가 올바르게 렌더링되는지 확인
2. **사용자 상호작용 테스트**: 실제 사용자 행동 시뮬레이션
3. **Props 테스트**: 다양한 props 조합에 대한 동작 검증
4. **상태 테스트**: 컴포넌트 내부 상태 변화 추적
5. **조건부 렌더링 테스트**: 조건에 따른 UI 변화 검증
6. **접근성 테스트**: WCAG 2.1 AA 준수 확인
7. **성능 테스트**: 렌더링 시간 및 메모리 사용량 측정
8. **에러 경계 테스트**: 에러 상황에서의 graceful degradation

## 최신 테스트 패턴 (2024)
- **Given-When-Then**: BDD 스타일 테스트 구조화
- **Arrange-Act-Assert**: 명확한 테스트 단계 구분
- **Mock 최소화**: 실제 구현에 가까운 테스트 환경 구성
- **Accessibility 우선**: jest-axe를 활용한 자동 접근성 검사
- **Visual Regression**: 스토리북과 Chromatic을 활용한 시각적 회귀 테스트
- **E2E 통합**: Playwright를 활용한 실제 브라우저 테스트`,
        codeTemplate: `// Button.test.tsx (2024 업계 표준)
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from './Button';

// 접근성 테스트 매처 확장
expect.extend(toHaveNoViolations);

describe('Button Component', () => {
  // 렌더링 테스트 (2024 업데이트)
  describe('Rendering', () => {
    it('should render button with accessible text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('should render button with icon and accessible name', () => {
      render(
        <Button icon={<span aria-hidden="true">+</span>} aria-label="Add item">
          Add
        </Button>
      );
      expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument();
    });

    it('should render disabled button with proper attributes', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should render loading state correctly', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  // 사용자 상호작용 테스트 (2024 업데이트)
  describe('User Interactions', () => {
    it('should call onClick when clicked with proper event handling', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<Button onClick={handleClick}>Click me</Button>);
      
      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<Button onClick={handleClick} disabled>Disabled</Button>);
      
      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should handle keyboard navigation properly', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<Button onClick={handleClick}>Click me</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
      
      await user.keyboard(' '); // Space key
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('should handle focus management correctly', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <Button>First</Button>
          <Button>Second</Button>
        </div>
      );
      
      const firstButton = screen.getByRole('button', { name: 'First' });
      const secondButton = screen.getByRole('button', { name: 'Second' });
      
      await user.tab();
      expect(firstButton).toHaveFocus();
      
      await user.tab();
      expect(secondButton).toHaveFocus();
    });
  });

  // Props 테스트 (2024 업데이트)
  describe('Props and Variants', () => {
    it('should apply variant styles correctly', () => {
      render(<Button variant="destructive">Delete</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-destructive', 'text-destructive-foreground');
    });

    it('should apply size styles correctly', () => {
      render(<Button size="lg">Large Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-11', 'px-8');
    });

    it('should apply custom className without conflicts', () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('should handle all variant combinations', () => {
      const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'];
      const sizes = ['default', 'sm', 'lg', 'icon'];
      
      variants.forEach(variant => {
        sizes.forEach(size => {
          const { unmount } = render(
            <Button variant={variant as any} size={size as any}>
              {variant}-{size}
            </Button>
          );
          expect(screen.getByRole('button')).toBeInTheDocument();
          unmount();
        });
      });
    });
  });

  // 접근성 테스트 (2024 WCAG 2.1 AA 준수)
  describe('Accessibility (WCAG 2.1 AA)', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<Button>Accessible Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA attributes', () => {
      render(
        <Button 
          aria-label="Close dialog" 
          aria-describedby="close-description"
          aria-expanded="false"
        >
          ×
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Close dialog');
      expect(button).toHaveAttribute('aria-describedby', 'close-description');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('should be focusable and keyboard navigable', () => {
      render(<Button>Focusable</Button>);
      const button = screen.getByRole('button');
      
      button.focus();
      expect(button).toHaveFocus();
      expect(button).toHaveAttribute('tabindex', '0');
    });

    it('should have proper color contrast', async () => {
      const { container } = render(<Button>High Contrast</Button>);
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true }
        }
      });
      expect(results).toHaveNoViolations();
    });

    it('should announce state changes to screen readers', () => {
      const { rerender } = render(<Button>Normal</Button>);
      const button = screen.getByRole('button');
      
      rerender(<Button loading>Loading</Button>);
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toHaveAttribute('aria-live', 'polite');
    });
  });

  // 성능 테스트 (2024 업데이트)
  describe('Performance', () => {
    it('should render within acceptable time', () => {
      const startTime = performance.now();
      render(<Button>Performance Test</Button>);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(16); // 60fps 기준
    });

    it('should not cause memory leaks', () => {
      const { unmount } = render(<Button>Memory Test</Button>);
      
      // 컴포넌트 언마운트 후 메모리 정리 확인
      unmount();
      
      // 가비지 컬렉션 후 메모리 사용량 확인
      if (global.gc) {
        global.gc();
      }
    });

    it('should handle rapid clicks efficiently', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<Button onClick={handleClick}>Rapid Click</Button>);
      
      const button = screen.getByRole('button');
      const startTime = performance.now();
      
      // 100번 빠르게 클릭
      for (let i = 0; i < 100; i++) {
        await user.click(button);
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(1000); // 1초 이내
      expect(handleClick).toHaveBeenCalledTimes(100);
    });
  });

  // 에러 경계 테스트 (2024 업데이트)
  describe('Error Handling', () => {
    it('should handle onClick errors gracefully', async () => {
      const user = userEvent.setup();
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const ErrorButton = () => {
        const handleClick = () => {
          throw new Error('Test error');
        };
        return <Button onClick={handleClick}>Error Button</Button>;
      };
      
      render(<ErrorButton />);
      
      await user.click(screen.getByRole('button'));
      
      expect(consoleError).toHaveBeenCalled();
      consoleError.mockRestore();
    });

    it('should display fallback UI on render error', () => {
      const ErrorButton = () => {
        throw new Error('Render error');
      };
      
      const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
        try {
          return <>{children}</>;
        } catch (error) {
          return <div>Error occurred</div>;
        }
      };
      
      render(
        <ErrorBoundary>
          <ErrorButton />
        </ErrorBoundary>
      );
      
      expect(screen.getByText('Error occurred')).toBeInTheDocument();
    });
  });
});`,
        testScenario: `// 테스트 시나리오 예시
describe('LoginForm Integration Test', () => {
  it('should complete login flow successfully', async () => {
    const user = userEvent.setup();
    
    // Given: 로그인 폼이 렌더링됨
    render(<LoginForm />);
    
    // When: 사용자가 이메일과 비밀번호를 입력하고 로그인 버튼을 클릭
    await user.type(screen.getByLabelText('이메일'), 'test@example.com');
    await user.type(screen.getByLabelText('비밀번호'), 'password123');
    await user.click(screen.getByRole('button', { name: '로그인' }));
    
    // Then: 로그인이 성공하고 대시보드로 리다이렉트됨
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});`,
        requirements: ['REQ-008'],
        implemented: true
      },
      {
        id: '4-3',
        title: 'API 테스트',
        content: `# API 테스트 가이드

## API 테스트 전략
1. **MSW (Mock Service Worker)**: 네트워크 레벨에서 API 모킹
2. **Jest Mock**: 함수 레벨에서 API 호출 모킹
3. **Integration Test**: 실제 API와의 통합 테스트

## 테스트 시나리오
- **성공 케이스**: 정상적인 API 응답 처리
- **에러 케이스**: 네트워크 에러, 서버 에러 처리
- **로딩 상태**: API 호출 중 로딩 상태 표시
- **재시도 로직**: 실패 시 재시도 메커니즘

## MSW 설정
- handlers: API 엔드포인트별 모킹 핸들러
- server: MSW 서버 설정
- scenarios: 다양한 응답 시나리오`,
        codeTemplate: `// mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  // 성공 케이스
  rest.get('/api/users', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        users: [
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        ],
      })
    );
  }),

  // 에러 케이스
  rest.get('/api/users', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({ error: 'Internal Server Error' })
    );
  }),

  // 로그인 API
  rest.post('/api/auth/login', async (req, res, ctx) => {
    const { email, password } = await req.json();
    
    if (email === 'test@example.com' && password === 'password123') {
      return res(
        ctx.status(200),
        ctx.json({
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          user: { id: 1, email, name: 'Test User' },
        })
      );
    }
    
    return res(
      ctx.status(401),
      ctx.json({ error: 'Invalid credentials' })
    );
  }),
];

// mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// api.test.ts
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { authService } from '../services/auth.service';

const server = setupServer(
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(ctx.json({ accessToken: 'mock-token' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Auth Service', () => {
  it('should login successfully', async () => {
    const credentials = { email: 'test@example.com', password: 'password123' };
    
    const result = await authService.login(credentials);
    
    expect(result.accessToken).toBe('mock-token');
  });

  it('should handle login error', async () => {
    server.use(
      rest.post('/api/auth/login', (req, res, ctx) => {
        return res(ctx.status(401), ctx.json({ error: 'Unauthorized' }));
      })
    );

    const credentials = { email: 'wrong@example.com', password: 'wrong' };
    
    await expect(authService.login(credentials)).rejects.toThrow();
  });
});`,
        testScenario: `// API 테스트 시나리오
describe('UserList Component API Integration', () => {
  it('should fetch and display users', async () => {
    render(<UserList />);
    
    // 로딩 상태 확인
    expect(screen.getByText('로딩 중...')).toBeInTheDocument();
    
    // 사용자 목록 렌더링 확인
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('should handle API error gracefully', async () => {
    server.use(
      rest.get('/api/users', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<UserList />);
    
    await waitFor(() => {
      expect(screen.getByText('사용자를 불러올 수 없습니다.')).toBeInTheDocument();
    });
  });
});`,
        requirements: ['REQ-009'],
        implemented: false
      },
      {
        id: '4-4',
        title: '테스트 자동화',
        content: `# 테스트 자동화 가이드

## CI/CD 파이프라인 통합
- **GitHub Actions**: GitHub 저장소와 연동
- **GitLab CI**: GitLab 저장소와 연동
- **Jenkins**: 기업용 CI/CD 도구

## 테스트 실행 전략
- **Pre-commit Hook**: 커밋 전 테스트 실행
- **Pull Request**: PR 생성 시 테스트 실행
- **Nightly Build**: 매일 밤 전체 테스트 실행
- **Release Build**: 릴리스 전 전체 테스트 실행

## 테스트 커버리지
- **최소 커버리지**: 80% 이상 유지
- **커버리지 리포트**: HTML, JSON 형태로 생성
- **커버리지 트렌드**: 시간에 따른 커버리지 변화 추적

## 성능 테스트
- **Lighthouse CI**: 웹 성능 테스트
- **Bundle Size**: 번들 크기 모니터링
- **Load Testing**: 부하 테스트`,
        codeTemplate: `// .github/workflows/test.yml
name: Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: \${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run type check
      run: npm run type-check
    
    - name: Run tests
      run: npm test -- --coverage --watchAll=false
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
    
    - name: Run Lighthouse CI
      run: |
        npm install -g @lhci/cli@0.12.x
        lhci autorun

// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
    "type-check": "tsc --noEmit"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "src/**/*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "jest --bail --findRelatedTests"
    ]
  }
}`,
        testScenario: `// 성능 테스트 예시
describe('Performance Tests', () => {
  it('should render large list efficiently', () => {
    const largeData = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: \`Item \${i}\`,
    }));

    const startTime = performance.now();
    render(<VirtualizedList data={largeData} />);
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(100); // 100ms 이내 렌더링
  });

  it('should not cause memory leaks', () => {
    const { unmount } = render(<ComponentWithTimers />);
    
    // 컴포넌트 언마운트 후 메모리 정리 확인
    unmount();
    
    // 가비지 컬렉션 후 메모리 사용량 확인
    if (global.gc) {
      global.gc();
    }
  });
});`,
        requirements: ['REQ-010'],
        implemented: false
      }
    ]
  }
]

const mockIACodes: IACode[] = [
  {
    id: '1',
    iaCode: 'LOGIN-001',
    description: '로그인 폼 컴포넌트',
    component: 'LoginForm',
    requirements: ['REQ-001'],
    implemented: true
  },
  {
    id: '2',
    iaCode: 'DASH-001',
    description: '대시보드 메인 카드',
    component: 'DashboardCard',
    requirements: ['REQ-002'],
    implemented: true
  },
  {
    id: '3',
    iaCode: 'USER-001',
    description: '사용자 목록 테이블',
    component: 'UserTable',
    requirements: ['REQ-003'],
    implemented: false
  },
  {
    id: '4',
    iaCode: 'PROJ-001',
    description: '프로젝트 생성 폼',
    component: 'ProjectForm',
    requirements: ['REQ-004'],
    implemented: false
  }
]

export function DevelopmentGuide() {
  const [guideData, setGuideData] = useState<GuideSection[]>(mockGuideData)
  const [selectedSection, setSelectedSection] = useState<GuideSubsection | null>(
    mockGuideData[0].subsections[0]
  )
  const [activeTab, setActiveTab] = useState('guide')
  const [searchTerm, setSearchTerm] = useState('')
  const [iaCodeFilter, setIACodeFilter] = useState('all')

  const toggleSection = (sectionId: string) => {
    setGuideData(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, expanded: !section.expanded }
        : section
    ))
  }

  const selectSubsection = (subsection: GuideSubsection) => {
    setSelectedSection(subsection)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('클립보드에 복사되었습니다.')
    }).catch(() => {
      alert('복사에 실패했습니다.')
    })
  }

  const exportToCursor = () => {
    if (!selectedSection) {
      alert('내보낼 가이드를 선택해주세요.')
      return
    }
    
    const exportData = {
      guide: selectedSection,
      timestamp: new Date().toISOString(),
      project: 'SI Project Management Dashboard'
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${selectedSection.title}-guide.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportAllGuides = () => {
    const allGuides = guideData.map(section => ({
      title: section.title,
      progress: section.progress,
      subsections: section.subsections
    }))
    
    const exportData = {
      project: 'SI Project Management Dashboard',
      exportDate: new Date().toISOString(),
      guides: allGuides
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'development-guides.json')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const toggleImplementation = (itemId: string) => {
    // IA 코드 구현 상태 토글
    // 실제 구현에서는 상태를 업데이트해야 함
    console.log('Toggle implementation for:', itemId)
  }

  const filteredIACodes = mockIACodes.filter(item => {
    const matchesSearch = item.iaCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = iaCodeFilter === 'all' || 
                         (iaCodeFilter === 'implemented' && item.implemented) ||
                         (iaCodeFilter === 'pending' && !item.implemented)
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">상세 개발 가이드</h2>
          <p className="text-gray-600 mt-1">
            프로젝트 개발에 필요한 모든 기술 가이드와 코드 템플릿을 제공합니다
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={exportAllGuides}>
            <Download className="w-4 h-4 mr-2" />
            전체 내보내기
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Guide Sections */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>개발 가이드 목차</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {guideData.map((section) => {
                const IconComponent = section.icon
                return (
                  <div key={section.id} className="space-y-1">
                    <div
                      className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleSection(section.id)}
                    >
                      <div className="flex items-center space-x-2">
                        <IconComponent className="w-4 h-4" />
                        <span className="text-sm font-medium">{section.title}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-12 bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-blue-600 h-1 rounded-full"
                            style={{ width: `${section.progress}%` }}
                          />
                        </div>
                        {section.expanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                    
                    {section.expanded && (
                      <div className="ml-6 space-y-1">
                        {section.subsections.map((subsection) => (
                          <div
                            key={subsection.id}
                            className={`p-2 text-sm rounded cursor-pointer hover:bg-gray-100 ${
                              selectedSection?.id === subsection.id ? 'bg-blue-50 text-blue-700' : ''
                            }`}
                            onClick={() => selectSubsection(subsection)}
                          >
                            {subsection.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Guide Content */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <div>
                <CardTitle>{selectedSection?.title || '가이드를 선택하세요'}</CardTitle>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-sm text-gray-500">홈</span>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <span className="text-sm text-gray-500">화면별 가이드</span>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <span className="text-sm font-medium">{selectedSection?.title}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedSection ? (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="guide">가이드</TabsTrigger>
                    <TabsTrigger value="code">코드 템플릿</TabsTrigger>
                    <TabsTrigger value="test">테스트</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="guide" className="mt-4">
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap text-sm">
                        {selectedSection.content}
                      </pre>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="code" className="mt-4">
                    {selectedSection.codeTemplate ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">코드 템플릿</h3>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => copyToClipboard(selectedSection.codeTemplate || '')}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            복사
                          </Button>
                        </div>
                        <div className="relative">
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{selectedSection.codeTemplate}</code>
                          </pre>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Code className="w-8 h-8 mx-auto mb-2" />
                        <p>코드 템플릿이 준비되지 않았습니다</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="test" className="mt-4">
                    {selectedSection.testScenario ? (
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap text-sm">
                          {selectedSection.testScenario}
                        </pre>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <TestTube className="w-8 h-8 mx-auto mb-2" />
                        <p>테스트 시나리오가 준비되지 않았습니다</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Monitor className="w-12 h-12 mx-auto mb-4" />
                  <p>좌측 메뉴에서 가이드를 선택하세요</p>
                  <p className="text-sm mt-1">상세한 개발 가이드와 코드 템플릿을 확인할 수 있습니다</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* IA Code 매핑 영역 */}
        <div className="lg:col-span-1">
          <Card className="h-full">
        <CardHeader>
          <CardTitle>IA Code 매핑</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="IA Code 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-1">
              <Button
                variant={iaCodeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIACodeFilter('all')}
              >
                전체
              </Button>
              <Button
                variant={iaCodeFilter === 'implemented' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIACodeFilter('implemented')}
              >
                완료
              </Button>
              <Button
                variant={iaCodeFilter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIACodeFilter('pending')}
              >
                대기
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredIACodes.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline" className="font-mono">
                      {item.iaCode}
                    </Badge>
                    <Badge variant="secondary">
                      {item.component}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{item.description}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">관련 요구사항:</span>
                    {item.requirements.map((req) => (
                      <Badge key={req} variant="outline" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={item.implemented}
                    onCheckedChange={() => toggleImplementation(item.id)}
                  />
                  {item.implemented && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}