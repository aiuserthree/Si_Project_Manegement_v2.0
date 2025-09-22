import { useState } from 'react'
import { Bot, Send, Zap, FileSearch, Code, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: string
}

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'ai',
    content: '안녕하세요! SI Project Manager AI 어시스턴트입니다. 프로젝트 분석이나 문서 생성을 도와드릴게요.',
    timestamp: '10:30'
  },
  {
    id: '2',
    type: 'user',
    content: '현재 프로젝트의 요구사항 분석 상황은 어떤가요?',
    timestamp: '10:32'
  },
  {
    id: '3',
    type: 'ai',
    content: '현재 23개의 요구사항이 정의되어 있으며, 전체 진행률은 67%입니다. 상품 추천 엔진(REQ-006)과 고객 리뷰 시스템(REQ-008)의 진행률이 낮아 우선 검토가 필요합니다.',
    timestamp: '10:32'
  }
]

const quickActions = [
  {
    icon: FileSearch,
    label: '요구사항 분석',
    description: 'AI가 현재 요구사항을 분석합니다'
  },
  {
    icon: Code,
    label: 'IA Code 검증',
    description: '코드 구조와 명명 규칙을 검증합니다'
  },
  {
    icon: Zap,
    label: '문서 자동 생성',
    description: '현재 데이터로 문서를 자동 생성합니다'
  }
]

interface AIAssistantProps {
  isCollapsed: boolean
  onToggle: () => void
  isMobile: boolean
}

export function AIAssistant({ isCollapsed, onToggle, isMobile }: AIAssistantProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [inputValue, setInputValue] = useState('')

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }

    setMessages([...messages, userMessage])
    setInputValue('')

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '요청을 분석하고 있습니다. 잠시만 기다려주세요.',
        timestamp: new Date().toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }
      setMessages(prev => [...prev, aiMessage])
    }, 1000)
  }

  const handleQuickAction = (action: typeof quickActions[0]) => {
    const message: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: action.label,
      timestamp: new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
    setMessages([...messages, message])
  }

  // Mobile: Floating action button
  if (isMobile) {
    return (
      <Button 
        className="w-14 h-14 rounded-full bg-blue-700 hover:bg-blue-800 shadow-lg"
        onClick={onToggle}
      >
        <Bot className="w-6 h-6 text-white" />
      </Button>
    )
  }

  // Desktop: Collapsed sidebar
  if (isCollapsed) {
    return (
      <div className="w-12 h-full bg-white border-l border-gray-200 flex flex-col items-center py-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggle}
          className="mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-blue-600" />
        </div>
        <Badge className="rotate-90 mt-4 bg-blue-100 text-blue-800 text-xs">
          AI
        </Badge>
      </div>
    )
  }

  // Desktop: Full panel
  return (
    <Card className="w-80 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI 어시스턴트</h3>
            <p className="text-xs text-green-600">온라인</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onToggle}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <Avatar className="w-6 h-6 flex-shrink-0">
              {message.type === 'ai' ? (
                <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="w-3 h-3 text-blue-600" />
                </div>
              ) : (
                <>
                  <AvatarImage src="/api/placeholder/24/24" />
                  <AvatarFallback className="text-xs">김</AvatarFallback>
                </>
              )}
            </Avatar>
            
            <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
              <div
                className={`inline-block p-3 rounded-lg text-sm max-w-xs ${
                  message.type === 'user'
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.content}
              </div>
              <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t">
        <p className="text-sm font-medium text-gray-900 mb-3">빠른 작업</p>
        <div className="space-y-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left h-auto p-3"
              onClick={() => handleQuickAction(action)}
            >
              <action.icon className="w-4 h-4 mr-3 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">{action.label}</div>
                <div className="text-xs text-gray-500">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="질문을 입력하세요..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button size="sm" onClick={handleSendMessage}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}