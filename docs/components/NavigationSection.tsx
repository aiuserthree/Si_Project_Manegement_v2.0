import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
import { ChevronDown, Menu, Home, ArrowUp } from "lucide-react";
import { useState } from "react";

export default function NavigationSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="space-y-6">
      <h2 id="navigation">내비게이션 (Navigation)</h2>
      
      {/* GNB */}
      <Card>
        <CardHeader>
          <CardTitle>GNB (Global Navigation Bar)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-600 text-white p-4 rounded">
            <nav className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-8 h-8 bg-white/20 rounded"></div>
                <div className="hidden md:flex gap-4">
                  <a href="#" className="hover:text-blue-200">홈</a>
                  <div className="relative group">
                    <a href="#" className="flex items-center gap-1 hover:text-blue-200">
                      제품 <ChevronDown className="w-4 h-4" />
                    </a>
                    <div className="absolute top-full left-0 bg-white text-black shadow-lg rounded mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <a href="#" className="block px-4 py-2 hover:bg-gray-100">웹 솔루션</a>
                      <a href="#" className="block px-4 py-2 hover:bg-gray-100">모바일 앱</a>
                    </div>
                  </div>
                  <a href="#" className="hover:text-blue-200">서비스</a>
                  <a href="#" className="hover:text-blue-200">회사소개</a>
                </div>
              </div>
              <Button variant="outline" size="sm" className="md:hidden text-blue-600">
                <Menu className="w-4 h-4" />
              </Button>
            </nav>
          </div>
        </CardContent>
      </Card>

      {/* Breadcrumb */}
      <Card>
        <CardHeader>
          <CardTitle>브레드크럼 (Breadcrumb)</CardTitle>
        </CardHeader>
        <CardContent>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">홈</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/products">제품</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>웹 솔루션</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>탭/탭바 (Tabs)</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">개요</TabsTrigger>
              <TabsTrigger value="features">기능</TabsTrigger>
              <TabsTrigger value="pricing">가격</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="p-4 border rounded">
              <h3>서비스 개요</h3>
              <p>우리 서비스의 전반적인 소개입니다.</p>
            </TabsContent>
            <TabsContent value="features" className="p-4 border rounded">
              <h3>주요 기능</h3>
              <p>다양한 기능들을 소개합니다.</p>
            </TabsContent>
            <TabsContent value="pricing" className="p-4 border rounded">
              <h3>가격 정보</h3>
              <p>합리적인 가격 정책을 확인하세요.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Accordion */}
      <Card>
        <CardHeader>
          <CardTitle>아코디언 (Accordion)</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>서비스 이용 방법은?</AccordionTrigger>
              <AccordionContent>
                회원가입 후 바로 이용 가능합니다. 간단한 설정만으로 시작할 수 있습니다.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>결제 방법은 무엇인가요?</AccordionTrigger>
              <AccordionContent>
                신용카드, 계좌이체, 가상계좌 등 다양한 결제 방법을 지원합니다.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>고객 지원은 어떻게 받나요?</AccordionTrigger>
              <AccordionContent>
                24시간 온라인 채팅, 이메일, 전화 지원을 제공합니다.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Hamburger Menu */}
      <Card>
        <CardHeader>
          <CardTitle>햄버거 메뉴 (Hamburger Menu)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="flex items-center justify-between p-4 bg-gray-100 rounded">
              <span>모바일 헤더</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
            {isMenuOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border shadow-lg rounded-b z-10">
                <nav className="p-4 space-y-2">
                  <a href="#" className="block p-2 hover:bg-gray-100 rounded">홈</a>
                  <a href="#" className="block p-2 hover:bg-gray-100 rounded">제품</a>
                  <a href="#" className="block p-2 hover:bg-gray-100 rounded">서비스</a>
                  <a href="#" className="block p-2 hover:bg-gray-100 rounded">연락처</a>
                </nav>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <Card>
        <CardHeader>
          <CardTitle>페이지네이션 (Pagination)</CardTitle>
        </CardHeader>
        <CardContent>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>

      {/* Quick Menu */}
      <Card>
        <CardHeader>
          <CardTitle>퀵 메뉴 (Quick Menu)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              <Home className="w-4 h-4 mr-1" />
              홈
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              검색
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              즐겨찾기
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <ArrowUp className="w-4 h-4 mr-1" />
              위로
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tree Menu */}
      <Card>
        <CardHeader>
          <CardTitle>트리 메뉴 (Tree Menu)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">📁 Documents</div>
            <div className="ml-4 space-y-1">
              <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">📁 Projects</div>
              <div className="ml-4 space-y-1">
                <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">📄 project1.pdf</div>
                <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">📄 project2.pdf</div>
              </div>
              <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">📄 readme.txt</div>
            </div>
            <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">📁 Images</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}