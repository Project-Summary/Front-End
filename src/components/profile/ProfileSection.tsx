// components/profile/ProfileSection.tsx
"use client";
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Upload, Edit, User, Mail, Calendar, Eye, Heart, Star, List } from 'lucide-react';
import { AppDispatch } from '@/app/redux/store';
import { updateUserProfileThunk, uploadAvatarThunk } from '@/app/redux/users/thunk.users';
import { toast } from 'sonner';
import { User as UserType } from '@/app/redux/users/slice.users';

interface ProfileSectionProps {
  user: UserType;
}

export default function ProfileSection({ user }: ProfileSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    if (!user) return;

    dispatch(updateUserProfileThunk({
      userId: user._id,
      data: formData,
      onSuccess: () => {
        setIsEditing(false);
        toast.success('Hồ sơ đã được cập nhật thành công');
      }
    }));
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    dispatch(uploadAvatarThunk({
      file,
      onSuccess: () => {
        toast.success('Hồ sơ đã được cập nhật thành công');
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <label className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/80">
                <Upload className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-muted-foreground">{user.email}</p>
                  <Badge variant="outline" className="mt-1">
                    {user.role}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin hồ sơ</CardTitle>
          <CardDescription>
            Cập nhật thông tin hồ sơ của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled={true}
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-2">
              <Button onClick={handleSaveProfile}>
                Lưu thay đổi
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Hủy
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Thống kê */}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Eye className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold">{user.statistics?.totalViews || 0}</div>
              <div className="text-sm text-muted-foreground">Tổng số lượt xem</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Heart className="h-5 w-5 text-red-500" />
              </div>
              <div className="text-2xl font-bold">{user.statistics?.totalLikes || 0}</div>
              <div className="text-sm text-muted-foreground">Tổng số lượt thích</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold">{user.statistics?.totalComments || 0}</div>
              <div className="text-sm text-muted-foreground">Bình luận</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <List className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold">{user.statistics?.watchlist?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Danh sách theo dõi</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin tài khoản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Thành viên từ</span>
            </div>
            <span className="text-sm font-medium">
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Trạng thái tài khoản</span>
            </div>
            <Badge variant={user.isActive ? "default" : "destructive"}>
              {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Cần đăng nhập cuối cùng</span>
            </div>
            <span className="text-sm font-medium">
              {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Không bao giờ'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
