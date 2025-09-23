import * as XLSX from 'xlsx'
import mammoth from 'mammoth'
import Tesseract from 'tesseract.js'

export interface ParsedContent {
  text: string
  metadata?: {
    pages?: number
    sheets?: string[]
    wordCount?: number
    [key: string]: any
  }
}

export class FileParser {
  /**
   * 파일 타입에 따라 적절한 파서를 선택하여 텍스트를 추출합니다
   */
  static async parseFile(file: File): Promise<ParsedContent> {
    const fileType = file.type.toLowerCase()
    const fileName = file.name.toLowerCase()

    try {
      if (fileType.includes('sheet') || fileType.includes('excel') || fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        return await this.parseExcel(file)
      } else if (fileType.includes('word') || fileType.includes('document') || fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
        return await this.parseWord(file)
      } else if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
        return await this.parsePDF(file)
      } else if (fileType.includes('image') || this.isImageFile(fileName)) {
        return await this.parseImage(file)
      } else if (fileType.includes('text') || fileName.endsWith('.txt')) {
        return await this.parseText(file)
      } else {
        throw new Error(`지원하지 않는 파일 형식입니다: ${fileType}`)
      }
    } catch (error) {
      console.error(`파일 파싱 오류 (${file.name}):`, error)
      throw new Error(`파일을 읽을 수 없습니다: ${file.name}`)
    }
  }

  /**
   * Excel 파일을 파싱합니다
   */
  private static async parseExcel(file: File): Promise<ParsedContent> {
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    
    let text = ''
    const sheets: string[] = []
    
    workbook.SheetNames.forEach(sheetName => {
      sheets.push(sheetName)
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      
      text += `\n=== ${sheetName} 시트 ===\n`
      
      // 헤더와 데이터를 텍스트로 변환
      jsonData.forEach((row: any[], rowIndex: number) => {
        if (row && row.length > 0) {
          const rowText = row.map(cell => String(cell || '')).join(' | ')
          text += `행 ${rowIndex + 1}: ${rowText}\n`
        }
      })
    })

    const wordCount = text.split(/\s+/).length

    return {
      text: text.trim(),
      metadata: {
        sheets,
        wordCount,
        totalSheets: sheets.length
      }
    }
  }

  /**
   * Word 문서를 파싱합니다
   */
  private static async parseWord(file: File): Promise<ParsedContent> {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    
    let text = result.value
    const messages = result.messages
    
    // 경고 메시지가 있다면 텍스트에 추가
    if (messages.length > 0) {
      text += '\n\n=== 문서 처리 메시지 ===\n'
      messages.forEach(message => {
        text += `${message.type}: ${message.message}\n`
      })
    }

    const wordCount = text.split(/\s+/).length

    return {
      text: text.trim(),
      metadata: {
        wordCount,
        messages: messages.length
      }
    }
  }

  /**
   * PDF 파일을 파싱합니다 (브라우저 호환)
   */
  private static async parsePDF(file: File): Promise<ParsedContent> {
    try {
      // PDF.js를 사용한 브라우저 호환 PDF 파싱
      const pdfjsLib = await import('pdfjs-dist')
      
      // Worker 설정
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
      
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      
      let text = ''
      const numPages = pdf.numPages
      
      // 모든 페이지의 텍스트 추출
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map((item: any) => item.str).join(' ')
        text += `\n페이지 ${pageNum}: ${pageText}\n`
      }
      
      const wordCount = text.split(/\s+/).length

      return {
        text: text.trim(),
        metadata: {
          pages: numPages,
          wordCount,
          info: { title: file.name }
        }
      }
    } catch (error) {
      console.error('PDF 파싱 오류:', error)
      return {
        text: 'PDF 파일을 읽을 수 없습니다. 파일이 손상되었거나 암호화되어 있을 수 있습니다.',
        metadata: {
          pages: 0,
          wordCount: 0,
          error: 'PDF 파싱 실패'
        }
      }
    }
  }

  /**
   * 이미지 파일에서 OCR로 텍스트를 추출합니다
   */
  private static async parseImage(file: File): Promise<ParsedContent> {
    try {
      const { data: { text } } = await Tesseract.recognize(file, 'kor+eng', {
        logger: m => console.log(m) // 진행 상황 로깅
      })

      const wordCount = text.split(/\s+/).length

      return {
        text: text.trim(),
        metadata: {
          wordCount,
          imageType: file.type,
          imageSize: file.size
        }
      }
    } catch (error) {
      console.error('OCR 처리 오류:', error)
      return {
        text: '이미지에서 텍스트를 추출할 수 없습니다. 이미지가 선명하고 텍스트가 포함되어 있는지 확인해주세요.',
        metadata: {
          wordCount: 0,
          error: 'OCR 처리 실패'
        }
      }
    }
  }

  /**
   * 텍스트 파일을 파싱합니다
   */
  private static async parseText(file: File): Promise<ParsedContent> {
    const text = await file.text()
    const wordCount = text.split(/\s+/).length

    return {
      text: text.trim(),
      metadata: {
        wordCount,
        encoding: file.type
      }
    }
  }

  /**
   * 파일명으로 이미지 파일인지 확인합니다
   */
  private static isImageFile(fileName: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff']
    return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext))
  }

  /**
   * 파일 크기를 사람이 읽기 쉬운 형태로 변환합니다
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  /**
   * 파일 타입을 기반으로 적절한 아이콘을 반환합니다
   */
  static getFileTypeIcon(fileType: string): string {
    if (fileType.includes('sheet') || fileType.includes('excel')) {
      return '📊'
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return '📝'
    } else if (fileType.includes('pdf')) {
      return '📄'
    } else if (fileType.includes('image')) {
      return '🖼️'
    } else if (fileType.includes('text')) {
      return '📃'
    } else if (fileType.includes('presentation') || fileType.includes('powerpoint')) {
      return '📊'
    }
    return '📁'
  }

  /**
   * 파일 타입을 기반으로 문서 카테고리를 반환합니다
   */
  static getDocumentCategory(fileType: string, fileName: string): string {
    const lowerType = fileType.toLowerCase()
    const lowerName = fileName.toLowerCase()

    if (lowerType.includes('sheet') || lowerName.includes('요구사항') || lowerName.includes('requirement')) {
      return '요구사항 정의서'
    } else if (lowerType.includes('word') || lowerName.includes('명세서') || lowerName.includes('specification')) {
      return '프로젝트 명세서'
    } else if (lowerType.includes('pdf') || lowerName.includes('설계') || lowerName.includes('design')) {
      return '기술 설계서'
    } else if (lowerName.includes('기획') || lowerName.includes('plan')) {
      return '프로젝트 기획서'
    } else if (lowerName.includes('사용자') || lowerName.includes('user')) {
      return '사용자 매뉴얼'
    } else if (lowerName.includes('테스트') || lowerName.includes('test')) {
      return '테스트 문서'
    }
    
    return '프로젝트 문서'
  }

  /**
   * 추출된 텍스트에서 키워드를 추출합니다
   */
  static extractKeywords(text: string, maxKeywords: number = 10): string[] {
    // 한국어와 영어 단어를 추출하는 정규식
    const words = text.toLowerCase()
      .replace(/[^\w\s가-힣]/g, ' ') // 특수문자 제거
      .split(/\s+/)
      .filter(word => word.length > 2) // 2글자 이상만

    // 단어 빈도 계산
    const wordCount: { [key: string]: number } = {}
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1
    })

    // 빈도순으로 정렬하여 상위 키워드 반환
    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, maxKeywords)
      .map(([word]) => word)
  }

  /**
   * 파일이 너무 큰지 확인합니다 (100MB 제한)
   */
  static isFileTooLarge(file: File, maxSizeMB: number = 100): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    return file.size > maxSizeBytes
  }

  /**
   * 지원되는 파일 타입인지 확인합니다
   */
  static isSupportedFileType(file: File): boolean {
    const supportedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'text/plain'
    ]

    return supportedTypes.includes(file.type) || this.isImageFile(file.name)
  }
}
