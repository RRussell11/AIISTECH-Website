<?php
/**
 * The header for the AIISTECH theme
 *
 * @package AIISTECH
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
    <style>
        html {
            scroll-behavior: smooth;
        }
        body {
            background-color: #f1f5f9;
            color: #0f172a;
        }
        .gradient-hero {
            background: radial-gradient(circle at top right, #1e293b 0%, #0f172a 100%);
        }
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f5f9;
        }
        ::-webkit-scrollbar-thumb {
            background: #38bdf8;
            border-radius: 4px;
        }
    </style>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div id="page" class="site">
    <a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e('Skip to content', 'aiistech'); ?></a>

    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-aiistech-dark/95 backdrop-blur-md border-b border-aiistech-accent py-4">
        <div class="max-w-7xl mx-auto px-4 md:px-10 flex justify-between items-center">
            <!-- Logo -->
            <div class="flex items-center gap-3 cursor-pointer">
                <?php if (has_custom_logo()) : ?>
                    <?php the_custom_logo(); ?>
                <?php else : ?>
                    <div class="w-10 h-10 bg-gradient-to-br from-aiistech-primary to-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08A2.5 2.5 0 0 0 12 19.5a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5"/>
                            <path d="M9 11h6"/>
                            <path d="M9 15h6"/>
                        </svg>
                    </div>
                <?php endif; ?>
                <a href="<?php echo esc_url(home_url('/')); ?>" class="text-xl font-bold tracking-tight text-white uppercase">
                    <?php bloginfo('name'); ?>
                </a>
            </div>

            <!-- Desktop Menu -->
            <div class="hidden md:flex items-center gap-10">
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'container'      => false,
                    'menu_class'     => 'flex items-center gap-10',
                    'fallback_cb'    => 'aiistech_default_menu',
                    'depth'          => 1,
                    'walker'         => new AIISTECH_Walker_Nav_Menu(),
                ));
                ?>
                <a href="#" class="text-sm font-semibold text-white bg-aiistech-primary/20 hover:bg-aiistech-primary/30 border border-aiistech-primary/50 px-5 py-2 rounded-full transition-all">
                    <?php esc_html_e('Sign In', 'aiistech'); ?>
                </a>
            </div>

            <!-- Mobile Menu Toggle -->
            <button class="md:hidden text-white" id="mobile-menu-toggle" aria-label="Toggle menu">
                <svg id="menu-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
                <svg id="close-icon" class="hidden" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>

        <!-- Mobile Menu -->
        <div id="mobile-menu" class="md:hidden bg-aiistech-dark px-6 py-8 hidden flex-col gap-6">
            <?php
            wp_nav_menu(array(
                'theme_location' => 'primary',
                'container'      => false,
                'menu_class'     => 'flex flex-col gap-6',
                'fallback_cb'    => 'aiistech_default_menu_mobile',
                'depth'          => 1,
            ));
            ?>
            <a href="#" class="w-full text-center bg-aiistech-primary py-3 rounded-xl font-bold text-aiistech-dark">
                <?php esc_html_e('Sign In', 'aiistech'); ?>
            </a>
        </div>
    </nav>

    <div id="content" class="site-content content-wrapper">
<?php

/**
 * Custom Walker for Navigation Menu
 */
class AIISTECH_Walker_Nav_Menu extends Walker_Nav_Menu {
    function start_el(&$output, $item, $depth = 0, $args = null, $id = 0) {
        $classes = empty($item->classes) ? array() : (array) $item->classes;
        $class_names = join(' ', apply_filters('nav_menu_css_class', array_filter($classes), $item, $args, $depth));
        
        $output .= '<a href="' . esc_url($item->url) . '" class="text-sm font-medium transition-colors text-aiistech-white/70 hover:text-aiistech-primary">';
        $output .= esc_html($item->title);
        $output .= '</a>';
    }
}

/**
 * Fallback menu for desktop
 */
function aiistech_default_menu() {
    ?>
    <a href="<?php echo esc_url(home_url('/')); ?>" class="text-sm font-medium transition-colors text-aiistech-white/70 hover:text-aiistech-primary"><?php esc_html_e('Platform', 'aiistech'); ?></a>
    <a href="<?php echo esc_url(home_url('/solutions')); ?>" class="text-sm font-medium transition-colors text-aiistech-white/70 hover:text-aiistech-primary"><?php esc_html_e('Solutions', 'aiistech'); ?></a>
    <a href="<?php echo esc_url(home_url('/services')); ?>" class="text-sm font-medium transition-colors text-aiistech-white/70 hover:text-aiistech-primary"><?php esc_html_e('Services', 'aiistech'); ?></a>
    <a href="<?php echo esc_url(home_url('/pricing')); ?>" class="text-sm font-medium transition-colors text-aiistech-white/70 hover:text-aiistech-primary"><?php esc_html_e('Pricing', 'aiistech'); ?></a>
    <a href="<?php echo esc_url(home_url('/blog')); ?>" class="text-sm font-medium transition-colors text-aiistech-white/70 hover:text-aiistech-primary"><?php esc_html_e('Resources', 'aiistech'); ?></a>
    <?php
}

/**
 * Fallback menu for mobile
 */
function aiistech_default_menu_mobile() {
    ?>
    <a href="<?php echo esc_url(home_url('/')); ?>" class="text-left text-lg font-medium text-white/80"><?php esc_html_e('Platform', 'aiistech'); ?></a>
    <a href="<?php echo esc_url(home_url('/solutions')); ?>" class="text-left text-lg font-medium text-white/80"><?php esc_html_e('Solutions', 'aiistech'); ?></a>
    <a href="<?php echo esc_url(home_url('/services')); ?>" class="text-left text-lg font-medium text-white/80"><?php esc_html_e('Services', 'aiistech'); ?></a>
    <a href="<?php echo esc_url(home_url('/pricing')); ?>" class="text-left text-lg font-medium text-white/80"><?php esc_html_e('Pricing', 'aiistech'); ?></a>
    <a href="<?php echo esc_url(home_url('/blog')); ?>" class="text-left text-lg font-medium text-white/80"><?php esc_html_e('Resources', 'aiistech'); ?></a>
    <?php
}
