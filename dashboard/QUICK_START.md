# WordPress Quick Start Guide

## 🚀 Quick Installation (5 Minutes)

### Step 1: Upload Theme
```bash
# Via command line
cp -r wordpress-theme /path/to/wordpress/wp-content/themes/aiitech-dashboard

# Or via FTP
Upload 'wordpress-theme' folder to wp-content/themes/
```

### Step 2: Activate Theme
1. WordPress Admin → **Appearance → Themes**
2. Click **Activate** on "AI ITECH Dashboard"

### Step 3: Create Dashboard Page
1. WordPress Admin → **Pages → Add New**
2. Title: "Dashboard"
3. Template: Select **AI ITECH Dashboard**
4. Click **Publish**

### Step 4: View Dashboard
Click "View Page" - Your dashboard is live! 🎉

---

## 📁 What's Included

```
wordpress-theme/
├── style.css              # Theme info & styles
├── functions.php          # WordPress integration
├── page-dashboard.php     # Dashboard template
├── header.php & footer.php
├── index.php
├── dist/                  # React app (built)
└── README.md              # Full documentation
```

---

## 🔧 Common Tasks

### Make Dashboard Your Homepage
**Settings → Reading** → Select your dashboard page as homepage

### Add to Menu
**Appearance → Menus** → Add dashboard page to your menu

### Restrict Access to Logged-in Users
Add to `functions.php`:
```php
add_action('template_redirect', function() {
    if (is_page_template('page-dashboard.php') && !is_user_logged_in()) {
        auth_redirect();
    }
});
```

---

## ⚠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| Blank page | Check browser console for errors |
| No styling | Verify Tailwind CDN is loading |
| Template not showing | Ensure theme is activated |
| Admin bar overlapping | Already hidden by theme |

---

## 📚 Documentation

- **Full Installation Guide**: `WORDPRESS_INSTALLATION.md`
- **Theme Documentation**: `wordpress-theme/README.md`
- **Project README**: `README.md`

---

## 🔗 Links

- **GitHub**: https://github.com/RRussell11/aiitech-project2
- **AI Studio**: https://ai.studio/apps/drive/1sQSzGV6-pKCDfdnDksRmHhaNJdtw7TUs

---

## ✅ Requirements

- WordPress 5.0+
- PHP 7.4+
- Modern browser

---

**Need help?** Open an issue on GitHub or check the full documentation files.
