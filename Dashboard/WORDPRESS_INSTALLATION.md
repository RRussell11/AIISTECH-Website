# WordPress Installation Guide - AI ITECH Dashboard

This guide will help you install and configure the AI ITECH Dashboard as a WordPress page template.

## Overview

The AI ITECH Dashboard has been converted into a fully functional WordPress theme. This allows you to:
- Display the dashboard on any WordPress page
- Integrate with your existing WordPress site
- Maintain all dashboard functionality within WordPress
- Use WordPress user management and permissions

## Prerequisites

- WordPress 5.0 or higher
- PHP 7.4 or higher
- FTP/SFTP access or WordPress admin access
- Modern web browser

## Installation Methods

### Method 1: Direct Upload via FTP (Recommended)

1. **Download the theme files**
   - Navigate to the `wordpress-theme` folder in this repository
   - Download all files and folders

2. **Upload to WordPress**
   - Connect to your WordPress site via FTP/SFTP
   - Navigate to `/wp-content/themes/`
   - Create a new folder named `aiitech-dashboard`
   - Upload all theme files into this folder

3. **Activate the theme**
   - Log in to WordPress admin
   - Go to **Appearance > Themes**
   - Find "AI ITECH Dashboard" theme
   - Click **Activate**

### Method 2: ZIP Upload via WordPress Admin

1. **Create a ZIP file**
   - Compress the entire `wordpress-theme` folder into a ZIP file
   - Make sure the ZIP contains the theme files directly (not nested in another folder)

2. **Upload via WordPress**
   - Log in to WordPress admin
   - Go to **Appearance > Themes > Add New**
   - Click **Upload Theme**
   - Choose your ZIP file
   - Click **Install Now**
   - Click **Activate**

### Method 3: Command Line (For Developers)

```bash
# Navigate to your WordPress themes directory
cd /path/to/wordpress/wp-content/themes/

# Clone or copy the theme
cp -r /path/to/aiitech-project2/wordpress-theme ./aiitech-dashboard

# Set proper permissions
chmod -R 755 aiitech-dashboard
```

## Setting Up the Dashboard Page

1. **Create a new page**
   - In WordPress admin, go to **Pages > Add New**
   - Enter a title (e.g., "Dashboard", "Command Center", or "AI Control Panel")
   - Leave the content area empty (not needed for this template)

2. **Apply the template**
   - In the right sidebar, find **Page Attributes**
   - Under **Template**, select **AI ITECH Dashboard**
   - Click **Publish**

3. **View your dashboard**
   - Click **View Page** or navigate to the page URL
   - The full dashboard should load

## Configuration Options

### Setting as Homepage

To make the dashboard your site's homepage:
1. Go to **Settings > Reading**
2. Select "A static page" for "Your homepage displays"
3. Choose your dashboard page from the **Homepage** dropdown
4. Click **Save Changes**

### Creating a Menu Item

1. Go to **Appearance > Menus**
2. Select your menu or create a new one
3. Add your dashboard page to the menu
4. Position it where desired (e.g., first item)
5. Save the menu

### Restricting Access

To restrict dashboard access to logged-in users:

**Option A: Using a Plugin**
1. Install a plugin like "Content Control" or "Restrict Content"
2. Configure it to require login for your dashboard page

**Option B: Custom Code**
Add this to your theme's `functions.php` or a custom plugin:

```php
add_action('template_redirect', 'aiitech_restrict_dashboard');
function aiitech_restrict_dashboard() {
    if (is_page_template('page-dashboard.php') && !is_user_logged_in()) {
        auth_redirect();
    }
}
```

### Role-Based Access

To restrict to specific user roles:

```php
add_action('template_redirect', 'aiitech_restrict_dashboard_by_role');
function aiitech_restrict_dashboard_by_role() {
    if (is_page_template('page-dashboard.php')) {
        if (!current_user_can('administrator') && !current_user_can('editor')) {
            wp_die('You do not have permission to access this page.');
        }
    }
}
```

## Verification Steps

After installation, verify everything works:

1. **Check theme activation**
   - Go to **Appearance > Themes**
   - Confirm "AI ITECH Dashboard" is active

2. **Verify template availability**
   - Create or edit a page
   - Check that "AI ITECH Dashboard" appears in the Template dropdown

3. **Test the dashboard**
   - View the dashboard page
   - Check that all components load:
     - Navigation sidebar
     - KPI cards
     - Charts and graphs
     - Tables
     - Alerts feed

4. **Check console for errors**
   - Open browser DevTools (F12)
   - Check the Console tab for any JavaScript errors
   - Verify all external resources load successfully

## Troubleshooting

### Dashboard Not Loading

**Problem**: Page is blank or shows only a header/footer

**Solutions**:
1. Check browser console for JavaScript errors
2. Verify the `dist` folder exists in the theme directory
3. Ensure the JavaScript file exists in `dist/assets/`
4. Check file permissions (should be readable by web server)

### Styling Issues

**Problem**: Dashboard looks broken or unstyled

**Solutions**:
1. Verify Tailwind CSS CDN is loading (check Network tab in DevTools)
2. Clear WordPress cache if using a caching plugin
3. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
4. Check for CSS conflicts with other plugins

### Import Map Errors

**Problem**: Console shows "Failed to resolve module specifier"

**Solutions**:
1. Verify your browser supports import maps (modern browsers only)
2. Check that CDN URLs are accessible
3. Test in a different browser
4. Check your firewall/proxy settings

### Performance Issues

**Problem**: Dashboard is slow to load

**Solutions**:
1. Enable WordPress caching (use W3 Total Cache or WP Rocket)
2. Use a CDN for your site
3. Optimize images and assets
4. Consider using a faster hosting provider

### WordPress Admin Bar Overlapping

**Problem**: Admin bar covers dashboard header

**Solutions**:
- The theme automatically hides the admin bar for dashboard pages
- If still visible, add this CSS to `style.css`:
  ```css
  .page-template-page-dashboard #wpadminbar {
      display: none !important;
  }
  ```

## Customization

### Changing Dashboard Content

The dashboard data is currently mock/demo data. To integrate real data:

1. Edit the React source files in the repository
2. Rebuild: `npm run build`
3. Copy the new `dist` folder to `wordpress-theme/dist`
4. Re-upload the theme to WordPress

### Adding API Integration

To connect to real APIs:

1. Add your API endpoints in the React services
2. Configure CORS on your API server
3. Add authentication tokens in WordPress (use custom fields or wp_options)
4. Rebuild and redeploy

### Modifying Styles

**For WordPress-specific styling**:
- Edit `wordpress-theme/style.css`

**For dashboard styling**:
- Modify the React source and rebuild
- Or add custom CSS via WordPress Customizer

## Security Considerations

1. **Keep WordPress Updated**
   - Regularly update WordPress core, themes, and plugins

2. **Use Strong Passwords**
   - Enforce strong passwords for all users

3. **Implement SSL/HTTPS**
   - Use HTTPS for all dashboard access
   - Install an SSL certificate

4. **Regular Backups**
   - Back up your WordPress site regularly
   - Test restoration procedures

5. **Limit Login Attempts**
   - Use a plugin like "Limit Login Attempts Reloaded"

6. **Monitor Access Logs**
   - Review who accesses the dashboard
   - Set up alerts for suspicious activity

## Performance Optimization

1. **Use a Caching Plugin**
   - W3 Total Cache
   - WP Super Cache
   - WP Rocket

2. **Optimize Images**
   - Use WebP format
   - Compress images
   - Lazy load where appropriate

3. **Minify Assets**
   - Enable minification in your caching plugin
   - Combine CSS and JavaScript files

4. **Use a CDN**
   - CloudFlare
   - Amazon CloudFront
   - StackPath

## Support and Updates

### Getting Help

- GitHub Issues: https://github.com/RRussell11/aiitech-project2/issues
- AI Studio: https://ai.studio/apps/drive/1sQSzGV6-pKCDfdnDksRmHhaNJdtw7TUs

### Updating the Theme

When updates are available:
1. Download the latest `wordpress-theme` folder
2. Back up your current theme
3. Replace the theme files via FTP or WordPress admin
4. Test the dashboard thoroughly

### Contributing

To contribute improvements:
1. Fork the repository
2. Make your changes
3. Test in a WordPress environment
4. Submit a pull request

## Frequently Asked Questions

**Q: Can I use this with my existing WordPress theme?**
A: Yes! This is a standalone theme. You can switch between themes or use it for specific pages.

**Q: Will this work with WordPress multisite?**
A: Yes, install it as a network theme or per-site basis.

**Q: Can I customize the dashboard data?**
A: Yes, modify the React source code and rebuild the application.

**Q: Does this work with page builders?**
A: The dashboard template bypasses page builders. Use it on a standalone page.

**Q: Is this mobile-responsive?**
A: Yes, the dashboard is fully responsive and works on all devices.

**Q: Can I have multiple dashboard pages?**
A: Yes, create multiple pages and apply the same template to each.

## Additional Resources

- [WordPress Theme Developer Handbook](https://developer.wordpress.org/themes/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)

## License

This theme is licensed under Apache License 2.0. See LICENSE file for details.
