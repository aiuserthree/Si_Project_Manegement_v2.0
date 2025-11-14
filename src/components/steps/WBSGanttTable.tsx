import { useState } from 'react'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Function, WBSTask } from './WBSGantt'

interface WBSGanttTableProps {
  functions: Function[]
  onUpdate: (functions: Function[]) => void
}

// 업무별 컬럼 구조
const workTypeColumns = {
  '기획': ['담당자', '진행률', '시작일', '완료예정일', '검수 상태', '검수 완료일'],
  '디자인': ['담당자', '진행률', '시작일', '완료예정일', '검수 상태', '검수 완료일'],
  '퍼블리싱': ['담당자', '진행률', '시작일', '완료예정일', '검수 상태', '검수 완료일'],
  '개발': ['담당자', '진행률', '시작일', '완료예정일'],
  '검수': ['담당자', '진행률', '시작일', '완료예정일', '검수 상태', '검수 완료일']
}

// 역할을 업무 타입으로 매핑
const roleToWorkType: Record<string, '기획' | '디자인' | '퍼블리싱' | '개발' | '검수'> = {
  '기획자': '기획',
  '디자이너': '디자인',
  '퍼블리셔': '퍼블리싱',
  '개발자': '개발',
  '검수자': '검수'
}

export function WBSGanttTable({ functions, onUpdate }: WBSGanttTableProps) {
  const [editingTask, setEditingTask] = useState<{ task: WBSTask; workType: string; funcId: string } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; weekIdx: number; taskIdx: number } | null>(null)
  // 기능별로 업무별 작업을 그룹화
  const getTasksByWorkType = (func: Function) => {
    const tasksByType: Record<string, WBSTask | null> = {
      '기획': null,
      '디자인': null,
      '퍼블리싱': null,
      '개발': null,
      '검수': null
    }
    
    func.tasks.forEach(task => {
      // 검수 작업은 taskName에 '검수'가 포함되어 있으면 검수로 매핑
      const isReviewTask = task.taskName.includes('검수')
      const workType = isReviewTask ? '검수' : (roleToWorkType[task.role] || '기획')
      if (!tasksByType[workType]) {
        tasksByType[workType] = task
      }
    })
    
    return tasksByType
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // 날짜 범위 계산
  const getDateRange = () => {
    let minDate: Date | null = null
    let maxDate: Date | null = null

    // 실제 작업의 날짜 범위 찾기
    functions.forEach(func => {
      func.tasks.forEach(task => {
        if (task.startDate && (!minDate || task.startDate < minDate)) {
          minDate = task.startDate
        }
        if (task.endDate && (!maxDate || task.endDate > maxDate)) {
          maxDate = task.endDate
        }
      })
    })

    // 작업이 없거나 날짜가 없는 경우 기본값 설정
    if (!minDate || !maxDate) {
      minDate = new Date()
      maxDate = new Date()
      maxDate.setMonth(maxDate.getMonth() + 6) // 기본 6개월 (데이터가 없을 때만)
    }
    // 최대 기간 제한 없이 실제 작업 기간에 맞춰 표시

    return { start: minDate, end: maxDate }
  }

  // 주차 계산 (월의 몇 번째 주인지, 월요일 기준)
  const getWeekOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    const firstDayOfWeek = firstDay.getDay() === 0 ? 7 : firstDay.getDay() // 일요일을 7로 변환
    const dayOfMonth = date.getDate()
    const adjustedDay = dayOfMonth + (firstDayOfWeek - 1) // 월요일 기준으로 조정
    return Math.ceil(adjustedDay / 7)
  }

  // 월별 주차 컬럼 생성
  const generateWeekColumns = () => {
    const { start, end } = getDateRange()
    const columns: { month: number; year: number; week: number; startDate: Date; endDate: Date; weekNumber: number }[] = []
    
    const currentDate = new Date(start)
    // 주의 시작일로 조정 (월요일)
    const dayOfWeek = currentDate.getDay()
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    currentDate.setDate(currentDate.getDate() - daysToMonday)
    
    let weekNumber = 1
    let currentMonth = currentDate.getMonth() + 1
    let currentYear = currentDate.getFullYear()

    // 종료일을 약간 여유있게 설정 (마지막 작업이 끝나는 주까지 포함)
    const endDateWithBuffer = new Date(end)
    endDateWithBuffer.setDate(endDateWithBuffer.getDate() + 7) // 1주일 여유

    while (currentDate <= endDateWithBuffer) {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      
      // 월이 바뀌면 주차 번호 리셋
      if (month !== currentMonth || year !== currentYear) {
        weekNumber = 1
        currentMonth = month
        currentYear = year
      }
      
      const weekStart = new Date(currentDate)
      const weekEnd = new Date(currentDate)
      weekEnd.setDate(weekStart.getDate() + 6)

      columns.push({
        month,
        year,
        week: weekNumber,
        weekNumber: weekNumber,
        startDate: weekStart,
        endDate: weekEnd
      })

      // 다음 주로 이동
      currentDate.setDate(currentDate.getDate() + 7)
      weekNumber++
      
      // 무한 루프 방지 (최대 10년치)
      if (columns.length > 520) break // 약 10년치 (52주 * 10년)
    }

    return columns
  }

  // 작업이 주차에 포함되는지 확인
  const isTaskInWeek = (task: WBSTask | null, weekStart: Date, weekEnd: Date) => {
    if (!task || !task.startDate || !task.endDate) return false
    return (task.startDate <= weekEnd && task.endDate >= weekStart)
  }

  // 주차 내에서 작업의 위치 계산 (0~1)
  const getTaskPositionInWeek = (task: WBSTask | null, weekStart: Date, weekEnd: Date) => {
    if (!task || !task.startDate || !task.endDate) return { start: 0, width: 0 }
    
    const weekDuration = weekEnd.getTime() - weekStart.getTime()
    const taskStart = Math.max(task.startDate.getTime(), weekStart.getTime())
    const taskEnd = Math.min(task.endDate.getTime(), weekEnd.getTime())
    
    const startPos = (taskStart - weekStart.getTime()) / weekDuration
    const width = (taskEnd - taskStart) / weekDuration
    
    return { start: startPos, width: Math.max(width, 0.1) }
  }

  // 업무별 색상
  const getWorkTypeColor = (workType: string) => {
    switch (workType) {
      case '기획': return '#9333ea'
      case '디자인': return '#ec4899'
      case '퍼블리싱': return '#10b981'
      case '개발': return '#3b82f6'
      case '검수': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const updateTask = (funcId: string, workType: string, field: string, value: any) => {
    const updatedFunctions = functions.map(func => {
      if (func.id !== funcId) return func
      
      const updatedTasks = func.tasks.map(task => {
        // 검수 작업은 taskName에 '검수'가 포함되어 있으면 검수로 매핑
        const isReviewTask = task.taskName.includes('검수')
        const taskWorkType = isReviewTask ? '검수' : (roleToWorkType[task.role] || '기획')
        if (taskWorkType !== workType) return task
        
        return { ...task, [field]: value }
      })
      
      return { ...func, tasks: updatedTasks }
    })
    
    onUpdate(updatedFunctions)
  }

  const weekColumns = generateWeekColumns()

  return (
    <div className="border rounded-lg" style={{ position: 'relative' }}>
      <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        <table className="border-collapse" style={{ fontSize: '13px', minWidth: '100%', width: `${Math.max(100, weekColumns.length * 400 + 5000)}px`, tableLayout: 'fixed' }}>
          {/* 헤더 1: 업무 구분 */}
          <thead style={{ position: 'sticky', top: 0, zIndex: 20, backgroundColor: 'white' }}>
            <tr className="bg-gray-200">
            <th rowSpan={2} className="border p-3 bg-[#434343] text-white font-semibold" style={{ minWidth: '150px', width: '150px', position: 'sticky', left: 0, zIndex: 21, backgroundColor: '#434343' }}>구분</th>
            <th rowSpan={2} className="border p-3 bg-[#434343] text-white font-semibold" style={{ minWidth: '250px', width: '250px', position: 'sticky', left: '150px', zIndex: 21, backgroundColor: '#434343' }}>1depth</th>
            <th rowSpan={2} className="border p-3 bg-[#434343] text-white font-semibold" style={{ minWidth: '250px', width: '250px' }}>2depth</th>
            <th rowSpan={2} className="border p-3 bg-[#434343] text-white font-semibold" style={{ minWidth: '250px', width: '250px' }}>3depth</th>
            <th rowSpan={2} className="border p-3 bg-[#434343] text-white font-semibold" style={{ minWidth: '180px', width: '180px' }}>페이지</th>
            <th rowSpan={2} className="border p-3 bg-[#434343] text-white font-semibold" style={{ minWidth: '400px', width: '400px' }}>기능 정의</th>
            <th rowSpan={2} className="border p-3 bg-[#434343] text-white font-semibold" style={{ minWidth: '600px', width: '600px' }}>세부 내용</th>
            <th rowSpan={2} className="border p-3 bg-[#434343] text-white font-semibold" style={{ minWidth: '120px', width: '120px' }}>Platform</th>
            <th rowSpan={2} className="border p-3 bg-[#434343] text-white font-semibold" style={{ minWidth: '100px', width: '100px' }}>Spec</th>
            <th rowSpan={2} className="border p-3 bg-[#434343] text-white font-semibold" style={{ minWidth: '300px', width: '300px' }}>비고</th>
            <th colSpan={6} className="border p-2 bg-[#C9DAF8] text-center font-semibold">기획</th>
            <th colSpan={6} className="border p-2 bg-[#C9DAF8] text-center font-semibold">디자인</th>
            <th colSpan={6} className="border p-2 bg-[#C9DAF8] text-center font-semibold">퍼블리싱</th>
            <th colSpan={4} className="border p-2 bg-[#C9DAF8] text-center font-semibold">개발</th>
            <th colSpan={6} className="border p-2 bg-[#C9DAF8] text-center font-semibold">검수(내부)</th>
            <th colSpan={weekColumns.length} className="border p-2 bg-[#F3F3F3] text-center font-semibold">일정 타임라인</th>
          </tr>
          <tr className="bg-[#C9DAF8]">
            {/* 기획 */}
            <th className="border p-2" style={{ minWidth: '300px', width: '300px' }}>담당자</th>
            <th className="border p-2" style={{ minWidth: '200px', width: '200px' }}>진행률</th>
            <th className="border p-2" style={{ minWidth: '300px', width: '300px' }}>시작일</th>
            <th className="border p-2" style={{ minWidth: '300px', width: '300px' }}>완료예정일</th>
            <th className="border p-2" style={{ minWidth: '300px', width: '300px' }}>검수 상태</th>
            <th className="border p-2" style={{ minWidth: '300px', width: '300px' }}>검수 완료일</th>
            {/* 디자인 */}
            <th className="border p-2" style={{ minWidth: '300px', width: '300px' }}>담당자</th>
            <th className="border p-2" style={{ minWidth: '200px', width: '200px' }}>진행률</th>
            <th className="border p-2" style={{ minWidth: '300px', width: '300px' }}>시작일</th>
            <th className="border p-2" style={{ minWidth: '300px', width: '300px' }}>완료예정일</th>
            <th className="border p-2" style={{ minWidth: '300px', width: '300px' }}>검수 상태</th>
            <th className="border p-2" style={{ minWidth: '300px', width: '300px' }}>검수 완료일</th>
            {/* 퍼블리싱 */}
            <th className="border p-2" style={{ minWidth: '300px', width: '300px' }}>담당자</th>
            <th className="border p-2" style={{ minWidth: '200px', width: '200px' }}>진행률</th>
            <th className="border p-2" style={{ minWidth: '300px', width: '300px' }}>시작일</th>
            <th className="border p-2" style={{ minWidth: '300px', width: '300px' }}>완료예정일</th>
            <th className="border p-2" style={{ minWidth: '300px', width: '300px' }}>검수 상태</th>
            <th className="border p-2" style={{ minWidth: '300px', width: '300px' }}>검수 완료일</th>
            {/* 개발 */}
            <th className="border p-2" style={{ minWidth: '300px', width: '300px' }}>담당자</th>
            <th className="border p-2" style={{ minWidth: '200px', width: '200px' }}>진행률</th>
            <th className="border p-2" style={{ minWidth: '300px', width: '300px' }}>시작일</th>
            <th className="border p-2" style={{ minWidth: '300px', width: '300px' }}>완료예정일</th>
            {/* 검수 */}
            <th className="border p-2" style={{ minWidth: '300px', width: '300px' }}>담당자</th>
            <th className="border p-2" style={{ minWidth: '200px', width: '200px' }}>진행률</th>
            <th className="border p-2" style={{ minWidth: '300px', width: '300px' }}>시작일</th>
            <th className="border p-2" style={{ minWidth: '300px', width: '300px' }}>완료예정일</th>
            <th className="border p-2" style={{ minWidth: '300px', width: '300px' }}>검수 상태</th>
            <th className="border p-2" style={{ minWidth: '300px', width: '300px' }}>검수 완료일</th>
            {/* 일정 타임라인 헤더 */}
            {weekColumns.map((col, idx) => {
              const monthLabel = `${col.year % 100}년 ${col.month}월`
              const weekLabel = `${col.week}w\n${col.startDate.getDate()}~${col.endDate.getDate()}`
              return (
                <th key={idx} className="border p-2 bg-[#F3F3F3] text-center" style={{ minWidth: '400px', width: '400px' }}>
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-medium">{monthLabel}</span>
                    <span className="text-xs whitespace-pre-line leading-tight">{weekLabel}</span>
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {functions.map((func) => {
            const tasksByType = getTasksByWorkType(func)
            const progressColor = (progress: number = 0) => {
              if (progress >= 1.0) return '#D9EAD3'
              if (progress > 0) return '#FFF2CC'
              return '#FFFFFF'
            }
            
            return (
              <tr key={func.id} className="hover:bg-gray-50" style={{ height: '220px' }}>
                {/* 작업 분류 영역 */}
                <td className="border p-3 bg-white hover:bg-white" style={{ verticalAlign: 'top', position: 'sticky', left: 0, zIndex: 10, minWidth: '150px', width: '150px' }}>{func.division || ''}</td>
                <td className="border p-3 bg-white hover:bg-white" style={{ verticalAlign: 'top', position: 'sticky', left: '150px', zIndex: 10, minWidth: '250px', width: '250px' }}>{func.depth1 || ''}</td>
                <td className="border p-3" style={{ verticalAlign: 'top', minWidth: '250px', width: '250px' }}>{func.depth2 || ''}</td>
                <td className="border p-3" style={{ verticalAlign: 'top', minWidth: '250px', width: '250px' }}>{func.depth3 || ''}</td>
                <td className="border p-3" style={{ verticalAlign: 'top', minWidth: '180px', width: '180px' }}>{func.page || ''}</td>
                <td className="border p-3 font-medium" style={{ verticalAlign: 'top', minWidth: '400px', width: '400px' }}>{func.name}</td>
                <td className="border p-3" style={{ verticalAlign: 'top', minWidth: '600px', width: '600px' }}>{func.description}</td>
                <td className="border p-3" style={{ verticalAlign: 'top', minWidth: '120px', width: '120px' }}>{func.platform || ''}</td>
                <td className="border p-3" style={{ verticalAlign: 'top', minWidth: '100px', width: '100px' }}>{func.spec || ''}</td>
                <td className="border p-3" style={{ verticalAlign: 'top', minWidth: '300px', width: '300px' }}>{func.note || ''}</td>
                
                {/* 기획 영역 */}
                {tasksByType['기획'] ? (
                  <>
                    <td className="border p-2" style={{ backgroundColor: progressColor(tasksByType['기획']?.progress) }}>
                      <Input
                        className="h-8 border-0 bg-transparent"
                        value={tasksByType['기획']?.assignedResourceName || ''}
                        onChange={(e) => updateTask(func.id, '기획', 'assignedResourceName', e.target.value)}
                      />
                    </td>
                    <td className="border p-2" style={{ backgroundColor: progressColor(tasksByType['기획']?.progress) }}>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="1"
                          step="0.1"
                          className="h-8 w-20 border-0 bg-transparent"
                          value={tasksByType['기획']?.progress || 0}
                          onChange={(e) => updateTask(func.id, '기획', 'progress', parseFloat(e.target.value) || 0)}
                        />
                        <span>{(tasksByType['기획']?.progress || 0) * 100}%</span>
                      </div>
                    </td>
                    <td className="border p-2" style={{ backgroundColor: progressColor(tasksByType['기획']?.progress) }}>
                      <Input
                        type="date"
                        className="h-8 border-0 bg-transparent"
                        value={formatDate(tasksByType['기획']?.startDate)}
                        onChange={(e) => updateTask(func.id, '기획', 'startDate', e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </td>
                    <td className="border p-2" style={{ backgroundColor: progressColor(tasksByType['기획']?.progress) }}>
                      <Input
                        type="date"
                        className="h-8 border-0 bg-transparent"
                        value={formatDate(tasksByType['기획']?.endDate)}
                        onChange={(e) => updateTask(func.id, '기획', 'endDate', e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </td>
                    <td className="border p-2" style={{ backgroundColor: progressColor(tasksByType['기획']?.progress) }}>
                      <Select
                        value={tasksByType['기획']?.reviewStatus || '대기'}
                        onValueChange={(value) => updateTask(func.id, '기획', 'reviewStatus', value)}
                      >
                        <SelectTrigger className="h-8 border-0 bg-transparent">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="대기">대기</SelectItem>
                          <SelectItem value="검수 요청">검수 요청</SelectItem>
                          <SelectItem value="검수 진행중">검수 진행중</SelectItem>
                          <SelectItem value="검수완료">검수완료</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="border p-2" style={{ backgroundColor: progressColor(tasksByType['기획']?.progress) }}>
                      <Input
                        type="date"
                        className="h-8 border-0 bg-transparent"
                        value={formatDate(tasksByType['기획']?.reviewCompleteDate)}
                        onChange={(e) => updateTask(func.id, '기획', 'reviewCompleteDate', e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </td>
                  </>
                ) : (
                  <td colSpan={6} className="border p-2"></td>
                )}
                
                {/* 디자인 영역 */}
                {tasksByType['디자인'] ? (
                  <>
                    <td className="border p-2" style={{ backgroundColor: progressColor(tasksByType['디자인']?.progress) }}>
                      <Input
                        className="h-8 border-0 bg-transparent"
                        value={tasksByType['디자인']?.assignedResourceName || ''}
                        onChange={(e) => updateTask(func.id, '디자인', 'assignedResourceName', e.target.value)}
                      />
                    </td>
                    <td className="border p-2" style={{ backgroundColor: progressColor(tasksByType['디자인']?.progress) }}>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="1"
                          step="0.1"
                          className="h-8 w-20 border-0 bg-transparent"
                          value={tasksByType['디자인']?.progress || 0}
                          onChange={(e) => updateTask(func.id, '디자인', 'progress', parseFloat(e.target.value) || 0)}
                        />
                        <span>{(tasksByType['디자인']?.progress || 0) * 100}%</span>
                      </div>
                    </td>
                    <td className="border p-2" style={{ backgroundColor: progressColor(tasksByType['디자인']?.progress) }}>
                      <Input
                        type="date"
                        className="h-8 border-0 bg-transparent"
                        value={formatDate(tasksByType['디자인']?.startDate)}
                        onChange={(e) => updateTask(func.id, '디자인', 'startDate', e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </td>
                    <td className="border p-2" style={{ backgroundColor: progressColor(tasksByType['디자인']?.progress) }}>
                      <Input
                        type="date"
                        className="h-8 border-0 bg-transparent"
                        value={formatDate(tasksByType['디자인']?.endDate)}
                        onChange={(e) => updateTask(func.id, '디자인', 'endDate', e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </td>
                    <td className="border p-2" style={{ backgroundColor: progressColor(tasksByType['디자인']?.progress) }}>
                      <Select
                        value={tasksByType['디자인']?.reviewStatus || '대기'}
                        onValueChange={(value) => updateTask(func.id, '디자인', 'reviewStatus', value)}
                      >
                        <SelectTrigger className="h-8 border-0 bg-transparent">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="대기">대기</SelectItem>
                          <SelectItem value="검수 요청">검수 요청</SelectItem>
                          <SelectItem value="검수 진행중">검수 진행중</SelectItem>
                          <SelectItem value="검수완료">검수완료</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="border p-2" style={{ backgroundColor: progressColor(tasksByType['디자인']?.progress) }}>
                      <Input
                        type="date"
                        className="h-8 border-0 bg-transparent"
                        value={formatDate(tasksByType['디자인']?.reviewCompleteDate)}
                        onChange={(e) => updateTask(func.id, '디자인', 'reviewCompleteDate', e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </td>
                  </>
                ) : (
                  <td colSpan={6} className="border p-2"></td>
                )}
                
                {/* 퍼블리싱 영역 */}
                {tasksByType['퍼블리싱'] ? (
                  <>
                    <td className="border p-2" style={{ backgroundColor: progressColor(tasksByType['퍼블리싱']?.progress) }}>
                      <Input
                        className="h-8 border-0 bg-transparent"
                        value={tasksByType['퍼블리싱']?.assignedResourceName || ''}
                        onChange={(e) => updateTask(func.id, '퍼블리싱', 'assignedResourceName', e.target.value)}
                      />
                    </td>
                    <td className="border p-2" style={{ backgroundColor: progressColor(tasksByType['퍼블리싱']?.progress) }}>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="1"
                          step="0.1"
                          className="h-8 w-20 border-0 bg-transparent"
                          value={tasksByType['퍼블리싱']?.progress || 0}
                          onChange={(e) => updateTask(func.id, '퍼블리싱', 'progress', parseFloat(e.target.value) || 0)}
                        />
                        <span>{(tasksByType['퍼블리싱']?.progress || 0) * 100}%</span>
                      </div>
                    </td>
                    <td className="border p-2" style={{ backgroundColor: progressColor(tasksByType['퍼블리싱']?.progress) }}>
                      <Input
                        type="date"
                        className="h-8 border-0 bg-transparent"
                        value={formatDate(tasksByType['퍼블리싱']?.startDate)}
                        onChange={(e) => updateTask(func.id, '퍼블리싱', 'startDate', e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </td>
                    <td className="border p-2" style={{ backgroundColor: progressColor(tasksByType['퍼블리싱']?.progress) }}>
                      <Input
                        type="date"
                        className="h-8 border-0 bg-transparent"
                        value={formatDate(tasksByType['퍼블리싱']?.endDate)}
                        onChange={(e) => updateTask(func.id, '퍼블리싱', 'endDate', e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </td>
                    <td className="border p-2" style={{ backgroundColor: progressColor(tasksByType['퍼블리싱']?.progress) }}>
                      <Select
                        value={tasksByType['퍼블리싱']?.reviewStatus || '대기'}
                        onValueChange={(value) => updateTask(func.id, '퍼블리싱', 'reviewStatus', value)}
                      >
                        <SelectTrigger className="h-8 border-0 bg-transparent">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="대기">대기</SelectItem>
                          <SelectItem value="검수 요청">검수 요청</SelectItem>
                          <SelectItem value="검수 진행중">검수 진행중</SelectItem>
                          <SelectItem value="검수완료">검수완료</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="border p-2" style={{ backgroundColor: progressColor(tasksByType['퍼블리싱']?.progress) }}>
                      <Input
                        type="date"
                        className="h-8 border-0 bg-transparent"
                        value={formatDate(tasksByType['퍼블리싱']?.reviewCompleteDate)}
                        onChange={(e) => updateTask(func.id, '퍼블리싱', 'reviewCompleteDate', e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </td>
                  </>
                ) : (
                  <td colSpan={6} className="border p-2"></td>
                )}
                
                {/* 개발 영역 */}
                {tasksByType['개발'] ? (
                  <>
                    <td className="border p-2" style={{ backgroundColor: progressColor(tasksByType['개발']?.progress) }}>
                      <Input
                        className="h-8 border-0 bg-transparent"
                        value={tasksByType['개발']?.assignedResourceName || ''}
                        onChange={(e) => updateTask(func.id, '개발', 'assignedResourceName', e.target.value)}
                      />
                    </td>
                    <td className="border p-2" style={{ backgroundColor: progressColor(tasksByType['개발']?.progress) }}>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="1"
                          step="0.1"
                          className="h-8 w-20 border-0 bg-transparent"
                          value={tasksByType['개발']?.progress || 0}
                          onChange={(e) => updateTask(func.id, '개발', 'progress', parseFloat(e.target.value) || 0)}
                        />
                        <span>{(tasksByType['개발']?.progress || 0) * 100}%</span>
                      </div>
                    </td>
                    <td className="border p-2" style={{ backgroundColor: progressColor(tasksByType['개발']?.progress) }}>
                      <Input
                        type="date"
                        className="h-8 border-0 bg-transparent"
                        value={formatDate(tasksByType['개발']?.startDate)}
                        onChange={(e) => updateTask(func.id, '개발', 'startDate', e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </td>
                    <td className="border p-2" style={{ backgroundColor: progressColor(tasksByType['개발']?.progress) }}>
                      <Input
                        type="date"
                        className="h-8 border-0 bg-transparent"
                        value={formatDate(tasksByType['개발']?.endDate)}
                        onChange={(e) => updateTask(func.id, '개발', 'endDate', e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </td>
                  </>
                ) : (
                  <td colSpan={4} className="border p-2"></td>
                )}
                
                {/* 검수 영역 */}
                {tasksByType['검수'] ? (
                  <>
                    <td className="border p-2" style={{ backgroundColor: progressColor(tasksByType['검수']?.progress) }}>
                      <Input
                        className="h-8 border-0 bg-transparent"
                        value={tasksByType['검수']?.assignedResourceName || ''}
                        onChange={(e) => updateTask(func.id, '검수', 'assignedResourceName', e.target.value)}
                      />
                    </td>
                    <td className="border p-2" style={{ backgroundColor: progressColor(tasksByType['검수']?.progress) }}>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="1"
                          step="0.1"
                          className="h-8 w-20 border-0 bg-transparent"
                          value={tasksByType['검수']?.progress || 0}
                          onChange={(e) => updateTask(func.id, '검수', 'progress', parseFloat(e.target.value) || 0)}
                        />
                        <span>{(tasksByType['검수']?.progress || 0) * 100}%</span>
                      </div>
                    </td>
                    <td className="border p-2" style={{ backgroundColor: progressColor(tasksByType['검수']?.progress) }}>
                      <Input
                        type="date"
                        className="h-8 border-0 bg-transparent"
                        value={formatDate(tasksByType['검수']?.startDate)}
                        onChange={(e) => updateTask(func.id, '검수', 'startDate', e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </td>
                    <td className="border p-2" style={{ backgroundColor: progressColor(tasksByType['검수']?.progress) }}>
                      <Input
                        type="date"
                        className="h-8 border-0 bg-transparent"
                        value={formatDate(tasksByType['검수']?.endDate)}
                        onChange={(e) => updateTask(func.id, '검수', 'endDate', e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </td>
                    <td className="border p-2" style={{ backgroundColor: progressColor(tasksByType['검수']?.progress) }}>
                      <Select
                        value={tasksByType['검수']?.reviewStatus || '대기'}
                        onValueChange={(value) => updateTask(func.id, '검수', 'reviewStatus', value)}
                      >
                        <SelectTrigger className="h-8 border-0 bg-transparent">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="대기">대기</SelectItem>
                          <SelectItem value="검수 요청">검수 요청</SelectItem>
                          <SelectItem value="검수 진행중">검수 진행중</SelectItem>
                          <SelectItem value="검수완료">검수완료</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="border p-2" style={{ backgroundColor: progressColor(tasksByType['검수']?.progress) }}>
                      <Input
                        type="date"
                        className="h-8 border-0 bg-transparent"
                        value={formatDate(tasksByType['검수']?.reviewCompleteDate)}
                        onChange={(e) => updateTask(func.id, '검수', 'reviewCompleteDate', e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </td>
                  </>
                ) : (
                  <td colSpan={6} className="border p-2"></td>
                )}
                
                {/* 일정 타임라인 (막대 그래프) */}
                {weekColumns.map((weekCol, weekIdx) => {
                  // 해당 주차에 포함되는 모든 작업 찾기 (기획, 디자인, 퍼블, 개발, 검수 순서로 정렬)
                  const tasksInWeek: { task: WBSTask; workType: string }[] = []
                  const workTypeOrder = ['기획', '디자인', '퍼블리싱', '개발', '검수']
                  
                  // 순서대로 작업 추가
                  workTypeOrder.forEach(workType => {
                    const task = tasksByType[workType]
                    if (task && isTaskInWeek(task, weekCol.startDate, weekCol.endDate)) {
                      tasksInWeek.push({ task, workType })
                    }
                  })

                  return (
                    <td
                      key={weekIdx}
                      className="border p-2 relative"
                      style={{ minWidth: '400px', width: '400px', height: '220px', backgroundColor: '#FFFFFF', verticalAlign: 'top' }}
                    >
                      {tasksInWeek.length === 0 ? (
                        <div className="w-full h-full"></div>
                      ) : (
                        tasksInWeek.map(({ task, workType }, taskIdx) => {
                          const { start, width } = getTaskPositionInWeek(task, weekCol.startDate, weekCol.endDate)
                          const color = getWorkTypeColor(workType)
                          const progress = task.progress || 0
                          
                          const handleBarClick = () => {
                            setEditingTask({ task, workType, funcId: func.id })
                          }

                          const handleMouseDown = (e: React.MouseEvent) => {
                            e.stopPropagation()
                            setIsDragging(true)
                            setDragStart({ x: e.clientX, weekIdx, taskIdx })
                          }

                          return (
                            <div key={`${workType}-${taskIdx}`}>
                              <div
                                className="absolute rounded-md cursor-move hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
                              style={{
                                left: `${start * 100}%`,
                                width: `${width * 100}%`,
                                height: '30px',
                                top: `${taskIdx * 35 + 4}px`,
                                maxTop: '216px',
                                backgroundColor: color,
                                opacity: progress >= 1.0 ? 1 : progress > 0 ? 0.8 : 0.6,
                                border: '2px solid rgba(255,255,255,0.4)',
                                zIndex: taskIdx + 1,
                                minWidth: '12px'
                              }}
                                onMouseDown={handleMouseDown}
                                onClick={handleBarClick}
                                title={`${workType}: ${task.taskName}\n${formatDate(task.startDate)} ~ ${formatDate(task.endDate)}\n진행률: ${(progress * 100).toFixed(0)}%\n클릭하여 수정`}
                              >
                                {width > 0.15 && (
                                  <span className="text-xs text-white px-2 whitespace-nowrap block leading-tight h-full flex items-center justify-center font-semibold">
                                    {workType}
                                  </span>
                                )}
                              </div>
                              {/* 왼쪽 리사이즈 핸들 */}
                              {width > 0.1 && (
                                <div
                                  className="absolute cursor-ew-resize hover:bg-white hover:bg-opacity-30 rounded-l-md"
                                  style={{
                                    left: `${start * 100}%`,
                                    width: '8px',
                                    height: '30px',
                                    top: `${taskIdx * 35 + 4}px`,
                                    zIndex: taskIdx + 2
                                  }}
                                  onMouseDown={(e) => {
                                    e.stopPropagation()
                                    // 리사이즈 로직은 추후 구현
                                  }}
                                  title="드래그하여 시작일 조정"
                                />
                              )}
                              {/* 오른쪽 리사이즈 핸들 */}
                              {width > 0.1 && (
                                <div
                                  className="absolute cursor-ew-resize hover:bg-white hover:bg-opacity-30 rounded-r-md"
                                  style={{
                                    left: `${(start + width) * 100}%`,
                                    marginLeft: '-8px',
                                    width: '8px',
                                    height: '30px',
                                    top: `${taskIdx * 35 + 4}px`,
                                    zIndex: taskIdx + 2
                                  }}
                                  onMouseDown={(e) => {
                                    e.stopPropagation()
                                    // 리사이즈 로직은 추후 구현
                                  }}
                                  title="드래그하여 종료일 조정"
                                />
                              )}
                            </div>
                          )
                        })
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      </div>

      {/* 작업 수정 다이얼로그 */}
      {editingTask && (
        <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
          <DialogContent className="max-w-md bg-white" style={{ zIndex: 10000 }}>
            <DialogHeader>
              <DialogTitle>작업 일정 수정</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">업무 유형</label>
                <div className="p-2 bg-gray-100 rounded">{editingTask.workType}</div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">작업명</label>
                <div className="p-2 bg-gray-100 rounded">{editingTask.task.taskName}</div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">시작일</label>
                <Input
                  type="date"
                  value={formatDate(editingTask.task.startDate)}
                  onChange={(e) => {
                    const newDate = e.target.value ? new Date(e.target.value) : undefined
                    updateTask(editingTask.funcId, editingTask.workType, 'startDate', newDate)
                    setEditingTask({
                      ...editingTask,
                      task: { ...editingTask.task, startDate: newDate }
                    })
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">종료일</label>
                <Input
                  type="date"
                  value={formatDate(editingTask.task.endDate)}
                  onChange={(e) => {
                    const newDate = e.target.value ? new Date(e.target.value) : undefined
                    updateTask(editingTask.funcId, editingTask.workType, 'endDate', newDate)
                    setEditingTask({
                      ...editingTask,
                      task: { ...editingTask.task, endDate: newDate }
                    })
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">진행률</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={editingTask.task.progress || 0}
                    onChange={(e) => {
                      const progress = parseFloat(e.target.value) || 0
                      updateTask(editingTask.funcId, editingTask.workType, 'progress', progress)
                      setEditingTask({
                        ...editingTask,
                        task: { ...editingTask.task, progress }
                      })
                    }}
                  />
                  <span className="text-sm">{(editingTask.task.progress || 0) * 100}%</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setEditingTask(null)}>
                  닫기
                </Button>
                <Button onClick={() => setEditingTask(null)}>
                  저장
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

