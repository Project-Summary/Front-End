// app/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FilmHero from '@/components/film/FilmHero';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AppDispatch, RootState } from '@/app/redux/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Film, BookOpen, TrendingUp, Clock, Router } from 'lucide-react';
import { getPopularMoviesThunk, getRecentMoviesThunk } from './redux/film/thunk.film';
import { getPopularStoriesThunk, getRecentStoriesThunk } from './redux/story/thunk.story';
import ContentGrid from '@/components/content/contentGrid.component';
import RatePage from '@/components/film/FilmReviews';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { logoutThunk } from './redux/auth/thunk.auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { films, popular: popularFilms, recent: recentFilms, } = useSelector((state: RootState) => state.film);
  const { stories, popularStories: popularStories, recentStories: recentStories, } = useSelector((state: RootState) => state.story);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [featuredContent, setFeaturedContent] = useState<any>(null);

  useEffect(() => {
    // Load initial data
    dispatch(getPopularMoviesThunk() as any);
    dispatch(getRecentMoviesThunk() as any);
    dispatch(getPopularStoriesThunk({}) as any);
    dispatch(getRecentStoriesThunk({}) as any);

  }, [dispatch]);

  useEffect(() => {
    router.prefetch('/login');
  }, [])

  useEffect(() => {
    // Set featured content (first popular film or story)
    if (popularStories?.length > 0) {
      setFeaturedContent({
        ...popularStories[0],
        type: 'story'
      });
    } else if (popularFilms?.length > 0) {
      setFeaturedContent({
        ...popularFilms[0],
        type: 'film'
      });
    }
  }, [popularFilms, popularStories]);

  const handleLogout = () => {
    dispatch(logoutThunk({
      onSuccess: () => {
        toast.success("Đăng xuất thành công");
        router.push('/login');
      }
    }))
  }

  return (
    <div className="flex flex-col gap-12 pb-16">
      {isAuthenticated && (
        <div className="absolute top-4 right-4 z-50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <span className="font-medium">Tên người dùng</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end">
              <DropdownMenuLabel>
                <Link href="/profile">Tài khoản của tôi</Link>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/playlist">Danh sách phát</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/preferences">Ưa thích</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 font-semibold"
              >
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      {/* Hero section */}
      {featuredContent && (
        <FilmHero film={featuredContent} />
      )}

      {/* Content Tabs */}
      <section className="container mx-auto px-4">
        <Tabs defaultValue="popular" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="popular" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Phổ biến
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Gần đây
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/film">
                  <Film className="mr-2 h-4 w-4" />
                  Tất cả phim
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/story">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Tất cả truyện
                </Link>
              </Button>
            </div>
          </div>

          <TabsContent value="popular">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Phim phổ biến</h3>
                <ContentGrid items={popularFilms} type="film" showActions={isAuthenticated} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Câu chuyện phổ biến</h3>
                <ContentGrid items={popularStories} type="story" showActions={isAuthenticated} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recent">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Phim gần đây</h3>
                <ContentGrid items={recentFilms} type="film" showActions={isAuthenticated} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Những câu chuyện gần đây</h3>
                <ContentGrid items={recentStories} type="story" showActions={isAuthenticated} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="films">
            <ContentGrid items={films} type="film" showActions={isAuthenticated} />
          </TabsContent>
        </Tabs>
      </section>

      {/* Featured Reviews section */}
      <section className="container mx-auto px-4">
        <RatePage />
      </section>

      {/* Newsletter section */}
      {!isAuthenticated && (
        <section className="container mx-auto px-4 bg-accent/20 rounded-xl p-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Tham gia cộng đồng của chúng tôi</h2>
            <p className="text-muted-foreground mb-6">
              Tạo tài khoản để đánh giá phim, viết bài đánh giá và xây dựng danh sách theo dõi cá nhân của bạn
            </p>
            <div className="flex gap-2 justify-center">
              <Button asChild>
                <Link href="/register">Đăng ký miễn phí</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/login">Đăng nhập</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
