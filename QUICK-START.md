# 🚀 QUICK START GUIDE - WordPress Theme Installation

This is a **3-step quick start guide** to get the AIISTECH WordPress theme up and running.

## Prerequisites
- WordPress 6.0+ installed
- Admin access to WordPress dashboard
- FTP or file system access to your server

---

## 📋 STEP 1: Install the Theme

### Method A: Copy Entire Repository (Easiest)
```bash
# Copy the entire repository to your WordPress themes directory
cp -r /path/to/AIISTECH-Website /var/www/html/wp-content/themes/aiistech
```

### Method B: Copy Only Theme Files
```bash
# Create theme directory
mkdir -p /var/www/html/wp-content/themes/aiistech

# Copy WordPress theme files
cp style.css functions.php header.php footer.php index.php /var/www/html/wp-content/themes/aiistech/
cp page*.php single.php /var/www/html/wp-content/themes/aiistech/
cp -r js /var/www/html/wp-content/themes/aiistech/
```

### Method C: Upload via WordPress Admin
1. Create a ZIP file containing the theme files
2. In WordPress: Go to **Appearance → Themes → Add New → Upload Theme**
3. Choose the ZIP file and click **Install Now**

---

## 📋 STEP 2: Activate & Configure

### 2.1 Activate Theme
1. Log in to WordPress admin dashboard
2. Navigate to **Appearance → Themes**
3. Find "AIISTECH" theme
4. Click **Activate**

### 2.2 Create Pages
Create these pages in WordPress (Pages → Add New):

| Page Name | Assign Template |
|-----------|----------------|
| Home      | "Home Page"    |
| Services  | "Services"     |
| Pricing   | "Pricing"      |
| Blog      | (Default)      |

### 2.3 Set Homepage
1. Go to **Settings → Reading**
2. Select "A static page"
3. Homepage: Choose "Home"
4. Posts page: Choose "Blog"
5. Click **Save Changes**

### 2.4 Configure Menus
1. Go to **Appearance → Menus**
2. Create menu: "Primary Menu"
3. Add pages: Home, Services, Pricing, Blog
4. Assign to location: "Primary Menu"
5. Click **Save Menu**

---

## 📋 STEP 3: Customize

### 3.1 Site Identity
1. Go to **Appearance → Customize → Site Identity**
2. Site Title: "AIISTECH"
3. Tagline: "Integrated AI Automation & PSA Platform"
4. Upload Logo (40x40px recommended)
5. Click **Publish**

### 3.2 Optional: Add Widgets
1. Go to **Appearance → Widgets**
2. Add widgets to:
   - Sidebar Widget Area
   - Footer Widget Area

---

## ✅ You're Done!

Your AIISTECH WordPress theme is now live! 

Visit your website to see it in action.

---

## 🔧 Troubleshooting

### Theme doesn't appear
- Check file permissions (755 for directories, 644 for files)
- Verify all required files are present (style.css, functions.php, index.php)

### Styling looks broken
- Clear browser cache
- Check if Tailwind CSS CDN is loading (check browser console)

### Mobile menu not working
- Verify js/scripts.js is loading
- Check browser console for JavaScript errors

---

## 📚 Need More Help?

For detailed documentation, see:
- **README-WORDPRESS.md** - Complete installation guide
- **WORDPRESS-CONVERSION-COMPLETE.md** - Feature overview
- **THEME-FILES-LIST.md** - File structure details

---

## 🎨 Customization

### Change Colors
Edit CSS variables in `style.css`:
```css
:root {
  --aiistech-primary: #38bdf8;  /* Change this */
  --aiistech-dark: #0f172a;     /* And this */
}
```

### Change Fonts
Edit Google Fonts URL in `functions.php`:
```php
wp_enqueue_style('google-fonts', 
  'https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;500;600;700&display=swap'
);
```

---

**Happy WordPress-ing! 🎉**
