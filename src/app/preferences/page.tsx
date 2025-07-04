"use client";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
    Heart,
    Clock,
    Film,
    BookOpen,
    Star,
    Users,
    Lock,
    Eye,
    ArrowLeft
} from 'lucide-react';
import { AppDispatch, RootState } from '@/app/redux/store';
import { toast } from 'sonner';
import {
    getMyPreferencesThunk,
    createPreferencesThunk,
    deletePreferencesThunk,
    searchPreferencesThunk
} from '@/app/redux/preferences/thunk.preferences';
import { clearError, clearSearchResults } from '@/app/redux/preferences/slice.preferences';
import { useRouter } from 'next/navigation';
import CreatePreferencesDialog from '@/components/preference/CreatePreferencesDialog';

export default function PreferencesPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { preferences, searchResults, loading, searchLoading, error } = useSelector(
        (state: RootState) => state.preferences
    );
    const [activeTab, setActiveTab] = useState('my');
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    useEffect(() => {
        dispatch(getMyPreferencesThunk());
    }, [dispatch]);

    useEffect(() => {
        return () => {
            dispatch(clearError());
            dispatch(clearSearchResults());
        };
    }, [dispatch]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        if (activeTab === 'discover') {
            if (term.trim()) {
                dispatch(searchPreferencesThunk({ q: term }));
            } else {
                dispatch(clearSearchResults());
            }
        }
    };

    const handleDeletePreferences = (preferencesId: string) => {
        dispatch(deletePreferencesThunk({
            preferenceIds: [preferencesId],
            onSuccess: () => {
                toast.success('Đã xóa tùy chọn thành công');
            }
        }));
    };

    const filteredMyPreferences = preferences.filter(pref =>
        pref.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pref.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const PreferencesCard = ({ preferences, showActions = true }: { preferences: any; showActions?: boolean }) => (
        <Card
            key={preferences._id}
            className="group hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => router.push(`/preferences/${preferences._id}`)}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg line-clamp-1">{preferences.name}</CardTitle>
                            <div className="flex gap-1">
                                {preferences.isPublic ? (
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
                                    {(preferences.movies?.length || 0) + (preferences.stories?.length || 0)} items
                                </Badge>
                            </div>
                        </div>
                        {preferences.description && (
                            <CardDescription className="line-clamp-2">
                                {preferences.description}
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
                                    router.push(`/preferences/${preferences._id}/edit`);
                                }}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeletePreferences(preferences._id);
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
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(preferences.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                            <Film className="h-3 w-3" />
                            {preferences.movies?.length || 0} phim
                        </span>
                        <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {preferences.stories?.length || 0} truyện
                        </span>
                    </div>
                    {preferences.isPublic && preferences.likes && (
                        <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {preferences.likes}
                        </span>
                    )}
                </div>

                {/* Preference Categories */}
                <div className="space-y-2">
                    {preferences.genres && preferences.genres.length > 0 && (
                        <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Thể loại:</p>
                            <div className="flex flex-wrap gap-1">
                                {preferences.genres.slice(0, 3).map((genre: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                        {genre}
                                    </Badge>
                                ))}
                                {preferences.genres.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                        +{preferences.genres.length - 3}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}

                    {preferences.tags && preferences.tags.length > 0 && (
                        <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Thẻ:</p>
                            <div className="flex flex-wrap gap-1">
                                {preferences.tags.slice(0, 3).map((tag: string, index: number) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                                {preferences.tags.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                        +{preferences.tags.length - 3}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}
                </div>
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
                    <h1 className="text-3xl font-bold">Sở thích của tôi</h1>
                    <p className="text-muted-foreground">
                        Sắp xếp nội dung yêu thích của bạn theo sở thích và mối quan tâm
                    </p>
                </div>

                <CreatePreferencesDialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                />
            </div>

            {/* Search and Tabs */}
            <div className="space-y-4">
                <div className="flex gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tùy chọn tìm kiếm..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="my">Tùy chọn của tôi ({preferences.length})</TabsTrigger>
                        <TabsTrigger value="discover">Khám phá ({searchResults.length})</TabsTrigger>
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
                        ) : filteredMyPreferences.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredMyPreferences.map((preferences) => (
                                    <PreferencesCard key={preferences._id} preferences={preferences} />
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">
                                        {searchTerm ? 'Không tìm thấy tùy chọn nào' : 'Chưa có tùy chọn nào'}
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        {searchTerm
                                            ? 'Thử điều chỉnh các điều khoản tìm kiếm của bạn'
                                            : 'Tạo bộ sưu tập tùy chọn đầu tiên của bạn để sắp xếp nội dung yêu thích của bạn'
                                        }
                                    </p>
                                    {!searchTerm && (
                                        <Button onClick={() => setIsCreateDialogOpen(true)}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Tạo tùy chọn đầu tiên của bạn
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="discover" className="space-y-4">
                        {searchLoading ? (
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
                        ) : searchResults.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {searchResults.map((preferences) => (
                                    <PreferencesCard key={preferences._id} preferences={preferences} showActions={false} />
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">
                                        {searchTerm ? 'Không tìm thấy tùy chọn nào' : 'Bắt ​​đầu tìm kiếm'}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {searchTerm
                                            ? 'Thử các thuật ngữ tìm kiếm khác nhau để tìm tùy chọn công khai'
                                            : 'Tìm kiếm bộ sưu tập tùy chọn công khai để khám phá nội dung mới'
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
