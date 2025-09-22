import { useState } from 'react'
import { MainLayout } from './components/MainLayout'
import { FileUpload } from './components/steps/FileUpload'
import { Questionnaire } from './components/steps/Questionnaire'
import { RequirementsDefinition } from './components/steps/RequirementsDefinition'
import { MenuStructure } from './components/steps/MenuStructure'
import { IADesign } from './components/steps/IADesign'
import { DocumentEditor } from './components/steps/DocumentEditor'
import { DevelopmentGuide } from './components/steps/DevelopmentGuide'

export default function App() {
  const [currentStep, setCurrentStep] = useState(1)

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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <FileUpload />
      case 2:
        return <Questionnaire />
      case 3:
        return <RequirementsDefinition />
      case 4:
        return <MenuStructure />
      case 5:
        return <IADesign />
      case 6:
        return <DocumentEditor />
      case 7:
        return <DevelopmentGuide />
      default:
        return <FileUpload />
    }
  }

  return (
    <MainLayout 
      currentStep={currentStep} 
      onStepChange={handleStepChange}
      onSave={handleSave}
    >
      {renderStepContent()}
    </MainLayout>
  )
}