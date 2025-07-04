// app/profile/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Heart,
  List,
  FileText,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppDispatch, RootState } from '@/app/redux/store';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { toast } from 'sonner';
import { getCurrentUserThunk, updateUserProfileThunk, uploadAvatarThunk } from '../redux/users/thunk.users';

// Import components for each section
import ProfileSection from '@/components/profile/ProfileSection';
import PlaylistSection from '@/components/profile/PlaylistSection';
import PreferencesSection from '@/components/profile/PreferencesSection';
import RequireSummarySection from '@/components/profile/RequireSummarySection';
import { useRouter } from 'next/navigation';

const sidebarItems = [
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    description: 'Quản lý thông tin hồ sơ của bạn'
  },
  {
    id: 'playlists',
    label: 'Playlists',
    icon: List,
    description: 'Quản lý danh sách phát của bạn'
  },
  {
    id: 'preferences',
    label: 'Preferences',
    icon: Heart,
    description: 'Quản lý tùy chọn của bạn'
  },
  {
    id: 'require-summary',
    label: 'Require Summary',
    icon: FileText,
    description: 'Yêu cầu tóm tắt nội dung'
  }
];

export default function ProfilePage() {
  useAuthRedirect();

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { currentUser: user } = useSelector((state: RootState) => state.users);
  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    dispatch(getCurrentUserThunk());
  }, [dispatch]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải hồ sơ...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection user={user} />;
      case 'playlists':
        return <PlaylistSection />;
      case 'preferences':
        return <PreferencesSection />;
      case 'require-summary':
        return <RequireSummarySection />;
      default:
        return <ProfileSection user={user} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <Button className="absolute left-5 top-5 z-40" variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 space-y-2">
            <div className="sticky top-8">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <nav className="space-y-1">
                    {sidebarItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          className={cn(
                            "w-full flex items-center space-x-3 px-3 py-2 text-left rounded-md transition-colors",
                            activeSection === item.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-sm">Thống kê nhanh</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tổng số lượt xem</span>
                    <span className="font-medium">{user.statistics?.totalViews || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Danh sách theo dõi</span>
                    <span className="font-medium">{user.statistics?.watchlist?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Thành viên từ</span>
                    <span className="font-medium">
                      {new Date(user.createdAt).getFullYear()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">
                {sidebarItems.find(item => item.id === activeSection)?.label}
              </h1>
              <p className="text-muted-foreground">
                {sidebarItems.find(item => item.id === activeSection)?.description}
              </p>
            </div>

            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
