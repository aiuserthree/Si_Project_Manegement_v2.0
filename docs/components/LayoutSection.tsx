import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Menu, ChevronDown, Search, User } from "lucide-react";

export default function LayoutSection() {
  return (
    <div className="space-y-6">
      <h2 id="layout">레이아웃 (Layout)</h2>
      
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>헤더 (Header)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-100 p-4 rounded border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-500 rounded"></div>
                <span>브랜드 로고</span>
              </div>
              <nav className="flex gap-4">
                <a href="#" className="hover:text-blue-500">홈</a>
                <a href="#" className="hover:text-blue-500">제품</a>
                <a href="#" className="hover:text-blue-500">서비스</a>
                <a href="#" className="hover:text-blue-500">연락처</a>
              </nav>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hero/Billboard */}
      <Card>
        <CardHeader>
          <CardTitle>히어로/빌보드 (Hero/Billboard)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-12 rounded text-center">
            <h1 className="mb-4">혁신적인 솔루션으로 비즈니스를 성장시키세요</h1>
            <p className="mb-6 opacity-90">최고의 기술로 최적의 결과를 제공합니다</p>
            <Button variant="secondary" size="lg">시작하기</Button>
          </div>
        </CardContent>
      </Card>

      {/* Grid Layout */}
      <Card>
        <CardHeader>
          <CardTitle>그리드 (Grid)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-100 p-4 rounded text-center">Column 1</div>
            <div className="bg-green-100 p-4 rounded text-center">Column 2</div>
            <div className="bg-blue-100 p-4 rounded text-center">Column 3</div>
            <div className="bg-yellow-100 p-4 rounded text-center">Column 4</div>
            <div className="bg-purple-100 p-4 rounded text-center">Column 5</div>
            <div className="bg-pink-100 p-4 rounded text-center">Column 6</div>
          </div>
        </CardContent>
      </Card>

      {/* Container */}
      <Card>
        <CardHeader>
          <CardTitle>컨테이너 (Container)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-4xl mx-auto border-2 border-dashed border-gray-300 p-6 rounded">
            <div className="bg-gray-100 p-4 rounded">
              <h3>컨테이너 내부 콘텐츠</h3>
              <p>최대 너비가 제한된 컨테이너 안에 콘텐츠가 배치됩니다.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sticky Header */}
      <Card>
        <CardHeader>
          <CardTitle>스티키 헤더 (Sticky Header)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="sticky top-0 bg-white border-b p-3 z-10">
              <div className="flex items-center justify-between">
                <span>고정된 헤더</span>
                <Menu className="w-5 h-5" />
              </div>
            </div>
            <div className="h-40 bg-gray-50 p-4 overflow-y-auto">
              <p className="mb-4">스크롤해도 헤더가 상단에 고정됩니다.</p>
              <p className="mb-4">더 많은 콘텐츠...</p>
              <p className="mb-4">스크롤이 가능한 영역입니다.</p>
              <p className="mb-4">헤더는 계속 보입니다.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Side Menu */}
      <Card>
        <CardHeader>
          <CardTitle>사이드 메뉴 (Side Menu)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex">
            <div className="w-48 bg-gray-100 p-4 rounded-l">
              <nav className="space-y-2">
                <a href="#" className="block p-2 hover:bg-white rounded">대시보드</a>
                <a href="#" className="block p-2 hover:bg-white rounded">프로젝트</a>
                <a href="#" className="block p-2 hover:bg-white rounded">팀</a>
                <a href="#" className="block p-2 hover:bg-white rounded">설정</a>
              </nav>
            </div>
            <div className="flex-1 bg-white p-4 rounded-r border-l">
              <h3>메인 콘텐츠 영역</h3>
              <p>사이드 메뉴와 함께 표시되는 주요 콘텐츠입니다.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card>
        <CardHeader>
          <CardTitle>푸터 (Footer)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-800 text-white p-6 rounded">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <h4 className="mb-3">회사 정보</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li><a href="#" className="hover:text-white">회사 소개</a></li>
                  <li><a href="#" className="hover:text-white">채용 정보</a></li>
                  <li><a href="#" className="hover:text-white">연혁</a></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-3">서비스</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li><a href="#" className="hover:text-white">제품</a></li>
                  <li><a href="#" className="hover:text-white">솔루션</a></li>
                  <li><a href="#" className="hover:text-white">지원</a></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-3">고객 지원</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li><a href="#" className="hover:text-white">FAQ</a></li>
                  <li><a href="#" className="hover:text-white">문의하기</a></li>
                  <li><a href="#" className="hover:text-white">온라인 채팅</a></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-3">법적 고지</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li><a href="#" className="hover:text-white">개인정보처리방침</a></li>
                  <li><a href="#" className="hover:text-white">이용약관</a></li>
                  <li><a href="#" className="hover:text-white">쿠키 정책</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm text-gray-400">
              © 2024 회사명. All rights reserved.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}