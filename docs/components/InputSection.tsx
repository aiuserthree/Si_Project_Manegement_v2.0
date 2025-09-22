import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Badge } from "./ui/badge";
import { Search, Calendar as CalendarIcon, Upload, X } from "lucide-react";
import { useState } from "react";

export default function InputSection() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [tags, setTags] = useState(['React', 'TypeScript']);
  const [newTag, setNewTag] = useState('');
  const [sliderValue, setSliderValue] = useState([50]);

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <div className="space-y-6">
      <h2 id="input">입력/상호작용 (Input/Interaction)</h2>
      
      {/* Text Field */}
      <Card>
        <CardHeader>
          <CardTitle>텍스트 필드 (Text Field)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">이메일</Label>
            <Input id="email" placeholder="이메일을 입력하세요" type="email" />
          </div>
          <div>
            <Label htmlFor="password">비밀번호</Label>
            <Input id="password" placeholder="비밀번호를 입력하세요" type="password" />
          </div>
        </CardContent>
      </Card>

      {/* Search Field */}
      <Card>
        <CardHeader>
          <CardTitle>검색창 (Search Field)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="검색어를 입력하세요..." 
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Radio Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>라디오 버튼 (Radio Button)</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue="option1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option1" id="option1" />
              <Label htmlFor="option1">옵션 1</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option2" id="option2" />
              <Label htmlFor="option2">옵션 2</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option3" id="option3" />
              <Label htmlFor="option3">옵션 3</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Checkboxes */}
      <Card>
        <CardHeader>
          <CardTitle>체크박스 (Checkbox)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">이용약관에 동의합니다</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="marketing" />
            <Label htmlFor="marketing">마케팅 정보 수신에 동의합니다</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="newsletter" />
            <Label htmlFor="newsletter">뉴스레터 구독</Label>
          </div>
        </CardContent>
      </Card>

      {/* Dropdown/Select */}
      <Card>
        <CardHeader>
          <CardTitle>드롭다운 (Dropdown/Select)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>국가 선택</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="국가를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kr">대한민국</SelectItem>
                  <SelectItem value="us">미국</SelectItem>
                  <SelectItem value="jp">일본</SelectItem>
                  <SelectItem value="cn">중국</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toggle Switch */}
      <Card>
        <CardHeader>
          <CardTitle>토글 스위치 (Toggle Switch)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">알림 받기</Label>
            <Switch id="notifications" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="darkmode">다크 모드</Label>
            <Switch id="darkmode" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sync">자동 동기화</Label>
            <Switch id="sync" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Slider */}
      <Card>
        <CardHeader>
          <CardTitle>슬라이더 (Slider)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>볼륨: {sliderValue[0]}</Label>
            <Slider 
              value={sliderValue} 
              onValueChange={setSliderValue}
              max={100} 
              step={1}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Date Picker */}
      <Card>
        <CardHeader>
          <CardTitle>날짜 선택기 (Date Picker)</CardTitle>
        </CardHeader>
        <CardContent>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? date.toLocaleDateString('ko-KR') : '날짜를 선택하세요'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {/* Tag Input */}
      <Card>
        <CardHeader>
          <CardTitle>태그 입력 (Tag Input)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-500" 
                  onClick={() => removeTag(tag)}
                />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="태그를 입력하고 추가 버튼을 클릭하세요"
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
            />
            <Button onClick={addTag}>추가</Button>
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>파일 업로더 (File Uploader)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div>
              <Label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block font-medium text-gray-900">
                  파일을 여기에 드래그하거나 클릭하여 업로드
                </span>
                <Input id="file-upload" type="file" className="sr-only" />
              </Label>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              PNG, JPG, PDF 최대 10MB
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle>필터 (Filter)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm">전체</Button>
              <Button variant="default" size="sm">최신순</Button>
              <Button variant="outline" size="sm">인기순</Button>
              <Button variant="outline" size="sm">가격순</Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary">카테고리: 전자제품</Badge>
              <Badge variant="secondary">가격: 10만원 이하</Badge>
              <Badge variant="secondary">브랜드: Samsung</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}