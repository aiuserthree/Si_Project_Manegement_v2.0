import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Switch } from '../ui/switch'
import { Badge } from '../ui/badge'
import { ChevronRight, ChevronDown, Folder, Plus, Trash2, Download, Save } from 'lucide-react'

interface MenuNode {
  id: string
  name: string
  depth1: string
  depth2: string
  depth3: string
  depth4: string
  depth5: string
  screenName: string
  accessLevel: 'all' | 'login'
  hasAdmin: boolean
  expanded?: boolean
  children?: MenuNode[]
}

const mockMenuData: MenuNode[] = [
  {
    id: '1',
    name: '홈',
    depth1: '홈',
    depth2: '',
    depth3: '',
    depth4: '',
    depth5: '',
    screenName: '/',
    accessLevel: 'all',
    hasAdmin: false,
    expanded: true,
    children: []
  },
  {
    id: '2',
    name: '사용자 관리',
    depth1: '관리',
    depth2: '사용자 관리',
    depth3: '',
    depth4: '',
    depth5: '',
    screenName: '/admin/users',
    accessLevel: 'login',
    hasAdmin: true,
    expanded: true,
    children: [
      {
        id: '2-1',
        name: '사용자 목록',
        depth1: '관리',
        depth2: '사용자 관리',
        depth3: '사용자 목록',
        depth4: '',
        depth5: '',
        screenName: '/admin/users/list',
        accessLevel: 'login',
        hasAdmin: true,
        expanded: false,
        children: []
      },
      {
        id: '2-2',
        name: '사용자 등록',
        depth1: '관리',
        depth2: '사용자 관리',
        depth3: '사용자 등록',
        depth4: '',
        depth5: '',
        screenName: '/admin/users/create',
        accessLevel: 'login',
        hasAdmin: true,
        expanded: false,
        children: []
      }
    ]
  },
  {
    id: '3',
    name: '프로젝트 관리',
    depth1: '프로젝트',
    depth2: '',
    depth3: '',
    depth4: '',
    depth5: '',
    screenName: '/projects',
    accessLevel: 'login',
    hasAdmin: false,
    expanded: true,
    children: [
      {
        id: '3-1',
        name: '프로젝트 목록',
        depth1: '프로젝트',
        depth2: '프로젝트 목록',
        depth3: '',
        depth4: '',
        depth5: '',
        screenName: '/projects/list',
        accessLevel: 'login',
        hasAdmin: false,
        expanded: false,
        children: []
      },
      {
        id: '3-2',
        name: '프로젝트 생성',
        depth1: '프로젝트',
        depth2: '프로젝트 생성',
        depth3: '',
        depth4: '',
        depth5: '',
        screenName: '/projects/create',
        accessLevel: 'login',
        hasAdmin: false,
        expanded: false,
        children: []
      }
    ]
  }
]

export function MenuStructure() {
  const [menuData, setMenuData] = useState<MenuNode[]>(mockMenuData)
  const [selectedNode, setSelectedNode] = useState<MenuNode | null>(null)

  const toggleNode = (nodeId: string) => {
    const updateNodes = (nodes: MenuNode[]): MenuNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, expanded: !node.expanded }
        }
        if (node.children) {
          return { ...node, children: updateNodes(node.children) }
        }
        return node
      })
    }
    setMenuData(updateNodes(menuData))
  }

  const updateNode = (nodeId: string, field: keyof MenuNode, value: any) => {
    const updateNodes = (nodes: MenuNode[]): MenuNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, [field]: value }
        }
        if (node.children) {
          return { ...node, children: updateNodes(node.children) }
        }
        return node
      })
    }
    setMenuData(updateNodes(menuData))
  }

  const addNewNode = (parentId?: string) => {
    const newNode: MenuNode = {
      id: Date.now().toString(),
      name: '새 메뉴',
      depth1: '새 메뉴',
      depth2: '',
      depth3: '',
      depth4: '',
      depth5: '',
      screenName: '/new-menu',
      accessLevel: 'all',
      hasAdmin: false,
      expanded: false,
      children: []
    }

    if (parentId) {
      // 하위 메뉴로 추가
      const addToParent = (nodes: MenuNode[]): MenuNode[] => {
        return nodes.map(node => {
          if (node.id === parentId) {
            const updatedChildren = [...(node.children || []), newNode]
            return { ...node, children: updatedChildren, expanded: true }
          }
          if (node.children) {
            return { ...node, children: addToParent(node.children) }
          }
          return node
        })
      }
      setMenuData(addToParent(menuData))
    } else {
      // 최상위 메뉴로 추가 - 맨 아래에 추가
      setMenuData([...menuData, newNode])
    }
    setSelectedNode(newNode)
  }

  const deleteNode = (nodeId: string) => {
    if (confirm('이 메뉴를 삭제하시겠습니까?')) {
      const removeNode = (nodes: MenuNode[]): MenuNode[] => {
        return nodes.filter(node => {
          if (node.id === nodeId) return false
          if (node.children) {
            node.children = removeNode(node.children)
          }
          return true
        })
      }
      setMenuData(removeNode(menuData))
      if (selectedNode?.id === nodeId) {
        setSelectedNode(null)
      }
    }
  }

  const saveNode = () => {
    if (selectedNode) {
      console.log('메뉴 저장:', selectedNode)
      alert('메뉴가 저장되었습니다.')
    }
  }

  const exportMenuStructure = () => {
    const exportData = {
      menuStructure: menuData,
      exportDate: new Date().toISOString(),
      totalMenus: menuData.length
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'menu-structure.json')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderTreeNode = (node: MenuNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0
    const isSelected = selectedNode?.id === node.id

    return (
      <div key={node.id} className="space-y-1">
        <div
          className={`
            flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-100
            ${isSelected ? 'bg-blue-50 border border-blue-200' : ''}
          `}
          onClick={() => setSelectedNode(node)}
        >
          <div className="flex items-center space-x-2">
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleNode(node.id)
                }}
                className="p-1 hover:bg-gray-200 rounded"
              >
                {node.expanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-6" />}
            <Folder className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">{node.name}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-blue-100"
              onClick={(e) => {
                e.stopPropagation()
                addNewNode(node.id)
              }}
              title="하위 메뉴 추가"
            >
              <Plus className="w-3 h-3 text-blue-600" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-red-100"
              onClick={(e) => {
                e.stopPropagation()
                deleteNode(node.id)
              }}
              title="메뉴 삭제"
            >
              <Trash2 className="w-3 h-3 text-red-600" />
            </Button>
            <Badge variant="outline" className="text-xs">
              {node.accessLevel === 'all' ? '전체' : '로그인'}
            </Badge>
            {node.hasAdmin && (
              <Badge variant="secondary" className="text-xs">
                관리자
              </Badge>
            )}
          </div>
        </div>
        
        {hasChildren && node.expanded && (
          <div className="ml-6 space-y-1">
            {node.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  const generateTreePreview = (nodes: MenuNode[]) => {
    const generateNode = (node: MenuNode, level: number = 0) => {
      const indent = level * 20 // 20px per level
      
      return (
        <div key={node.id} className="flex items-center mb-2" style={{ marginLeft: `${indent}px` }}>
          <div className="flex items-center space-x-2">
            <Folder className="w-4 h-4 text-blue-500" />
            <span className="font-medium">{node.name}</span>
            <Badge variant="secondary" className="text-xs">{node.screenName}</Badge>
          </div>
          {node.children && node.children.length > 0 && (
            <div className="ml-4">
              {node.children.map(child => generateNode(child, level + 1))}
            </div>
          )}
        </div>
      )
    }
    
    return nodes.map(node => generateNode(node))
  }

  const updateSelectedNode = (field: keyof MenuNode, value: any) => {
    if (selectedNode) {
      setSelectedNode(prev => ({ ...prev!, [field]: value }))
      setMenuData(prev => prev.map(node => 
        node.id === selectedNode.id ? { ...node, [field]: value } : node
      ))
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">메뉴 구조 설계</h2>
          <p className="text-gray-600 mt-1">웹사이트의 메뉴 구조를 설계하고 관리하세요</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={exportMenuStructure} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            내보내기
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Panel - Tree Structure */}
        <div className="col-span-1">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>메뉴 구조</CardTitle>
                <Button 
                  size="sm" 
                  onClick={() => addNewNode()}
                  title="최상위 메뉴 추가"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  추가
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {menuData.map(node => renderTreeNode(node))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Node Details */}
        <div className="col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>메뉴 상세 정보</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedNode ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="depth1">1 Depth</Label>
                      <Input
                        id="depth1"
                        value={selectedNode.depth1}
                        onChange={(e) => updateSelectedNode('depth1', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="depth2">2 Depth</Label>
                      <Input
                        id="depth2"
                        value={selectedNode.depth2}
                        onChange={(e) => updateSelectedNode('depth2', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="depth3">3 Depth</Label>
                      <Input
                        id="depth3"
                        value={selectedNode.depth3}
                        onChange={(e) => updateSelectedNode('depth3', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="depth4">4 Depth</Label>
                      <Input
                        id="depth4"
                        value={selectedNode.depth4}
                        onChange={(e) => updateSelectedNode('depth4', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="depth5">5 Depth</Label>
                      <Input
                        id="depth5"
                        value={selectedNode.depth5}
                        onChange={(e) => updateSelectedNode('depth5', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="screenName">화면명</Label>
                      <Input
                        id="screenName"
                        value={selectedNode.screenName}
                        onChange={(e) => updateSelectedNode('screenName', e.target.value)}
                        className="bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>접근 권한</Label>
                    <RadioGroup 
                      value={selectedNode.accessLevel}
                      onValueChange={(value) => updateSelectedNode('accessLevel', value)}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="access-all" />
                        <Label htmlFor="access-all">전체</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="login" id="access-login" />
                        <Label htmlFor="access-login">로그인</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="admin-function">관리 기능</Label>
                    <Switch
                      id="admin-function"
                      checked={selectedNode.hasAdmin}
                      onCheckedChange={(checked) => updateSelectedNode('hasAdmin', checked)}
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-4 border-t">
                    <Button onClick={saveNode} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4 mr-2" />
                      저장
                    </Button>
                    <Button 
                      onClick={() => deleteNode(selectedNode.id)} 
                      variant="outline" 
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      삭제
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Folder className="w-12 h-12 mx-auto mb-4" />
                  <p>트리에서 메뉴를 선택하세요</p>
                  <p className="text-sm mt-1">메뉴의 상세 정보를 편집할 수 있습니다</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Panel - Visual Tree Preview */}
      <Card>
        <CardHeader>
          <CardTitle>시각적 트리 미리보기</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto pb-4">
            <div className="min-w-full">
              {generateTreePreview(menuData)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}