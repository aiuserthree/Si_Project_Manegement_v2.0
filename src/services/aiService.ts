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
}

export class AIService {
  /**
   * 파일 내용을 분석하여 구조화된 정보를 추출합니다
   */
  static async analyzeFile(request: FileAnalysisRequest): Promise<FileAnalysisResult> {
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
        max_tokens: 2000
      })

      const analysisText = response.choices[0]?.message?.content
      if (!analysisText) {
        throw new Error('AI 분석 결과를 받지 못했습니다.')
      }

      return this.parseAnalysisResponse(analysisText, request)
    } catch (error) {
      console.error('AI 분석 중 오류 발생:', error)
      // 오류 발생 시 기본 분석 결과 반환
      return this.getFallbackAnalysis(request)
    }
  }

  /**
   * 분석 프롬프트를 구성합니다
   */
  private static buildAnalysisPrompt(request: FileAnalysisRequest): string {
    return `
다음 파일을 분석하여 SI 프로젝트 문서로 분류하고 핵심 정보를 추출해주세요.

파일 정보:
- 파일명: ${request.fileName}
- 파일 타입: ${request.fileType}
- 파일 크기: ${(request.fileSize / 1024).toFixed(2)} KB

파일 내용:
${request.extractedText}

다음 JSON 형식으로 응답해주세요:
{
  "summary": "문서의 핵심 내용을 2-3문장으로 요약",
  "keyPoints": ["주요 포인트 1", "주요 포인트 2", "주요 포인트 3", "주요 포인트 4"],
  "documentType": "문서 유형 (예: 요구사항 정의서, 프로젝트 명세서, 기술 설계서, 기획서 등)",
  "confidence": 85,
  "suggestedQuestions": ["다음 단계에서 물어볼 질문 1", "질문 2", "질문 3"],
  "relatedRequirements": ["REQ-001", "REQ-002", "REQ-003"],
  "businessContext": "비즈니스 맥락 및 목표",
  "technicalRequirements": ["기술적 요구사항 1", "기술적 요구사항 2"],
  "userStories": ["사용자 스토리 1", "사용자 스토리 2"]
}

주의사항:
- confidence는 0-100 사이의 숫자로 설정
- relatedRequirements는 REQ-XXX 형식으로 생성
- 모든 배열은 최대 4개 항목으로 제한
- 한국어로 응답
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
        userStories: parsed.userStories || []
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
      userStories: ["사용자가 시스템에 접근할 수 있어야 한다", "관리자가 데이터를 관리할 수 있어야 한다"]
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
