import { useState, useCallback } from 'react'
import { Upload, File, X, FileText, Image, FileSpreadsheet, FileImage } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'

interface FileItem {
  id: string
  name: string
  size: number
  type: string
  progress: number
  status: 'uploading' | 'completed' | 'error'
}

export function FileUpload() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

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

  const processFiles = (fileList: File[]) => {
    fileList.forEach(file => {
      const fileItem: FileItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: 'uploading'
      }

      setFiles(prev => [...prev, fileItem])

      // Simulate upload progress
      const uploadProgress = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === fileItem.id) {
            const newProgress = f.progress + Math.random() * 30
            if (newProgress >= 100) {
              clearInterval(uploadProgress)
              return { ...f, progress: 100, status: 'completed' }
            }
            return { ...f, progress: newProgress }
          }
          return f
        }))
      }, 200)
    })
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id))
  }

  const startAnalysis = () => {
    const completedFiles = files.filter(f => f.status === 'completed')
    if (completedFiles.length === 0) {
      alert('업로드된 파일이 없습니다.')
      return
    }
    
    // 실제 파일 분석 로직 구현
    console.log('Starting file analysis...', completedFiles)
    
    // 분석 진행 상태 표시
    setFiles(prev => prev.map(f => ({ ...f, status: 'analyzing' as any })))
    
    // 시뮬레이션된 분석 과정
    setTimeout(() => {
      setFiles(prev => prev.map(f => ({ ...f, status: 'analyzed' as any })))
      alert('파일 분석이 완료되었습니다!')
    }, 3000)
  }

  return (
    <div className="space-y-8">
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
          {files.filter(f => f.status === 'completed').length > 0 && (
            <div className="flex justify-end">
              <Button 
                onClick={startAnalysis}
                className="bg-blue-600 hover:bg-blue-700"
              >
                파일 분석 시작
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}