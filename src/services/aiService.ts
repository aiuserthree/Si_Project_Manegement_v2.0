import OpenAI from 'openai'

// 환경 변수에서 API 키 가져오기 (실제 구현 시 .env 파일 사용)
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || 'your-api-key-here'

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // 브라우저에서 사용 시 필요 (실제로는 백엔드에서 처리 권장)
})

export interface FileAnalysisRequest {
  fileName: string
  fileType: string
  extractedText: string
  fileSize: number
}

export interface FileAnalysisResult {
  summary: string
  keyPoints: string[]
  documentType: string
  confidence: number
  suggestedQuestions: string[]
  relatedRequirements: string[]
  extractedText?: string
  businessContext?: string
  technicalRequirements?: string[]
  userStories?: string[]
  detailedAnalysis?: string
  sections?: string[]
  importantDetails?: string[]
  requirementsSummary?: {
    functionalRequirements?: string[]
    nonFunctionalRequirements?: string[]
    systemRequirements?: string[]
    businessRequirements?: string[]
  }
}

export class AIService {
  /**
   * API 키가 유효한지 확인합니다
   */
  static isApiKeyValid(): boolean {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    return !!apiKey && apiKey !== 'your-api-key-here' && apiKey.length > 20
  }

  /**
   * 로컬 분석을 수행합니다 (API 키 없이)
   */
  private static performLocalAnalysis(request: FileAnalysisRequest): FileAnalysisResult {
    const text = request.extractedText
    const fileName = request.fileName.toLowerCase()
    
    // 키워드 추출
    const keywords = this.extractKeywords(text, 15)
    
    // 섹션 파싱 (Markdown 헤더 또는 텍스트 구조 분석)
    const sections = this.extractSections(text)
    
    // 요구사항 키워드 추출
    const requirements = this.extractRequirements(text)
    
    // 문서 타입 추정
    const documentType = this.inferDocumentType(fileName, text)
    
    // 주요 포인트 추출 (키워드 기반)
    const keyPoints = this.extractKeyPoints(text, keywords)
    
    // 요구사항 요약 생성
    const requirementsSummary = {
      functionalRequirements: requirements.functional || [],
      nonFunctionalRequirements: requirements.nonFunctional || [],
      systemRequirements: requirements.system || [],
      businessRequirements: requirements.business || []
    }
    
    return {
      summary: this.generateSummary(text, documentType, sections),
      keyPoints: keyPoints.slice(0, 5),
      documentType,
      confidence: 65, // 로컬 분석이므로 신뢰도 낮게 설정
      suggestedQuestions: this.generateSuggestedQuestions(text, sections),
      relatedRequirements: this.generateRelatedRequirements(text),
      extractedText: text,
      businessContext: this.extractBusinessContext(text),
      technicalRequirements: requirements.technical || [],
      userStories: this.extractUserStories(text),
      detailedAnalysis: this.generateDetailedAnalysis(text, sections),
      sections: sections.map(s => s.title),
      importantDetails: this.extractImportantDetails(text),
      requirementsSummary
    }
  }

  /**
   * 섹션 추출 (Markdown 헤더 또는 텍스트 구조)
   */
  private static extractSections(text: string): Array<{ title: string; level: number }> {
    const sections: Array<{ title: string; level: number }> = []
    
    // Markdown 헤더 추출 (# ## ### 등)
    const markdownHeaderRegex = /^(#{1,6})\s+(.+)$/gm
    let match
    while ((match = markdownHeaderRegex.exec(text)) !== null) {
      sections.push({
        title: match[2].trim(),
        level: match[1].length
      })
    }
    
    // Markdown 헤더가 없으면 숫자나 대문자로 시작하는 줄을 섹션으로 간주
    if (sections.length === 0) {
      const lines = text.split('\n')
      lines.forEach((line, index) => {
        const trimmed = line.trim()
        // 숫자로 시작하거나 대문자로 시작하는 긴 줄을 섹션으로 간주
        if (trimmed.length > 5 && trimmed.length < 100) {
          if (/^\d+[\.\)]\s+/.test(trimmed) || /^[A-Z가-힣][A-Za-z가-힣\s]{4,}/.test(trimmed)) {
            sections.push({
              title: trimmed.replace(/^\d+[\.\)]\s+/, '').trim(),
              level: 1
            })
          }
        }
      })
    }
    
    return sections.slice(0, 10) // 최대 10개
  }

  /**
   * 요구사항 추출
   */
  private static extractRequirements(text: string): {
    functional?: string[]
    nonFunctional?: string[]
    system?: string[]
    technical?: string[]
    business?: string[]
  } {
    const lowerText = text.toLowerCase()
    const requirements = {
      functional: [] as string[],
      nonFunctional: [] as string[],
      system: [] as string[],
      technical: [] as string[],
      business: [] as string[]
    }
    
    // 기능 요구사항 키워드
    const functionalKeywords = ['기능', '함수', '작업', '업무', '프로세스', '처리', '생성', '조회', '수정', '삭제', '등록', '로그인', '인증']
    // 비기능 요구사항 키워드
    const nonFunctionalKeywords = ['성능', '보안', '안정성', '가용성', '확장성', '응답시간', '처리속도', '동시접속', '가동률']
    // 시스템 요구사항 키워드
    const systemKeywords = ['운영체제', '브라우저', '하드웨어', '소프트웨어', '서버', '클라이언트', '환경', '플랫폼', '버전']
    // 기술 요구사항 키워드
    const technicalKeywords = ['데이터베이스', 'api', '프레임워크', '언어', '라이브러리', '프로토콜', '인터페이스', '아키텍처']
    // 비즈니스 요구사항 키워드
    const businessKeywords = ['비즈니스', '목표', '규정', '법률', '준수', '정책', '규칙', '프로세스', '워크플로우']
    
    // 문장 단위로 분석
    const sentences = text.split(/[\.\n]/).filter(s => s.trim().length > 10)
    
    sentences.forEach(sentence => {
      const lowerSentence = sentence.toLowerCase()
      
      // 기능 요구사항
      if (functionalKeywords.some(kw => lowerSentence.includes(kw))) {
        const req = sentence.trim().substring(0, 100)
        if (req && !requirements.functional.includes(req)) {
          requirements.functional.push(req)
        }
      }
      
      // 비기능 요구사항
      if (nonFunctionalKeywords.some(kw => lowerSentence.includes(kw))) {
        const req = sentence.trim().substring(0, 100)
        if (req && !requirements.nonFunctional.includes(req)) {
          requirements.nonFunctional.push(req)
        }
      }
      
      // 시스템 요구사항
      if (systemKeywords.some(kw => lowerSentence.includes(kw))) {
        const req = sentence.trim().substring(0, 100)
        if (req && !requirements.system.includes(req)) {
          requirements.system.push(req)
        }
      }
      
      // 기술 요구사항
      if (technicalKeywords.some(kw => lowerSentence.includes(kw))) {
        const req = sentence.trim().substring(0, 100)
        if (req && !requirements.technical.includes(req)) {
          requirements.technical.push(req)
        }
      }
      
      // 비즈니스 요구사항
      if (businessKeywords.some(kw => lowerSentence.includes(kw))) {
        const req = sentence.trim().substring(0, 100)
        if (req && !requirements.business.includes(req)) {
          requirements.business.push(req)
        }
      }
    })
    
    return {
      functional: requirements.functional.slice(0, 5),
      nonFunctional: requirements.nonFunctional.slice(0, 4),
      system: requirements.system.slice(0, 4),
      technical: requirements.technical.slice(0, 4),
      business: requirements.business.slice(0, 3)
    }
  }

  /**
   * 키워드 추출 (기존 메서드 활용)
   */
  private static extractKeywords(text: string, maxKeywords: number = 10): string[] {
    const words = text.toLowerCase()
      .replace(/[^\w\s가-힣]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2)
    
    const wordCount: { [key: string]: number } = {}
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1
    })
    
    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, maxKeywords)
      .map(([word]) => word)
  }

  /**
   * 문서 타입 추정
   */
  private static inferDocumentType(fileName: string, text: string): string {
    const lowerText = text.toLowerCase()
    const lowerFileName = fileName.toLowerCase()
    
    if (lowerFileName.includes('요구사항') || lowerText.includes('요구사항')) {
      return '요구사항 정의서'
    } else if (lowerFileName.includes('명세서') || lowerText.includes('명세서')) {
      return '프로젝트 명세서'
    } else if (lowerFileName.includes('설계') || lowerText.includes('설계')) {
      return '기술 설계서'
    } else if (lowerFileName.includes('기획') || lowerText.includes('기획')) {
      return '프로젝트 기획서'
    } else if (lowerFileName.includes('api') || lowerText.includes('api')) {
      return 'API 명세서'
    } else if (lowerFileName.includes('매뉴얼') || lowerText.includes('매뉴얼')) {
      return '사용자 매뉴얼'
    }
    
    return '프로젝트 문서'
  }

  /**
   * 주요 포인트 추출
   */
  private static extractKeyPoints(text: string, keywords: string[]): string[] {
    const sentences = text.split(/[\.\n]/).filter(s => s.trim().length > 20)
    const keyPoints: string[] = []
    
    // 키워드가 포함된 문장을 주요 포인트로 선정
    keywords.forEach(keyword => {
      const matchingSentence = sentences.find(s => 
        s.toLowerCase().includes(keyword) && s.trim().length < 150
      )
      if (matchingSentence && !keyPoints.includes(matchingSentence.trim())) {
        keyPoints.push(matchingSentence.trim())
      }
    })
    
    return keyPoints.slice(0, 5)
  }

  /**
   * 요약 생성
   */
  private static generateSummary(text: string, documentType: string, sections: Array<{ title: string; level: number }>): string {
    const firstParagraph = text.split('\n\n').find(p => p.trim().length > 50) || text.substring(0, 200)
    const mainSections = sections.slice(0, 3).map(s => s.title).join(', ')
    
    return `${documentType}입니다. 주요 섹션: ${mainSections || '없음'}. ${firstParagraph.substring(0, 150)}...`
  }

  /**
   * 추천 질문 생성
   */
  private static generateSuggestedQuestions(text: string, sections: Array<{ title: string; level: number }>): string[] {
    const questions = [
      "프로젝트의 주요 목표는 무엇인가요?",
      "예상 사용자 규모는 어느 정도인가요?",
      "특별한 기술적 제약사항이 있나요?"
    ]
    
    if (sections.length > 0) {
      questions.push(`${sections[0].title}에 대한 상세 요구사항은 무엇인가요?`)
    }
    
    return questions.slice(0, 4)
  }

  /**
   * 관련 요구사항 ID 생성
   */
  private static generateRelatedRequirements(text: string): string[] {
    const reqMatches = text.match(/REQ-\d+/gi) || []
    const uniqueReqs = [...new Set(reqMatches)]
    
    // REQ-XXX 형식이 없으면 자동 생성
    if (uniqueReqs.length === 0) {
      return ['REQ-001', 'REQ-002', 'REQ-003']
    }
    
    return uniqueReqs.slice(0, 4)
  }

  /**
   * 비즈니스 맥락 추출
   */
  private static extractBusinessContext(text: string): string {
    const contextKeywords = ['목표', '배경', '문제', '해결', '효과', '기대']
    const sentences = text.split(/[\.\n]/)
    
    const contextSentence = sentences.find(s => 
      contextKeywords.some(kw => s.toLowerCase().includes(kw)) && s.trim().length > 30
    )
    
    return contextSentence?.trim().substring(0, 200) || 
           "프로젝트의 비즈니스 목표와 맥락을 파악하기 위해 추가 정보가 필요합니다."
  }

  /**
   * 사용자 스토리 추출
   */
  private static extractUserStories(text: string): string[] {
    const stories: string[] = []
    const sentences = text.split(/[\.\n]/)
    
    const userKeywords = ['사용자', '관리자', '고객', '직원', '시스템']
    const actionKeywords = ['할 수 있어야', '수행', '처리', '관리', '조회', '생성']
    
    sentences.forEach(sentence => {
      const lowerSentence = sentence.toLowerCase()
      if (userKeywords.some(uk => lowerSentence.includes(uk)) && 
          actionKeywords.some(ak => lowerSentence.includes(ak))) {
        const story = sentence.trim().substring(0, 100)
        if (story && !stories.includes(story)) {
          stories.push(story)
        }
      }
    })
    
    return stories.slice(0, 4)
  }

  /**
   * 상세 분석 생성
   */
  private static generateDetailedAnalysis(text: string, sections: Array<{ title: string; level: number }>): string {
    const sectionCount = sections.length
    const wordCount = text.split(/\s+/).length
    
    return `문서는 ${sectionCount}개의 주요 섹션으로 구성되어 있으며, 총 ${wordCount}단어를 포함합니다. ${sections.slice(0, 2).map(s => s.title).join(', ')} 등의 내용을 다루고 있습니다.`
  }

  /**
   * 중요한 세부사항 추출
   */
  private static extractImportantDetails(text: string): string[] {
    const details: string[] = []
    const sentences = text.split(/[\.\n]/)
    
    const importantKeywords = ['중요', '필수', '반드시', '주의', '금지', '제한', '필요']
    
    sentences.forEach(sentence => {
      const lowerSentence = sentence.toLowerCase()
      if (importantKeywords.some(kw => lowerSentence.includes(kw)) && sentence.trim().length > 20) {
        const detail = sentence.trim().substring(0, 100)
        if (detail && !details.includes(detail)) {
          details.push(detail)
        }
      }
    })
    
    return details.slice(0, 3)
  }

  /**
   * 파일 내용을 분석하여 구조화된 정보를 추출합니다
   */
  static async analyzeFile(request: FileAnalysisRequest): Promise<FileAnalysisResult> {
    // API 키 확인
    if (!this.isApiKeyValid()) {
      console.warn('OpenAI API 키가 설정되지 않았습니다. 로컬 분석을 수행합니다.')
      return this.performLocalAnalysis(request)
    }

    try {
      const prompt = this.buildAnalysisPrompt(request)
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // 비용 효율적인 모델 사용
        messages: [
          {
            role: "system",
            content: "당신은 SI 프로젝트 문서 분석 전문가입니다. 업로드된 문서를 분석하여 프로젝트 요구사항, 기술 사양, 비즈니스 맥락을 정확하게 파악하고 구조화된 정보를 제공합니다."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3, // 일관된 결과를 위해 낮은 온도 설정
        max_tokens: 4000 // 텍스트 파일 분석을 위해 토큰 수 증가
      })

      const analysisText = response.choices[0]?.message?.content
      if (!analysisText) {
        throw new Error('AI 분석 결과를 받지 못했습니다.')
      }

      return this.parseAnalysisResponse(analysisText, request)
    } catch (error: any) {
      console.error('AI 분석 중 오류 발생:', error)
      
      // API 키 관련 오류인지 확인
      if (error?.status === 401 || error?.message?.includes('api key') || error?.message?.includes('authentication')) {
        console.error('OpenAI API 키가 유효하지 않습니다. 로컬 분석으로 전환합니다.')
      }
      
      // 오류 발생 시 로컬 분석 수행
      return this.performLocalAnalysis(request)
    }
  }

  /**
   * 분석 프롬프트를 구성합니다
   */
  private static buildAnalysisPrompt(request: FileAnalysisRequest): string {
    const isTextFile = request.fileName.toLowerCase().endsWith('.txt') || 
                       request.fileName.toLowerCase().endsWith('.md') ||
                       request.fileType.includes('text')
    const isMarkdown = request.fileName.toLowerCase().endsWith('.md')
    
    let fileTypeInstruction = ''
    if (isMarkdown) {
      fileTypeInstruction = `
이 파일은 Markdown 형식의 문서입니다. 다음을 면밀히 분석해주세요:
- Markdown 구조(헤더, 리스트, 코드 블록 등)를 파악하고 문서의 계층 구조를 분석
- 각 섹션의 주요 내용을 상세히 추출
- 코드 예제나 기술적 내용이 있다면 이를 기술 요구사항으로 분류
- 표나 리스트로 정리된 정보를 구조화하여 추출
- 문서의 목적과 범위를 명확히 파악
- 요구사항 섹션이 있다면 반드시 모든 요구사항을 추출
`
    } else if (isTextFile) {
      fileTypeInstruction = `
이 파일은 텍스트 문서입니다. 다음을 면밀히 분석해주세요:
- 문서의 전체 구조와 섹션 구분을 파악
- 각 섹션의 주요 내용을 상세히 추출
- 기술적 용어, 기능명, 요구사항을 정확히 식별
- 문서의 목적과 범위를 명확히 파악
- 중요한 숫자, 날짜, 기한 등의 정보를 추출
- 요구사항 섹션이 있다면 반드시 모든 요구사항을 추출
`
    }
    
    return `
다음 파일을 면밀하고 자세히 분석하여 SI 프로젝트 문서로 분류하고 핵심 정보를 추출해주세요.

파일 정보:
- 파일명: ${request.fileName}
- 파일 타입: ${request.fileType}
- 파일 크기: ${(request.fileSize / 1024).toFixed(2)} KB
${isMarkdown ? '- 문서 형식: Markdown' : isTextFile ? '- 문서 형식: 텍스트' : ''}

${fileTypeInstruction}

파일 내용:
${request.extractedText}

다음 JSON 형식으로 응답해주세요:
{
  "summary": "문서의 핵심 내용을 3-5문장으로 상세히 요약 (프로젝트 목적, 주요 기능, 기술 스택, 비즈니스 목표 등을 포함)",
  "keyPoints": ["주요 포인트 1 (구체적이고 상세하게)", "주요 포인트 2", "주요 포인트 3", "주요 포인트 4", "주요 포인트 5"],
  "documentType": "문서 유형 (예: 요구사항 정의서, 프로젝트 명세서, 기술 설계서, 기획서, API 명세서, 사용자 매뉴얼 등)",
  "confidence": 85,
  "suggestedQuestions": ["다음 단계에서 물어볼 질문 1", "질문 2", "질문 3", "질문 4"],
  "relatedRequirements": ["REQ-001", "REQ-002", "REQ-003", "REQ-004"],
  "businessContext": "비즈니스 맥락 및 목표를 상세히 설명 (프로젝트 배경, 해결하려는 문제, 기대 효과 등)",
  "technicalRequirements": ["기술적 요구사항 1 (구체적으로)", "기술적 요구사항 2", "기술적 요구사항 3", "기술적 요구사항 4"],
  "userStories": ["사용자 스토리 1 (구체적으로)", "사용자 스토리 2", "사용자 스토리 3", "사용자 스토리 4"],
  "detailedAnalysis": "문서의 구조, 주요 섹션, 핵심 내용을 상세히 분석한 결과 (3-5문장)",
  "sections": ["섹션 1 제목", "섹션 2 제목", "섹션 3 제목"],
  "importantDetails": ["중요한 세부사항 1", "중요한 세부사항 2", "중요한 세부사항 3"],
  "requirementsSummary": {
    "functionalRequirements": ["기능 요구사항 1", "기능 요구사항 2", "기능 요구사항 3", "기능 요구사항 4"],
    "nonFunctionalRequirements": ["비기능 요구사항 1", "비기능 요구사항 2", "비기능 요구사항 3"],
    "systemRequirements": ["시스템 요구사항 1", "시스템 요구사항 2", "시스템 요구사항 3"],
    "businessRequirements": ["비즈니스 요구사항 1", "비즈니스 요구사항 2"]
  }
}

주의사항:
- confidence는 0-100 사이의 숫자로 설정
- relatedRequirements는 REQ-XXX 형식으로 생성
- 모든 내용은 구체적이고 상세하게 작성
- 문서의 모든 중요한 정보를 빠짐없이 추출
- 한국어로 응답

**요구사항 분석에 특별히 주의하세요:**
- 문서 전체를 꼼꼼히 읽고 모든 요구사항을 찾아내세요
- 기능 요구사항: 시스템이 수행해야 하는 기능들 (예: 사용자 로그인, 데이터 조회, 보고서 생성 등)
- 비기능 요구사항: 성능, 보안, 사용성, 확장성 등 (예: 응답 시간 3초 이내, 99.9% 가동률 등)
- 시스템 요구사항: 하드웨어, 소프트웨어, 네트워크 환경 등 (예: Windows 10 이상, Chrome 브라우저 지원 등)
- 비즈니스 요구사항: 비즈니스 목표, 규정 준수, 법적 요구사항 등 (예: 개인정보보호법 준수, 결제 시스템 연동 등)
- requirementsSummary 필드는 반드시 채워야 하며, 각 카테고리별로 최소 2개 이상의 요구사항을 추출하세요
- 문서에 명시된 요구사항이 없더라도 문서 내용을 분석하여 요구사항을 도출하세요
`
  }

  /**
   * AI 응답을 파싱하여 구조화된 데이터로 변환합니다
   */
  private static parseAnalysisResponse(response: string, request: FileAnalysisRequest): FileAnalysisResult {
    try {
      // JSON 부분만 추출 (```json``` 블록이 있는 경우)
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/)
      const jsonString = jsonMatch ? jsonMatch[1] : response
      
      const parsed = JSON.parse(jsonString)
      
      return {
        summary: parsed.summary || "문서를 분석했습니다.",
        keyPoints: parsed.keyPoints || [],
        documentType: parsed.documentType || "프로젝트 문서",
        confidence: parsed.confidence || 75,
        suggestedQuestions: parsed.suggestedQuestions || [],
        relatedRequirements: parsed.relatedRequirements || [],
        extractedText: request.extractedText,
        businessContext: parsed.businessContext,
        technicalRequirements: parsed.technicalRequirements || [],
        userStories: parsed.userStories || [],
        detailedAnalysis: parsed.detailedAnalysis || "문서의 상세 분석 결과입니다.",
        sections: parsed.sections || [],
        importantDetails: parsed.importantDetails || [],
        requirementsSummary: parsed.requirementsSummary || {
          functionalRequirements: [],
          nonFunctionalRequirements: [],
          systemRequirements: [],
          businessRequirements: []
        }
      }
    } catch (error) {
      console.error('AI 응답 파싱 오류:', error)
      return this.getFallbackAnalysis(request)
    }
  }

  /**
   * AI 분석 실패 시 기본 분석 결과를 반환합니다
   */
  private static getFallbackAnalysis(request: FileAnalysisRequest): FileAnalysisResult {
    const fileName = request.fileName.toLowerCase()
    const fileType = request.fileType.toLowerCase()
    
    let documentType = "프로젝트 문서"
    let keyPoints = ["기본 프로젝트 요구사항", "일반적인 기능 명세"]
    let suggestedQuestions = [
      "프로젝트의 주요 목표는 무엇인가요?",
      "예상 사용자 규모는 어느 정도인가요?"
    ]

    if (fileType.includes('sheet') || fileType.includes('excel')) {
      documentType = "요구사항 정의서"
      keyPoints = [
        "사용자 인증 시스템 필요",
        "관리자 대시보드 기능",
        "데이터 내보내기 기능",
        "모바일 반응형 지원"
      ]
      suggestedQuestions = [
        "사용자 권한 체계는 어떻게 구성되어야 하나요?",
        "관리자 기능의 범위는 어디까지인가요?",
        "데이터 보안 요구사항은 무엇인가요?"
      ]
    } else if (fileType.includes('word') || fileType.includes('document')) {
      documentType = "프로젝트 명세서"
      keyPoints = [
        "고객 관리 시스템",
        "주문 처리 프로세스",
        "재고 관리 기능",
        "리포팅 시스템"
      ]
      suggestedQuestions = [
        "기존 시스템과의 연동이 필요한가요?",
        "사용자 교육 계획은 어떻게 되어 있나요?",
        "성능 요구사항은 무엇인가요?"
      ]
    } else if (fileType.includes('pdf')) {
      documentType = "기술 설계서"
      keyPoints = [
        "클라우드 기반 아키텍처",
        "API 기반 통합",
        "보안 인증 시스템",
        "실시간 모니터링"
      ]
      suggestedQuestions = [
        "클라우드 서비스 제공업체는 어디를 사용하나요?",
        "API 보안 정책은 어떻게 설정하나요?",
        "모니터링 도구는 어떤 것을 사용하나요?"
      ]
    }

    return {
      summary: `${documentType}로 분류된 문서입니다. 파일명과 내용을 기반으로 기본적인 프로젝트 요구사항을 파악했습니다.`,
      keyPoints,
      documentType,
      confidence: 70,
      suggestedQuestions,
      relatedRequirements: ["REQ-001", "REQ-002"],
      extractedText: request.extractedText,
      businessContext: "프로젝트의 비즈니스 목표와 맥락을 파악하기 위해 추가 정보가 필요합니다.",
      technicalRequirements: ["기본적인 웹 애플리케이션 구조", "데이터베이스 연동"],
      userStories: ["사용자가 시스템에 접근할 수 있어야 한다", "관리자가 데이터를 관리할 수 있어야 한다"],
      requirementsSummary: defaultRequirementsSummary
    }
  }

  /**
   * 여러 파일을 일괄 분석합니다
   */
  static async analyzeMultipleFiles(requests: FileAnalysisRequest[]): Promise<FileAnalysisResult[]> {
    const results: FileAnalysisResult[] = []
    
    for (const request of requests) {
      try {
        const result = await this.analyzeFile(request)
        results.push(result)
        
        // API 호출 제한을 고려한 지연
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.error(`파일 ${request.fileName} 분석 실패:`, error)
        results.push(this.getFallbackAnalysis(request))
      }
    }
    
    return results
  }

  /**
   * 분석 결과를 기반으로 통합 프로젝트 요약을 생성합니다
   */
  static async generateProjectSummary(analyses: FileAnalysisResult[]): Promise<string> {
    try {
      const prompt = `
다음은 SI 프로젝트의 여러 문서 분석 결과입니다:

${analyses.map((analysis, index) => `
문서 ${index + 1}: ${analysis.documentType}
요약: ${analysis.summary}
주요 포인트: ${analysis.keyPoints.join(', ')}
`).join('\n')}

이 분석 결과들을 종합하여 전체 프로젝트의 핵심 요구사항과 특징을 3-4문장으로 요약해주세요.
`

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "당신은 SI 프로젝트 분석 전문가입니다. 여러 문서의 분석 결과를 종합하여 프로젝트의 핵심 특징을 명확하게 요약합니다."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })

      return response.choices[0]?.message?.content || "프로젝트 분석 결과를 종합했습니다."
    } catch (error) {
      console.error('프로젝트 요약 생성 오류:', error)
      return "여러 문서를 분석한 결과, 다양한 기능과 요구사항을 포함한 SI 프로젝트입니다."
    }
  }
}
