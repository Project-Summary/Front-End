// components/profile/PreferencesSection.tsx
"use client";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Edit,
    Trash2,
    Heart,
    Star,
    Clock,
    Film,
    BookOpen,
    BookAIcon
} from 'lucide-react';
import { AppDispatch, RootState } from '@/app/redux/store';
import { toast } from 'sonner';
import {
    getMyPreferencesThunk,
    createPreferencesThunk,
    updatePreferencesThunk,
    deletePreferencesThunk,
    addMovieToPreferencesThunk,
    removeMoviesFromPreferencesThunk
} from '@/app/redux/preferences/thunk.preferences';
import { Preferences } from '@/app/redux/preferences/interface.preferences';

export default function PreferencesSection() {
    const dispatch = useDispatch<AppDispatch>();
    const { preferences, loading } = useSelector((state: RootState) => state.preferences);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingPreference, setEditingPreference] = useState<Preferences | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: ''
    });

    useEffect(() => {
        dispatch(getMyPreferencesThunk());
    }, [dispatch]);

    const filteredPreferences = preferences?.filter(preference => {
        const matchesSearch = preference.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            preference.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || preference.type === filterType;
        return matchesSearch && matchesFilter;
    }) || [];

    const handleCreatePreference = () => {
        dispatch(createPreferencesThunk({
            data: formData,
            onSuccess: () => {
                setIsCreateDialogOpen(false);
                setFormData({ title: '', description: '', type: 'story' });
                toast.success('Đã tạo tùy chọn thành công');
            }
        }));
    };

    const handleUpdatePreference = () => {
        if (!editingPreference) return;

        dispatch(updatePreferencesThunk({
            preferencesId: editingPreference._id,
            data: formData,
            onSuccess: () => {
                setEditingPreference(null);
                setFormData({ title: '', description: '', type: 'story' });
                toast.success('Đã cập nhật tùy chọn thành công');
            }
        }));
    };

    const handleDeleteSelected = () => {
        if (selectedPreferences.length === 0) return;

        dispatch(deletePreferencesThunk({
            preferenceIds: selectedPreferences,
            onSuccess: () => {
                setSelectedPreferences([]);
                toast.success(`${selectedPreferences.length} tùy chọn đã được xóa thành công`);
            }
        }));
    };

    const handleSelectAll = () => {
        if (selectedPreferences.length === filteredPreferences.length) {
            setSelectedPreferences([]);
        } else {
            setSelectedPreferences(filteredPreferences.map(p => p._id));
        }
    };

    const openEditDialog = (preference: Preferences) => {
        setEditingPreference(preference);
        setFormData({
            title: preference.title,
            description: preference.description || '',
            type: preference.type
        });
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'story': return <BookAIcon className="h-4 w-4" />;
            case 'movie': return <Film className="h-4 w-4" />;
            default: return <Heart className="h-4 w-4" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'story': return 'bg-blue-100 text-blue-800';
            case 'movie': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header with Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex flex-1 gap-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tùy chọn tìm kiếm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-32">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả các loại</SelectItem>
                            <SelectItem value="movie">Phim</SelectItem>
                            <SelectItem value="story">Câu chuyện</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-2">
                    {selectedPreferences.length > 0 && (
                        <Button variant="destructive" onClick={handleDeleteSelected}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa ({selectedPreferences.length})
                        </Button>
                    )}

                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm tùy chọn
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Thêm tùy chọn mới</DialogTitle>
                                <DialogDescription>
                                    Tạo tùy chọn mới để cá nhân hóa các đề xuất nội dung của bạn.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Tiêu đề</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Nhập tiêu đề tùy chọn"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="type">Loại</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent aria-placeholder='Chọn loại'>
                                            <SelectItem value="Story">Story</SelectItem>
                                            <SelectItem value="Movie">Movie</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Mô tả</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Nhập mô tả tùy chọn (tùy chọn)"
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                    Hủy
                                </Button>
                                <Button onClick={handleCreatePreference} disabled={!formData.title.trim()}>
                                    Thêm tùy chọn
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Hành động hàng loạt */}
            {filteredPreferences.length > 0 && (
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                    <Checkbox
                        checked={selectedPreferences.length === filteredPreferences.length}
                        onCheckedChange={handleSelectAll}
                    />
                    <span className="text-sm text-muted-foreground">
                        {selectedPreferences.length > 0
                            ? `${selectedPreferences.length} trong số ${filteredPreferences.length} đã chọn`
                            : `Chọn tất cả ${filteredPreferences.length} sở thích`
                        }
                    </span>
                </div>
            )}

            {/* Preferences Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            ) : filteredPreferences.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPreferences.map((preference) => (
                        <Card key={preference._id} className="group hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-2 flex-1">
                                        <Checkbox
                                            checked={selectedPreferences.includes(preference._id)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedPreferences(prev => [...prev, preference._id]);
                                                } else {
                                                    setSelectedPreferences(prev => prev.filter(id => id !== preference._id));
                                                }
                                            }}
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                {getTypeIcon(preference.type)}
                                                <CardTitle className="text-base line-clamp-1">{preference.title}</CardTitle>
                                            </div>
                                            <Badge className={`text-xs ${getTypeColor(preference.type)}`}>
                                                {preference.type}
                                            </Badge>
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openEditDialog(preference)}>
                                                <Edit className="h-4 w-4 mr-2" />
                                                Chỉnh sửa
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    dispatch(deletePreferencesThunk({
                                                        preferenceIds: [preference._id],
                                                        onSuccess: () => toast.success('Đã xóa tùy chọn thành công')
                                                    }));
                                                }}
                                                className="text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Xóa
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0">
                                {preference.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                        {preference.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {new Date(preference.createdAt).toLocaleDateString()}
                                    </div>
                                    {preference.items && preference.items.length > 0 && (
                                        <span>{preference.items.length} phim</span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="text-center py-12">
                        <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            {searchTerm || filterType !== 'all' ? 'Không tìm thấy tùy chọn nào' : 'Chưa có tùy chọn nào'}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            {searchTerm || filterType !== 'all'
                                ? 'Thử điều chỉnh tìm kiếm hoặc bộ lọc của bạn'
                                : 'Thêm tùy chọn để nhận đề xuất nội dung được cá nhân hóa'
                            }
                        </p>
                        {!searchTerm && filterType === 'all' && (
                            <Button onClick={() => setIsCreateDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm tùy chọn đầu tiên của bạn
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Edit Dialog */}
            <Dialog open={!!editingPreference} onOpenChange={() => setEditingPreference(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa tùy chọn</DialogTitle>
                        <DialogDescription>
                            Cập nhật thông tin tùy chọn của bạn.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-title">Tiêu đề</Label>
                            <Input
                                id="edit-title"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Nhập tiêu đề tùy chọn"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-type">Loại</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Story">Story</SelectItem>
                                    <SelectItem value="Movie">Movie</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Mô tả</Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Nhập mô tả tùy chọn (tùy chọn)"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingPreference(null)}>
                            Hủy
                        </Button>
                        <Button onClick={handleUpdatePreference} disabled={!formData.title.trim()}>
                            Cập nhật tùy chọn
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
