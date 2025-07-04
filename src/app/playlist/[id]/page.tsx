"use client";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    ArrowLeft,
    MoreHorizontal,
    Edit,
    Trash2,
    Play,
    Users,
    Lock,
    Heart,
    Clock,
    Film,
    BookOpen,
    Plus,
    Share,
    Search,
    Star,
    Eye,
    Calendar
} from 'lucide-react';
import { AppDispatch, RootState } from '@/app/redux/store';
import { toast } from 'sonner';
import {
    getPlaylistByIdThunk,
    deletePlaylistThunk,
    removeFromPlaylistThunk,
    addItemToPlaylistThunk
} from '@/app/redux/playlist/thunk.playlist';
import { clearSelectedPlaylist } from '@/app/redux/playlist/slice.playlist';
import { getAllFilmsThunk } from '@/app/redux/film/thunk.film';
import { getAllStoriesThunk } from '@/app/redux/story/thunk.story';

export default function PlaylistDetailPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const params = useParams();
    const playlistId = params.id as string;

    const { selectedPlaylist, loading, error } = useSelector((state: RootState) => state.playlist);
    const { films } = useSelector((state: RootState) => state.film);
    const { stories } = useSelector((state: RootState) => state.story);

    const [isOwner, setIsOwner] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [contentType, setContentType] = useState<'Movie' | 'Story'>('Movie');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    useEffect(() => {
        if (playlistId) {
            dispatch(getPlaylistByIdThunk(playlistId));
        }

        return () => {
            dispatch(clearSelectedPlaylist());
        };
    }, [dispatch, playlistId]);

    useEffect(() => {
        // Check if current user is the owner (implement user context)
        // setIsOwner(selectedPlaylist?.userId._id === currentUser?.id);
        setIsOwner(true); // Temporary for demo
    }, [selectedPlaylist]);

    useEffect(() => {
        // Load content for adding items
        if (isAddItemDialogOpen) {
            dispatch(getAllFilmsThunk());
            dispatch(getAllStoriesThunk({ filterDto: { page: 1, limit: 50 } }));
        }
    }, [isAddItemDialogOpen, dispatch]);

    const handleDeletePlaylist = () => {
        dispatch(deletePlaylistThunk({
            id: playlistId,
            onSuccess: () => {
                toast.success('Xóa playlist thành công');
                router.push('/playlist');
            }
        }));
    };

    const handleRemoveItem = (itemId: string) => {
        dispatch(removeFromPlaylistThunk({
            playlistId,
            itemId,
            onSuccess: () => {
                toast.success('Đã xóa item khỏi playlist');
                // Refresh playlist data
                dispatch(getPlaylistByIdThunk(playlistId));
            }
        }));
    };

    const handleAddItems = () => {
        if (selectedItems.length === 0) {
            toast.error('Vui lòng chọn ít nhất một mục');
            return;
        }

        selectedItems.forEach(itemId => {
            dispatch(addItemToPlaylistThunk({
                playlistId,
                itemData: {
                    contentId: itemId,
                    contentType,
                },
                onSuccess: () => {
                    toast.success('Đã thêm item vào playlist');
                    setIsAddItemDialogOpen(false);
                    setSelectedItems([]);
                    // Refresh playlist data
                    dispatch(getPlaylistByIdThunk(playlistId));
                }
            }));
        });
    };

    const handleShare = async () => {
        try {
            await navigator.share({
                title: selectedPlaylist?.name,
                text: selectedPlaylist?.description,
                url: window.location.href,
            });
        } catch (error) {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Đã sao chép liên kết vào clipboard');
        }
    };

    const getFilteredItems = () => {
        if (!selectedPlaylist?.items) return [];

        switch (activeTab) {
            case 'movies':
                return selectedPlaylist.items.filter(item => item.contentType === 'Movie');
            case 'stories':
                return selectedPlaylist.items.filter(item => item.contentType === 'Story');
            default:
                return selectedPlaylist.items;
        }
    };

    const getAvailableContent = () => {
        const existingItemIds = selectedPlaylist?.items.map(item => item.content._id) || [];

        if (contentType === 'Movie') {
            return films.filter(film =>
                !existingItemIds.includes(film._id) &&
                film.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } else {
            return stories.filter(story =>
                !existingItemIds.includes(story._id) &&
                story.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="animate-pulse space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 bg-muted rounded"></div>
                        <div className="h-8 bg-muted rounded w-1/3"></div>
                    </div>
                    <div className="h-32 bg-muted rounded"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-48 bg-muted rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error || !selectedPlaylist) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="text-center py-12">
                        <h3 className="text-lg font-semibold mb-2">Danh sách phát không tồn tại</h3>
                        <p className="text-muted-foreground mb-4">
                            Danh sách phát bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                        </p>
                        <Button onClick={() => router.push('/playlist')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Quay lại danh sách phát
                        </Button>
                    </CardContent>
                </Card>

            </div>
        );
    }

    const filteredItems = getFilteredItems();
    const movieCount = selectedPlaylist.items?.filter(item => item.contentType === 'Movie').length || 0;
    const storyCount = selectedPlaylist.items?.filter(item => item.contentType === 'Story').length || 0;

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">Chi tiết Playlist</h1>
            </div>

            {/* Thông tin Playlist */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <CardTitle className="text-2xl">{selectedPlaylist.name}</CardTitle>
                                <div className="flex gap-2">
                                    {selectedPlaylist.isPublic ? (
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                            <Users className="h-3 w-3 mr-1" />
                                            Công khai
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline">
                                            <Lock className="h-3 w-3 mr-1" />
                                            Riêng tư
                                        </Badge>
                                    )}
                                    <Badge variant="secondary">
                                        {selectedPlaylist.totalItems} mục
                                    </Badge>
                                </div>
                            </div>

                            {selectedPlaylist.description && (
                                <CardDescription className="text-base mb-4">
                                    {selectedPlaylist.description}
                                </CardDescription>
                            )}

                            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={selectedPlaylist.userId.name} />
                                        <AvatarFallback>
                                            {selectedPlaylist.userId.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span>{selectedPlaylist.userId.name}</span>
                                </div>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Tạo vào ngày {new Date(selectedPlaylist.createdAt).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Film className="h-4 w-4" />
                                    {movieCount} phim
                                </span>
                                <span className="flex items-center gap-1">
                                    <BookOpen className="h-4 w-4" />
                                    {storyCount} truyện
                                </span>
                            </div>

                            {selectedPlaylist.tags && selectedPlaylist.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {selectedPlaylist.tags.map((tag, index) => (
                                        <Badge key={index} variant="outline">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleShare}>
                                <Share className="h-4 w-4 mr-2" />
                                Chia sẻ
                            </Button>

                            {isOwner && (
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.push(`/playlist/${playlistId}/edit`)}
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Chỉnh sửa
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm">
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Xóa
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Xóa Playlist</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Bạn có chắc chắn muốn xóa playlist này không? Hành động này không thể hoàn tác.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleDeletePlaylist}>
                                                    Xóa
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </>
                            )}
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Tab Nội dung */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList>
                            <TabsTrigger value="all">Tất cả ({selectedPlaylist.totalItems})</TabsTrigger>
                            <TabsTrigger value="movies">Phim ({movieCount})</TabsTrigger>
                            <TabsTrigger value="stories">Truyện ({storyCount})</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {isOwner && (
                        <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Thêm mục
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Thêm mục vào Playlist</DialogTitle>
                                    <DialogDescription>
                                        Chọn phim hoặc truyện để thêm vào playlist của bạn
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <Select value={contentType} onValueChange={(value: 'Movie' | 'Story') => setContentType(value)}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Movie">Phim</SelectItem>
                                                <SelectItem value="Story">Truyện</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search content..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                                        {getAvailableContent().map((item) => (
                                            <Card
                                                key={item._id}
                                                className={`cursor-pointer transition-all ${selectedItems.includes(item._id)
                                                    ? 'ring-2 ring-primary bg-primary/5'
                                                    : 'hover:shadow-md'
                                                    }`}
                                                onClick={() => {
                                                    setSelectedItems(prev =>
                                                        prev.includes(item._id)
                                                            ? prev.filter(id => id !== item._id)
                                                            : [...prev, item._id]
                                                    );
                                                }}
                                            >
                                                <CardHeader className="pb-2">
                                                    <div className="flex items-start gap-3">
                                                        {item.poster && (
                                                            <img
                                                                src={item.poster}
                                                                alt={item.title}
                                                                className="w-12 h-16 object-cover rounded"
                                                            />
                                                        )}
                                                        <div className="flex-1">
                                                            <CardTitle className="text-sm line-clamp-2">
                                                                {item.title}
                                                            </CardTitle>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                {contentType === 'Movie' ? (
                                                                    <Film className="h-3 w-3 text-blue-600" />
                                                                ) : (
                                                                    <BookOpen className="h-3 w-3 text-green-600" />
                                                                )}
                                                                {item.averageRating && (
                                                                    <div className="flex items-center gap-1">
                                                                        <Star className="h-3 w-3 text-yellow-500" />
                                                                        <span className="text-xs">{item.averageRating.toFixed(1)}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                            </Card>
                                        ))}
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsAddItemDialogOpen(false)}>
                                        Hủy
                                    </Button>
                                    <Button
                                        onClick={handleAddItems}
                                        disabled={selectedItems.length === 0}
                                    >
                                        Thêm {selectedItems.length} mục
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                {/* Items List */}
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((item) => (
                            <Card key={item._id} className="group hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                {item.contentType === 'Movie' ? (
                                                    <Film className="h-4 w-4 text-blue-600" />
                                                ) : (
                                                    <BookOpen className="h-4 w-4 text-green-600" />
                                                )}
                                                <Badge variant="outline" className="text-xs">
                                                    {item.contentType}
                                                </Badge>
                                                {item.content.averageRating && (
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-3 w-3 text-yellow-500" />
                                                        <span className="text-xs">{item.content.averageRating.toFixed(1)}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <CardTitle className="text-base line-clamp-2">
                                                {item.content.title}
                                            </CardTitle>
                                            {item.content.description && (
                                                <CardDescription className="line-clamp-2 mt-1">
                                                    {item.content.description}
                                                </CardDescription>
                                            )}
                                        </div>

                                        {isOwner && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => handleRemoveItem(item.content._id)}
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
                                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            Đã thêm {new Date(item.addedAt).toLocaleDateString()}
                                        </span>
                                        {item.content.releaseDate && (
                                            <span className="text-xs">
                                                {new Date(item.content.releaseDate).getFullYear()}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            {item.content.duration && (
                                                <span>{item.content.duration} phút</span>
                                            )}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => router.push(`/${item.contentType.toLowerCase()}/${item.content._id}`)}
                                        >
                                            <Play className="h-4 w-4 mr-1" />
                                            Xem
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Play className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                {activeTab === 'all' ? 'Không có mục nào trong danh sách phát này' :
                                    activeTab === 'movies' ? 'Không có phim nào trong danh sách phát này' :
                                        'Không có câu chuyện nào trong danh sách phát này'}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                {isOwner
                                    ? `Thêm một số ${activeTab === 'all' ? 'content' : activeTab} để bắt đầu`
                                    : `Danh sách phát này không có ${activeTab === 'all' ? 'items' : activeTab}`
                                }
                            </p>
                            {isOwner && (
                                <Button onClick={() => setIsAddItemDialogOpen(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Thêm mục
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
