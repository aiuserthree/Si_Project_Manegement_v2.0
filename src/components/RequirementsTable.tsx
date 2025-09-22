import { useState } from 'react'
import { Edit, Trash2, ChevronDown, Filter, MoreHorizontal } from 'lucide-react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Checkbox } from './ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Progress } from './ui/progress'

const requirements = [
  {
    id: 'REQ-001',
    serviceType: 'F/O',
    name: '사용자 회원가입 기능',
    priority: 'High',
    status: 100,
    iaCode: 'USR.REG.001'
  },
  {
    id: 'REQ-002',
    serviceType: 'F/O',
    name: '상품 검색 및 필터링',
    priority: 'High',
    status: 85,
    iaCode: 'PRD.SRC.001'
  },
  {
    id: 'REQ-003',
    serviceType: 'B/O',
    name: '주문 관리 시스템',
    priority: 'High',
    status: 90,
    iaCode: 'ORD.MGT.001'
  },
  {
    id: 'REQ-004',
    serviceType: 'API',
    name: '결제 API 연동',
    priority: 'High',
    status: 75,
    iaCode: 'PAY.API.001'
  },
  {
    id: 'REQ-005',
    serviceType: 'F/O',
    name: '장바구니 기능',
    priority: 'Medium',
    status: 60,
    iaCode: 'CRT.MGT.001'
  },
  {
    id: 'REQ-006',
    serviceType: 'AI',
    name: '상품 추천 엔진',
    priority: 'Medium',
    status: 30,
    iaCode: 'REC.ENG.001'
  },
  {
    id: 'REQ-007',
    serviceType: 'B/O',
    name: '재고 관리 시스템',
    priority: 'Medium',
    status: 45,
    iaCode: 'INV.MGT.001'
  },
  {
    id: 'REQ-008',
    serviceType: 'F/O',
    name: '고객 리뷰 시스템',
    priority: 'Low',
    status: 20,
    iaCode: 'REV.SYS.001'
  }
]

const serviceTypeColors = {
  'F/O': 'bg-blue-100 text-blue-800',
  'B/O': 'bg-purple-100 text-purple-800',
  'API': 'bg-green-100 text-green-800',
  'AI': 'bg-orange-100 text-orange-800'
}

const priorityColors = {
  'High': 'bg-red-100 text-red-800',
  'Medium': 'bg-yellow-100 text-yellow-800',
  'Low': 'bg-gray-100 text-gray-800'
}

export function RequirementsTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [filterType, setFilterType] = useState<string>('all')

  const filteredRequirements = filterType === 'all' 
    ? requirements 
    : requirements.filter(req => req.serviceType === filterType)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(filteredRequirements.map(req => req.id))
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id])
    } else {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id))
    }
  }

  return (
    <Card className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-3">
        <h2 className="text-lg font-semibold text-gray-900">요구사항 관리</h2>
        
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">서비스 구분</span>
                <span className="sm:hidden">필터</span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterType('all')}>
                전체
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('F/O')}>
                Frontend Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('B/O')}>
                Backend Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('API')}>
                API
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('AI')}>
                AI
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedRows.length === filteredRequirements.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-16">번호</TableHead>
              <TableHead className="w-24">ID</TableHead>
              <TableHead className="w-20">구분</TableHead>
              <TableHead>요구사항명</TableHead>
              <TableHead className="w-20">우선순위</TableHead>
              <TableHead className="w-32">상태</TableHead>
              <TableHead className="w-32">IA Code</TableHead>
              <TableHead className="w-20">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequirements.map((req, index) => (
              <TableRow key={req.id} className="hover:bg-gray-50">
                <TableCell>
                  <Checkbox 
                    checked={selectedRows.includes(req.id)}
                    onCheckedChange={(checked) => handleSelectRow(req.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell className="text-gray-600">{index + 1}</TableCell>
                <TableCell className="font-mono text-sm">{req.id}</TableCell>
                <TableCell>
                  <Badge className={serviceTypeColors[req.serviceType as keyof typeof serviceTypeColors]}>
                    {req.serviceType}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{req.name}</TableCell>
                <TableCell>
                  <Badge className={priorityColors[req.priority as keyof typeof priorityColors]}>
                    {req.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={req.status} className="flex-1 h-2" />
                    <span className="text-sm text-gray-600 w-10">{req.status}%</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm text-blue-600">
                  {req.iaCode}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        편집
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filteredRequirements.map((req, index) => (
          <Card key={req.id} className="p-4">
            <div className="flex items-start gap-3">
              <Checkbox 
                checked={selectedRows.includes(req.id)}
                onCheckedChange={(checked) => handleSelectRow(req.id, checked as boolean)}
                className="mt-1"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-500">#{index + 1}</span>
                  <Badge className={serviceTypeColors[req.serviceType as keyof typeof serviceTypeColors]}>
                    {req.serviceType}
                  </Badge>
                  <Badge className={priorityColors[req.priority as keyof typeof priorityColors]}>
                    {req.priority}
                  </Badge>
                </div>
                
                <h3 className="font-medium text-gray-900 mb-2">{req.name}</h3>
                
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-mono text-gray-600">{req.id}</span>
                  <span className="font-mono text-blue-600">{req.iaCode}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Progress value={req.status} className="flex-1 h-2" />
                  <span className="text-sm text-gray-600 w-10">{req.status}%</span>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    편집
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    삭제
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}
      </div>

      {selectedRows.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <span className="text-sm text-blue-800">
            {selectedRows.length}개 항목이 선택되었습니다
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              일괄 편집
            </Button>
            <Button size="sm" variant="outline" className="text-red-600 border-red-200">
              일괄 삭제
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}