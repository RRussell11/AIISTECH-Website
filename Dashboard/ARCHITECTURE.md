# WordPress Theme Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    WordPress Site                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │          AI ITECH Dashboard Theme                      │  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Page Template (page-dashboard.php)             │  │  │
│  │  │  ┌───────────────────────────────────────────┐  │  │  │
│  │  │  │   <div id="root"></div>                   │  │  │  │
│  │  │  │                                             │  │  │  │
│  │  │  │   ┌─────────────────────────────────────┐ │  │  │  │
│  │  │  │   │   React Application                  │ │  │  │  │
│  │  │  │   │   (from dist/assets/index-*.js)      │ │  │  │  │
│  │  │  │   │                                       │ │  │  │  │
│  │  │  │   │   Components:                         │ │  │  │  │
│  │  │  │   │   • Sidebar Navigation                │ │  │  │  │
│  │  │  │   │   • Header with Role Selector         │ │  │  │  │
│  │  │  │   │   • KPI Dashboard Cards               │ │  │  │  │
│  │  │  │   │   • Charts & Graphs (Recharts)        │ │  │  │  │
│  │  │  │   │   • Data Tables                       │ │  │  │  │
│  │  │  │   │   • Real-time Alerts Feed             │ │  │  │  │
│  │  │  │   └─────────────────────────────────────┘ │  │  │  │
│  │  │  └───────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                         │  │
│  │  Theme Functions (functions.php):                      │  │
│  │  • Enqueue Tailwind CSS (CDN)                          │  │
│  │  • Enqueue React bundle as ES6 module                  │  │
│  │  • Inject import map for dependencies                  │  │
│  │  • Add inline CSS for dark theme                       │  │
│  │  • Remove admin bar on dashboard pages                 │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Request
    ↓
WordPress Routing
    ↓
page-dashboard.php template selected
    ↓
header.php (loads wp_head)
    ↓
functions.php hooks execute:
  • Enqueue Tailwind CSS from CDN
  • Add import map for React modules
  • Enqueue React bundle (type="module")
  • Add inline CSS for styling
    ↓
<div id="root"></div> rendered
    ↓
React bundle executes
    ↓
React app mounts to #root
    ↓
Dashboard UI renders
    ↓
footer.php (loads wp_footer)
    ↓
Full dashboard displayed
```

## File Dependencies

```
WordPress Theme Files:
├── style.css ──────────────→ WordPress theme metadata
├── functions.php ──────────→ Asset loading & configuration
├── header.php ─────────────→ HTML head & wp_head()
├── footer.php ─────────────→ wp_footer()
├── index.php ──────────────→ Fallback template
├── page-dashboard.php ─────→ Dashboard page template
│   └── Requires: header.php, footer.php
│
└── dist/ (React Build Output)
    ├── index.html ─────────→ (Reference only, not used in WP)
    └── assets/
        └── index-*.js ─────→ Bundled React application
            ├── React components
            ├── Recharts for graphs
            ├── Hero Icons
            └── Business logic
```

## External Dependencies (CDN)

```
Loaded via Import Map (in functions.php):

• react (v19.2.x)              → https://aistudiocdn.com/
• react-dom (v19.2.x)          → https://aistudiocdn.com/
• @google/genai (v1.28.0)      → https://aistudiocdn.com/
• @heroicons/react (v2.2.0)    → https://aistudiocdn.com/
• recharts (v2.12.7)           → https://esm.sh/
• axios (v1.6.8)               → https://esm.sh/
• clsx (v2.1.1)                → https://esm.sh/
• tailwind-merge (v2.3.0)      → https://esm.sh/

Tailwind CSS (v3.x)            → https://cdn.tailwindcss.com
```

## WordPress Hooks Used

```php
// Theme Setup
add_action('after_setup_theme', 'aiitech_dashboard_setup')
  → Adds support for title-tag, custom-logo, HTML5

// Asset Enqueueing
add_action('wp_enqueue_scripts', 'aiitech_enqueue_dashboard_assets')
  → Loads CSS and JavaScript conditionally

// Import Map Injection
add_action('wp_head', 'aiitech_add_import_map')
  → Adds <script type="importmap"> to head

// Script Tag Modification
add_filter('script_loader_tag', 'aiitech_add_type_attribute')
  → Converts script tag to type="module"

// Template Registration
add_filter('theme_page_templates', 'aiitech_add_page_template')
  → Registers custom page template

// Admin Bar Removal
add_action('wp_head', 'aiitech_remove_admin_bar')
  → Hides admin bar for full-screen experience
```

## Template Hierarchy

```
WordPress decides template to use:

Page with "AI ITECH Dashboard" template assigned
    ↓
page-dashboard.php (Custom Template)
    ↓
page.php (if custom template not found)
    ↓
singular.php
    ↓
index.php (fallback)

Our theme provides:
✓ page-dashboard.php (Custom Dashboard)
✓ index.php (Fallback)
```

## Browser Rendering Process

```
1. Browser requests WordPress page
2. Server returns HTML with:
   • <div id="root"></div>
   • <script type="importmap"> (dependencies)
   • <script type="module" src="assets/index-*.js">
   • Tailwind CSS from CDN
3. Browser parses HTML
4. Browser loads Tailwind CSS (styling)
5. Browser loads import map (dependency resolution)
6. Browser loads React bundle as ES6 module
7. React initializes and mounts to #root
8. React renders dashboard components
9. Charts, tables, and interactive elements initialize
10. Dashboard ready for user interaction
```

## Security Considerations

```
✓ No inline JavaScript evaluation
✓ Proper WordPress escaping in PHP
✓ ABSPATH check in functions.php
✓ CDN resources loaded over HTTPS
✓ ES6 modules with proper CORS
✓ No sensitive data in client code
✓ WordPress nonce support available
✓ User authentication through WordPress
```

## Performance Optimization

```
✓ Single bundled JavaScript file
✓ CDN-hosted dependencies (parallel loading)
✓ Minified production build
✓ Gzip compression enabled
✓ Modern ES6 modules (tree-shaking)
✓ Conditional loading (only on dashboard pages)
✓ No jQuery dependency
✓ Optimized React bundle
```

## Customization Points

```
1. Theme Styles → wordpress-theme/style.css
2. Dashboard Logic → Rebuild React app, update dist/
3. PHP Functions → wordpress-theme/functions.php
4. Page Template → wordpress-theme/page-dashboard.php
5. Import Map → Modify in functions.php
6. CDN URLs → Update in functions.php
```

## Development Workflow

```
┌─────────────────────────────────────┐
│  Make changes to React source       │
│  (App.tsx, components/, etc.)       │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  npm run build                       │
│  (Compiles to dist/)                 │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  cp -r dist wordpress-theme/         │
│  (Update theme assets)               │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Upload wordpress-theme/ to WP       │
│  (Via FTP or admin)                  │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Test in WordPress                   │
│  (Verify dashboard works)            │
└─────────────────────────────────────┘
```
