import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import { Loader2, Wifi, Battery, Signal, AlertCircle, CheckCircle, Clock, Zap, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function StateSection() {
  const [progress, setProgress] = useState(13);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  const startLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <h2 id="state">상태 & 피드백 (State & Feedback)</h2>
        
        {/* Loader/Spinner */}
        <Card>
          <CardHeader>
            <CardTitle>로더/스피너 (Loader/Spinner)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>로딩 중...</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Button onClick={startLoading} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "로딩중..." : "로딩 시작"}
              </Button>
            </div>

            <div className="flex gap-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              </div>
              
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              
              <div className="w-8 h-8 border-2 border-blue-600 border-dashed rounded-full animate-spin"></div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <Card>
          <CardHeader>
            <CardTitle>프로그레스 바 (Progress Bar)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>파일 업로드</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>설치 진행률</span>
                <span>85%</span>
              </div>
              <Progress value={85} className="w-full" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>용량 사용률</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" style={{width: '45%'}}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skeleton UI */}
        <Card>
          <CardHeader>
            <CardTitle>스켈레톤 UI (Skeleton UI)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badge */}
        <Card>
          <CardHeader>
            <CardTitle>배지 (Badge)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge>기본</Badge>
              <Badge variant="secondary">보조</Badge>
              <Badge variant="outline">아웃라인</Badge>
              <Badge variant="destructive">위험</Badge>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-green-500">
                <CheckCircle className="w-3 h-3 mr-1" />
                완료
              </Badge>
              <Badge className="bg-yellow-500">
                <Clock className="w-3 h-3 mr-1" />
                대기중
              </Badge>
              <Badge className="bg-red-500">
                <AlertCircle className="w-3 h-3 mr-1" />
                오류
              </Badge>
              <Badge className="bg-blue-500">
                <Zap className="w-3 h-3 mr-1" />
                새로움
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Button variant="outline">메시지</Button>
                <Badge className="absolute -top-2 -right-2 px-1 py-0 text-xs">5</Badge>
              </div>
              
              <div className="relative">
                <Button variant="outline">알림</Button>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Bar */}
        <Card>
          <CardHeader>
            <CardTitle>상태바 (Status Bar)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-white p-2 rounded text-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span>9:41</span>
                </div>
                <div className="flex items-center gap-1">
                  <Signal className="w-4 h-4" />
                  <Wifi className="w-4 h-4" />
                  <Battery className="w-4 h-4" />
                  <span>100%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tooltip */}
        <Card>
          <CardHeader>
            <CardTitle>툴팁 (Tooltip)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">위로 호버</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>이 버튼에 대한 도움말입니다.</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">
                    <AlertCircle className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>중요한 정보가 있습니다.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Badge */}
        <Card>
          <CardHeader>
            <CardTitle>동적 배지 (Dynamic Badge)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative p-4 border rounded">
                <h3>신제품</h3>
                <p className="text-sm text-gray-600">최신 출시된 제품입니다.</p>
                <Badge className="absolute top-2 right-2 animate-pulse bg-red-500">
                  NEW
                </Badge>
              </div>
              
              <div className="relative p-4 border rounded">
                <h3>인기 상품</h3>
                <p className="text-sm text-gray-600">가장 많이 팔린 제품입니다.</p>
                <Badge className="absolute top-2 right-2 bg-orange-500">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  HOT
                </Badge>
              </div>
              
              <div className="relative p-4 border rounded">
                <h3>할인 상품</h3>
                <p className="text-sm text-gray-600">특별 할인가로 만나보세요.</p>
                <Badge className="absolute top-2 right-2 bg-green-500 animate-bounce">
                  50% OFF
                </Badge>
              </div>
              
              <div className="relative p-4 border rounded">
                <h3>한정판</h3>
                <p className="text-sm text-gray-600">한정 수량 제품입니다.</p>
                <Badge className="absolute top-2 right-2 bg-purple-500">
                  LIMITED
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guide Text */}
        <Card>
          <CardHeader>
            <CardTitle>가이드 텍스트 (Guide Text)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block">이메일 주소</label>
              <input 
                type="email" 
                className="w-full p-2 border rounded" 
                placeholder="example@email.com"
              />
              <p className="text-sm text-gray-500">
                📧 올바른 이메일 형식으로 입력해주세요.
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="block">비밀번호</label>
              <input 
                type="password" 
                className="w-full p-2 border rounded" 
                placeholder="비밀번호를 입력하세요"
              />
              <p className="text-sm text-gray-500">
                🔒 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.
              </p>
            </div>
            
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-700">
                💡 <strong>팁:</strong> 더 안전한 계정을 위해 2단계 인증을 설정하세요.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}