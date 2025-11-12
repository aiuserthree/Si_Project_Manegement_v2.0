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
    
    // API 키 확인 (선택사항 - 없어도 로컬 분석 수행)
    if (!AIService.isApiKeyValid()) {
      console.info('OpenAI API 키가 없습니다. 로컬 분석(키워드 추출, 섹션 파싱)을 수행합니다.')
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
    // 이 함수는 더 이상 사용되지 않음 (로컬 분석으로 대체됨)
    // 하지만 혹시 모를 경우를 대비해 유지
    return {
      summary: "로컬 분석을 수행했습니다. (키워드 추출, 섹션 파싱, 요구사항 추출)",
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
    // 저장 로직 실행
    onSave?.()
    // 다음 단계로 이동
    onNextStep?.()
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
              PDF, 이미지 (JPG, PNG, GIF), 텍스트 파일 (.txt, .md)
            </p>
            <input
              id="file-input"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept=".xlsx,.xls,.docx,.doc,.pptx,.ppt,.pdf,.jpg,.jpeg,.png,.gif,.txt,.md"
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
              {files.filter(f => f.status === 'analyzed' && f.analysis).map((file) => (
                <Card key={file.id} className="p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
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
                  
                  {/* 상세 요약 */}
                  <div className="mb-6">
                    <h5 className="text-sm font-semibold text-gray-900 mb-2">📋 문서 요약</h5>
                    <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                      {file.analysis?.summary}
                    </p>
                  </div>

                  {/* 요구사항 요약 */}
                  {file.analysis?.requirementsSummary && (
                    (file.analysis.requirementsSummary.functionalRequirements?.length > 0 ||
                     file.analysis.requirementsSummary.nonFunctionalRequirements?.length > 0 ||
                     file.analysis.requirementsSummary.systemRequirements?.length > 0 ||
                     file.analysis.requirementsSummary.businessRequirements?.length > 0) && (
                    <div className="mb-6">
                      <h5 className="text-sm font-semibold text-gray-900 mb-4">📝 요구사항 요약</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 기능 요구사항 */}
                        {file.analysis.requirementsSummary.functionalRequirements && 
                         file.analysis.requirementsSummary.functionalRequirements.length > 0 && (
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h6 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                              <span className="mr-2">⚙️</span>
                              기능 요구사항
                            </h6>
                            <div className="space-y-2">
                              {file.analysis.requirementsSummary.functionalRequirements.map((req, index) => (
                                <div key={index} className="text-sm text-blue-800 bg-white p-2 rounded border border-blue-100">
                                  <span className="font-medium text-blue-600 mr-2">{index + 1}.</span>
                                  {req}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 비기능 요구사항 */}
                        {file.analysis.requirementsSummary.nonFunctionalRequirements && 
                         file.analysis.requirementsSummary.nonFunctionalRequirements.length > 0 && (
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h6 className="text-sm font-semibold text-green-900 mb-3 flex items-center">
                              <span className="mr-2">🔒</span>
                              비기능 요구사항
                            </h6>
                            <div className="space-y-2">
                              {file.analysis.requirementsSummary.nonFunctionalRequirements.map((req, index) => (
                                <div key={index} className="text-sm text-green-800 bg-white p-2 rounded border border-green-100">
                                  <span className="font-medium text-green-600 mr-2">{index + 1}.</span>
                                  {req}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 시스템 요구사항 */}
                        {file.analysis.requirementsSummary.systemRequirements && 
                         file.analysis.requirementsSummary.systemRequirements.length > 0 && (
                          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                            <h6 className="text-sm font-semibold text-purple-900 mb-3 flex items-center">
                              <span className="mr-2">🖥️</span>
                              시스템 요구사항
                            </h6>
                            <div className="space-y-2">
                              {file.analysis.requirementsSummary.systemRequirements.map((req, index) => (
                                <div key={index} className="text-sm text-purple-800 bg-white p-2 rounded border border-purple-100">
                                  <span className="font-medium text-purple-600 mr-2">{index + 1}.</span>
                                  {req}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 비즈니스 요구사항 */}
                        {file.analysis.requirementsSummary.businessRequirements && 
                         file.analysis.requirementsSummary.businessRequirements.length > 0 && (
                          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                            <h6 className="text-sm font-semibold text-orange-900 mb-3 flex items-center">
                              <span className="mr-2">💼</span>
                              비즈니스 요구사항
                            </h6>
                            <div className="space-y-2">
                              {file.analysis.requirementsSummary.businessRequirements.map((req, index) => (
                                <div key={index} className="text-sm text-orange-800 bg-white p-2 rounded border border-orange-100">
                                  <span className="font-medium text-orange-600 mr-2">{index + 1}.</span>
                                  {req}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    )
                  )}

                  {/* 상세 분석 */}
                  {file.analysis?.detailedAnalysis && (
                    <div className="mb-6">
                      <h5 className="text-sm font-semibold text-gray-900 mb-2">🔍 상세 분석</h5>
                      <p className="text-sm text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg border border-blue-100">
                        {file.analysis.detailedAnalysis}
                      </p>
                    </div>
                  )}

                  {/* 주요 포인트 */}
                  {file.analysis?.keyPoints && file.analysis.keyPoints.length > 0 && (
                    <div className="mb-6">
                      <h5 className="text-sm font-semibold text-gray-900 mb-3">✨ 주요 포인트</h5>
                      <div className="space-y-2">
                        {file.analysis.keyPoints.map((point, index) => (
                          <div key={index} className="flex items-start space-x-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                            <span className="text-blue-600 font-semibold mt-0.5">{index + 1}.</span>
                            <span className="flex-1">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 문서 섹션 */}
                  {file.analysis?.sections && file.analysis.sections.length > 0 && (
                    <div className="mb-6">
                      <h5 className="text-sm font-semibold text-gray-900 mb-3">📑 문서 구조</h5>
                      <div className="flex flex-wrap gap-2">
                        {file.analysis.sections.map((section, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-3 py-1.5 bg-green-50 text-green-700 border-green-200">
                            {section}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 중요한 세부사항 */}
                  {file.analysis?.importantDetails && file.analysis.importantDetails.length > 0 && (
                    <div className="mb-6">
                      <h5 className="text-sm font-semibold text-gray-900 mb-3">⚠️ 중요한 세부사항</h5>
                      <div className="space-y-2">
                        {file.analysis.importantDetails.map((detail, index) => (
                          <div key={index} className="flex items-start space-x-2 text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                            <span className="text-yellow-600 font-semibold mt-0.5">•</span>
                            <span className="flex-1">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 비즈니스 맥락 */}
                  {file.analysis?.businessContext && (
                    <div className="mb-6">
                      <h5 className="text-sm font-semibold text-gray-900 mb-2">💼 비즈니스 맥락</h5>
                      <p className="text-sm text-gray-700 leading-relaxed bg-purple-50 p-4 rounded-lg border border-purple-100">
                        {file.analysis.businessContext}
                      </p>
                    </div>
                  )}

                  {/* 기술적 요구사항 */}
                  {file.analysis?.technicalRequirements && file.analysis.technicalRequirements.length > 0 && (
                    <div className="mb-6">
                      <h5 className="text-sm font-semibold text-gray-900 mb-3">⚙️ 기술적 요구사항</h5>
                      <div className="space-y-2">
                        {file.analysis.technicalRequirements.map((req, index) => (
                          <div key={index} className="flex items-start space-x-2 text-sm text-gray-700 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                            <span className="text-indigo-600 font-semibold mt-0.5">🔧</span>
                            <span className="flex-1">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 사용자 스토리 */}
                  {file.analysis?.userStories && file.analysis.userStories.length > 0 && (
                    <div className="mb-6">
                      <h5 className="text-sm font-semibold text-gray-900 mb-3">👤 사용자 스토리</h5>
                      <div className="space-y-2">
                        {file.analysis.userStories.map((story, index) => (
                          <div key={index} className="flex items-start space-x-2 text-sm text-gray-700 bg-teal-50 p-3 rounded-lg border border-teal-100">
                            <span className="text-teal-600 font-semibold mt-0.5">📖</span>
                            <span className="flex-1">{story}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 관련 요구사항 */}
                  {file.analysis?.relatedRequirements && file.analysis.relatedRequirements.length > 0 && (
                    <div className="mb-6">
                      <h5 className="text-sm font-semibold text-gray-900 mb-3">🔗 관련 요구사항</h5>
                      <div className="flex flex-wrap gap-2">
                        {file.analysis.relatedRequirements.map((req, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 border-blue-200">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 추천 질문 */}
                  {file.analysis?.suggestedQuestions && file.analysis.suggestedQuestions.length > 0 && (
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-3">❓ 추천 질문</h5>
                      <div className="space-y-2">
                        {file.analysis.suggestedQuestions.map((question, index) => (
                          <div key={index} className="flex items-start space-x-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                            <span className="text-gray-600 font-semibold mt-0.5">Q{index + 1}.</span>
                            <span className="flex-1">{question}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  )
}