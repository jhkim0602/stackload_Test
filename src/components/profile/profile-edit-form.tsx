"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { SocialLinksManager } from "./social-links-manager";
import { TechStackManager } from "./tech-stack-manager";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  level?: string;
  location?: string;
  github?: string;
  discord?: string;
  contactEmail?: string;
  techStack: Array<{ name: string; category?: string; level?: number; }>;
  interests?: string[];
}

interface ProfileEditFormProps {
  userProfile: UserProfile;
  onSave: (data: {
    bio: string;
    level: string;
    location: string;
    github: string;
    discord: string;
    contactEmail: string;
    twitter: string;
    linkedin: string;
    instagram: string;
    website: string;
    techStack: Array<{ name: string; category?: string; level?: number; }>;
  }) => Promise<void>;
  onCancel: () => void;
}

const levelOptions = [
  { value: "Beginner", label: "초급자", color: "bg-gray-100 text-gray-700", description: "개발을 시작한 지 1년 미만" },
  { value: "Junior", label: "주니어", color: "bg-blue-100 text-blue-700", description: "1-3년차 개발자" },
  { value: "Mid-Level", label: "중급자", color: "bg-green-100 text-green-700", description: "3-7년차 개발자" },
  { value: "Senior", label: "시니어", color: "bg-purple-100 text-purple-700", description: "7년 이상 경력" },
  { value: "Expert", label: "전문가", color: "bg-orange-100 text-orange-700", description: "특정 분야 전문가" },
  { value: "Student", label: "학생", color: "bg-pink-100 text-pink-700", description: "현재 학습 중" }
];

export function ProfileEditForm({ userProfile, onSave, onCancel }: ProfileEditFormProps) {
  const [bio, setBio] = useState(userProfile.bio || '');
  const [location, setLocation] = useState(userProfile.location || '');
  const [selectedLevel, setSelectedLevel] = useState(userProfile.level || 'Beginner');
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({
    github: userProfile.github || '',
    discord: userProfile.discord || '',
    email: userProfile.contactEmail || userProfile.email || ''
  });
  const [techStack, setTechStack] = useState(userProfile.techStack || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      await onSave({
        bio,
        level: selectedLevel,
        location,
        github: socialLinks.github || '',
        discord: socialLinks.discord || '',
        contactEmail: socialLinks.email || '',
        twitter: socialLinks.twitter || '',
        linkedin: socialLinks.linkedin || '',
        instagram: socialLinks.instagram || '',
        website: socialLinks.website || '',
        techStack: techStack
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setBio(userProfile.bio || '');
    setLocation(userProfile.location || '');
    setSelectedLevel(userProfile.level || 'Beginner');
    setSocialLinks({
      github: userProfile.github || '',
      discord: userProfile.discord || '',
      email: userProfile.contactEmail || userProfile.email || ''
    });
    setTechStack(userProfile.techStack || []);
    onCancel();
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">기본 정보</h3>
        
        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">소개</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            placeholder="자신을 소개해보세요..."
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">위치</label>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="위치를 입력하세요"
            />
          </div>
        </div>

        {/* Level Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">경험 수준</label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {levelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Level Guide */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">레벨 선택 가이드</h4>
        <div className="space-y-2">
          {levelOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedLevel(option.value)}
              className={`w-full text-left p-3 rounded-lg text-sm transition-all duration-200 hover:shadow-md ${
                selectedLevel === option.value 
                  ? 'bg-blue-100 border-2 border-blue-400 shadow-md transform scale-[1.02]' 
                  : 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-gray-900">{option.label}</span>
                  <span className="text-gray-600 ml-2">- {option.description}</span>
                </div>
                <div className={`w-3 h-3 rounded-full border-2 ${
                  selectedLevel === option.value
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedLevel === option.value && (
                    <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-blue-700 mt-3">
          💡 위 옵션을 클릭하여 본인의 경험 수준에 맞는 레벨을 선택하세요.
        </p>
      </div>

      {/* Social Links */}
      <div>
        <SocialLinksManager
          initialLinks={socialLinks}
          onLinksChange={setSocialLinks}
          isEditing={true}
        />
      </div>

      {/* Tech Stack */}
      <div>
        <TechStackManager
          userTechStack={techStack}
          onTechStackChange={setTechStack}
          isEditing={true}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t">
        <Button 
          onClick={handleSave}
          disabled={isSubmitting}
          variant="default"
        >
          {isSubmitting ? '저장 중...' : '저장'}
        </Button>
        <Button 
          onClick={handleCancel}
          disabled={isSubmitting}
          variant="outline"
        >
          취소
        </Button>
      </div>
    </div>
  );
}