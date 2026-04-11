# Features Directory Structure

This directory contains all feature-specific modules organized by business domain.

## Structure

```
features/
├── auth/                 # Authentication & authorization
├── dashboard/           # Role-specific dashboards
├── jobs/                # Job management across all roles
├── profile/             # User profile management
├── booking/             # Booking system
├── messaging/           # Communication features
├── payments/            # Payment & billing
├── admin/               # Admin-specific features
├── maps/                # Location & mapping
└── shared/              # Shared feature components
```

## Guidelines

- Each feature should be self-contained
- Components should be organized by: components/, hooks/, types/, utils/
- Use index.ts files for clean exports
- Keep feature-specific logic isolated