"use client";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Plus,
    Search,
    MoreHorizontal,
    Edit,
    Trash2,
    Play,
    Users,
    Lock,
    Eye,
    Heart,
    Clock,
    Film,
    ArrowLeft,
} from 'lucide-react';
import { AppDispatch, RootState } from '@/app/redux/store';
import { toast } from 'sonner';
import {
    getMyPlaylistsThunk,
    getPublicPlaylistsThunk,
    deletePlaylistThunk,
    searchPlaylistsThunk,
    getPlaylistStatsThunk
} from '@/app/redux/playlist/thunk.playlist';
import { clearError } from '@/app/redux/playlist/slice.playlist';
import { useRouter } from 'next/navigation';
import CreatePlaylistDialog from '@/components/playlist/CreatePlaylistDialog';

export default function PlaylistsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { playlists, publicPlaylists, stats, loading, error, pagination } = useSelector(
        (state: RootState) => state.playlist
    );

    const [activeTab, setActiveTab] = useState('my');
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    useEffect(() => {
        dispatch(getMyPlaylistsThunk());
        dispatch(getPublicPlaylistsThunk({ page: 1, limit: 12 }));
        dispatch(getPlaylistStatsThunk());
    }, [dispatch]);

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        if (activeTab === 'public') {
            if (term.trim()) {
                dispatch(searchPlaylistsThunk({ query: term, page: 1, limit: 12 }));
            } else {
                dispatch(getPublicPlaylistsThunk({ page: 1, limit: 12 }));
            }
        }
    };

    const handleDeletePlaylist = (playlistId: string) => {
        dispatch(deletePlaylistThunk({
            id: playlistId,
            onSuccess: () => {
                toast.success('Đã xóa danh sách phát thành công');
            }
        }));
    };

    const filteredMyPlaylists = playlists.filter(playlist =>
        playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        playlist.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const PlaylistCard = ({ playlist, showActions = true }: { playlist: any; showActions?: boolean }) => (
        <Card
            key={playlist._id}
            className="group hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => router.push(`/playlist/${playlist._id}`)}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg line-clamp-1">{playlist.name}</CardTitle>
                            <div className="flex gap-1">
                                {playlist.isPublic ? (
                                    <Badge variant="secondary" className="text-xs">
                                        <Users className="h-3 w-3 mr-1" />
                                        Công khai
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-xs">
                                        <Lock className="h-3 w-3 mr-1" />
                                        Riêng tư
                                    </Badge>
                                )}
                                <Badge variant="outline" className="text-xs">
                                    {playlist.items?.length || 0} items
                                </Badge>
                            </div>
                        </div>
                        {playlist.description && (
                            <CardDescription className="line-clamp-2">
                                {playlist.description}
                            </CardDescription>
                        )}
                    </div>

                    {showActions && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/playlist/${playlist._id}/edit`);
                                }}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeletePlaylist(playlist._id);
                                    }}
                                    className="text-destructive"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Xóa
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(playlist.createdAt).toLocaleDateString()}
                        </span>
                        {playlist.totalDuration && (
                            <span className="flex items-center gap-1">
                                <Play className="h-3 w-3" />
                                {Math.round(playlist.totalDuration / 60)}phút
                            </span>
                        )}
                    </div>
                    {playlist.isPublic && playlist.likes && (
                        <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {playlist.likes}
                        </span>
                    )}
                </div>

                {playlist.tags && playlist.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                        {playlist.tags.slice(0, 3).map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                        {playlist.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                                +{playlist.tags.length - 3}
                            </Badge>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );

    return (
        <div className="container mx-auto p-6 space-y-6">
            <Button className="absolute left-5 top-5 z-40" variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
            </Button>
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">Danh sách phát của tôi</h1>
                    <p className="text-muted-foreground">
                        Sắp xếp các bộ phim và câu chuyện yêu thích của bạn
                    </p>
                </div>

                <CreatePlaylistDialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                />
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                                    <Play className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Tổng số danh sách phát</p>
                                    <p className="text-2xl font-bold">{stats.totalPlaylists}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
                                    <Film className="h-4 w-4 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Tổng số mục</p>
                                    <p className="text-2xl font-bold">{stats.totalItems}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
                                    <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Danh sách phát công khai</p>
                                    <p className="text-2xl font-bold">{stats.publicPlaylists}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Search and Tabs */}
            <div className="space-y-4">
                <div className="flex gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search playlists..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="my">Danh sách phát của tôi ({playlists.length})</TabsTrigger>
                        <TabsTrigger value="public">Khám phá ({publicPlaylists.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="my" className="space-y-4">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <Card key={i} className="animate-pulse">
                                        <CardHeader>
                                            <div className="h-4 bg-muted rounded w-3/4"></div>
                                            <div className="h-3 bg-muted rounded w-1/2"></div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-16 bg-muted rounded"></div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : filteredMyPlaylists.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredMyPlaylists.map((playlist) => (
                                    <PlaylistCard key={playlist._id} playlist={playlist} />
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <Play className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">
                                        {searchTerm ? 'Không tìm thấy danh sách phát nào' : 'Chưa có danh sách phát nào'}
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        {searchTerm
                                            ? 'Thử điều chỉnh các thuật ngữ tìm kiếm của bạn'
                                            : 'Tạo danh sách phát đầu tiên của bạn để sắp xếp nội dung yêu thích của bạn'
                                        }
                                    </p>
                                    {!searchTerm && (
                                        <Button onClick={() => setIsCreateDialogOpen(true)}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Tạo danh sách phát đầu tiên của bạn
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="public" className="space-y-4">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <Card key={i} className="animate-pulse">
                                        <CardHeader>
                                            <div className="h-4 bg-muted rounded w-3/4"></div>
                                            <div className="h-3 bg-muted rounded w-1/2"></div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-16 bg-muted rounded"></div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : publicPlaylists.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {publicPlaylists.map((playlist) => (
                                    <PlaylistCard key={playlist._id} playlist={playlist} showActions={false} />
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">Không tìm thấy danh sách phát công khai nào</h3>
                                    <p className="text-muted-foreground">
                                        {searchTerm
                                            ? 'Thử các thuật ngữ tìm kiếm khác'
                                            : 'Kiểm tra lại sau để biết danh sách phát công khai mới'
                                        }
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Error Display */}
            {error && (
                <Card className="border-destructive">
                    <CardContent className="pt-6">
                        <p className="text-destructive text-sm">{error}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
