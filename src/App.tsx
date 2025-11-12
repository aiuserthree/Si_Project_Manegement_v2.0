import { useState, useEffect } from 'react'
import { AppLayout } from './components/layout/AppLayout'
import { LoginScreen } from './components/auth/LoginScreen'
import { DashboardScreen } from './components/dashboard/DashboardScreen'
import { FileUpload } from './components/steps/FileUpload'
import { Questionnaire } from './components/steps/Questionnaire'
import { RequirementsDefinition } from './components/steps/RequirementsDefinition'
import { MenuStructure } from './components/steps/MenuStructure'
import { FunctionalSpecification } from './components/steps/FunctionalSpecification'
import { ResourceManagement } from './components/steps/ResourceManagement'
import { WBSGantt } from './components/steps/WBSGantt'
import { FigmaMakePrompt } from './components/steps/FigmaMakePrompt'
import { DocumentEditor } from './components/steps/DocumentEditor'
import { DevelopmentGuide } from './components/steps/DevelopmentGuide'
import { SettingsScreen } from './components/settings/SettingsScreen'
import { authService, User } from './services/authService'

type AppState = 'login' | 'dashboard' | 'workflow'
type MenuState = 'dashboard' | 'profile'

export default function App() {
  const [appState, setAppState] = useState<AppState>('login')
  const [currentStep, setCurrentStep] = useState(1)
  const [currentMenu, setCurrentMenu] = useState<MenuState>('dashboard')
  const [previousMenu, setPreviousMenu] = useState<MenuState>('dashboard')
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 페이지 로드 시 인증 상태 확인
    const authState = authService.getAuthState()
    
    if (authState.isAuthenticated && authState.user) {
      setUser(authState.user)
      setAppState('dashboard')
    } else {
      setUser(null)
      setAppState('login')
    }
    
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // 인증 상태 변경 구독
    const unsubscribe = authService.subscribe((authState) => {
      if (authState.isAuthenticated && authState.user) {
        setUser(authState.user)
        setAppState('dashboard')
      } else {
        setUser(null)
        setAppState('login')
      }
    })

    return unsubscribe
  }, [])

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser)
    setAppState('dashboard')
  }

  const handleStartNewProject = () => {
    setCurrentStep(1)
    setAppState('workflow')
  }

  const handleContinueProject = (projectId: string) => {
    // 실제로는 프로젝트별 현재 단계를 가져와야 함
    setCurrentStep(1)
    setAppState('workflow')
  }

  const handleBackToDashboard = () => {
    setAppState('dashboard')
    setCurrentMenu('dashboard')
  }

  const handleMenuChange = (menu: MenuState) => {
    setPreviousMenu(currentMenu)
    setCurrentMenu(menu)
    setAppState('dashboard')
  }

  const handleBackToPrevious = () => {
    setAppState('workflow')
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      setUser(null)
      setAppState('login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleStepChange = (step: number) => {
    console.log('Step change requested:', step)
    setCurrentStep(step)
    console.log('Current step updated to:', step)
  }

  const handleSave = () => {
    console.log('Saving current step data...')
    // 실제 저장 로직 구현
    alert('현재 단계 데이터가 저장되었습니다.')
  }

  const handleNextStep = () => {
    if (currentStep < 10) {
      setCurrentStep(currentStep + 1)
    } else {
      setAppState('dashboard')
    }
  }

  const renderWorkflowContent = () => {
    switch (currentStep) {
      case 1:
        return <FileUpload onSave={handleSave} onNextStep={handleNextStep} />
      case 2:
        return <Questionnaire onSave={handleSave} onNextStep={handleNextStep} />
      case 3:
        return <RequirementsDefinition onSave={handleSave} onNextStep={handleNextStep} />
      case 4:
        return <MenuStructure onSave={handleSave} onNextStep={handleNextStep} />
      case 5:
        return <FunctionalSpecification onSave={handleSave} onNextStep={handleNextStep} />
      case 6:
        return <ResourceManagement onSave={handleSave} onNextStep={handleNextStep} />
      case 7:
        return <WBSGantt onSave={handleSave} onNextStep={handleNextStep} />
      case 8:
        return <FigmaMakePrompt onSave={handleSave} onNextStep={handleNextStep} />
      case 9:
        return <DocumentEditor onSave={handleSave} onNextStep={handleNextStep} />
      case 10:
        return <DevelopmentGuide onSave={handleSave} onNextStep={handleNextStep} />
      default:
        return <FileUpload onSave={handleSave} onNextStep={handleNextStep} />
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      )
    }

    switch (appState) {
      case 'login':
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />
      
      case 'dashboard':
        return (
          <DashboardScreen 
            onStartNewProject={handleStartNewProject}
            onContinueProject={handleContinueProject}
            currentMenu={currentMenu}
            onMenuChange={handleMenuChange}
            onBackToPrevious={handleBackToPrevious}
            onLogout={handleLogout}
          />
        )
      
      case 'workflow':
        return (
          <AppLayout 
            currentStep={currentStep} 
            onStepChange={handleStepChange}
            onSave={handleSave}
            currentMenu={currentMenu}
            onMenuChange={handleMenuChange}
          >
            {renderWorkflowContent()}
          </AppLayout>
        )
      
      default:
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />
    }
  }

  return (
    <div className="App">
      {renderContent()}
    </div>
  )
}