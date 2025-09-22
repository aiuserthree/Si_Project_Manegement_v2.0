import { useState } from 'react'
import { ChevronRight, ChevronDown, Folder, File, Grid, Eye, Code } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

interface TreeNode {
  id: string
  name: string
  iaCode: string
  type: 'folder' | 'screen' | 'component'
  children?: TreeNode[]
  expanded?: boolean
}

const treeData: TreeNode[] = [
  {
    id: '1',
    name: '사용자 관리',
    iaCode: 'USR',
    type: 'folder',
    expanded: true,
    children: [
      {
        id: '1-1',
        name: '회원가입',
        iaCode: 'USR.REG',
        type: 'screen',
        children: [
          { id: '1-1-1', name: '회원가입 폼', iaCode: 'USR.REG.001', type: 'component' },
          { id: '1-1-2', name: '약관 동의', iaCode: 'USR.REG.002', type: 'component' },
          { id: '1-1-3', name: '이메일 인증', iaCode: 'USR.REG.003', type: 'component' }
        ]
      },
      {
        id: '1-2',
        name: '로그인',
        iaCode: 'USR.LGN',
        type: 'screen',
        children: [
          { id: '1-2-1', name: '로그인 폼', iaCode: 'USR.LGN.001', type: 'component' },
          { id: '1-2-2', name: '소셜 로그인', iaCode: 'USR.LGN.002', type: 'component' }
        ]
      }
    ]
  },
  {
    id: '2',
    name: '상품 관리',
    iaCode: 'PRD',
    type: 'folder',
    expanded: false,
    children: [
      {
        id: '2-1',
        name: '상품 목록',
        iaCode: 'PRD.LST',
        type: 'screen',
        children: [
          { id: '2-1-1', name: '상품 카드', iaCode: 'PRD.LST.001', type: 'component' },
          { id: '2-1-2', name: '검색 필터', iaCode: 'PRD.LST.002', type: 'component' }
        ]
      },
      {
        id: '2-2',
        name: '상품 상세',
        iaCode: 'PRD.DTL',
        type: 'screen',
        children: [
          { id: '2-2-1', name: '상품 정보', iaCode: 'PRD.DTL.001', type: 'component' },
          { id: '2-2-2', name: '리뷰 섹션', iaCode: 'PRD.DTL.002', type: 'component' }
        ]
      }
    ]
  },
  {
    id: '3',
    name: '주문 관리',
    iaCode: 'ORD',
    type: 'folder',
    expanded: false,
    children: [
      {
        id: '3-1',
        name: '장바구니',
        iaCode: 'ORD.CRT',
        type: 'screen',
        children: [
          { id: '3-1-1', name: '장바구니 아이템', iaCode: 'ORD.CRT.001', type: 'component' }
        ]
      }
    ]
  }
]

interface TreeItemProps {
  node: TreeNode
  level: number
  onToggle: (id: string) => void
  onSelect: (node: TreeNode) => void
  selectedId?: string
}

function TreeItem({ node, level, onToggle, onSelect, selectedId }: TreeItemProps) {
  const hasChildren = node.children && node.children.length > 0
  const isSelected = selectedId === node.id

  const getIcon = () => {
    switch (node.type) {
      case 'folder':
        return <Folder className="w-4 h-4 text-blue-600" />
      case 'screen':
        return <Grid className="w-4 h-4 text-green-600" />
      case 'component':
        return <File className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div>
      <div 
        className={`flex items-center gap-2 py-2 px-3 hover:bg-gray-50 cursor-pointer rounded ${
          isSelected ? 'bg-blue-50 border-l-2 border-blue-600' : ''
        }`}
        style={{ paddingLeft: `${level * 20 + 12}px` }}
        onClick={() => onSelect(node)}
      >
        {hasChildren && (
          <Button
            variant="ghost"
            size="sm"
            className="w-4 h-4 p-0"
            onClick={(e) => {
              e.stopPropagation()
              onToggle(node.id)
            }}
          >
            {node.expanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </Button>
        )}
        {!hasChildren && <div className="w-4" />}
        
        {getIcon()}
        
        <span className="text-sm font-medium text-gray-900 flex-1">{node.name}</span>
        
        <Badge variant="secondary" className="text-xs font-mono">
          {node.iaCode}
        </Badge>
      </div>
      
      {hasChildren && node.expanded && (
        <div>
          {node.children?.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              level={level + 1}
              onToggle={onToggle}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function IACodeTree() {
  const [treeState, setTreeState] = useState(treeData)
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null)

  const toggleNode = (id: string) => {
    const updateNode = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        if (node.id === id) {
          return { ...node, expanded: !node.expanded }
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) }
        }
        return node
      })
    }
    setTreeState(updateNode(treeState))
  }

  const handleSelectNode = (node: TreeNode) => {
    setSelectedNode(node)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">IA Code 구조 및 화면 설계</h2>
      
      {/* Desktop: Side by side layout */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-6">
        {/* Left Panel - Tree Structure */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">IA Code 구조</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Code className="w-4 h-4 mr-2" />
                코드 생성
              </Button>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {treeState.map((node) => (
              <TreeItem
                key={node.id}
                node={node}
                level={0}
                onToggle={toggleNode}
                onSelect={handleSelectNode}
                selectedId={selectedNode?.id}
              />
            ))}
          </div>
        </Card>

        {/* Right Panel - Screen Design Preview */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">화면 설계 미리보기</h3>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              전체 화면
            </Button>
          </div>

          {selectedNode ? (
            <div>
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{selectedNode.name}</h4>
                  <Badge className="font-mono">{selectedNode.iaCode}</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {selectedNode.type === 'screen' && '화면 단위'}
                  {selectedNode.type === 'component' && '컴포넌트 단위'}
                  {selectedNode.type === 'folder' && '폴더 구조'}
                </p>
              </div>

              <Tabs defaultValue="wireframe" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="wireframe">와이어프레임</TabsTrigger>
                  <TabsTrigger value="components">컴포넌트</TabsTrigger>
                </TabsList>
                
                <TabsContent value="wireframe" className="space-y-4">
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <Grid className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {selectedNode.name} 와이어프레임
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        IA Code: {selectedNode.iaCode}
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="components" className="space-y-4">
                  <div className="space-y-2">
                    {selectedNode.children?.map((child) => (
                      <div key={child.id} className="p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{child.name}</span>
                          <Badge variant="outline" className="text-xs font-mono">
                            {child.iaCode}
                          </Badge>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-gray-500">
                        <File className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">하위 컴포넌트가 없습니다</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Grid className="w-12 h-12 mx-auto mb-4" />
              <p>트리에서 항목을 선택하세요</p>
              <p className="text-sm mt-1">화면 설계와 컴포넌트 정보를 확인할 수 있습니다</p>
            </div>
          )}
        </Card>
      </div>

      {/* Mobile/Tablet: Tabs layout */}
      <div className="lg:hidden">
        <Tabs defaultValue="tree" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tree">IA 구조</TabsTrigger>
            <TabsTrigger value="design">화면 설계</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tree" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">IA Code 구조</h3>
                <Button variant="outline" size="sm">
                  <Code className="w-4 h-4 mr-2" />
                  생성
                </Button>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {treeState.map((node) => (
                  <TreeItem
                    key={node.id}
                    node={node}
                    level={0}
                    onToggle={toggleNode}
                    onSelect={handleSelectNode}
                    selectedId={selectedNode?.id}
                  />
                ))}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="design" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">화면 설계</h3>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  전체
                </Button>
              </div>

              {selectedNode ? (
                <div>
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h4 className="font-medium text-gray-900">{selectedNode.name}</h4>
                      <Badge className="font-mono w-fit">{selectedNode.iaCode}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {selectedNode.type === 'screen' && '화면 단위'}
                      {selectedNode.type === 'component' && '컴포넌트 단위'}
                      {selectedNode.type === 'folder' && '폴더 구조'}
                    </p>
                  </div>

                  <Tabs defaultValue="wireframe" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="wireframe">와이어프레임</TabsTrigger>
                      <TabsTrigger value="components">컴포넌트</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="wireframe" className="space-y-4">
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                        <div className="text-center">
                          <Grid className="w-8 h-8 md:w-12 md:h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            {selectedNode.name} 와이어프레임
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            IA Code: {selectedNode.iaCode}
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="components" className="space-y-4">
                      <div className="space-y-2">
                        {selectedNode.children?.map((child) => (
                          <div key={child.id} className="p-3 border rounded-lg hover:bg-gray-50">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <span className="text-sm font-medium">{child.name}</span>
                              <Badge variant="outline" className="text-xs font-mono w-fit">
                                {child.iaCode}
                              </Badge>
                            </div>
                          </div>
                        )) || (
                          <div className="text-center py-8 text-gray-500">
                            <File className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2" />
                            <p className="text-sm">하위 컴포넌트가 없습니다</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Grid className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-4" />
                  <p className="text-sm">구조에서 항목을 선택하세요</p>
                  <p className="text-xs mt-1">화면 설계와 컴포넌트 정보를 확인할 수 있습니다</p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}