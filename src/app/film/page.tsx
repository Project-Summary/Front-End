"use client";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Film, 
  Grid, 
  List, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { RootState } from '@/app/redux/store';
import { getAllFilmsThunk } from '@/app/redux/film/thunk.film';
import { getCategoriesThunk } from '@/app/redux/categories/thunk.categories';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContentGrid from '@/components/content/contentGrid.component';

export default function FilmsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { films, loading } = useSelector((state: RootState) => state.film);
  const { categories } = useSelector((state: RootState) => state.categories);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('releaseDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredFilms, setFilteredFilms] = useState([]);

  useEffect(() => {
    dispatch(getAllFilmsThunk() as any);
    dispatch(getCategoriesThunk() as any);
  }, [dispatch]);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = films?.filter(film => film.status === 'published') || [];
    
    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(film =>
        film.categories?.some(cat => cat._id === selectedCategory)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'releaseDate':
          aValue = new Date(a.releaseDate);
          bValue = new Date(b.releaseDate);
          break;
        case 'rating':
          aValue = a.averageRating || 0;
          bValue = b.averageRating || 0;
          break;
        case 'views':
          aValue = a.statistics?.views || 0;
          bValue = b.statistics?.views || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredFilms(filtered as any);
    setCurrentPage(1); // Reset to first page when filters change
  }, [films, selectedCategory, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredFilms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFilms = filteredFilms.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <Button
        key="prev"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    );

    // First page
    if (startPage > 1) {
      pages.push(
        <Button
          key={1}
          variant={currentPage === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(1)}
        >
          1
        </Button>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="px-2">...</span>);
      }
    }

    // Visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className="px-2">...</span>);
      }
      pages.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    // Next button
    pages.push(
      <Button
        key="next"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    );

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        {pages}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Film className="h-8 w-8" />
              Phim
            </h1>
            <p className="text-muted-foreground mt-1">
              Khám phá những bộ phim tuyệt vời và trải nghiệm điện ảnh
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Thể loại:</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thể loại</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Sắp xếp theo:</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="releaseDate">Ngày phát hành</SelectItem>
                  <SelectItem value="title">Tiêu đề</SelectItem>
                  <SelectItem value="rating">Đánh giá</SelectItem>
                  <SelectItem value="views">Lượt xem</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">↓</SelectItem>
                <SelectItem value="asc">↑</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              Hiện đang hiển thị {startIndex + 1}-{Math.min(endIndex, filteredFilms.length)} của {filteredFilms.length} phim
            </span>
            {selectedCategory !== 'all' && (
              <Badge variant="secondary">
                {categories?.find(c => c._id === selectedCategory)?.name}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải phim...</p>
        </div>
      ) : currentFilms.length > 0 ? (
        <>
          <ContentGrid 
            items={currentFilms} 
            type="film" 
            showActions={isAuthenticated}
            columns={viewMode === 'grid' ? 4 : 2}
          />
          {renderPagination()}
        </>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Film className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Không tìm thấy phim</h3>
            <p className="text-muted-foreground mb-4">
              {selectedCategory !== 'all' 
                ? 'Không tìm thấy phim trong thể loại này' 
                : 'Hiện tại không có phim nào'
              }
            </p>
            {selectedCategory !== 'all' && (
              <Button variant="outline" onClick={() => setSelectedCategory('all')}>
                Hiển thị tất cả phim
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}