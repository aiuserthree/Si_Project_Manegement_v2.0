import { useState, useCallback } from 'react'
import { Upload, File, X, FileText, Image, FileSpreadsheet, FileImage, Brain, Eye, Download, RefreshCw, AlertCircle, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { Badge } from '../ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Alert, AlertDescription } from '../ui/alert'
import { AIService, FileAnalysisRequest, FileAnalysisResult } from '../../services/aiService'
import { FileParser } from '../../utils/fileParser'
import { saveAs } from 'file-saver'

interface FileItem {
  id: string
  name: string
  size: number
  type: string
  progress: number
  status: 'uploading' | 'completed' | 'analyzing' | 'analyzed' | 'error'
  analysis?: FileAnalysisResult
  parsedContent?: {
    text: string
    metadata?: any
  }
  error?: string
}

interface FileUploadProps {
  onSave?: () => void
  onNextStep?: () => void
}

export function FileUpload({ onSave, onNextStep }: FileUploadProps) {
  const [files, setFiles] = useState<FileItem[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [projectSummary, setProjectSummary] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  const getFileIcon = (type: string) => {
    if (type.includes('sheet') || type.includes('excel')) {
      return <FileSpreadsheet className="w-6 h-6 text-green-600" />
    }
    if (type.includes('word') || type.includes('document')) {
      return <FileText className="w-6 h-6 text-blue-600" />
    }
    if (type.includes('pdf')) {
      return <FileText className="w-6 h-6 text-red-600" />
    }
    if (type.includes('image')) {
      return <FileImage className="w-6 h-6 text-purple-600" />
    }
    return <File className="w-6 h-6 text-gray-600" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      processFiles(selectedFiles)
    }
  }

  const processFiles = async (fileList: File[]) => {
    for (const file of fileList) {
      // 파일 검증
      if (!FileParser.isSupportedFileType(file)) {
        setError(`지원하지 않는 파일 형식입니다: ${file.name}`)
        continue
      }

      if (FileParser.isFileTooLarge(file)) {
        setError(`파일이 너무 큽니다: ${file.name} (최대 100MB)`)
        continue
      }

      const fileItem: FileItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: 'uploading'
      }

      setFiles(prev => [...prev, fileItem])

      try {
        // 파일 파싱
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { ...f, status: 'uploading', progress: 50 } : f
        ))

        const parsedContent = await FileParser.parseFile(file)
        
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { 
            ...f, 
            status: 'completed', 
            progress: 100,
            parsedContent 
          } : f
        ))
      } catch (error) {
        console.error(`파일 처리 오류 (${file.name}):`, error)
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { 
            ...f, 
            status: 'error', 
            error: error instanceof Error ? error.message : '파일 처리 중 오류가 발생했습니다.'
          } : f
        ))
      }
    }
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id))
  }

  const startAnalysis = async () => {
    const completedFiles = files.filter(f => f.status === 'completed' && f.parsedContent)
    if (completedFiles.length === 0) {
      setError('분석할 수 있는 파일이 없습니다.')
      return
    }
    
    setIsAnalyzing(true)
    setError('')
    
    try {
      // 분석 진행 상태 표시
      setFiles(prev => prev.map(f => 
        f.status === 'completed' ? { ...f, status: 'analyzing' } : f
      ))
      
      // AI 분석 요청 준비
      const analysisRequests: FileAnalysisRequest[] = completedFiles.map(file => ({
        fileName: file.name,
        fileType: file.type,
        extractedText: file.parsedContent!.text,
        fileSize: file.size
      }))
      
      // AI 분석 실행
      const analysisResults = await AIService.analyzeMultipleFiles(analysisRequests)
      
      // 분석 결과 적용
      setFiles(prev => prev.map(f => {
        if (f.status === 'analyzing') {
          const analysisIndex = completedFiles.findIndex(cf => cf.id === f.id)
          return {
            ...f,
            status: 'analyzed',
            analysis: analysisResults[analysisIndex]
          }
        }
        return f
      }))
      
      // 프로젝트 전체 요약 생성
      const summary = await AIService.generateProjectSummary(analysisResults)
      setProjectSummary(summary)
      
      setIsAnalyzing(false)
      setAnalysisComplete(true)
    } catch (error) {
      console.error('AI 분석 오류:', error)
      setError('AI 분석 중 오류가 발생했습니다. API 키를 확인해주세요.')
      
      // 오류 발생 시 기본 분석으로 폴백
      setFiles(prev => prev.map(f => {
        if (f.status === 'analyzing') {
          return {
            ...f,
            status: 'analyzed',
            analysis: generateFallbackAnalysis(f.name, f.type)
          }
        }
        return f
      }))
      
      setIsAnalyzing(false)
      setAnalysisComplete(true)
    }
  }

  const generateFallbackAnalysis = (fileName: string, fileType: string): FileAnalysisResult => {
    return {
      summary: "AI 분석을 사용할 수 없어 기본 분석을 수행했습니다. API 키를 설정하시면 더 정확한 분석을 받을 수 있습니다.",
      keyPoints: [
        "기본 프로젝트 요구사항",
        "일반적인 기능 명세",
        "표준 보안 요구사항"
      ],
      documentType: FileParser.getDocumentCategory(fileType, fileName),
      confidence: 70,
      suggestedQuestions: [
        "프로젝트의 주요 목표는 무엇인가요?",
        "예상 사용자 규모는 어느 정도인가요?",
        "특별한 기술적 제약사항이 있나요?"
      ],
      relatedRequirements: ["REQ-001", "REQ-002"],
      businessContext: "프로젝트의 비즈니스 목표와 맥락을 파악하기 위해 추가 정보가 필요합니다.",
      technicalRequirements: ["기본적인 웹 애플리케이션 구조", "데이터베이스 연동"],
      userStories: ["사용자가 시스템에 접근할 수 있어야 한다", "관리자가 데이터를 관리할 수 있어야 한다"]
    }
  }

  const downloadAnalysisResults = () => {
    const analyzedFiles = files.filter(f => f.status === 'analyzed' && f.analysis)
    
    const exportData = {
      projectSummary,
      files: analyzedFiles.map(file => ({
        fileName: file.name,
        fileType: file.type,
        analysis: file.analysis,
        metadata: file.parsedContent?.metadata
      })),
      exportDate: new Date().toISOString(),
      totalFiles: analyzedFiles.length
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    })
    saveAs(blob, `file-analysis-${new Date().toISOString().split('T')[0]}.json`)
  }

  const handleSaveClick = () => {
    setShowSaveDialog(true)
  }

  const handleSaveConfirm = () => {
    setShowSaveDialog(false)
    // 저장 로직 실행
    onSave?.()
    // 다음 단계로 이동
    onNextStep?.()
  }

  const handleSaveCancel = () => {
    setShowSaveDialog(false)
  }

  return (
    <div className="space-y-8">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">프로젝트 파일 업로드</CardTitle>
          <p className="text-gray-600">
            프로젝트 관련 문서를 업로드하여 요구사항 분석을 시작하세요
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Zone */}
          <div
            className={`
              border-2 border-dashed rounded-xl h-72 flex flex-col items-center justify-center
              bg-gradient-to-b from-gray-50 to-white transition-colors cursor-pointer
              ${isDragOver 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragOver(true)
            }}
            onDragLeave={() => setIsDragOver(false)}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <Upload className={`w-12 h-12 mb-4 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              파일을 드래그하여 업로드하거나 클릭하여 선택
            </h3>
            <p className="text-sm text-gray-500 text-center">
              지원 형식: Excel (.xlsx, .xls), Word (.docx, .doc), PPT (.pptx, .ppt), <br />
              PDF, 이미지 (JPG, PNG, GIF), 텍스트 파일
            </p>
            <input
              id="file-input"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept=".xlsx,.xls,.docx,.doc,.pptx,.ppt,.pdf,.jpg,.jpeg,.png,.gif,.txt"
            />
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">업로드된 파일</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((file) => (
                  <Card key={file.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {file.status === 'uploading' && (
                      <div className="space-y-2">
                        <Progress value={file.progress} className="h-1" />
                        <p className="text-xs text-gray-500">
                          업로드 중... {Math.round(file.progress)}%
                        </p>
                      </div>
                    )}
                    
                    {file.status === 'completed' && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <p className="text-xs text-green-600">업로드 완료</p>
                      </div>
                    )}
                    
                    {file.status === 'analyzing' && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        <p className="text-xs text-blue-600">분석 중...</p>
                      </div>
                    )}
                    
                    {file.status === 'analyzed' && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <p className="text-xs text-purple-600">분석 완료</p>
                      </div>
                    )}
                    
                    {file.status === 'error' && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <p className="text-xs text-red-600">업로드 실패</p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          {files.filter(f => f.status === 'completed').length > 0 && !analysisComplete && (
            <div className="flex justify-end">
              <Button 
                onClick={startAnalysis}
                disabled={isAnalyzing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    분석 중...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    파일 분석 시작
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisComplete && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl flex items-center">
                <Brain className="w-6 h-6 mr-2 text-blue-600" />
                파일 분석 결과
              </CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleSaveClick}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  저장 및 다음 단계
                </Button>
                <Button variant="outline" size="sm" onClick={downloadAnalysisResults}>
                  <Download className="w-4 h-4 mr-2" />
                  분석 결과 다운로드
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setAnalysisComplete(false)
                    setFiles(prev => prev.map(f => ({ ...f, status: 'completed', analysis: undefined })))
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  다시 분석
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Project Summary */}
            {projectSummary && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">프로젝트 전체 요약</h3>
                <p className="text-blue-800">{projectSummary}</p>
              </div>
            )}

            {/* Analysis Results */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {files.filter(f => f.status === 'analyzed' && f.analysis).map((file) => (
                  <Card key={file.id} className="p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {file.name}
                          </h4>
                          <Badge variant="secondary" className="text-xs mb-2">
                            {file.analysis?.documentType}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="text-xs text-gray-500 mb-1">신뢰도</div>
                        <div className="text-xl font-bold text-blue-600">
                          {file.analysis?.confidence}%
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                      {file.analysis?.summary}
                    </p>
                    
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-gray-900">주요 포인트:</h5>
                      <div className="flex flex-wrap gap-2">
                        {file.analysis?.keyPoints.slice(0, 3).map((point, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                            {point}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Confirmation Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg border border-gray-200 shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">저장 확인</h3>
            <p className="text-gray-600 mb-6">
              파일 분석 결과를 저장하고 다음 단계로 진행하시겠습니까?
            </p>
            <div className="flex justify-end gap-3 mt-16">
              <Button 
                variant="outline" 
                onClick={handleSaveCancel}
              >
                취소
              </Button>
              <Button 
                variant="default" 
                onClick={handleSaveConfirm}
                className="bg-blue-600 hover:bg-blue-700"
              >
                저장 및 다음 단계
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}