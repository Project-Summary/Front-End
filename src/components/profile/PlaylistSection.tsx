// components/profile/PlaylistSection.tsx
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
import { Separator } from '@/components/ui/separator';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  List,
  Eye,
  Heart,
  Clock
} from 'lucide-react';
import { AppDispatch, RootState } from '@/app/redux/store';
import { toast } from 'sonner';
import {
  getMyPlaylistsThunk,
  createPlaylistThunk,
  updatePlaylistThunk,
  deletePlaylistThunk,
  addItemToPlaylistThunk,
  removeFromPlaylistThunk
} from '@/app/redux/playlist/thunk.playlist';
import { Playlist } from '@/app/redux/playlist/interface.playlist';

export default function PlaylistSection() {
  const dispatch = useDispatch<AppDispatch>();
  const { playlists, loading } = useSelector((state: RootState) => state.playlist);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false
  });

  useEffect(() => {
    dispatch(getMyPlaylistsThunk());
  }, [dispatch]);

  const filteredPlaylists = playlists?.filter(playlist => {
    const matchesSearch = playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      playlist.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'public' && playlist.isPublic) ||
      (filterStatus === 'private' && !playlist.isPublic);
    return matchesSearch && matchesFilter;
  }) || [];

  const handleCreatePlaylist = () => {
    dispatch(createPlaylistThunk({
      data: { ...formData },
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setFormData({ name: '', description: '', isPublic: false });
        toast.success('Danh sách phát đã được tạo thành công');
      }
    }));
  };

  const handleUpdatePlaylist = () => {
    if (!editingPlaylist) return;

    dispatch(updatePlaylistThunk({
      id: editingPlaylist._id,
      data: formData,
      onSuccess: () => {
        setEditingPlaylist(null);
        setFormData({ name: '', description: '', isPublic: false });
        dispatch(getMyPlaylistsThunk());
        toast.success('Danh sách phát đã được cập nhật thành công');
      }
    }));
  };

  const handleDeleteSelected = () => {
    if (selectedPlaylists.length === 0) return;

    const deletePromises = selectedPlaylists.map(id =>
      dispatch(deletePlaylistThunk({ id }))
    );

    Promise.all(deletePromises).then(() => {
      setSelectedPlaylists([]);
      toast.success(`${selectedPlaylists.length} danh sách phát đã được xóa thành công`);
    });
  };

  const handleSelectAll = () => {
    if (selectedPlaylists.length === filteredPlaylists.length) {
      setSelectedPlaylists([]);
    } else {
      setSelectedPlaylists(filteredPlaylists.map(p => p._id));
    }
  };

  const openEditDialog = (playlist: Playlist) => {
    setEditingPlaylist(playlist);
    setFormData({
      name: playlist.name,
      description: playlist.description,
      isPublic: playlist.isPublic
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search playlists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="public">Công khai</SelectItem>
              <SelectItem value="private">Riêng tư</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          {selectedPlaylists.length > 0 && (
            <Button variant="destructive" onClick={handleDeleteSelected}>
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa ({selectedPlaylists.length})
            </Button>
          )}

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tạo danh sách phát
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tạo danh sách phát mới</DialogTitle>
                <DialogDescription>
                  Tạo danh sách phát mới để sắp xếp nội dung yêu thích của bạn.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}

                    placeholder="Nhập tên danh sách phát"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Nhập mô tả danh sách phát"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPublic"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, isPublic: checked as boolean }))
                    }
                  />
                  <Label htmlFor="isPublic">Công khai danh sách phát này</Label>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleCreatePlaylist} disabled={!formData.name.trim()}>
                  Tạo danh sách phát
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Bulk Actions */}
      {filteredPlaylists.length > 0 && (
        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
          <Checkbox
            checked={selectedPlaylists.length === filteredPlaylists.length}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-muted-foreground">
            {selectedPlaylists.length > 0
              ? `${selectedPlaylists.length} trong số ${filteredPlaylists.length} đã chọn`
              : `Chọn tất cả ${filteredPlaylists.length} danh sách phát`
            }
          </span>
        </div>
      )}

      {/* Playlists Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPlaylists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaylists.map((playlist) => (
            <Card key={playlist._id} className="group hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedPlaylists.includes(playlist._id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedPlaylists(prev => [...prev, playlist._id]);
                        } else {
                          setSelectedPlaylists(prev => prev.filter(id => id !== playlist._id));
                        }
                      }}
                    />
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{playlist.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={playlist.isPublic ? "default" : "secondary"} className="text-xs">
                          {playlist.isPublic ? 'Công khai' : 'Riêng tư'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {playlist.items?.length || 0} mục
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
                      <DropdownMenuItem onClick={() => openEditDialog(playlist)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          dispatch(deletePlaylistThunk({
                            id: playlist._id,
                            onSuccess: () => toast.success('Đã xóa danh sách phát thành công')
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
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {playlist.description || 'Không có mô tả'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3"
                  asChild
                >
                  <a href={`/playlists/${playlist._id}`}>
                    <List className="h-4 w-4 mr-2" />
                    Xem danh sách phát
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <List className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm || filterStatus !== 'all' ? 'Không tìm thấy danh sách phát nào' : 'Chưa có danh sách phát nào'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterStatus !== 'all'
                ? 'Thử điều chỉnh tìm kiếm hoặc bộ lọc của bạn'
                : 'Tạo danh sách phát đầu tiên của bạn để sắp xếp nội dung yêu thích của bạn'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo danh sách phát đầu tiên của bạn
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingPlaylist} onOpenChange={() => setEditingPlaylist(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa danh sách phát</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin danh sách phát của bạn.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nhập tên danh sách phát"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Nhập mô tả danh sách phát"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-isPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({ ...prev, isPublic: checked as boolean }))
                }
              />
              <Label htmlFor="edit-isPublic">Công khai danh sách phát này</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPlaylist(null)}>
              Hủy
            </Button>
            <Button onClick={handleUpdatePlaylist} disabled={!formData.name.trim()}>
              Cập nhật danh sách phát
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
