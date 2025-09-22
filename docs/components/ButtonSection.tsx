import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { 
  Heart, 
  Share2, 
  Download, 
  Play, 
  Pause, 
  MoreHorizontal, 
  Plus,
  Facebook,
  Twitter,
  Instagram,
  ChevronDown,
  ArrowUp,
  MessageCircle,
  Phone,
  Mail
} from "lucide-react";
import { useState } from "react";

export default function ButtonSection() {
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="space-y-6">
      <h2 id="buttons">버튼 & 액션 (Button & Action)</h2>
      
      {/* CTA Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>CTA 버튼 (Call-to-Action)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button size="lg">지금 시작하기</Button>
            <Button variant="outline" size="lg">더 알아보기</Button>
            <Button variant="destructive" size="lg">긴급 문의</Button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              무료 체험하기
            </Button>
            <Button variant="secondary">
              <Download className="mr-2 h-4 w-4" />
              다운로드
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Icon Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>아이콘 버튼 (Icon Button)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button size="icon">
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon">
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>액션 버튼 (Action Button)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button variant="default">
              <Phone className="mr-2 h-4 w-4" />
              전화하기
            </Button>
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              이메일 보내기
            </Button>
            <Button variant="secondary">
              <MessageCircle className="mr-2 h-4 w-4" />
              메시지 보내기
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Switch */}
      <Card>
        <CardHeader>
          <CardTitle>스위치 (Switch)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="airplane-mode">비행기 모드</Label>
            <Switch id="airplane-mode" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="wifi">WiFi</Label>
            <Switch id="wifi" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="bluetooth">Bluetooth</Label>
            <Switch id="bluetooth" />
          </div>
        </CardContent>
      </Card>

      {/* More Button */}
      <Card>
        <CardHeader>
          <CardTitle>더보기 버튼 (More Button)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p>이곳에 기본 콘텐츠가 표시됩니다.</p>
            <p>더 많은 정보를 보려면 아래 버튼을 클릭하세요.</p>
            {showMore && (
              <div className="p-4 bg-gray-50 rounded">
                <p>추가로 표시되는 콘텐츠입니다.</p>
                <p>더 많은 세부 정보와 내용이 여기에 들어갑니다.</p>
              </div>
            )}
            <Button 
              variant="outline" 
              onClick={() => setShowMore(!showMore)}
              className="w-full"
            >
              {showMore ? '접기' : '더보기'}
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showMore ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Floating Button */}
      <Card>
        <CardHeader>
          <CardTitle>플로팅 버튼 (Floating Button)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-32 bg-gray-100 rounded overflow-hidden">
            <div className="p-4">
              <p>스크롤 가능한 콘텐츠 영역</p>
              <p>플로팅 버튼은 항상 고정된 위치에 표시됩니다.</p>
            </div>
            <Button 
              size="icon"
              className="absolute bottom-4 right-4 rounded-full shadow-lg"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Social Share Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>소셜 쉐어 버튼 (Social Share Button)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Facebook className="mr-2 h-4 w-4" />
              Facebook
            </Button>
            <Button className="bg-blue-400 hover:bg-blue-500">
              <Twitter className="mr-2 h-4 w-4" />
              Twitter
            </Button>
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Instagram className="mr-2 h-4 w-4" />
              Instagram
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Facebook className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Instagram className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Button States */}
      <Card>
        <CardHeader>
          <CardTitle>버튼 상태 (Button States)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button>기본 상태</Button>
            <Button className="hover:bg-blue-600">호버 상태</Button>
            <Button disabled>비활성화</Button>
            <Button className="bg-green-600 hover:bg-green-700">
              성공 상태
            </Button>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline">아웃라인</Button>
            <Button variant="ghost">고스트</Button>
            <Button variant="link">링크</Button>
            <Button variant="destructive">위험</Button>
          </div>
          
          <div className="flex gap-2 items-center">
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}