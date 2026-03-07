# AI ITECH Dashboard - WordPress Theme

A WordPress theme that integrates the AI ITECH Dashboard React application as a page template.

## Description

This theme allows you to display the AI ITECH Dashboard (a modern AI automation command center) within your WordPress site as a full-page template. The dashboard provides real-time monitoring and control of AI automation processes, bots, and business metrics.

## Features

- **Full React Integration**: Seamlessly integrates the React-based dashboard into WordPress
- **Custom Page Template**: Apply the dashboard to any WordPress page
- **Responsive Design**: Modern, mobile-friendly interface
- **Real-time Monitoring**: Track KPIs, automations, processes, and alerts
- **Role-based Views**: Executive, Operations, Finance, and IT perspectives
- **Dark Mode**: Modern dark theme with custom styling

## Installation

### Option 1: Manual Installation

1. Download or clone this repository
2. Copy the `wordpress-theme` folder to your WordPress installation's `wp-content/themes/` directory
3. Rename the folder to `aiitech-dashboard` (optional but recommended)
4. In WordPress admin, go to **Appearance > Themes**
5. Find "AI ITECH Dashboard" and click **Activate**

### Option 2: ZIP Installation

1. Create a ZIP file of the `wordpress-theme` folder
2. In WordPress admin, go to **Appearance > Themes > Add New**
3. Click **Upload Theme**
4. Choose the ZIP file and click **Install Now**
5. Click **Activate**

## Usage

### Creating a Dashboard Page

1. In WordPress admin, go to **Pages > Add New**
2. Give your page a title (e.g., "Dashboard" or "Command Center")
3. In the **Page Attributes** section (right sidebar), select **AI ITECH Dashboard** from the Template dropdown
4. Publish the page
5. View the page to see your dashboard

### Configuration

The theme automatically:
- Loads all necessary React dependencies from CDN
- Includes Tailwind CSS for styling
- Removes the WordPress admin bar for a full-screen experience
- Applies custom dark theme styling

### Best Practices

1. **Full-Screen Experience**: For the best experience, use this template on a page without sidebars
2. **Direct Access**: Consider setting the dashboard page as your homepage or creating a prominent menu item
3. **Permissions**: Restrict access to the dashboard page using WordPress user roles and capabilities if needed

## Technical Details

### Files Structure

```
wordpress-theme/
├── style.css              # Theme header and basic styles
├── functions.php          # Theme functionality and asset enqueueing
├── header.php            # HTML head section
├── footer.php            # Footer section
├── index.php             # Default template
├── page-dashboard.php    # Dashboard page template
└── dist/                 # Built React application
    ├── assets/
    │   └── index-*.js    # Bundled React app
    └── index.html
```

### Dependencies

The theme loads the following external dependencies:
- React 19.2.x
- React DOM 19.2.x
- Tailwind CSS (CDN)
- Recharts (for data visualization)
- Hero Icons
- Google Generative AI SDK
- Axios, clsx, tailwind-merge

All dependencies are loaded from CDN for optimal performance.

## Requirements

- WordPress 5.0 or higher
- PHP 7.4 or higher
- Modern web browser with ES6 module support

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## Customization

### Modifying the Dashboard

To modify the dashboard functionality:
1. Edit the original React source files in the root directory
2. Run `npm run build` to rebuild the application
3. Copy the updated `dist` folder to `wordpress-theme/dist`

### Changing Styles

You can customize the theme by:
1. Editing `style.css` for WordPress-specific styles
2. Modifying the inline styles in `functions.php` for dashboard-specific styling
3. Rebuilding the React app with custom Tailwind configuration

## Troubleshooting

### Dashboard Not Loading

1. Check browser console for JavaScript errors
2. Ensure all CDN resources are accessible
3. Verify the `dist/assets/` folder contains the JavaScript bundle
4. Check that the template is properly assigned to the page

### Styling Issues

1. Clear WordPress cache if using a caching plugin
2. Clear browser cache
3. Check for theme conflicts with other active plugins
4. Ensure Tailwind CSS CDN is loading properly

### Admin Bar Overlapping

The theme automatically hides the WordPress admin bar on dashboard pages. If it's still visible:
1. Check your WordPress user profile settings
2. Consider using a custom CSS to force hide it

## Support

For issues, questions, or contributions, please visit:
- GitHub Repository: https://github.com/RRussell11/aiitech-project2
- AI Studio: https://ai.studio/apps/drive/1sQSzGV6-pKCDfdnDksRmHhaNJdtw7TUs

## License

This theme is licensed under the Apache License 2.0. See LICENSE file for details.

## Credits

- Developed with AI Studio
- Built with React, Vite, and Tailwind CSS
- Icon system by Hero Icons
- Charts powered by Recharts

## Changelog

### Version 1.0.0
- Initial release
- Full React dashboard integration
- Custom page template
- WordPress theme structure
- CDN-based dependency loading
