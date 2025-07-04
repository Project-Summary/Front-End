// components/layout/Header.tsx
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Search, Bell, Settings, User, LogOut, Heart, List, Film, BookOpen } from 'lucide-react';
import { RootState } from '@/app/redux/store';
import { useRouter } from 'next/navigation';
import { logoutThunk } from '@/app/redux/auth/thunk.auth';
import { toast } from 'sonner';

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    dispatch(logoutThunk({
      onSuccess() {
        toast.success("Đăng xuất thành công")
      },
    }) as any);
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Film className="h-8 w-8" />
            <span className="text-xl font-bold">CineCritique</span>
          </Link>

          {/* Điều hướng */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/films" className="text-sm font-medium hover:text-primary">
              Phim
            </Link>
            <Link href="/stories" className="text-sm font-medium hover:text-primary">
              Truyện
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-primary">
              Thể loại
            </Link>
          </nav>

          {/* Tìm kiếm */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm phim, truyện..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      Hồ sơ
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/watchlist')}>
                      <Heart className="mr-2 h-4 w-4" />
                      Danh sách theo dõi
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/playlists')}>
                      <List className="mr-2 h-4 w-4" />
                      Danh sách phát
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/preferences')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Tùy chọn
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Đăng nhập</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">Đăng ký</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
