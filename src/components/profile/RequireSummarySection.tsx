// components/profile/RequireSummarySection.tsx
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
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Film,
    BookOpen
} from 'lucide-react';
import { AppDispatch, RootState } from '@/app/redux/store';
import { toast } from 'sonner';
import { RequireSummary } from '@/app/redux/require-summary/request.require-summary';
import { getMyRequireSummariesThunk, createRequireSummaryThunk, updateRequireSummaryThunk, deleteRequireSummariesThunk } from '@/app/redux/require-summary/thunk.require-summary';


export default function RequireSummarySection() {
    const dispatch = useDispatch<AppDispatch>();
    const { requireSummaries, loading } = useSelector((state: RootState) => state.requireSummary);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterContentType, setFilterContentType] = useState<string>('all');
    const [selectedSummaries, setSelectedSummaries] = useState<string[]>([]);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingSummary, setEditingSummary] = useState<RequireSummary | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        contentType: 'movie' as 'movie' | 'story',
        // movieId: '',
        // storyId: ''
    });

    useEffect(() => {
        dispatch(getMyRequireSummariesThunk({}));
    }, [dispatch]);

    const filteredSummaries = requireSummaries?.filter(summary => {
        const matchesSearch = summary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            summary.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || summary.status === filterStatus;
        const matchesContentType = filterContentType === 'all' || summary.contentType === filterContentType;
        return matchesSearch && matchesStatus && matchesContentType;
    }) || []; const handleCreateSummary = () => {
        const data = {
            title: formData.title,
            description: formData.description,
            contentType: formData.contentType,
            //   ...(formData.contentType === 'movie' ? { movieId: formData.movieId } : { storyId: formData.storyId })
        };

        dispatch(createRequireSummaryThunk(data))
            .unwrap()
            .then(() => {
                setIsCreateDialogOpen(false);
                setFormData({ title: '', description: '', contentType: 'movie' });
                toast.success('Yêu cầu tóm tắt đã được tạo thành công');
            })
            .catch((error) => {
                toast.error(error || 'Không tạo được yêu cầu tóm tắt');
            });
    };

    const handleUpdateSummary = () => {
        if (!editingSummary) return;

        dispatch(updateRequireSummaryThunk({
            id: editingSummary._id,
            data: {
                title: formData.title,
                description: formData.description
            }
        }))
            .unwrap()
            .then(() => {
                setEditingSummary(null);
                setFormData({ title: '', description: '', contentType: 'movie' });
                dispatch(getMyRequireSummariesThunk({}));
                toast.success('Yêu cầu tóm tắt đã được cập nhật thành công');
            })
            .catch((error) => {
                toast.error(error || 'Không cập nhật được yêu cầu tóm tắt');
            });
    };

    const handleDeleteSelected = () => {
        if (selectedSummaries.length === 0) return;

        dispatch(deleteRequireSummariesThunk(selectedSummaries))
            .unwrap()
            .then(() => {
                setSelectedSummaries([]);
                toast.success(`${selectedSummaries.length} yêu cầu tóm tắt đã được xóa thành công`);
            })
            .catch((error) => {
                toast.error(error || 'Không xóa được yêu cầu tóm tắt');
            });
    };

    const handleSelectAll = () => {
        if (selectedSummaries.length === filteredSummaries.length) {
            setSelectedSummaries([]);
        } else {
            setSelectedSummaries(filteredSummaries.map(s => s._id));
        }
    };

    const openEditDialog = (summary: RequireSummary) => {
        setEditingSummary(summary);
        setFormData({
            title: summary.title,
            description: summary.description,
            contentType: summary.contentType,
            //   movieId: summary.movieId || '',
            //   storyId: summary.storyId || ''
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
            case 'approved': return <CheckCircle className="h-4 w-4 text-blue-500" />;
            case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
            default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'approved': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const canEdit = (summary: RequireSummary) => {
        return summary.status === 'pending' || summary.status === 'rejected';
    };

    return (
        <div className="space-y-6">
            {/* Header with Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex flex-1 gap-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Yêu cầu tóm tắt tìm kiếm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-32">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem value="pending">Đang chờ</SelectItem>
                            <SelectItem value="approved">Đã phê duyệt</SelectItem>
                            <SelectItem value="completed">Hoàn thành</SelectItem>
                            <SelectItem value="rejected">Đã từ chối</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filterContentType} onValueChange={setFilterContentType}>
                        <SelectTrigger className="w-32">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả các loại</SelectItem>
                            <SelectItem value="movie">Phim</SelectItem>
                            <SelectItem value="story">Câu chuyện</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-2">
                    {selectedSummaries.length > 0 && (
                        <Button variant="destructive" onClick={handleDeleteSelected}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa ({selectedSummaries.length})
                        </Button>
                    )}

                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Yêu cầu tóm tắt
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Yêu cầu tóm tắt mới</DialogTitle>
                                <DialogDescription>
                                    Yêu cầu tóm tắt cho một bộ phim hoặc câu chuyện từ nhóm quản trị của chúng tôi.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Tiêu đề</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Nhập tiêu đề nội dung"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contentType">Loại nội dung</Label>
                                    <Select
                                        value={formData.contentType}
                                        onValueChange={(value: 'movie' | 'story') =>
                                            setFormData(prev => ({ ...prev, contentType: value }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="movie">
                                                <div className="flex items-center gap-2">
                                                    <Film className="h-4 w-4" />
                                                    Phim
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="story">
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="h-4 w-4" />
                                                    Câu chuyện
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* {formData.contentType === 'movie' && (
                  <div className="space-y-2">
                    <Label htmlFor="movieId">Movie ID (Optional)</Label>
                    <Input
                      id="movieId"
                      value={formData.movieId}
                      onChange={(e) => setFormData(prev => ({ ...prev, movieId: e.target.value }))}
                      placeholder="Enter movie ID if known"
                    />
                  </div>
                )}

                {formData.contentType === 'story' && (
                  <div className="space-y-2">
                    <Label htmlFor="storyId">Story ID (Optional)</Label>
                    <Input
                      id="storyId"
                      value={formData.storyId}
                      onChange={(e) => setFormData(prev => ({ ...prev, storyId: e.target.value }))}
                      placeholder="Enter story ID if known"
                    />
                  </div>
                )} */}

                                <div className="space-y-2">
                                    <Label htmlFor="description">Mô tả</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Mô tả những gì bạn muốn tóm tắt..."
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                    Hủy
                                </Button>
                                <Button onClick={handleCreateSummary} disabled={!formData.title.trim() || !formData.description.trim()}>
                                    Gửi yêu cầu
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Bulk Actions */}
            {filteredSummaries.length > 0 && (
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                    <Checkbox
                        checked={selectedSummaries.length === filteredSummaries.length}
                        onCheckedChange={handleSelectAll}
                    />
                    <span className="text-sm text-muted-foreground">
                        {selectedSummaries.length > 0
                            ? `${selectedSummaries.length} trong số ${filteredSummaries.length} đã chọn`
                            : `Chọn tất cả các yêu cầu ${filteredSummaries.length}`
                        }
                    </span>
                </div>
            )}

            {/* Summary Requests List */}
            {loading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader>
                                <div className="flex justify-between">
                                    <div className="space-y-2">
                                        <div className="h-4 bg-muted rounded w-1/3"></div>
                                        <div className="h-3 bg-muted rounded w-1/4"></div>
                                    </div>
                                    <div className="h-6 bg-muted rounded w-20"></div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-16 bg-muted rounded"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : filteredSummaries.length > 0 ? (
                <div className="space-y-4">
                    {filteredSummaries.map((summary) => (
                        <Card key={summary._id} className="group hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3 flex-1">
                                        <Checkbox
                                            checked={selectedSummaries.includes(summary._id)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedSummaries(prev => [...prev, summary._id]);
                                                } else {
                                                    setSelectedSummaries(prev => prev.filter(id => id !== summary._id));
                                                }
                                            }}
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                {summary.contentType === 'movie' ?
                                                    <Film className="h-4 w-4 text-blue-500" /> :
                                                    <BookOpen className="h-4 w-4 text-green-500" />
                                                }
                                                <CardTitle className="text-lg line-clamp-1">{summary.title}</CardTitle>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge className={`text-xs border ${getStatusColor(summary.status)}`}>
                                                    <div className="flex items-center gap-1">
                                                        {getStatusIcon(summary.status)}
                                                        {summary.status.charAt(0).toUpperCase() + summary.status.slice(1)}
                                                    </div>
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    {summary.contentType}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(summary.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {canEdit(summary) && (
                                                <DropdownMenuItem onClick={() => openEditDialog(summary)}>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Chỉnh sửa
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    dispatch(deleteRequireSummariesThunk([summary._id]))
                                                        .unwrap()
                                                        .then(() => toast.success('Yêu cầu tóm tắt đã xóa thành công'))
                                                        .catch((error) => toast.error(error || 'Không xóa được yêu cầu tóm tắt'));
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
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                    {summary.description}
                                </p>

                                {summary.adminResponse && (
                                    <div className="bg-muted/50 rounded-md p-3 mb-3">
                                        <h4 className="text-sm font-medium mb-1">Admin Phản hồi:</h4>
                                        <p className="text-sm text-muted-foreground">{summary.adminResponse}</p>
                                    </div>
                                )}

                                {summary.summaryContent && (
                                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                                        <h4 className="text-sm font-medium mb-1 text-green-800">Tóm tắt:</h4>
                                        <p className="text-sm text-green-700 line-clamp-3">{summary.summaryContent}</p>
                                        <Button variant="link" size="sm" className="p-0 h-auto text-green-600">
                                            Đọc toàn bộ tóm tắt
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="text-center py-12">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            {searchTerm || filterStatus !== 'all' || filterContentType !== 'all'
                                ? 'Không tìm thấy yêu cầu tóm tắt nào'
                                : 'Chưa có yêu cầu tóm tắt nào'
                            }
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            {searchTerm || filterStatus !== 'all' || filterContentType !== 'all'
                                ? 'Thử điều chỉnh tìm kiếm hoặc bộ lọc của bạn'
                                : 'Yêu cầu tóm tắt phim hoặc truyện từ nhóm quản trị của chúng tôi'
                            }
                        </p>
                        {!searchTerm && filterStatus === 'all' && filterContentType === 'all' && (
                            <Button onClick={() => setIsCreateDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Yêu cầu tóm tắt đầu tiên của bạn
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Edit Dialog */}
            <Dialog open={!!editingSummary} onOpenChange={() => setEditingSummary(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa yêu cầu tóm tắt</DialogTitle>
                        <DialogDescription>
                            Cập nhật thông tin yêu cầu tóm tắt của bạn.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-title">Tiêu đề</Label>
                            <Input
                                id="edit-title"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Nhập tiêu đề nội dung"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Mô tả</Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Mô tả những gì bạn muốn tóm tắt..."
                                rows={3}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingSummary(null)}>
                            Hủy
                        </Button>
                        <Button onClick={handleUpdateSummary} disabled={!formData.title.trim() || !formData.description.trim()}>
                            Yêu cầu cập nhật
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

