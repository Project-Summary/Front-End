"use client";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    Heart,
    Clock,
    Film,
    BookOpen,
    Plus,
    Share,
    Users,
    Lock,
    Tag,
    Image as ImageIcon,
    Search,
    Star,
    Play
} from 'lucide-react';
import { AppDispatch, RootState } from '@/app/redux/store';
import { toast } from 'sonner';
import {
    getPreferencesByIdThunk,
    deletePreferencesThunk,
    removeItemsFromPreferencesThunk,
    addItemToPreferencesThunk,
    bulkAddItemsToPreferencesThunk
} from '@/app/redux/preferences/thunk.preferences';
import { setSelectedPreferences } from '@/app/redux/preferences/slice.preferences';
import { getFilmByIdThunk, getAllFilmsThunk } from '@/app/redux/film/thunk.film';
import { getStoryByIdThunk, getAllStoriesThunk } from '@/app/redux/story/thunk.story';

export default function PreferencesDetailPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const params = useParams();
    const preferencesId = params.id as string;

    const { selectedPreferences, loading, error } = useSelector((state: RootState) => state.preferences);
    const { films } = useSelector((state: RootState) => state.film);
    const { stories } = useSelector((state: RootState) => state.story);

    const [isOwner, setIsOwner] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [movieItems, setMovieItems] = useState<any[]>([]);
    const [storyItems, setStoryItems] = useState<any[]>([]);
    const [loadingItems, setLoadingItems] = useState(false);

    // Add Items Dialog States
    const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [contentType, setContentType] = useState<'Movie' | 'Story'>('Movie');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    useEffect(() => {
        if (preferencesId) {
            dispatch(getPreferencesByIdThunk(preferencesId));
        }

        return () => {
            dispatch(setSelectedPreferences(null));
        };
    }, [dispatch, preferencesId]);

    // Load detailed item data when preferences are loaded
    useEffect(() => {
        if (selectedPreferences?.items) {
            loadItemDetails();
        }
    }, [selectedPreferences?.items]);

    useEffect(() => {
        // Check if current user is the owner (you'll need to implement user context)
        // setIsOwner(selectedPreferences?.userId === currentUser?.id);
        setIsOwner(true); // Temporary for demo
    }, [selectedPreferences]);

    // Load content for adding items
    useEffect(() => {
        if (isAddItemDialogOpen) {
            dispatch(getAllFilmsThunk());
            dispatch(getAllStoriesThunk({ filterDto: { page: 1, limit: 50 } }));
        }
    }, [isAddItemDialogOpen, dispatch]);

    const loadItemDetails = async () => {
        if (!selectedPreferences?.items) return;

        setLoadingItems(true);
        try {
            const moviePromises = selectedPreferences.items
                .filter(item => item.contentType === 'Movie')
                .map(item => dispatch(getFilmByIdThunk(item.contentId)));

            const storyPromises = selectedPreferences.items
                .filter(item => item.contentType === 'Story')
                .map(item => dispatch(getStoryByIdThunk(item.contentId)));

            await Promise.all([...moviePromises, ...storyPromises]);

            // Get movies and stories from Redux store
            const movieData = selectedPreferences.items
                .filter(item => item.contentType === 'Movie')
                .map(item => {
                    const movie = films.find(f => f._id === item.contentId);
                    return movie ? { ...movie, addedAt: item.addedAt } : null;
                })
                .filter(Boolean);

            const storyData = selectedPreferences.items
                .filter(item => item.contentType === 'Story')
                .map(item => {
                    const story = stories.find(s => s._id === item.contentId);
                    return story ? { ...story, addedAt: item.addedAt } : null;
                })
                .filter(Boolean);

            setMovieItems(movieData);
            setStoryItems(storyData);
        } catch (error) {
            console.error('Error loading item details:', error);
        } finally {
            setLoadingItems(false);
        }
    };

    const handleDeletePreferences = () => {
        dispatch(deletePreferencesThunk({
            preferenceIds: [preferencesId],
            onSuccess: () => {
                toast.success('Đã xóa tùy chọn thành công');
                router.push('/preferences');
            }
        }));
    };

    const handleRemoveItems = (contentIds: string[], contentType: 'Movie' | 'Story') => {
        const items = contentIds.map(contentId => ({ contentId, contentType }));

        dispatch(removeItemsFromPreferencesThunk({
            preferencesId,
            data: { items },
            onSuccess: () => {
                toast.success(`${contentType === 'Movie' ? 'Phim ảnh' : 'Câu chuyện'} đã xóa khỏi sở thích`);
                // Refresh preferences data
                dispatch(getPreferencesByIdThunk(preferencesId));
            }
        }));
    };

    const handleAddItems = () => {
        if (selectedItems.length === 0) {
            toast.error('Vui lòng chọn ít nhất một item');
            return;
        }

        if (selectedItems.length === 1) {
            // Single item add
            dispatch(addItemToPreferencesThunk({
                preferencesId,
                data: {
                    contentId: selectedItems[0],
                    contentType,
                },
                onSuccess: () => {
                    toast.success('Item đã được thêm vào ưa thích');
                    setIsAddItemDialogOpen(false);
                    setSelectedItems([]);
                    setSearchTerm('');
                    // Refresh preferences data
                    dispatch(getPreferencesByIdThunk(preferencesId));
                },
            }));
        } else {
            // Bulk add items
            const items = selectedItems.map(contentId => ({
                contentId,
                contentType,
            }));

            dispatch(bulkAddItemsToPreferencesThunk({
                preferencesId,
                data: { items },
                onSuccess: () => {
                    toast.success(`${selectedItems.length} items đã thêm vào ưa thích`);
                    setIsAddItemDialogOpen(false);
                    setSelectedItems([]);
                    setSearchTerm('');
                    // Refresh preferences data
                    dispatch(getPreferencesByIdThunk(preferencesId));
                },
            }));
        }
    };

    const handleRemoveItem = (itemId: string, contentType: 'Movie' | 'Story') => {
        dispatch(removeItemsFromPreferencesThunk({
            preferencesId,
            data: {
                items: [{ contentId: itemId, contentType }]
            },
            onSuccess: () => {
                toast.success('Đã xóa item khỏi danh sách phát');
                dispatch(getPreferencesByIdThunk(preferencesId));
            }
        }));
    };

    const handleShare = async () => {
        try {
            await navigator.share({
                title: selectedPreferences?.title,
                text: selectedPreferences?.description,
                url: window.location.href,
            });
        } catch (error) {
            // Fallback to clipboard
            navigator.clipboard.writeText(window.location.href);
            toast.success('Liên kết đã được sao chép vào bảng tạm');
        }
    };

    const getFilteredItems = () => {
        if (!selectedPreferences?.items) return [];

        switch (activeTab) {
            case 'movies':
                return selectedPreferences.items.filter(item => item.contentType === 'Movie');
            case 'stories':
                return selectedPreferences.items.filter(item => item.contentType === 'Story');
            default:
                return selectedPreferences.items;
        }
    };

    const getAvailableContent = () => {
        const existingItemIds = selectedPreferences?.items.map(item => item.contentId) || [];

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

    if (error || !selectedPreferences) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="text-center py-12">
                        <h3 className="text-lg font-semibold mb-2">Không tìm thấy tùy chọn</h3>
                        <p className="text-muted-foreground mb-4">
                            Các tùy chọn bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                        </p>
                        <Button onClick={() => router.push('/preferences')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Quay lại Tùy chọn
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const filteredItems = getFilteredItems();
    const movieCount = selectedPreferences.items?.filter(item => item.contentType === 'Movie').length || 0;
    const storyCount = selectedPreferences.items?.filter(item => item.contentType === 'Story').length || 0;

    console.log("FilteredItems", filteredItems);

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">Chi tiết tùy chọn</h1>
            </div>

            {/* Preferences Info */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-start gap-4 mb-4">
                                {/* Thumbnail */}
                                {selectedPreferences.thumbnail ? (
                                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={selectedPreferences.thumbnail}
                                            alt={selectedPreferences.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                )}

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <CardTitle className="text-2xl">{selectedPreferences.title}</CardTitle>
                                        <div className="flex gap-2">
                                            {selectedPreferences.isPublic ? (
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
                                            <Badge variant="outline">
                                                {selectedPreferences.type}
                                            </Badge>
                                        </div>
                                    </div>

                                    {selectedPreferences.description && (
                                        <CardDescription className="text-base mb-4">
                                            {selectedPreferences.description}
                                        </CardDescription>
                                    )}

                                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            Đã tạo {new Date(selectedPreferences.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Film className="h-4 w-4" />
                                            {movieCount} moviesq
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <BookOpen className="h-4 w-4" />
                                            {storyCount} truyện
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            {selectedPreferences.tags && selectedPreferences.tags.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-muted-foreground">Thẻ:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedPreferences.tags.map((tag, index) => (
                                            <Badge key={index} variant="secondary">
                                                <Tag className="h-3 w-3 mr-1" />
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
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
                                        onClick={() => router.push(`/preferences/${preferencesId}/edit`)}
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm">
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Xóa tùy chọn</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Bạn có chắc chắn muốn xóa các tùy chọn này không? Không thể hoàn tác hành động này.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleDeletePreferences}>
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

            {/* Content Tabs */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList>
                            <TabsTrigger value="all">Tất cả ({movieCount + storyCount})</TabsTrigger>
                            <TabsTrigger value="movies">Phim ({movieCount})</TabsTrigger>
                            <TabsTrigger value="stories">Câu chuyện ({storyCount})</TabsTrigger>
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
                                    <DialogTitle>Thêm mục vào Tùy chọn</DialogTitle>
                                    <DialogDescription>
                                        Chọn phim hoặc truyện để thêm vào tùy chọn của bạn
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
                                                placeholder="Tìm kiếm nội dung..."
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

                                    {getAvailableContent().length === 0 && (
                                        <div className="text-center py-8">
                                            <p className="text-muted-foreground">
                                                {searchTerm
                                                    ? `Không tìm thấy ${contentType.toLowerCase()} nào khớp với "${searchTerm}"`
                                                    : `Không có ${contentType.toLowerCase()} nào để thêm`
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <DialogFooter>
                                    <Button variant="outline" onClick={() => {
                                        setIsAddItemDialogOpen(false);
                                        setSelectedItems([]);
                                        setSearchTerm('');
                                    }}>
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
                            <Card key={item?.contentId} className="group hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                {item?.contentType === 'Movie' ? (
                                                    <Film className="h-4 w-4 text-blue-600" />
                                                ) : (
                                                    <BookOpen className="h-4 w-4 text-green-600" />
                                                )}
                                                <Badge variant="outline" className="text-xs">
                                                    {item?.contentType}
                                                </Badge>
                                                {item.content?.averageRating && (
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-3 w-3 text-yellow-500" />
                                                        <span className="text-xs">{item.content?.averageRating.toFixed(1)}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <CardTitle className="text-base line-clamp-2">
                                                {item.content?.title}
                                            </CardTitle>
                                            {item.content?.description && (
                                                <CardDescription className="line-clamp-2 mt-1">
                                                    {item.content?.description}
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
                                                        onClick={() => handleRemoveItem(item.content?._id, item.contentType)}
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
                                        {item.content?.releaseDate && (
                                            <span className="text-xs">
                                                {new Date(item.content?.releaseDate).getFullYear()}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            {item.content?.duration && (
                                                <span>{item.content?.duration} phút</span>
                                            )}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => router.push(`/${item.contentType.toLowerCase()}/${item.content?._id}`)}
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
