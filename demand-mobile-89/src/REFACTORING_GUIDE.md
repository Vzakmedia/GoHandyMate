# App Refactoring Guide

## Overview
This document outlines the ongoing refactoring to improve code organization and maintainability.

## New Structure

### ✅ Completed Migrations

#### 1. Features Directory
- **Auth**: `/src/features/auth/` - Authentication and authorization
  - ✅ Types: `types.ts`
  - ✅ Hooks: `hooks/useAuth.tsx`
  - ✅ Components: `components/AuthProvider.tsx`
  - ⏳ TODO: Migrate LoginForm, SignUpForm, ProtectedRoute

#### 2. Shared Components
- **UI**: `/src/shared/components/ui/` - Centralized UI component exports
- **Layout**: `/src/shared/components/layout/` - Layout components
- **Types**: `/src/shared/types/` - Shared TypeScript interfaces
- **Utils**: `/src/shared/utils/` - Utility functions

### 🔄 In Progress

#### 3. Jobs Feature
- **Structure**: `/src/features/jobs/`
  - ✅ Types: `types.ts`
  - ✅ Hooks: `hooks/useJobData.ts` (proxy for now)
  - ⏳ TODO: Migrate job components, calculations

#### 4. Profile Feature
- **Structure**: `/src/features/profile/`
  - ⏳ TODO: Migrate profile components and hooks

#### 5. Dashboard Feature
- **Structure**: `/src/features/dashboard/`
  - ⏳ TODO: Migrate role-specific dashboards

### 📝 Migration Strategy

1. **Backward Compatibility**: All refactoring maintains backward compatibility during transition
2. **Gradual Migration**: Components are moved incrementally to avoid breaking changes
3. **Feature-Based**: Organization by business feature rather than technical concerns
4. **Shared Resources**: Common utilities and components are centralized

### 🎯 Next Steps

1. Migrate remaining auth components (LoginForm, SignUpForm)
2. Move job-related components to `/src/features/jobs/components/`
3. Migrate profile components to `/src/features/profile/`
4. Create dashboard feature structure
5. Update all import paths gradually

### 📖 Import Guide

#### New Import Patterns:
```typescript
// Auth
import { useAuth, AuthProvider } from '@/features/auth';

// Jobs (when ready)
import { useJobData, JobCard } from '@/features/jobs';

// Shared UI
import { Button, Card, Input } from '@/shared/components/ui';

// Shared utilities
import { formatCurrency, debounce } from '@/shared/utils';

// Shared types
import type { UserRole, AccountStatus } from '@/shared/types';
```

### 🚫 Legacy Patterns (being phased out):
```typescript
// Old - scattered imports
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/metricsCalculations';
```

## Benefits

1. **Better Organization**: Features are self-contained and easier to find
2. **Reduced Coupling**: Clear boundaries between features
3. **Easier Testing**: Feature-specific tests are isolated
4. **Better Scalability**: New features follow established patterns
5. **Improved Developer Experience**: Consistent import patterns and structure