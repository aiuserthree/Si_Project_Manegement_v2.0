import { CheckCircle, Clock, Circle, ChevronRight } from 'lucide-react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'

const phases = [
  {
    id: 1,
    name: '요구사항 수집',
    status: 'completed',
    description: '클라이언트 요구사항 수집 완료',
    completedDate: '2024-01-15'
  },
  {
    id: 2,
    name: '프로젝트 질의서',
    status: 'completed',
    description: '기술적 질의응답 완료',
    completedDate: '2024-01-20'
  },
  {
    id: 3,
    name: '요구사항 정의서',
    status: 'completed',
    description: '상세 요구사항 문서화',
    completedDate: '2024-02-05'
  },
  {
    id: 4,
    name: '메뉴구조도/IA',
    status: 'completed',
    description: 'IA 설계 및 메뉴 구조 완료',
    completedDate: '2024-02-18'
  },
  {
    id: 5,
    name: '상세 설계',
    status: 'in-progress',
    description: '화면 상세 설계 진행 중',
    progress: 75
  },
  {
    id: 6,
    name: '개발 가이드',
    status: 'pending',
    description: '개발 가이드 문서 생성 대기'
  },
  {
    id: 7,
    name: 'Cursor 연동',
    status: 'pending',
    description: 'AI 개발 도구 연동 대기'
  }
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-6 h-6 text-green-600" />
    case 'in-progress':
      return <Clock className="w-6 h-6 text-blue-600" />
    default:
      return <Circle className="w-6 h-6 text-gray-400" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'in-progress':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

export function PhaseTracker() {
  return (
    <Card className="p-4 md:p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 md:mb-6">프로젝트 진행 단계</h2>
      
      {/* Desktop View */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 z-0">
            <div className="h-full bg-green-500 transition-all duration-500" style={{ width: '57%' }} />
          </div>

          {phases.map((phase, index) => (
            <div key={phase.id} className="flex flex-col items-center relative z-10">
              {/* Phase Circle */}
              <div className="flex items-center justify-center w-12 h-12 bg-white border-2 border-gray-200 rounded-full mb-3">
                {getStatusIcon(phase.status)}
              </div>

              {/* Phase Card */}
              <Card className={`w-40 p-4 cursor-pointer hover:shadow-md transition-shadow ${
                phase.status === 'in-progress' ? 'ring-2 ring-blue-200' : ''
              }`}>
                <div className="text-center">
                  <Badge className={`text-xs mb-2 ${getStatusColor(phase.status)}`}>
                    {phase.status === 'completed' && '완료'}
                    {phase.status === 'in-progress' && '진행중'}
                    {phase.status === 'pending' && '대기'}
                  </Badge>
                  
                  <h3 className="font-medium text-sm text-gray-900 mb-1">
                    {phase.name}
                  </h3>
                  
                  <p className="text-xs text-gray-600 mb-2">
                    {phase.description}
                  </p>

                  {phase.status === 'completed' && phase.completedDate && (
                    <p className="text-xs text-green-600">
                      {phase.completedDate}
                    </p>
                  )}

                  {phase.status === 'in-progress' && phase.progress && (
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${phase.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </Card>

              {/* Arrow */}
              {index < phases.length - 1 && (
                <ChevronRight className="absolute top-6 -right-4 w-4 h-4 text-gray-400 z-20" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile/Tablet View */}
      <div className="lg:hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {phases.map((phase, index) => (
            <Card key={phase.id} className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
              phase.status === 'in-progress' ? 'ring-2 ring-blue-200' : ''
            }`}>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex-shrink-0">
                  {getStatusIcon(phase.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm text-gray-900 truncate">
                      {phase.name}
                    </h3>
                    <Badge className={`text-xs whitespace-nowrap ${getStatusColor(phase.status)}`}>
                      {phase.status === 'completed' && '완료'}
                      {phase.status === 'in-progress' && '진행중'}
                      {phase.status === 'pending' && '대기'}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2">
                    {phase.description}
                  </p>

                  {phase.status === 'completed' && phase.completedDate && (
                    <p className="text-xs text-green-600">
                      {phase.completedDate}
                    </p>
                  )}

                  {phase.status === 'in-progress' && phase.progress && (
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${phase.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  )
}