// 인증 관련 서비스
export interface User {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  success: boolean
  token: string
  refreshToken: string
  user: User
  expiresIn: number
}

class AuthService {
  private static instance: AuthService
  private authState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  }

  private listeners: ((state: AuthState) => void)[] = []

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  constructor() {
    // 페이지 로드 시 저장된 토큰 확인
    this.initializeAuth()
  }

  private initializeAuth() {
    const token = localStorage.getItem('accessToken')
    const userStr = localStorage.getItem('user')
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        this.authState = {
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        }
        this.notifyListeners()
      } catch (error) {
        this.clearAuth()
      }
    }
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    this.setLoading(true)
    this.clearError()

    try {
      // 실제 API 호출 시뮬레이션
      const response = await this.mockLoginAPI(credentials)
      
      // 토큰 저장
      localStorage.setItem('accessToken', response.token)
      localStorage.setItem('refreshToken', response.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      if (credentials.rememberMe) {
        localStorage.setItem('rememberMe', 'true')
      }

      this.authState = {
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }

      this.notifyListeners()
      return response
    } catch (error: any) {
      this.authState.error = error.message
      this.authState.isLoading = false
      this.notifyListeners()
      throw error
    }
  }

  async logout() {
    this.setLoading(true)
    
    try {
      // 실제 API 호출 (토큰 무효화)
      await this.mockLogoutAPI()
    } catch (error) {
      console.warn('Logout API failed:', error)
    } finally {
      this.clearAuth()
      this.setLoading(false)
    }
  }

  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      // 실제 토큰 갱신 API 호출
      const response = await this.mockRefreshTokenAPI(refreshToken)
      
      localStorage.setItem('accessToken', response.token)
      localStorage.setItem('refreshToken', response.refreshToken)
      
      return response.token
    } catch (error) {
      this.clearAuth()
      throw error
    }
  }

  getAuthState(): AuthState {
    return { ...this.authState }
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener)
    
    // 구독 즉시 현재 상태 전달
    listener(this.getAuthState())
    
    // 구독 해제 함수 반환
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private setLoading(loading: boolean) {
    this.authState.isLoading = loading
    this.notifyListeners()
  }

  private clearError() {
    this.authState.error = null
    this.notifyListeners()
  }

  private clearAuth() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    localStorage.removeItem('rememberMe')
    
    this.authState = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    }
    
    this.notifyListeners()
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.getAuthState()))
  }

  // Mock API 메서드들 (실제 구현 시 실제 API로 교체)
  private async mockLoginAPI(credentials: LoginCredentials): Promise<LoginResponse> {
    // 네트워크 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 모든 로그인 시도 허용 (개발용)
    return {
      success: true,
      token: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      user: {
        id: 'user-001',
        email: credentials.email || 'user@example.com',
        name: '김프로젝트',
        role: 'project-manager',
        avatar: '/avatars/default.png'
      },
      expiresIn: 3600
    }
  }

  private async mockLogoutAPI(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  private async mockRefreshTokenAPI(refreshToken: string): Promise<{token: string, refreshToken: string}> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      token: 'new-mock-jwt-token-' + Date.now(),
      refreshToken: 'new-mock-refresh-token-' + Date.now()
    }
  }
}

export const authService = AuthService.getInstance()
