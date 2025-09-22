import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { toast } from "sonner@2.0.3";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge";
import { AlertTriangle, Info, CheckCircle, X, Bell } from "lucide-react";
import { useState } from "react";

export default function PopupSection() {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "새 메시지", description: "새로운 메시지가 도착했습니다.", time: "방금 전" },
    { id: 2, title: "업데이트 알림", description: "시스템 업데이트가 완료되었습니다.", time: "5분 전" },
  ]);

  const showToast = (type: string) => {
    switch (type) {
      case 'success':
        toast.success("성공적으로 완료되었습니다!");
        break;
      case 'error':
        toast.error("오류가 발생했습니다. 다시 시도해주세요.");
        break;
      case 'info':
        toast.info("새로운 알림이 있습니다.");
        break;
      default:
        toast("기본 알림입니다.");
    }
  };

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 id="popup">팝업/오버레이 (Popup/Overlay)</h2>
      
      {/* Modal Dialog */}
      <Card>
        <CardHeader>
          <CardTitle>모달 (Modal)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>모달 열기</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>프로필 편집</DialogTitle>
                <DialogDescription>
                  프로필 정보를 변경하세요. 완료하면 저장을 클릭하세요.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">이름</label>
                  <input id="name" className="col-span-3 px-3 py-2 border rounded" defaultValue="홍길동" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="email" className="text-right">이메일</label>
                  <input id="email" className="col-span-3 px-3 py-2 border rounded" defaultValue="hong@example.com" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">취소</Button>
                <Button>저장</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Alert Dialog */}
      <Card>
        <CardHeader>
          <CardTitle>경고창/얼럿 (Alert Dialog)</CardTitle>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">계정 삭제</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>정말로 계정을 삭제하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  이 작업은 되돌릴 수 없습니다. 계정이 영구적으로 삭제되며 
                  모든 데이터가 서버에서 제거됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 hover:bg-red-700">삭제</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* Toast/Snackbar */}
      <Card>
        <CardHeader>
          <CardTitle>토스트/스낵바 (Toast/Snackbar)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => showToast('success')} className="bg-green-600 hover:bg-green-700">
              성공 토스트
            </Button>
            <Button onClick={() => showToast('error')} variant="destructive">
              오류 토스트
            </Button>
            <Button onClick={() => showToast('info')} variant="outline">
              정보 토스트
            </Button>
            <Button onClick={() => showToast('default')} variant="secondary">
              기본 토스트
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Sheet */}
      <Card>
        <CardHeader>
          <CardTitle>바텀시트 (Bottom Sheet)</CardTitle>
        </CardHeader>
        <CardContent>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">바텀시트 열기</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>옵션 선택</DrawerTitle>
                <DrawerDescription>원하는 옵션을 선택하세요.</DrawerDescription>
              </DrawerHeader>
              <div className="p-4 space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  📷 사진 촬영
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  🖼️ 갤러리에서 선택
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  📁 파일 선택
                </Button>
              </div>
              <DrawerFooter>
                <Button variant="outline">취소</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </CardContent>
      </Card>

      {/* Side Panel/Drawer */}
      <Card>
        <CardHeader>
          <CardTitle>사이드 패널/드로어 (Side Panel/Drawer)</CardTitle>
        </CardHeader>
        <CardContent>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">사이드 패널 열기</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>설정</SheetTitle>
                <SheetDescription>
                  앱 설정을 변경할 수 있습니다.
                </SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <h4>알림 설정</h4>
                  <div className="flex items-center justify-between">
                    <span>푸시 알림</span>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>이메일 알림</span>
                    <input type="checkbox" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4>개인정보</h4>
                  <div className="flex items-center justify-between">
                    <span>프로필 공개</span>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>온라인 상태</span>
                    <input type="checkbox" defaultChecked />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </CardContent>
      </Card>

      {/* Lightbox */}
      <Card>
        <CardHeader>
          <CardTitle>라이트박스 (Lightbox)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            <div 
              className="aspect-square bg-gradient-to-br from-blue-400 to-purple-500 rounded cursor-pointer"
              onClick={() => setIsLightboxOpen(true)}
            >
              <div className="w-full h-full flex items-center justify-center text-white">
                클릭하여 확대
              </div>
            </div>
            <div className="aspect-square bg-gradient-to-br from-green-400 to-blue-500 rounded cursor-pointer">
              <div className="w-full h-full flex items-center justify-center text-white text-sm">
                이미지 2
              </div>
            </div>
            <div className="aspect-square bg-gradient-to-br from-pink-400 to-red-500 rounded cursor-pointer">
              <div className="w-full h-full flex items-center justify-center text-white text-sm">
                이미지 3
              </div>
            </div>
          </div>
          
          {isLightboxOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
              <div className="relative">
                <button
                  onClick={() => setIsLightboxOpen(false)}
                  className="absolute -top-10 right-0 text-white hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-500 rounded">
                  <div className="w-full h-full flex items-center justify-center text-white">
                    확대된 이미지
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alert Messages */}
      <Card>
        <CardHeader>
          <CardTitle>안내/오류/성공 메시지 (Alert Messages)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>정보</AlertTitle>
            <AlertDescription>
              새로운 업데이트가 있습니다. 확인해보세요.
            </AlertDescription>
          </Alert>
          
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">성공</AlertTitle>
            <AlertDescription className="text-green-700">
              작업이 성공적으로 완료되었습니다.
            </AlertDescription>
          </Alert>
          
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>오류</AlertTitle>
            <AlertDescription>
              문제가 발생했습니다. 나중에 다시 시도해주세요.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>알림 (Notification)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3 p-3 border rounded">
                <Bell className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{notification.title}</h4>
                    <Badge variant="secondary">{notification.time}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeNotification(notification.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                알림이 없습니다.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}