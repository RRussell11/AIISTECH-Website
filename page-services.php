<?php
/**
 * Template Name: Services
 * Template Post Type: page
 *
 * @package AIISTECH
 * @since 1.0.0
 */

get_header();
?>

<main id="primary" class="site-main">
    
    <!-- Hero Section -->
    <section class="gradient-hero text-white py-20 md:py-24">
        <div class="max-w-7xl mx-auto px-4 md:px-10">
            <div class="max-w-4xl">
                <h1 class="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    <?php esc_html_e('Our Services', 'aiistech'); ?>
                </h1>
                <p class="text-xl text-aiistech-white/90 leading-relaxed">
                    <?php esc_html_e('End-to-end AI automation services tailored for mid-market enterprises', 'aiistech'); ?>
                </p>
            </div>
        </div>
    </section>

    <!-- Services Grid -->
    <section class="py-20">
        <div class="max-w-7xl mx-auto px-4 md:px-10">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <!-- Service 1: Automation Consulting -->
                <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                    <div class="w-16 h-16 bg-aiistech-primary/10 rounded-xl flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                            <line x1="12" y1="22.08" x2="12" y2="12"/>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-aiistech-dark mb-4">
                        <?php esc_html_e('Automation Consulting', 'aiistech'); ?>
                    </h3>
                    <p class="text-gray-600 mb-6 leading-relaxed">
                        <?php esc_html_e('Strategic assessment and roadmap development for intelligent automation implementation across your enterprise.', 'aiistech'); ?>
                    </p>
                    <ul class="space-y-3 text-gray-600">
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span><?php esc_html_e('Process Discovery & Analysis', 'aiistech'); ?></span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span><?php esc_html_e('ROI Calculation & Business Case', 'aiistech'); ?></span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span><?php esc_html_e('Implementation Roadmap', 'aiistech'); ?></span>
                        </li>
                    </ul>
                </div>

                <!-- Service 2: AI Agent Development -->
                <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                    <div class="w-16 h-16 bg-aiistech-primary/10 rounded-xl flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08A2.5 2.5 0 0 0 12 19.5a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5"/>
                            <path d="M9 11h6"/>
                            <path d="M9 15h6"/>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-aiistech-dark mb-4">
                        <?php esc_html_e('AI Agent Development', 'aiistech'); ?>
                    </h3>
                    <p class="text-gray-600 mb-6 leading-relaxed">
                        <?php esc_html_e('Custom agentic AI solutions that learn, adapt, and make intelligent decisions for your unique business needs.', 'aiistech'); ?>
                    </p>
                    <ul class="space-y-3 text-gray-600">
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span><?php esc_html_e('Intelligent Decision Making', 'aiistech'); ?></span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span><?php esc_html_e('Self-Learning Algorithms', 'aiistech'); ?></span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span><?php esc_html_e('Continuous Optimization', 'aiistech'); ?></span>
                        </li>
                    </ul>
                </div>

                <!-- Service 3: RPA Implementation -->
                <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                    <div class="w-16 h-16 bg-aiistech-primary/10 rounded-xl flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="8" y="8" width="8" height="8" rx="2"/>
                            <path d="M4 8V6a2 2 0 0 1 2-2h2"/>
                            <path d="M4 16v2a2 2 0 0 0 2 2h2"/>
                            <path d="M16 4h2a2 2 0 0 1 2 2v2"/>
                            <path d="M16 20h2a2 2 0 0 0 2-2v-2"/>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-aiistech-dark mb-4">
                        <?php esc_html_e('RPA Implementation', 'aiistech'); ?>
                    </h3>
                    <p class="text-gray-600 mb-6 leading-relaxed">
                        <?php esc_html_e('Deploy robotic process automation to handle repetitive tasks and free your team for strategic work.', 'aiistech'); ?>
                    </p>
                    <ul class="space-y-3 text-gray-600">
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span><?php esc_html_e('Bot Development & Deployment', 'aiistech'); ?></span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span><?php esc_html_e('System Integration', 'aiistech'); ?></span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span><?php esc_html_e('Performance Monitoring', 'aiistech'); ?></span>
                        </li>
                    </ul>
                </div>

                <!-- Service 4: Managed Services -->
                <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                    <div class="w-16 h-16 bg-aiistech-primary/10 rounded-xl flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-aiistech-dark mb-4">
                        <?php esc_html_e('Managed Services', 'aiistech'); ?>
                    </h3>
                    <p class="text-gray-600 mb-6 leading-relaxed">
                        <?php esc_html_e('Ongoing support, monitoring, and optimization of your automation infrastructure with 24/7 availability.', 'aiistech'); ?>
                    </p>
                    <ul class="space-y-3 text-gray-600">
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span><?php esc_html_e('24/7 Monitoring & Support', 'aiistech'); ?></span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span><?php esc_html_e('Proactive Maintenance', 'aiistech'); ?></span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span><?php esc_html_e('Regular Updates & Enhancements', 'aiistech'); ?></span>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-aiistech-primary to-blue-600 text-white">
        <div class="max-w-4xl mx-auto px-4 md:px-10 text-center">
            <h2 class="text-4xl font-bold mb-6">
                <?php esc_html_e('Ready to Get Started?', 'aiistech'); ?>
            </h2>
            <p class="text-xl mb-8 text-white/90">
                <?php esc_html_e('Contact us today to discuss how our services can transform your business.', 'aiistech'); ?>
            </p>
            <a href="<?php echo esc_url(home_url('/contact')); ?>" class="inline-block bg-white text-aiistech-primary hover:bg-gray-100 font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl">
                <?php esc_html_e('Contact Us', 'aiistech'); ?>
            </a>
        </div>
    </section>

</main><!-- #primary -->

<?php
get_footer();
