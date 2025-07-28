import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface Video {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  previewFrames: string[];
  views: number;
  duration: string;
  category: string;
  uploadDate: string;
}

interface Category {
  name: string;
  count: number;
  color: string;
}

const Index = () => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [popularPage, setPopularPage] = useState(1);
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);
  const [currentFrame, setCurrentFrame] = useState<{ [key: number]: number }>({});
  const videosPerPage = 9;
  const popularVideosPerPage = 6;

  const categories: Category[] = [
    { name: 'Технологии', count: 245, color: 'bg-gradient-to-r from-coral to-warm-yellow' },
    { name: 'Развлечения', count: 892, color: 'bg-gradient-to-r from-turquoise to-sky-blue' },
    { name: 'Образование', count: 156, color: 'bg-gradient-to-r from-lavender to-coral' },
    { name: 'Музыка', count: 678, color: 'bg-gradient-to-r from-warm-yellow to-turquoise' },
    { name: 'Спорт', count: 423, color: 'bg-gradient-to-r from-sky-blue to-lavender' },
    { name: 'Игры', count: 334, color: 'bg-gradient-to-r from-coral to-turquoise' },
    { name: 'Кулинария', count: 287, color: 'bg-gradient-to-r from-lavender to-warm-yellow' },
    { name: 'Путешествия', count: 198, color: 'bg-gradient-to-r from-turquoise to-coral' },
    { name: 'Мода', count: 156, color: 'bg-gradient-to-r from-warm-yellow to-sky-blue' },
    { name: 'Наука', count: 89, color: 'bg-gradient-to-r from-sky-blue to-coral' },
  ];

  const thumbnails = [
    '/img/7a792cdf-802d-4156-9955-28e614df14db.jpg',
    '/img/cfc879f1-a93b-4e09-8ab0-c0f152073b3b.jpg',
    '/img/efede1ce-79fc-4ae5-afe3-5645455af641.jpg'
  ];

  const videoTitles = [
    'Искусственный интеллект в 2024: Революция или эволюция?',
    'Топ-10 трендов в веб-разработке',
    'Как создать стартап с нуля: Практический гайд',
    'Кибербезопасность для начинающих',
    'Будущее блокчейн технологий',
    'React vs Vue: Детальное сравнение',
    'Дизайн мышление в IT проектах',
    'Карьера в технологиях: Советы экспертов',
    'Машинное обучение простыми словами'
  ];

  const mockVideos: Video[] = Array.from({ length: 27 }, (_, i) => ({
    id: i + 1,
    title: videoTitles[i % videoTitles.length] || `Интересное видео ${i + 1}`,
    description: `В этом увлекательном видео мы подробно разбираем актуальные темы современных технологий. Вы узнаете практические советы от экспертов индустрии и сможете применить полученные знания в своих проектах.`,
    thumbnail: thumbnails[i % thumbnails.length],
    previewFrames: [
      thumbnails[i % thumbnails.length],
      thumbnails[(i + 1) % thumbnails.length],
      thumbnails[(i + 2) % thumbnails.length]
    ],
    views: Math.floor(Math.random() * 100000) + 1000,
    duration: `${Math.floor(Math.random() * 10) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    category: categories[Math.floor(Math.random() * categories.length)].name,
    uploadDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
  }));

  const popularVideos = [...mockVideos]
    .sort((a, b) => b.views - a.views)
    .slice(0, 18);

  const latestVideos = [...mockVideos]
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());

  const getCurrentVideos = () => {
    const startIndex = (currentPage - 1) * videosPerPage;
    return latestVideos.slice(startIndex, startIndex + videosPerPage);
  };

  const getPopularVideos = () => {
    const startIndex = (popularPage - 1) * popularVideosPerPage;
    return popularVideos.slice(startIndex, startIndex + popularVideosPerPage);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (hoveredVideo) {
      interval = setInterval(() => {
        setCurrentFrame(prev => ({
          ...prev,
          [hoveredVideo]: ((prev[hoveredVideo] || 0) + 1) % 3
        }));
      }, 800);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [hoveredVideo]);

  const VideoCard = ({ video, showViews = true }: { video: Video; showViews?: boolean }) => {
    const isHovered = hoveredVideo === video.id;
    const frameIndex = currentFrame[video.id] || 0;
    const currentImage = isHovered ? video.previewFrames[frameIndex] : video.thumbnail;

    return (
      <Card 
        className="group cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg bg-white/80 backdrop-blur-sm border-0 shadow-md"
        onMouseEnter={() => {
          setHoveredVideo(video.id);
          setCurrentFrame(prev => ({ ...prev, [video.id]: 0 }));
        }}
        onMouseLeave={() => {
          setHoveredVideo(null);
          setCurrentFrame(prev => ({ ...prev, [video.id]: 0 }));
        }}
      >
        <div className="relative overflow-hidden">
          <img 
            src={currentImage}
            alt={video.title}
            className="w-full h-48 object-cover transition-all duration-300 group-hover:scale-110"
          />
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
            {video.duration}
          </div>
          {isHovered && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center animate-fade-in">
              <Button size="lg" className="bg-white/90 text-black hover:bg-white">
                <Icon name="Play" size={24} />
              </Button>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-coral transition-colors">
            {video.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {video.description}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            {showViews && (
              <span className="flex items-center gap-1">
                <Icon name="Eye" size={16} />
                {video.views.toLocaleString()} просмотров
              </span>
            )}
            <span>{video.uploadDate}</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-blue/20 via-turquoise/10 to-lavender/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-coral via-turquoise to-lavender bg-clip-text text-transparent">
              VideoHost
            </h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Icon name="Search" size={20} />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon name="Upload" size={20} />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon name="User" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 space-y-12">
        {/* Categories Section */}
        <section className="animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Категории</h2>
            <Button 
              variant="outline" 
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="bg-white/80 hover:bg-coral hover:text-white transition-all duration-300"
            >
              {showAllCategories ? 'Скрыть' : 'Раскрыть все категории'}
              <Icon name={showAllCategories ? "ChevronUp" : "ChevronDown"} size={16} />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {(showAllCategories ? categories : categories.slice(0, 5)).map((category, index) => (
              <Card 
                key={category.name}
                className={`${category.color} text-white cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-0 animate-scale-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.count} видео</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Latest Videos Section */}
        <section className="animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Последние видео</h2>
          
          {/* Top Pagination */}
          <div className="mb-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {[1, 2, 3].map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
                    className={currentPage === 3 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {getCurrentVideos().map((video, index) => (
              <div 
                key={video.id} 
                className="animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <VideoCard video={video} />
              </div>
            ))}
          </div>

          {/* Bottom Pagination */}
          <div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {[1, 2, 3].map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
                    className={currentPage === 3 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </section>

        {/* Popular Videos Section */}
        <section className="animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Популярные видео</h2>
          
          {/* Top Pagination */}
          <div className="mb-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setPopularPage(Math.max(1, popularPage - 1))}
                    className={popularPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {[1, 2, 3].map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      onClick={() => setPopularPage(page)}
                      isActive={popularPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setPopularPage(Math.min(3, popularPage + 1))}
                    className={popularPage === 3 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {getPopularVideos().map((video, index) => (
              <div 
                key={video.id} 
                className="animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <VideoCard video={video} showViews={true} />
              </div>
            ))}
          </div>

          {/* Bottom Pagination */}
          <div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setPopularPage(Math.max(1, popularPage - 1))}
                    className={popularPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {[1, 2, 3].map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      onClick={() => setPopularPage(page)}
                      isActive={popularPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setPopularPage(Math.min(3, popularPage + 1))}
                    className={popularPage === 3 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;