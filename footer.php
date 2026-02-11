<?php
/**
 * The footer for the AIISTECH theme
 *
 * @package AIISTECH
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
?>

    </div><!-- #content -->

    <!-- Footer -->
    <footer class="bg-aiistech-dark text-aiistech-white/80 py-16 mt-20">
        <div class="max-w-7xl mx-auto px-4 md:px-10">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
                <!-- Company Info -->
                <div class="space-y-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gradient-to-br from-aiistech-primary to-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08A2.5 2.5 0 0 0 12 19.5a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5"/>
                                <path d="M9 11h6"/>
                                <path d="M9 15h6"/>
                            </svg>
                        </div>
                        <span class="text-xl font-bold tracking-tight uppercase"><?php bloginfo('name'); ?></span>
                    </div>
                    <p class="text-sm leading-relaxed">
                        <?php 
                        $description = get_bloginfo('description');
                        echo $description ? esc_html($description) : esc_html__('Integrated AI Automation & PSA Platform for Mid-Market Enterprises', 'aiistech'); 
                        ?>
                    </p>
                    <div class="flex gap-4 pt-4">
                        <!-- Social Media Icons -->
                        <a href="#" class="text-aiistech-white/60 hover:text-aiistech-primary transition-colors" aria-label="LinkedIn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                                <rect x="2" y="9" width="4" height="12"/>
                                <circle cx="4" cy="4" r="2"/>
                            </svg>
                        </a>
                        <a href="#" class="text-aiistech-white/60 hover:text-aiistech-primary transition-colors" aria-label="Twitter">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                            </svg>
                        </a>
                        <a href="#" class="text-aiistech-white/60 hover:text-aiistech-primary transition-colors" aria-label="GitHub">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                                <path d="M9 18c-4.51 2-5-2-7-2"/>
                            </svg>
                        </a>
                    </div>
                </div>

                <!-- Solutions Menu -->
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold text-white"><?php esc_html_e('Solutions', 'aiistech'); ?></h3>
                    <?php
                    wp_nav_menu(array(
                        'theme_location' => 'footer-solutions',
                        'container'      => false,
                        'menu_class'     => 'space-y-3',
                        'fallback_cb'    => 'aiistech_default_footer_solutions',
                        'depth'          => 1,
                        'walker'         => new AIISTECH_Walker_Footer_Menu(),
                    ));
                    ?>
                </div>

                <!-- Resources Menu -->
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold text-white"><?php esc_html_e('Resources', 'aiistech'); ?></h3>
                    <?php
                    wp_nav_menu(array(
                        'theme_location' => 'footer-resources',
                        'container'      => false,
                        'menu_class'     => 'space-y-3',
                        'fallback_cb'    => 'aiistech_default_footer_resources',
                        'depth'          => 1,
                        'walker'         => new AIISTECH_Walker_Footer_Menu(),
                    ));
                    ?>
                </div>

                <!-- Contact & CTA -->
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold text-white"><?php esc_html_e('Get Started', 'aiistech'); ?></h3>
                    <p class="text-sm leading-relaxed">
                        <?php esc_html_e('Ready to transform your business with AI automation?', 'aiistech'); ?>
                    </p>
                    <a href="<?php echo esc_url(home_url('/contact')); ?>" class="inline-block bg-aiistech-primary hover:bg-aiistech-primary/90 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                        <?php esc_html_e('Contact Us', 'aiistech'); ?>
                    </a>
                </div>
            </div>

            <!-- Copyright -->
            <div class="border-t border-aiistech-accent/50 mt-12 pt-8 text-center text-sm">
                <p>
                    &copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. <?php esc_html_e('All rights reserved.', 'aiistech'); ?>
                    <?php if (function_exists('the_privacy_policy_link')) {
                        echo ' | ';
                        the_privacy_policy_link();
                    } ?>
                </p>
                <!-- Google AI Studio Badge -->
                <div class="mt-4">
                    <a href="https://github.com/google-gemini/aistudio-repository-template" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-aiistech-accent/30 hover:bg-aiistech-accent/50 text-aiistech-white/70 hover:text-aiistech-primary transition-all duration-300 text-xs border border-aiistech-primary/20 hover:border-aiistech-primary/40"
                       aria-label="<?php esc_attr_e('Built with Google AI Studio template', 'aiistech'); ?>">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 16v-4"/>
                            <path d="M12 8h.01"/>
                        </svg>
                        <span><?php esc_html_e('Powered by Google AI Studio', 'aiistech'); ?></span>
                    </a>
                </div>
            </div>
        </div>
    </footer>

</div><!-- #page -->

<?php wp_footer(); ?>

<script>
    // Mobile menu toggle
    document.addEventListener('DOMContentLoaded', function() {
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIcon = document.getElementById('menu-icon');
        const closeIcon = document.getElementById('close-icon');
        
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
                mobileMenu.classList.toggle('flex');
                menuIcon.classList.toggle('hidden');
                closeIcon.classList.toggle('hidden');
            });
        }

        // Initialize Lucide icons if available
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    });
</script>

</body>
</html>

<?php

/**
 * Custom Walker for Footer Menu
 */
class AIISTECH_Walker_Footer_Menu extends Walker_Nav_Menu {
    function start_el(&$output, $item, $depth = 0, $args = null, $id = 0) {
        $output .= '<li>';
        $output .= '<a href="' . esc_url($item->url) . '" class="text-sm hover:text-aiistech-primary transition-colors">';
        $output .= esc_html($item->title);
        $output .= '</a>';
        $output .= '</li>';
    }
}

/**
 * Default Solutions Menu
 */
function aiistech_default_footer_solutions() {
    ?>
    <ul class="space-y-3">
        <li><a href="<?php echo esc_url(home_url('/solutions/healthcare')); ?>" class="text-sm hover:text-aiistech-primary transition-colors"><?php esc_html_e('Healthcare', 'aiistech'); ?></a></li>
        <li><a href="<?php echo esc_url(home_url('/solutions/manufacturing')); ?>" class="text-sm hover:text-aiistech-primary transition-colors"><?php esc_html_e('Manufacturing', 'aiistech'); ?></a></li>
        <li><a href="<?php echo esc_url(home_url('/solutions/bfsi')); ?>" class="text-sm hover:text-aiistech-primary transition-colors"><?php esc_html_e('BFSI', 'aiistech'); ?></a></li>
        <li><a href="<?php echo esc_url(home_url('/solutions/professional-services')); ?>" class="text-sm hover:text-aiistech-primary transition-colors"><?php esc_html_e('Professional Services', 'aiistech'); ?></a></li>
    </ul>
    <?php
}

/**
 * Default Resources Menu
 */
function aiistech_default_footer_resources() {
    ?>
    <ul class="space-y-3">
        <li><a href="<?php echo esc_url(home_url('/blog')); ?>" class="text-sm hover:text-aiistech-primary transition-colors"><?php esc_html_e('Blog', 'aiistech'); ?></a></li>
        <li><a href="<?php echo esc_url(home_url('/case-studies')); ?>" class="text-sm hover:text-aiistech-primary transition-colors"><?php esc_html_e('Case Studies', 'aiistech'); ?></a></li>
        <li><a href="<?php echo esc_url(home_url('/guides')); ?>" class="text-sm hover:text-aiistech-primary transition-colors"><?php esc_html_e('Guides', 'aiistech'); ?></a></li>
        <li><a href="<?php echo esc_url(home_url('/documentation')); ?>" class="text-sm hover:text-aiistech-primary transition-colors"><?php esc_html_e('Documentation', 'aiistech'); ?></a></li>
    </ul>
    <?php
}
