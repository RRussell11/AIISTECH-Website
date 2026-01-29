# AIISTECH WordPress Theme

A modern, responsive WordPress theme for AIISTECH - Integrated AI Automation & PSA Platform.

## Description

This WordPress theme is designed for showcasing AI automation solutions, services, and case studies for mid-market enterprises. It features a clean, professional design with a focus on conversion optimization and lead generation.

## Features

- **Responsive Design**: Fully responsive and mobile-friendly
- **Custom Page Templates**: 
  - Home Page Template
  - Services Page Template
  - Pricing Page Template
- **Tailwind CSS Integration**: Modern utility-first CSS framework
- **Custom Navigation Menus**: Primary menu and footer menus
- **Widget Areas**: Sidebar and footer widget areas
- **SEO Friendly**: Clean, semantic HTML5 markup
- **Performance Optimized**: Fast loading times with optimized assets
- **Accessibility**: WCAG 2.1 compliant markup
- **Translation Ready**: Full i18n support

## Installation

### Method 1: WordPress Admin Dashboard

1. Download the theme files as a ZIP archive
2. Log in to your WordPress admin dashboard
3. Navigate to **Appearance > Themes > Add New**
4. Click **Upload Theme**
5. Choose the ZIP file and click **Install Now**
6. After installation, click **Activate**

### Method 2: FTP Upload

1. Extract the theme ZIP file
2. Connect to your server via FTP
3. Upload the extracted theme folder to `/wp-content/themes/`
4. Log in to your WordPress admin dashboard
5. Navigate to **Appearance > Themes**
6. Find "AIISTECH" and click **Activate**

### Method 3: Direct Installation (This Repository)

If you're working directly with this repository:

1. Copy the entire theme directory to your WordPress installation's themes directory:
   ```bash
   cp -r /path/to/AIISTECH-Website /path/to/wordpress/wp-content/themes/aiistech
   ```

2. Log in to your WordPress admin dashboard
3. Navigate to **Appearance > Themes**
4. Find "AIISTECH" and click **Activate**

## Setup

### 1. Create Required Pages

Create the following pages in WordPress (Pages > Add New):

- **Home** - Assign the "Home Page" template
- **Services** - Assign the "Services" template
- **Pricing** - Assign the "Pricing" template
- **Blog** - Use default template
- **Contact** - Create with your preferred contact form plugin

### 2. Configure Homepage

1. Go to **Settings > Reading**
2. Select "A static page" under "Your homepage displays"
3. Choose your "Home" page as the homepage
4. Choose your "Blog" page as the posts page
5. Click **Save Changes**

### 3. Set Up Menus

1. Go to **Appearance > Menus**
2. Create a new menu named "Primary Menu"
3. Add pages: Platform (Home), Solutions, Services, Pricing, Resources (Blog)
4. Assign to "Primary Menu" location
5. Create footer menus for Solutions and Resources
6. Click **Save Menu**

### 4. Configure Site Identity

1. Go to **Appearance > Customize > Site Identity**
2. Add your site title: "AIISTECH"
3. Add tagline: "Integrated AI Automation & PSA Platform"
4. Upload a logo (recommended size: 40x40px)
5. Click **Publish**

## Page Templates

### Home Page Template

Features:
- Hero section with CTA buttons
- Stats showcase
- Platform features grid
- Call-to-action section

### Services Template

Features:
- Service offerings grid
- Detailed service descriptions
- Features and benefits lists
- Contact CTA

### Pricing Template

Features:
- Three-tier pricing structure
- Feature comparison
- Popular plan highlight
- ROI calculator CTA

## Customization

### Colors

The theme uses the following color scheme defined in CSS variables:

```css
--aiistech-primary: #38bdf8;  /* Primary/Accent color */
--aiistech-dark: #0f172a;     /* Dark background */
--aiistech-accent: #1e293b;   /* Accent elements */
--aiistech-white: #f1f5f9;    /* Light text/bg */
--aiistech-success: #22c55e;  /* Success color */
--aiistech-warning: #f59e0b;  /* Warning color */
```

To customize colors, edit `style.css` and update the CSS variables.

### Fonts

The theme uses Inter font from Google Fonts. To change fonts:

1. Edit `functions.php`
2. Update the Google Fonts URL in `aiistech_enqueue_assets()`
3. Update the font-family in `style.css`

## Requirements

- WordPress 6.0 or higher
- PHP 7.4 or higher
- MySQL 5.6 or higher

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Theme Structure

```
AIISTECH-Website/
├── style.css              # Main stylesheet with theme header
├── functions.php          # Theme functions and setup
├── index.php              # Main template file
├── header.php             # Header template
├── footer.php             # Footer template
├── page-home.php          # Home page template
├── page-services.php      # Services page template
├── page-pricing.php       # Pricing page template
├── js/
│   └── scripts.js         # Custom JavaScript
└── README-WORDPRESS.md    # This file
```

## Support

For theme support and documentation:
- Website: https://aiistech.com
- Email: support@aiistech.com
- GitHub: https://github.com/RRussell11/AIISTECH-Website

## Credits

- **Tailwind CSS**: https://tailwindcss.com
- **Lucide Icons**: https://lucide.dev
- **Google Fonts (Inter)**: https://fonts.google.com

## License

This theme is licensed under the MIT License.

## Changelog

### Version 1.0.0
- Initial release
- Home, Services, and Pricing page templates
- Responsive navigation with mobile menu
- Tailwind CSS integration
- Custom widget areas
- SEO optimized markup
