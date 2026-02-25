<?php
/**
 * AI ITECH Dashboard Theme Functions
 *
 * @package AIITech_Dashboard
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enqueue React app assets for the dashboard page template
 */
function aiitech_enqueue_dashboard_assets() {
    // Only load on pages using the dashboard template
    if (is_page_template('page-dashboard.php')) {
        // Get the theme directory URI
        $theme_uri = get_template_directory_uri();
        
        // Enqueue Tailwind CSS from CDN
        wp_enqueue_script('tailwindcss', 'https://cdn.tailwindcss.com', array(), null, false);
        
        // Enqueue the built React app
        $js_file = glob(get_template_directory() . '/dist/assets/index-*.js');
        if (!empty($js_file)) {
            $js_filename = basename($js_file[0]);
            wp_enqueue_script(
                'aiitech-dashboard-app',
                $theme_uri . '/dist/assets/' . $js_filename,
                array(),
                '1.0.0',
                true
            );
            // Add module type attribute
            add_filter('script_loader_tag', 'aiitech_add_type_attribute', 10, 3);
        }
        
        // Add inline styles from the original HTML
        wp_add_inline_style('aiitech-dashboard-style', '
            body {
                background-color: #0f172a;
                color: #f1f5f9;
                margin: 0;
                padding: 0;
            }
            
            .bg-surface-1 { background-color: #111827; }
            .bg-surface-2 { background-color: #1f2933; }
            
            /* Recharts Tooltip Styling */
            .recharts-default-tooltip {
                background-color: #111827 !important;
                border: 1px solid #374151 !important;
                border-radius: 6px !important;
                color: #f1f5f9 !important;
            }

            ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            
            ::-webkit-scrollbar-track {
                background: #0f172a;
            }
            
            ::-webkit-scrollbar-thumb {
                background: #334155;
                border-radius: 4px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
                background: #475569;
            }
        ');
    }
}
add_action('wp_enqueue_scripts', 'aiitech_enqueue_dashboard_assets');

/**
 * Add type="module" attribute to the dashboard script
 */
function aiitech_add_type_attribute($tag, $handle, $src) {
    if ('aiitech-dashboard-app' === $handle) {
        $tag = '<script type="module" crossorigin src="' . esc_url($src) . '"></script>' . "\n";
    }
    return $tag;
}

/**
 * Add import map for external modules
 */
function aiitech_add_import_map() {
    if (is_page_template('page-dashboard.php')) {
        ?>
        <script type="importmap">
        {
          "imports": {
            "react": "https://aistudiocdn.com/react@^19.2.0",
            "react-dom/client": "https://aistudiocdn.com/react-dom@^19.2.0/client",
            "react-dom": "https://aistudiocdn.com/react-dom@^19.2.0",
            "@google/genai": "https://aistudiocdn.com/@google/genai@^1.28.0",
            "@heroicons/react/24/outline": "https://aistudiocdn.com/@heroicons/react@^2.2.0/24/outline",
            "@heroicons/react/24/solid": "https://aistudiocdn.com/@heroicons/react@^2.2.0/24/solid",
            "recharts": "https://esm.sh/recharts@2.12.7?external=react",
            "axios": "https://esm.sh/axios@1.6.8",
            "clsx": "https://esm.sh/clsx@2.1.1",
            "tailwind-merge": "https://esm.sh/tailwind-merge@2.3.0",
            "react/": "https://esm.sh/react@^19.2.3/",
            "react-dom/": "https://esm.sh/react-dom@^19.2.3/",
            "@heroicons/react/": "https://esm.sh/@heroicons/react@^2.2.0/"
          }
        }
        </script>
        <?php
    }
}
add_action('wp_head', 'aiitech_add_import_map');

/**
 * Theme setup
 */
function aiitech_dashboard_setup() {
    // Add theme support for title tag
    add_theme_support('title-tag');
    
    // Add theme support for custom logo
    add_theme_support('custom-logo');
    
    // Add theme support for HTML5
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
}
add_action('after_setup_theme', 'aiitech_dashboard_setup');

/**
 * Register dashboard page template
 */
function aiitech_add_page_template($templates) {
    $templates['page-dashboard.php'] = __('AI ITECH Dashboard', 'aiitech-dashboard');
    return $templates;
}
add_filter('theme_page_templates', 'aiitech_add_page_template');

/**
 * Remove admin bar for full-screen dashboard experience
 */
function aiitech_remove_admin_bar() {
    if (is_page_template('page-dashboard.php')) {
        show_admin_bar(false);
    }
}
add_action('wp_head', 'aiitech_remove_admin_bar');
