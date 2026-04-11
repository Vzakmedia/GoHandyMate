
import { expandedServiceCategories } from '@/data/expandedServiceCategories';

export interface SkillCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  skillKeywords: string[];
}

export const useSkillCategories = () => {
  const getSkillCategories = (): SkillCategory[] => {
    return expandedServiceCategories.map(category => ({
      id: category.id,
      name: category.name,
      icon: category.icon,
      color: category.color,
      description: category.description,
      skillKeywords: category.skillKeywords
    }));
  };

  const getSkillCategoryById = (id: string): SkillCategory | null => {
    const category = expandedServiceCategories.find(cat => cat.id === id);
    if (!category) return null;
    
    return {
      id: category.id,
      name: category.name,
      icon: category.icon,
      color: category.color,
      description: category.description,
      skillKeywords: category.skillKeywords
    };
  };

  const getSkillCategoryByName = (name: string): SkillCategory | null => {
    const category = expandedServiceCategories.find(cat => cat.name === name);
    if (!category) return null;
    
    return {
      id: category.id,
      name: category.name,
      icon: category.icon,
      color: category.color,
      description: category.description,
      skillKeywords: category.skillKeywords
    };
  };

  const searchSkillCategories = (searchTerm: string): SkillCategory[] => {
    if (!searchTerm.trim()) return getSkillCategories();
    
    const term = searchTerm.toLowerCase();
    return expandedServiceCategories
      .filter(category => 
        category.name.toLowerCase().includes(term) ||
        category.description.toLowerCase().includes(term) ||
        category.skillKeywords.some(keyword => keyword.toLowerCase().includes(term))
      )
      .map(category => ({
        id: category.id,
        name: category.name,
        icon: category.icon,
        color: category.color,
        description: category.description,
        skillKeywords: category.skillKeywords
      }));
  };

  return {
    getSkillCategories,
    getSkillCategoryById,
    getSkillCategoryByName,
    searchSkillCategories
  };
};
