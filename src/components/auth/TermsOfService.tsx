import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ArrowLeft, FileText } from 'lucide-react'

interface TermsOfServiceProps {
  onNavigateBack?: () => void
}

export function TermsOfService({ onNavigateBack }: TermsOfServiceProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">이용약관</h1>
            </div>
            {onNavigateBack && (
              <Button
                variant="outline"
                onClick={onNavigateBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                돌아가기
              </Button>
            )}
          </div>
          <p className="text-sm text-gray-600">
            최종 수정일: 2025년 1월 19일
          </p>
        </div>

        {/* Content */}
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="prose max-w-none space-y-8">
              {/* 제1조 목적 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">제1조 (목적)</h2>
                <p className="text-gray-700 leading-relaxed">
                  본 약관은 SI Project Manager(이하 "회사")가 제공하는 AI 기반 SI 프로젝트 워크플로우 자동화 플랫폼(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                </p>
              </section>

              {/* 제2조 정의 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">제2조 (정의)</h2>
                <div className="space-y-3 text-gray-700">
                  <p>본 약관에서 사용하는 용어의 정의는 다음과 같습니다:</p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>"서비스"란 회사가 제공하는 AI 기반 프로젝트 관리 및 워크플로우 자동화 플랫폼을 의미합니다.</li>
                    <li>"이용자"란 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 의미합니다.</li>
                    <li>"회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며, 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 의미합니다.</li>
                    <li>"아이디(ID)"란 회원의 식별과 서비스 이용을 위하여 회원이 정하고 회사가 승인하는 문자와 숫자의 조합을 의미합니다.</li>
                    <li>"비밀번호"란 회원이 부여받은 아이디와 일치된 회원임을 확인하고 회원의 권익 보호를 위하여 회원이 정한 문자와 숫자의 조합을 의미합니다.</li>
                    <li>"콘텐츠"란 서비스를 통해 제공되는 모든 정보, 텍스트, 그래픽, 링크 등을 의미합니다.</li>
                  </ol>
                </div>
              </section>

              {/* 제3조 약관의 게시와 개정 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">제3조 (약관의 게시와 개정)</h2>
                <div className="space-y-3 text-gray-700">
                  <p>① 회사는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.</p>
                  <p>② 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.</p>
                  <p>③ 회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 서비스 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.</p>
                  <p>④ 회원은 개정된 약관에 동의하지 않을 경우 회원 탈퇴를 요청할 수 있으며, 개정된 약관의 적용일자 이후에도 서비스를 계속 이용할 경우 약관의 변경사항에 동의한 것으로 간주됩니다.</p>
                </div>
              </section>

              {/* 제4조 서비스의 제공 및 변경 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">제4조 (서비스의 제공 및 변경)</h2>
                <div className="space-y-3 text-gray-700">
                  <p>① 회사는 다음과 같은 서비스를 제공합니다:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>프로젝트 문서 업로드 및 분석 서비스</li>
                    <li>AI 기반 요구사항 분석 및 질의서 생성</li>
                    <li>메뉴 구조 설계 및 기능 정의서 자동 생성</li>
                    <li>인력 관리 및 프로젝트 일정 관리(WBS)</li>
                    <li>피그마 메이크 프롬프트 자동 생성</li>
                    <li>개발 문서 편집 및 개발 가이드 생성</li>
                  </ul>
                  <p>② 회사는 서비스의 내용을 변경할 수 있으며, 변경 시에는 사전에 공지합니다.</p>
                  <p>③ 회사는 운영상, 기술상의 필요에 따라 제공하는 전부 또는 일부의 서비스를 변경할 수 있습니다.</p>
                </div>
              </section>

              {/* 제5조 서비스의 중단 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">제5조 (서비스의 중단)</h2>
                <div className="space-y-3 text-gray-700">
                  <p>① 회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.</p>
                  <p>② 회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여 배상합니다. 단, 회사가 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.</p>
                  <p>③ 사업종목의 전환, 사업의 포기, 업체 간의 통합 등의 이유로 서비스를 제공할 수 없게 되는 경우에는 회사는 제8조에 정한 방법으로 이용자에게 통지하고 당초 회사에서 제시한 조건에 따라 소비자에게 보상합니다.</p>
                </div>
              </section>

              {/* 제6조 회원가입 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">제6조 (회원가입)</h2>
                <div className="space-y-3 text-gray-700">
                  <p>① 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.</p>
                  <p>② 회사는 제1항과 같이 회원가입을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>가입신청자가 본 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                    <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
                    <li>기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</li>
                  </ul>
                  <p>③ 회원가입계약의 성립 시기는 회사의 승낙이 회원에게 도달한 시점으로 합니다.</p>
                </div>
              </section>

              {/* 제7조 회원정보의 변경 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">제7조 (회원정보의 변경)</h2>
                <div className="space-y-3 text-gray-700">
                  <p>① 회원은 개인정보관리화면을 통하여 언제든지 본인의 개인정보를 열람하고 수정할 수 있습니다. 다만, 서비스 관리를 위해 필요한 실명, 아이디 등은 수정이 불가능합니다.</p>
                  <p>② 회원은 회원가입신청 시 기재한 사항이 변경되었을 경우 온라인으로 수정을 하거나 전자우편 기타 방법으로 회사에 대하여 그 변경사항을 알려야 합니다.</p>
                  <p>③ 제2항의 변경사항을 회사에 알리지 않아 발생한 불이익에 대하여 회사는 책임을 지지 않습니다.</p>
                </div>
              </section>

              {/* 제8조 개인정보보호 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">제8조 (개인정보보호)</h2>
                <div className="space-y-3 text-gray-700">
                  <p>① 회사는 이용자의 개인정보 수집 시 서비스 제공을 위하여 필요한 범위에서 최소한의 개인정보를 수집합니다.</p>
                  <p>② 회사는 회원가입 시 구매계약이행에 필요한 정보를 미리 수집하지 않습니다.</p>
                  <p>③ 회사는 이용자의 개인정보를 수집·이용하는 때에는 당해 이용자에게 그 목적을 고지하고 동의를 받습니다.</p>
                  <p>④ 회사는 수집된 개인정보를 목적 외의 용도로 이용할 수 없으며, 새로운 이용목적이 발생한 경우 또는 제3자에게 제공하는 경우에는 이용·제공 단계에서 당해 이용자에게 그 목적을 고지하고 동의를 받습니다.</p>
                  <p>⑤ 회사는 개인정보 보호를 위하여 이용자의 개인정보를 처리하는 자를 최소한으로 제한하여야 하며, 개인정보의 분실·도난·유출·위조·변조 등으로 인한 이용자의 손해에 대하여 모든 책임을 집니다.</p>
                </div>
              </section>

              {/* 제9조 회원의 의무 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">제9조 (회원의 의무)</h2>
                <div className="space-y-3 text-gray-700">
                  <p>① 회원은 다음 행위를 하여서는 안 됩니다:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>신청 또는 변경 시 허위내용의 등록</li>
                    <li>타인의 정보 도용</li>
                    <li>회사가 게시한 정보의 변경</li>
                    <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                    <li>회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                    <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                    <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 공개 또는 게시하는 행위</li>
                  </ul>
                </div>
              </section>

              {/* 제10조 저작권의 귀속 및 이용제한 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">제10조 (저작권의 귀속 및 이용제한)</h2>
                <div className="space-y-3 text-gray-700">
                  <p>① 회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다.</p>
                  <p>② 이용자는 회사를 이용함으로써 얻은 정보 중 회사에 지적재산권이 귀속된 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.</p>
                  <p>③ 회사는 약정에 따라 이용자에게 귀속된 저작권을 사용하는 경우 당해 이용자에게 통보하여야 합니다.</p>
                </div>
              </section>

              {/* 제11조 분쟁의 해결 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">제11조 (분쟁의 해결)</h2>
                <div className="space-y-3 text-gray-700">
                  <p>① 회사와 이용자는 서비스와 관련하여 발생한 분쟁을 원만하게 해결하기 위하여 필요한 모든 노력을 하여야 합니다.</p>
                  <p>② 제1항의 규정에도 불구하고 분쟁으로 인하여 소송이 제기될 경우 소송은 회사의 본사 소재지를 관할하는 법원의 관할로 합니다.</p>
                </div>
              </section>

              {/* 부칙 */}
              <section className="pt-6 border-t">
                <p className="text-sm text-gray-600">
                  본 약관은 2025년 1월 19일부터 시행됩니다.
                </p>
              </section>
            </div>

            {/* Back Button */}
            {onNavigateBack && (
              <div className="mt-8 pt-6 border-t">
                <Button
                  onClick={onNavigateBack}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  돌아가기
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

