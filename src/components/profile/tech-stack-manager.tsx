"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, X, Star, TrendingUp } from "lucide-react";

interface TechSkill {
  name: string;
  category?: string;
  level?: number;
}

interface Tech {
  name: string;
  category: string;
  logoUrl?: string;
  isPopular?: boolean;
}

interface TechStackManagerProps {
  userTechStack: TechSkill[];
  onTechStackChange: (techStack: TechSkill[]) => void;
  isEditing: boolean;
}

export function TechStackManager({ userTechStack, onTechStackChange, isEditing }: TechStackManagerProps) {
  const [techStack, setTechStack] = useState<TechSkill[]>(userTechStack);
  const [availableTechs, setAvailableTechs] = useState<Tech[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch available technologies
  useEffect(() => {
    const fetchTechs = async () => {
      try {
        const response = await fetch('/api/techs');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setAvailableTechs(data.data);
          }
        }
      } catch (error) {
        console.error('기술 목록 조회 실패:', error);
      }
    };

    if (isEditing) {
      fetchTechs();
    }
  }, [isEditing]);

  const categories = [
    { value: 'all', label: '전체' },
    { value: 'frontend', label: '프론트엔드' },
    { value: 'backend', label: '백엔드' },
    { value: 'database', label: '데이터베이스' },
    { value: 'devops', label: 'DevOps' },
    { value: 'mobile', label: '모바일' },
    { value: 'ai', label: 'AI/ML' },
    { value: 'other', label: '기타' }
  ];

  const updateTechLevel = (index: number, level: number) => {
    const newTechStack = [...techStack];
    newTechStack[index] = { ...newTechStack[index], level };
    setTechStack(newTechStack);
    onTechStackChange(newTechStack);
  };

  const removeTech = (index: number) => {
    const newTechStack = techStack.filter((_, i) => i !== index);
    setTechStack(newTechStack);
    onTechStackChange(newTechStack);
  };

  const addTech = (tech: Tech) => {
    const existingTech = techStack.find(t => t.name === tech.name);
    if (existingTech) return;

    const newTech: TechSkill = {
      name: tech.name,
      category: tech.category,
      level: 3 // Default level
    };

    const newTechStack = [...techStack, newTech];
    setTechStack(newTechStack);
    onTechStackChange(newTechStack);
    setShowAddDialog(false);
    setSearchTerm('');
  };

  const getFilteredTechs = () => {
    let filtered = availableTechs;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tech => tech.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(tech => 
        tech.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Exclude already added techs
    const addedTechNames = techStack.map(t => t.name);
    filtered = filtered.filter(tech => !addedTechNames.includes(tech.name));

    return filtered;
  };

  const getLevelColor = (level: number) => {
    if (level >= 5) return "bg-purple-500";
    if (level >= 4) return "bg-green-500";
    if (level >= 3) return "bg-blue-500";
    if (level >= 2) return "bg-yellow-500";
    return "bg-gray-400";
  };

  const getLevelLabel = (level: number) => {
    const labels = ['', '입문', '초급', '중급', '고급', '전문가'];
    return labels[level] || '미설정';
  };

  if (!isEditing) {
    // View mode - display tech stack
    return (
      <div className="flex flex-wrap gap-3">
        {techStack.length > 0 ? (
          techStack.map((tech, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm font-medium rounded-lg border border-blue-200 transition-colors"
            >
              <span>{tech.name}</span>
              {tech.level && (
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= tech.level! 
                            ? 'fill-current text-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-blue-600">({tech.level}/5)</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 py-4">아직 기술 스택이 설정되지 않았습니다.</p>
        )}
      </div>
    );
  }

  // Edit mode - show management interface
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-800">기술 스택 관리</h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowAddDialog(!showAddDialog)}
        >
          <Plus className="w-4 h-4 mr-1" />
          기술 추가
        </Button>
      </div>

      {/* Add Tech Dialog */}
      {showAddDialog && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h5 className="font-medium text-blue-900 mb-3">기술 스택 추가</h5>
          
          {/* Search and Category Filter */}
          <div className="space-y-3 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="기술 이름으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    selectedCategory === category.value
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Available Techs */}
          <div className="max-h-60 overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {getFilteredTechs().slice(0, 24).map((tech) => (
                <button
                  key={tech.name}
                  type="button"
                  onClick={() => addTech(tech)}
                  className="flex items-center gap-2 p-2 text-left bg-white hover:bg-blue-100 rounded border border-gray-300 hover:border-blue-400 transition-colors text-sm"
                >
                  {tech.logoUrl && (
                    <img 
                      src={tech.logoUrl} 
                      alt={tech.name}
                      className="w-4 h-4 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <span className="truncate">{tech.name}</span>
                  {tech.isPopular && <TrendingUp className="w-3 h-3 text-orange-500" />}
                </button>
              ))}
            </div>
            
            {getFilteredTechs().length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                검색 결과가 없습니다.
              </p>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowAddDialog(false);
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="mt-3"
          >
            닫기
          </Button>
        </div>
      )}

      {/* Current Tech Stack */}
      <div className="space-y-3">
        {techStack && techStack.length > 0 ? techStack.map((tech, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-gray-900">{tech.name}</span>
                {tech.category && (
                  <Badge variant="secondary" className="text-xs">
                    {categories.find(c => c.value === tech.category)?.label || tech.category}
                  </Badge>
                )}
              </div>
              
              {/* Skill Level Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 min-w-0 w-12">숙련도:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => updateTechLevel(index, level)}
                      className={`p-1 rounded ${
                        (tech.level || 0) >= level 
                          ? 'text-yellow-400 hover:text-yellow-500' 
                          : 'text-gray-300 hover:text-gray-400'
                      }`}
                    >
                      <Star 
                        className={`w-4 h-4 ${
                          (tech.level || 0) >= level ? 'fill-current' : ''
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-gray-600 ml-2">
                    {getLevelLabel(tech.level || 0)}
                  </span>
                </div>
              </div>
            </div>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeTech(index)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )) : (
          <div className="text-center py-6 text-gray-500">
            <p className="text-sm">아직 추가된 기술 스택이 없습니다.</p>
            <p className="text-xs">위의 "기술 추가" 버튼을 클릭하여 기술 스택을 추가해보세요.</p>
          </div>
        )}
      </div>

    </div>
  );
}