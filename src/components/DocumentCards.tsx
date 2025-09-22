import { FileText, Network, Code2, BookOpen, Download, Edit, Eye, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

const documents = [
  {
    id: 1,
    title: '요구사항 정의서',
    icon: FileText,
    description: '프로젝트 요구사항 상세 문서',
    stats: '23 items defined',
    lastUpdated: '2024-02-20 14:30',
    status: 'completed',
    completion: 100
  },
  {
    id: 2,
    title: '메뉴구조도',
    icon: Network,
    description: 'IA 기반 메뉴 구조 설계',
    stats: '5 depth levels',
    lastUpdated: '2024-02-18 16:45',
    status: 'completed',
    completion: 100
  },
  {
    id: 3,
    title: 'IA 문서',
    icon: Code2,
    description: 'Information Architecture 설계서',
    stats: '45 screens mapped',
    lastUpdated: '2024-02-19 09:15',
    status: 'in-progress',
    completion: 85
  },
  {
    id: 4,
    title: '개발 가이드',
    icon: BookOpen,
    description: 'AI 생성 개발 가이드라인',
    stats: 'AI 생성 완료',
    lastUpdated: '2024-02-21 11:20',
    status: 'ready',
    completion: 95
  }
]

const getStatusBadge = (status: string, completion: number) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-100 text-green-800">완료</Badge>
    case 'in-progress':
      return <Badge className="bg-blue-100 text-blue-800">진행중 ({completion}%)</Badge>
    case 'ready':
      return <Badge className="bg-orange-100 text-orange-800">준비완료</Badge>
    default:
      return <Badge className="bg-gray-100 text-gray-800">대기</Badge>
  }
}

const getActionButtons = (doc: typeof documents[0]) => {
  switch (doc.status) {
    case 'completed':
      return (
        <>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            편집
          </Button>
          <Button size="sm" className="bg-blue-700 hover:bg-blue-800">
            <Download className="w-4 h-4 mr-2" />
            다운로드
          </Button>
        </>
      )
    case 'in-progress':
      return (
        <>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            편집
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            미리보기
          </Button>
        </>
      )
    case 'ready':
      return (
        <>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            보기
          </Button>
          <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
            <ExternalLink className="w-4 h-4 mr-2" />
            Cursor 연동
          </Button>
        </>
      )
    default:
      return (
        <Button variant="outline" size="sm" disabled>
          대기중
        </Button>
      )
  }
}

export function DocumentCards() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4 md:mb-6">문서 생성 현황</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {documents.map((doc) => {
          const IconComponent = doc.icon
          
          return (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 truncate">{doc.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{doc.description}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {getStatusBadge(doc.status, doc.completion)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="py-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 truncate flex-1">{doc.stats}</span>
                    <span className="text-gray-500 whitespace-nowrap ml-2">
                      {doc.lastUpdated.split(' ')[0]}
                    </span>
                  </div>
                  
                  {doc.status === 'in-progress' && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${doc.completion}%` }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="pt-3">
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  {getActionButtons(doc)}
                </div>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}