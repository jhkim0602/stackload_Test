"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Github, Mail, MessageCircle, Twitter, Linkedin, Instagram, Globe, Plus, X } from "lucide-react";

interface SocialLink {
  type: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  placeholder: string;
  validation?: (value: string) => boolean;
}

const socialLinkTypes = [
  {
    type: 'github',
    label: 'GitHub',
    icon: <Github className="w-4 h-4" />,
    placeholder: 'https://github.com/username',
    validation: (value: string) => value.includes('github.com')
  },
  {
    type: 'twitter',
    label: 'Twitter',
    icon: <Twitter className="w-4 h-4" />,
    placeholder: 'https://twitter.com/username',
    validation: (value: string) => value.includes('twitter.com') || value.includes('x.com')
  },
  {
    type: 'linkedin',
    label: 'LinkedIn',
    icon: <Linkedin className="w-4 h-4" />,
    placeholder: 'https://linkedin.com/in/username',
    validation: (value: string) => value.includes('linkedin.com')
  },
  {
    type: 'instagram',
    label: 'Instagram',
    icon: <Instagram className="w-4 h-4" />,
    placeholder: 'https://instagram.com/username',
    validation: (value: string) => value.includes('instagram.com')
  },
  {
    type: 'discord',
    label: 'Discord',
    icon: <MessageCircle className="w-4 h-4" />,
    placeholder: 'username#1234',
    validation: (value: string) => value.includes('#') || value.length > 3
  },
  {
    type: 'email',
    label: '이메일',
    icon: <Mail className="w-4 h-4" />,
    placeholder: 'your@email.com',
    validation: (value: string) => value.includes('@')
  },
  {
    type: 'website',
    label: '개인 웹사이트',
    icon: <Globe className="w-4 h-4" />,
    placeholder: 'https://yourwebsite.com',
    validation: (value: string) => value.includes('http')
  }
];

interface SocialLinksManagerProps {
  initialLinks: Record<string, string>;
  onLinksChange: (links: Record<string, string>) => void;
  isEditing: boolean;
}

export function SocialLinksManager({ initialLinks, onLinksChange, isEditing }: SocialLinksManagerProps) {
  const [links, setLinks] = useState<SocialLink[]>(() => {
    const existingLinks: SocialLink[] = [];
    
    // Convert existing links to SocialLink objects
    Object.entries(initialLinks).forEach(([type, value]) => {
      if (value) {
        const linkType = socialLinkTypes.find(lt => lt.type === type);
        if (linkType) {
          existingLinks.push({
            type,
            label: linkType.label,
            value,
            icon: linkType.icon,
            placeholder: linkType.placeholder,
            validation: linkType.validation
          });
        }
      }
    });
    
    return existingLinks;
  });

  const [showAddDialog, setShowAddDialog] = useState(false);

  const updateLink = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], value };
    setLinks(newLinks);
    
    // Convert back to Record<string, string> format
    const linksObject: Record<string, string> = {};
    newLinks.forEach(link => {
      if (link.value) {
        linksObject[link.type] = link.value;
      }
    });
    onLinksChange(linksObject);
  };

  const removeLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
    
    const linksObject: Record<string, string> = {};
    newLinks.forEach(link => {
      if (link.value) {
        linksObject[link.type] = link.value;
      }
    });
    onLinksChange(linksObject);
  };

  const addLink = (linkType: typeof socialLinkTypes[0]) => {
    const newLink: SocialLink = {
      type: linkType.type,
      label: linkType.label,
      value: '',
      icon: linkType.icon,
      placeholder: linkType.placeholder,
      validation: linkType.validation
    };
    
    setLinks([...links, newLink]);
    setShowAddDialog(false);
  };

  const getAvailableLinkTypes = () => {
    const usedTypes = links.map(link => link.type);
    return socialLinkTypes.filter(type => !usedTypes.includes(type.type));
  };

  const isValidLink = (link: SocialLink) => {
    if (!link.value) return true;
    return link.validation ? link.validation(link.value) : true;
  };

  if (!isEditing) {
    // View mode - display links
    return (
      <div className="flex flex-wrap items-center gap-3">
        {links.filter(link => link.value).map((link, index) => {
          const isEmail = link.type === 'email';
          const href = isEmail ? `mailto:${link.value}` : link.value;
          
          return (
            <a
              key={index}
              href={href}
              target={isEmail ? undefined : "_blank"}
              rel={isEmail ? undefined : "noopener noreferrer"}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {link.icon}
              <span className="text-sm">{link.label}</span>
            </a>
          );
        })}
      </div>
    );
  }

  // Edit mode - show management interface
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-800">소셜 링크 관리</h4>
        {getAvailableLinkTypes().length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAddDialog(!showAddDialog)}
          >
            <Plus className="w-4 h-4 mr-1" />
            링크 추가
          </Button>
        )}
      </div>

      {/* Add Link Dialog */}
      {showAddDialog && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h5 className="font-medium text-blue-900 mb-3">추가할 소셜 링크 선택</h5>
          <div className="grid grid-cols-2 gap-2">
            {getAvailableLinkTypes().map((linkType) => (
              <button
                key={linkType.type}
                type="button"
                onClick={() => addLink(linkType)}
                className="flex items-center gap-2 p-2 text-left bg-white hover:bg-blue-100 rounded border border-blue-300 hover:border-blue-400 transition-colors"
              >
                {linkType.icon}
                <span className="text-sm">{linkType.label}</span>
              </button>
            ))}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowAddDialog(false)}
            className="mt-2"
          >
            취소
          </Button>
        </div>
      )}

      {/* Current Links */}
      <div className="space-y-3">
        {links.map((link, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {link.icon}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {link.label}
                </label>
                <input
                  type={link.type === 'email' ? 'email' : 'url'}
                  value={link.value}
                  onChange={(e) => updateLink(index, e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                    !isValidLink(link) 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                  placeholder={link.placeholder}
                />
                {!isValidLink(link) && (
                  <p className="text-xs text-red-600 mt-1">
                    올바른 {link.label} 형식을 입력해주세요
                  </p>
                )}
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeLink(index)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {links.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          <p className="text-sm">아직 추가된 소셜 링크가 없습니다.</p>
          <p className="text-xs">위의 "링크 추가" 버튼을 클릭하여 소셜 링크를 추가해보세요.</p>
        </div>
      )}
    </div>
  );
}