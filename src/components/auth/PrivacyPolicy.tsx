import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ArrowLeft, Shield } from 'lucide-react'

interface PrivacyPolicyProps {
  onNavigateBack?: () => void
}

export function PrivacyPolicy({ onNavigateBack }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">개인정보처리방침</h1>
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
              {/* 제1조 개인정보의 처리목적 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">제1조 (개인정보의 처리목적)</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  SI Project Manager(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                </p>
                <div className="space-y-3 text-gray-700">
                  <div>
                    <h3 className="font-semibold mb-2">1. 홈페이지 회원 가입 및 관리</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지 목적</li>
                      <li>각종 고지·통지, 고충처리 등을 목적</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">2. 재화 또는 서비스 제공</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>서비스 제공, 콘텐츠 제공, 맞춤 서비스 제공, 본인인증 등을 목적</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">3. 마케팅 및 광고에의 활용</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>신규 서비스(제품) 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및 참여기회 제공 등을 목적</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 제2조 개인정보의 처리 및 보유기간 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">제2조 (개인정보의 처리 및 보유기간)</h2>
                <div className="space-y-3 text-gray-700">
                  <p>① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
                  <p>② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>홈페이지 회원 가입 및 관리:</strong> 회원 탈퇴 시까지 (다만, 관계 법령 위반에 따른 수사·조사 등이 진행중인 경우에는 해당 수사·조사 종료 시까지)</li>
                    <li><strong>재화 또는 서비스 제공:</strong> 재화·서비스 공급완료 및 요금결제·정산 완료 시까지</li>
                    <li><strong>마케팅 및 광고에의 활용:</strong> 회원 탈퇴 시까지 또는 동의 철회 시까지</li>
                  </ul>
                </div>
              </section>

              {/* 제3조 처리하는 개인정보의 항목 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">제3조 (처리하는 개인정보의 항목)</h2>
                <div className="space-y-3 text-gray-700">
                  <p>회사는 다음의 개인정보 항목을 처리하고 있습니다:</p>
                  <div>
                    <h3 className="font-semibold mb-2">1. 홈페이지 회원 가입 및 관리</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>필수항목: 이메일, 비밀번호, 이름</li>
                      <li>선택항목: 전화번호, 소속 회사명</li>
                      <li>자동 수집 항목: IP주소, 쿠키, MAC주소, 서비스 이용 기록, 접속 로그, 기기정보</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">2. 재화 또는 서비스 제공</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>필수항목: 이메일, 이름, 서비스 이용 기록</li>
                      <li>선택항목: 결제정보(신용카드번호, 계좌정보 등)</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 제4조 개인정보의 제3자 제공 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">제4조 (개인정보의 제3자 제공)</h2>
                <div className="space-y-3 text-gray-700">
                  <p>① 회사는 정보주체의 개인정보를 제1조(개인정보의 처리목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</p>
                  <p>② 회사는 원칙적으로 정보주체의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>정보주체가 사전에 동의한 경우</li>
                    <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                  </ul>
                </div>
              </section>

              {/* 제5조 개인정보처리의 위탁 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">제5조 (개인정보처리의 위탁)</h2>
                <div className="space-y-3 text-gray-700">
                  <p>① 회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">위탁받는 자</th>
                          <th className="text-left p-2">위탁업무 내용</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2">클라우드 서비스 제공업체</td>
                          <td className="p-2">서버 운영 및 데이터 저장</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">이메일 발송 서비스 제공업체</td>
                          <td className="p-2">이메일 발송 및 관리</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p>② 회사는 위탁계약 체결 시 개인정보 보호법 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.</p>
                  <p>③ 위탁업무의 내용이나 수탁자가 변경될 경우에는 지체 없이 본 개인정보처리방침을 통하여 공개하겠습니다.</p>
                </div>
              </section>

              {/* 제6조 정보주체의 권리·의무 및 그 행사방법 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">제6조 (정보주체의 권리·의무 및 그 행사방법)</h2>
                <div className="space-y-3 text-gray-700">
                  <p>① 정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>개인정보 처리정지 요구권</li>
                    <li>개인정보 열람요구권</li>
                    <li>개인정보 정정·삭제요구권</li>
                    <li>개인정보 처리정지 요구권</li>
                  </ul>
                  <p>② 제1항에 따른 권리 행사는 회사에 대해 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.</p>
                  <p>③ 정보주체가 개인정보의 오류에 대한 정정을 요청한 경우에는 정정을 완료하기 전까지 당해 개인정보를 이용하거나 제공하지 않습니다.</p>
                  <p>④ 제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다.</p>
                </div>
              </section>

              {/* 제7조 처리하는 개인정보의 항목 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">제7조 (개인정보의 파기)</h2>
                <div className="space-y-3 text-gray-700">
                  <p>① 회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.</p>
                  <p>② 개인정보 파기의 절차 및 방법은 다음과 같습니다:</p>
                  <div>
                    <h3 className="font-semibold mb-2">1. 파기절차</h3>
                    <p className="ml-4">회사는 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">2. 파기방법</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>전자적 파일 형태: 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제</li>
                      <li>기록물, 인쇄물, 서면 등: 분쇄하거나 소각하여 파기</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 제8조 개인정보 보호책임자 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">제8조 (개인정보 보호책임자)</h2>
                <div className="space-y-3 text-gray-700">
                  <p>① 회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div>
                        <strong>▶ 개인정보 보호책임자</strong>
                        <ul className="list-none space-y-1 ml-4 mt-1">
                          <li>• 성명: [담당자명]</li>
                          <li>• 직책: [직책]</li>
                          <li>• 연락처: [이메일], [전화번호]</li>
                        </ul>
                      </div>
                      <div>
                        <strong>▶ 개인정보 보호 담당부서</strong>
                        <ul className="list-none space-y-1 ml-4 mt-1">
                          <li>• 부서명: [부서명]</li>
                          <li>• 담당자: [담당자명]</li>
                          <li>• 연락처: [이메일], [전화번호]</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <p>② 정보주체께서는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다.</p>
                </div>
              </section>

              {/* 제9조 개인정보의 안전성 확보조치 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">제9조 (개인정보의 안전성 확보조치)</h2>
                <div className="space-y-3 text-gray-700">
                  <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>관리적 조치:</strong> 내부관리계획 수립·시행, 정기적 직원 교육 등</li>
                    <li><strong>기술적 조치:</strong> 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치</li>
                    <li><strong>물리적 조치:</strong> 전산실, 자료보관실 등의 접근통제</li>
                  </ul>
                </div>
              </section>

              {/* 제10조 개인정보처리방침 변경 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">제10조 (개인정보처리방침 변경)</h2>
                <div className="space-y-3 text-gray-700">
                  <p>이 개인정보처리방침은 2025년 1월 19일부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p>
                </div>
              </section>

              {/* 부칙 */}
              <section className="pt-6 border-t">
                <p className="text-sm text-gray-600">
                  본 개인정보처리방침은 2025년 1월 19일부터 시행됩니다.
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

