import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  ImageIcon, 
  Upload, 
  Search, 
  Camera, 
  Sparkles,
  Image as ImageLucide,
  TrendingUp,
  Filter
} from "lucide-react";
import { cn } from '@/lib/utils';

interface ImageResult {
  id: string;
  urls: {
    regular: string;
    thumb: string;
  };
  alt_description: string;
  user: {
    name: string;
    username: string;
  };
  likes: number;
}

const TRENDING_TOPICS = ['Nature', 'Cats', 'Travel', 'Food', 'Technology', 'Art'];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [images, setImages] = useState<ImageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState('text');

  const searchImages = async (term: string) => {
    if (term.trim()) {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${term}&client_id=YOUR_UNSPLASH_API_KEY`
        );
        const data = await response.json();
        setImages(data.results);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchImages(searchTerm);
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      console.log("File uploaded:", e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#1a1a1a]">
      <div className="absolute inset-0 bg-grid-neutral-900/[0.02] dark:bg-grid-white/[0.02] -z-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-100/50 via-neutral-100/25 to-neutral-50/10 dark:from-neutral-900/50 dark:via-neutral-900/25 dark:to-neutral-900/10 -z-10" />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="inline-block p-4 rounded-2xl bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50 shadow-xl">
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="h-10 w-10 text-neutral-800 dark:text-neutral-200" />
                <h1 className="text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neutral-950 via-neutral-800 to-neutral-700 dark:from-neutral-50 dark:via-neutral-200 dark:to-neutral-300">
                  Find-de-Pic
                </h1>
              </div>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Discover millions of stunning images through text search or find visually similar images by uploading your own
            </p>
          </div>

          {/* Main Search */}
          <Card className="p-8 shadow-2xl border border-neutral-200/50 dark:border-neutral-800/50 bg-white/80 dark:bg-black/50 backdrop-blur-sm">
            <Tabs defaultValue="text" className="space-y-8" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto bg-neutral-100 dark:bg-neutral-900">
                <TabsTrigger value="text" className="space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800">
                  <Search className="h-4 w-4" />
                  <span>Text Search</span>
                </TabsTrigger>
                <TabsTrigger value="image" className="space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800">
                  <Camera className="h-4 w-4" />
                  <span>Image Search</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-6">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search images..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
                    />
                  </div>
                  <Button 
                    onClick={() => searchImages(searchTerm)}
                    className="bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900"
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </div>

                {/* Trending */}
                <div className="space-y-3 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900/50">
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <TrendingUp className="h-4 w-4" />
                    <span>Trending Topics</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_TOPICS.map((topic) => (
                      <Badge
                        key={topic}
                        variant="secondary"
                        className="cursor-pointer bg-white hover:bg-neutral-900 hover:text-white dark:bg-neutral-800 dark:hover:bg-neutral-100 dark:hover:text-neutral-900 transition-colors"
                        onClick={() => setSearchTerm(topic)}
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="image" className="space-y-4">
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-12 text-center transition-all",
                    dragActive ? "border-neutral-900 bg-neutral-900/5 scale-[0.99] dark:border-neutral-100 dark:bg-neutral-100/5" : "border-neutral-300 dark:border-neutral-700",
                    "hover:border-neutral-900/50 hover:bg-neutral-900/5 dark:hover:border-neutral-100/50 dark:hover:bg-neutral-100/5"
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-neutral-100 dark:bg-neutral-900">
                      <Upload className="h-10 w-10 text-neutral-900 dark:text-neutral-100" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                        Drag and drop an image, or click to upload
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        Supports JPG, PNG and GIF files
                      </p>
                    </div>
                    <Button size="lg" className="mt-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900">
                      Choose File
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Results Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white/80 dark:bg-black/50 backdrop-blur-sm p-4 rounded-lg border border-neutral-200/50 dark:border-neutral-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-900">
                  <ImageLucide className="h-5 w-5 text-neutral-900 dark:text-neutral-100" />
                </div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {activeTab === 'text' ? 'Search Results' : 'Similar Images'}
                </h2>
              </div>
              <Button variant="outline" size="sm" className="border-neutral-300 dark:border-neutral-700">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
            <ScrollArea className="h-[600px] rounded-xl border border-neutral-200/50 dark:border-neutral-800/50 bg-white/80 dark:bg-black/50 backdrop-blur-sm shadow-xl">
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="aspect-square animate-pulse bg-neutral-100 dark:bg-neutral-900" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                  {images.length > 0 ? (
                    images.map((image) => (
                      <Card key={image.id} className="group relative overflow-hidden rounded-lg border-neutral-200/50 dark:border-neutral-800/50 shadow-lg">
                        <img
                          src={image.urls.regular}
                          alt={image.alt_description}
                          className="object-cover w-full h-full aspect-square transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                            <p className="text-white font-medium truncate">{image.user.name}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="bg-white/20 text-white">
                                {image.likes} likes
                              </Badge>
                              <Badge variant="secondary" className="bg-white/20 text-white">
                                @{image.user.username}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 text-neutral-600 dark:text-neutral-400">
                      {activeTab === 'text' ? (
                        <p>Start typing to search for images</p>
                      ) : (
                        <p>Upload an image to find similar ones</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
