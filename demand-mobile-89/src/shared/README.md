# Shared Directory

Contains reusable components, utilities, and types used across multiple features.

## Structure

```
shared/
├── components/         # Reusable UI components
│   ├── forms/         # Form components
│   ├── layout/        # Layout components  
│   ├── navigation/    # Navigation components
│   └── ui/            # Basic UI components (shadcn/ui)
├── hooks/             # Reusable custom hooks
├── utils/             # Utility functions
├── types/             # Shared TypeScript types
├── constants/         # Application constants
└── api/               # API client configurations
```

## Guidelines

- Only include truly reusable components
- Keep components generic and configurable
- Use proper TypeScript interfaces
- Document component props and usage