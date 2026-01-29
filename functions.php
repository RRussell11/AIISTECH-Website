<?php
/**
 * AIISTECH Theme Functions
 * 
 * @package AIISTECH
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Theme Setup
 */
function aiistech_theme_setup() {
    // Add default posts and comments RSS feed links to head
    add_theme_support('automatic-feed-links');
    
    // Enable support for Post Thumbnails
    add_theme_support('post-thumbnails');
    
    // Enable support for document title tag
    add_theme_support('title-tag');
    
    // Enable support for HTML5 markup
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ));
    
    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'aiistech'),
        'footer-solutions' => __('Footer Solutions Menu', 'aiistech'),
        'footer-resources' => __('Footer Resources Menu', 'aiistech'),
    ));
    
    // Add support for custom logo
    add_theme_support('custom-logo', array(
        'height'      => 40,
        'width'       => 40,
        'flex-height' => true,
        'flex-width'  => true,
    ));
    
    // Add support for wide alignment
    add_theme_support('align-wide');
    
    // Add support for responsive embeds
    add_theme_support('responsive-embeds');
}
add_action('after_setup_theme', 'aiistech_theme_setup');

/**
 * Enqueue scripts and styles
 */
function aiistech_enqueue_assets() {
    // Enqueue main stylesheet
    wp_enqueue_style('aiistech-style', get_stylesheet_uri(), array(), '1.0.0');
    
    // Enqueue Tailwind CSS from CDN
    wp_enqueue_style('tailwind-cdn', 'https://cdn.tailwindcss.com', array(), null);
    
    // Enqueue Google Fonts
    wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', array(), null);
    
    // Enqueue Lucide Icons (via CDN)
    wp_enqueue_script('lucide-icons', 'https://unpkg.com/lucide@latest/dist/umd/lucide.js', array(), null, true);
    
    // Enqueue custom JavaScript
    wp_enqueue_script('aiistech-scripts', get_template_directory_uri() . '/js/scripts.js', array(), '1.0.0', true);
    
    // Pass PHP data to JavaScript
    wp_localize_script('aiistech-scripts', 'aiistechData', array(
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('aiistech-nonce'),
    ));
}
add_action('wp_enqueue_scripts', 'aiistech_enqueue_assets');

/**
 * Register widget areas
 */
function aiistech_widgets_init() {
    register_sidebar(array(
        'name'          => __('Sidebar', 'aiistech'),
        'id'            => 'sidebar-1',
        'description'   => __('Add widgets here to appear in your sidebar.', 'aiistech'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ));
    
    register_sidebar(array(
        'name'          => __('Footer Widget Area', 'aiistech'),
        'id'            => 'footer-1',
        'description'   => __('Add widgets here to appear in your footer.', 'aiistech'),
        'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="footer-widget-title">',
        'after_title'   => '</h3>',
    ));
}
add_action('widgets_init', 'aiistech_widgets_init');

/**
 * Custom template tags
 */

/**
 * Display navigation to next/previous post
 */
function aiistech_post_navigation() {
    the_post_navigation(array(
        'prev_text' => '<span class="nav-subtitle">' . esc_html__('Previous:', 'aiistech') . '</span> <span class="nav-title">%title</span>',
        'next_text' => '<span class="nav-subtitle">' . esc_html__('Next:', 'aiistech') . '</span> <span class="nav-title">%title</span>',
    ));
}

/**
 * Display navigation to next/previous set of posts
 */
function aiistech_posts_navigation() {
    the_posts_pagination(array(
        'mid_size'  => 2,
        'prev_text' => __('&larr; Previous', 'aiistech'),
        'next_text' => __('Next &rarr;', 'aiistech'),
    ));
}

/**
 * Custom page templates
 */

/**
 * Add custom body classes
 */
function aiistech_body_classes($classes) {
    // Add page slug to body class
    if (is_page()) {
        $classes[] = 'page-' . basename(get_permalink());
    }
    
    // Add class for pages with custom templates
    if (is_page_template()) {
        $template_name = get_page_template_slug();
        $template_name = str_replace(array('page-templates/', '.php'), '', $template_name);
        $classes[] = 'template-' . $template_name;
    }
    
    return $classes;
}
add_filter('body_class', 'aiistech_body_classes');

/**
 * Tailwind config inline script
 */
function aiistech_tailwind_config() {
    ?>
    <script>
        if (typeof tailwind !== 'undefined' && tailwind.config) {
            tailwind.config = {
                theme: {
                    extend: {
                        fontFamily: {
                            sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
                            mono: ['"Berkeley Mono"', '"Courier New"', 'monospace'],
                        },
                        colors: {
                            aiistech: {
                                primary: '#38bdf8',
                                dark: '#0f172a',
                                accent: '#1e293b',
                                white: '#f1f5f9',
                                success: '#22c55e',
                                warning: '#f59e0b',
                            }
                        }
                    }
                }
            }
        }
    </script>
    <?php
}
add_action('wp_head', 'aiistech_tailwind_config', 99);

/**
 * Security enhancements
 */

// Remove WordPress version from head
remove_action('wp_head', 'wp_generator');

// Disable XML-RPC
add_filter('xmlrpc_enabled', '__return_false');
