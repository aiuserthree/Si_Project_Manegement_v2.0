import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'
import { Plus, Edit, Trash2, Save, Users, UserPlus, X, Check } from 'lucide-react'

export type ResourceRole = '기획자' | '디자이너' | '퍼블리셔' | '개발자'
export type ResourceGrade = '초급' | '중급' | '고급'

export interface Resource {
  id: string
  name: string
  role: ResourceRole
  grade: ResourceGrade
  email?: string
  phone?: string
  skills?: string[]
  isAssigned: boolean
  assignedProjectId?: string
}

interface ResourceManagementProps {
  onSave?: () => void
  onNextStep?: () => void
}

const mockResources: Resource[] = [
  {
    id: '1',
    name: '김기획',
    role: '기획자',
    grade: '고급',
    email: 'planner1@example.com',
    phone: '010-1234-5678',
    skills: ['요구사항 분석', '프로젝트 관리'],
    isAssigned: false
  },
  {
    id: '2',
    name: '이디자인',
    role: '디자이너',
    grade: '중급',
    email: 'designer1@example.com',
    phone: '010-2345-6789',
    skills: ['UI/UX 디자인', '프로토타이핑'],
    isAssigned: false
  },
  {
    id: '3',
    name: '박퍼블',
    role: '퍼블리셔',
    grade: '중급',
    email: 'publisher1@example.com',
    phone: '010-3456-7890',
    skills: ['HTML/CSS', '반응형 웹'],
    isAssigned: false
  },
  {
    id: '4',
    name: '최개발',
    role: '개발자',
    grade: '고급',
    email: 'developer1@example.com',
    phone: '010-4567-8901',
    skills: ['React', 'TypeScript', 'Node.js'],
    isAssigned: false
  }
]

const roleOptions: ResourceRole[] = ['기획자', '디자이너', '퍼블리셔', '개발자']
const gradeOptions: ResourceGrade[] = ['초급', '중급', '고급']

export function ResourceManagement({ onSave, onNextStep }: ResourceManagementProps) {
  const [resources, setResources] = useState<Resource[]>(mockResources)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState<Partial<Resource>>({
    name: '',
    role: '기획자',
    grade: '초급',
    email: '',
    phone: '',
    skills: []
  })
  const [assignedResources, setAssignedResources] = useState<Resource[]>([])

  const handleAddResource = () => {
    setIsEditMode(false)
    setFormData({
      name: '',
      role: '기획자',
      grade: '초급',
      email: '',
      phone: '',
      skills: []
    })
    setSelectedResource(null)
    setIsDialogOpen(true)
  }

  const handleEditResource = (resource: Resource) => {
    setIsEditMode(true)
    setSelectedResource(resource)
    setFormData({
      name: resource.name,
      role: resource.role,
      grade: resource.grade,
      email: resource.email,
      phone: resource.phone,
      skills: resource.skills || []
    })
    setIsDialogOpen(true)
  }

  const handleDeleteResource = (id: string) => {
    if (confirm('이 인력을 삭제하시겠습니까?')) {
      setResources(resources.filter(r => r.id !== id))
      setAssignedResources(assignedResources.filter(r => r.id !== id))
    }
  }

  const handleSaveResource = () => {
    if (!formData.name || !formData.role || !formData.grade) {
      alert('필수 항목을 입력해주세요.')
      return
    }

    if (isEditMode && selectedResource) {
      // 수정
      const updated = resources.map(r =>
        r.id === selectedResource.id
          ? { ...r, ...formData, id: selectedResource.id }
          : r
      )
      setResources(updated)
      
      // 할당된 리소스도 업데이트
      const updatedAssigned = assignedResources.map(r =>
        r.id === selectedResource.id
          ? { ...r, ...formData, id: selectedResource.id }
          : r
      )
      setAssignedResources(updatedAssigned)
    } else {
      // 추가
      const newResource: Resource = {
        id: Date.now().toString(),
        name: formData.name!,
        role: formData.role!,
        grade: formData.grade!,
        email: formData.email,
        phone: formData.phone,
        skills: formData.skills || [],
        isAssigned: false
      }
      setResources([...resources, newResource])
    }

    setIsDialogOpen(false)
    setFormData({
      name: '',
      role: '기획자',
      grade: '초급',
      email: '',
      phone: '',
      skills: []
    })
  }

  const handleAssignResource = (resource: Resource) => {
    if (resource.isAssigned) {
      // 할당 해제
      const updated = resources.map(r =>
        r.id === resource.id ? { ...r, isAssigned: false, assignedProjectId: undefined } : r
      )
      setResources(updated)
      setAssignedResources(assignedResources.filter(r => r.id !== resource.id))
    } else {
      // 할당
      const updated = resources.map(r =>
        r.id === resource.id ? { ...r, isAssigned: true, assignedProjectId: 'current-project' } : r
      )
      setResources(updated)
      setAssignedResources([...assignedResources, { ...resource, isAssigned: true, assignedProjectId: 'current-project' }])
    }
  }

  const getRoleColor = (role: ResourceRole) => {
    switch (role) {
      case '기획자': return 'bg-purple-100 text-purple-700'
      case '디자이너': return 'bg-pink-100 text-pink-700'
      case '퍼블리셔': return 'bg-green-100 text-green-700'
      case '개발자': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getGradeColor = (grade: ResourceGrade) => {
    switch (grade) {
      case '초급': return 'bg-gray-100 text-gray-700'
      case '중급': return 'bg-yellow-100 text-yellow-700'
      case '고급': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">인력 관리</h2>
          <p className="text-gray-600 mt-1">인력 pool을 관리하고 프로젝트에 투입하세요</p>
        </div>
        <Button onClick={handleAddResource} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          인력 추가
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Panel - Resource Pool */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              인력 Pool
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>역할</TableHead>
                    <TableHead>등급</TableHead>
                    <TableHead>연락처</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell className="font-medium">{resource.name}</TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(resource.role)}>
                          {resource.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getGradeColor(resource.grade)}>
                          {resource.grade}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {resource.email || '-'}
                      </TableCell>
                      <TableCell>
                        {resource.isAssigned ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            투입됨
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700">
                            대기중
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditResource(resource)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteResource(resource.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={resource.isAssigned ? "outline" : "default"}
                            onClick={() => handleAssignResource(resource)}
                            className={resource.isAssigned ? "text-red-600 border-red-200 hover:bg-red-50" : ""}
                          >
                            {resource.isAssigned ? (
                              <>
                                <X className="w-4 h-4 mr-1" />
                                해제
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-4 h-4 mr-1" />
                                투입
                              </>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Right Panel - Assigned Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              프로젝트 투입 인력
            </CardTitle>
          </CardHeader>
          <CardContent>
            {assignedResources.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {assignedResources.map((resource) => (
                    <Card key={resource.id} className="border-2">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{resource.name}</h4>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleAssignResource(resource)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getRoleColor(resource.role)}>
                              {resource.role}
                            </Badge>
                            <Badge className={getGradeColor(resource.grade)}>
                              {resource.grade}
                            </Badge>
                          </div>
                          {resource.skills && resource.skills.length > 0 && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">스킬: </span>
                              {resource.skills.join(', ')}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">총 투입 인력</span>
                    <span className="font-semibold text-lg">{assignedResources.length}명</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>투입된 인력이 없습니다</p>
                <p className="text-sm mt-1">인력 Pool에서 인원을 선택하여 투입하세요</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Resource Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? '인력 정보 수정' : '새 인력 추가'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">이름 *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="이름을 입력하세요"
                />
              </div>
              <div>
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="role">역할 *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: ResourceRole) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="grade">등급 *</Label>
                <Select
                  value={formData.grade}
                  onValueChange={(value: ResourceGrade) => setFormData({ ...formData, grade: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {gradeOptions.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="phone">연락처</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="010-1234-5678"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSaveResource} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <Button
          onClick={() => {
            onSave?.()
            onNextStep?.()
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Save className="w-4 h-4 mr-2" />
          저장 및 다음 단계
        </Button>
      </div>

    </div>
  )
}

