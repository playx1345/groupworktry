# Plateau State Polytechnic Result Hub

Student result management system for the Department of Computer Science at Plateau State Polytechnic Barkin Ladi. Built with React, TypeScript, Vite, Tailwind CSS, shadcn-ui components, and Supabase backend.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Build
- Install dependencies: `npm install` -- takes ~40 seconds from clean install, ~17 seconds with existing cache, may show 3 moderate vulnerabilities (normal). NEVER CANCEL. Set timeout to 5+ minutes.
- Build for production: `npm run build` -- takes ~6 seconds. NEVER CANCEL. Set timeout to 5+ minutes.
- Build for development: `npm run build:dev` -- takes ~7 seconds. NEVER CANCEL. Set timeout to 5+ minutes.
- Run development server: `npm run dev` -- starts on http://localhost:8080/
- Run production preview: `npm run preview` -- starts on http://localhost:4173/
- Lint code: `npm run lint` -- shows 6 errors and 15 warnings (expected), runs to completion

### Development Workflow
- ALWAYS run `npm install` first after cloning
- Development server starts immediately on port 8080 with hot reload
- Build produces warnings about large chunks (>500KB) - this is expected
- Linting has known issues (TypeScript interface warnings, JSX parsing errors in frontend/ folder) - DO NOT try to fix these unless specifically asked

## Validation

### Manual Testing Requirements
- ALWAYS test the complete application flow after making changes:
  1. Start dev server with `npm run dev`
  2. Navigate to http://localhost:8080/
  3. Test homepage loads correctly with Plateau State Polytechnic branding
  4. Test Student Login link (/auth?mode=login) - form should appear
  5. Test Admin Login link (/admin/login) - admin form should appear
  6. Test admin login with credentials: admin@plasu.edu.ng / 123456
  7. Verify admin dashboard loads with tabs: Overview, Students, Quick Create, Results, Fee Management, Announcements

### Required Screenshots
- Always take screenshots of UI changes for visual validation
- Homepage shows institutional branding and login options
- Admin dashboard shows management interface with statistics cards

### Validation Commands
- `npm run build` to ensure production build works
- `npm run lint` to check code style (expect some warnings)
- No test suite exists - rely on manual testing

## Critical Information

### Authentication System
- **Default Admin Credentials**: admin@plasu.edu.ng / 123456
- Student accounts require admin creation (no self-registration)
- Supabase handles authentication backend
- Admin has full access to student management, results upload, fee management

### Database Integration
- **Supabase Project**: zlxcbfgxmalqtvowgofx.supabase.co
- Database migrations in `/supabase/migrations/`
- Tables: students, admins, courses, results, fee_payments, announcements
- Row Level Security (RLS) policies implemented
- Admin functions for bulk operations

### GitHub Workflow Issue
- **KNOWN ISSUE**: `.github/workflows/npm-gulp.yml` expects `gulp` command but no gulpfile exists
- Workflow will FAIL on CI/CD - this is a repository configuration issue
- For local development, ignore gulp and use npm scripts instead
- DO NOT try to fix the workflow unless specifically asked

## Project Structure

### Key Directories
```
/src/                     - Main React application source
/src/components/ui/       - shadcn-ui component library
/src/pages/              - Application page components
/src/integrations/       - Supabase integration and types
/supabase/              - Database schema and migrations
/public/                - Static assets
/dist/                  - Production build output (generated)
```

### Important Files
- `package.json` - Dependencies and npm scripts
- `vite.config.ts` - Vite build configuration (port 8080)
- `tailwind.config.ts` - Tailwind CSS configuration with custom polytechnic colors
- `tsconfig.json` - TypeScript configuration with path aliases
- `.env` - Supabase connection credentials (committed to repo)

### Navigation Points
- **Student Routes**: `/`, `/auth`, `/dashboard`, `/results`, `/profile`
- **Admin Routes**: `/admin/login`, `/admin/dashboard`, `/admin/students`, `/admin/upload`, `/admin/bulk-upload`
- **Components**: AuthWrapper.tsx handles authentication state
- **Main App**: App.tsx defines all routes and providers

### Legacy/Unused Folders
- `/backend/` and `/frontend/` contain legacy JavaScript files - ignore these
- Main application is in `/src/` directory

## Common Tasks

### Adding New Features
- Follow existing component patterns in `/src/components/`
- Use TypeScript with proper typing
- Implement using shadcn-ui components for consistency
- Add routes in `App.tsx`
- Test authentication flows for both student and admin access

### Database Changes
- Create new migration files in `/supabase/migrations/`
- Follow existing naming convention: `YYYYMMDDHHMMSS_description.sql`
- Include RLS policies for security
- Test with admin credentials to verify access

### Styling Guidelines
- Use Tailwind CSS classes exclusively
- Custom polytechnic theme colors available: `polytechnic-blue`, `polytechnic-green`, `polytechnic-gold`
- Follow shadcn-ui component patterns
- Responsive design is implemented

### Result Management Workflow
- Students can view their ND1/ND2 semester results
- Admins can upload individual results or bulk CSV uploads
- Fee verification required for result access
- PDF export functionality available

### Performance Notes
- Vite provides fast development server startup
- Build produces large chunks due to comprehensive UI library
- Hot module replacement works for rapid development
- Production build includes CSS optimization

## Troubleshooting

### Common Issues
- **Supabase Connection Errors**: Normal in development without proper environment setup
- **Linting Errors**: Expected - focus on TypeScript errors in `/src/`, ignore JSX parsing errors in legacy folders
- **Port Conflicts**: Dev server uses port 8080, preview uses 4173
- **Build Warnings**: Large chunk warnings are expected due to UI library size

### Quick Fixes
- Restart dev server if hot reload stops working
- Clear `dist/` folder if build artifacts cause issues
- Check `.env` file for Supabase configuration
- Verify Node.js version compatibility (tested with 18.x, 20.x, 22.x)

Always run `npm run build && npm run lint` before submitting changes to ensure basic validation passes.