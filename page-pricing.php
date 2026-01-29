<?php
/**
 * Template Name: Pricing
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
        <div class="max-w-7xl mx-auto px-4 md:px-10 text-center">
            <h1 class="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <?php esc_html_e('Transparent Pricing', 'aiistech'); ?>
            </h1>
            <p class="text-xl text-aiistech-white/90 max-w-3xl mx-auto leading-relaxed">
                <?php esc_html_e('Choose the perfect plan for your business needs. All plans include 24/7 support and 280% average ROI.', 'aiistech'); ?>
            </p>
        </div>
    </section>

    <!-- Pricing Cards -->
    <section class="py-20">
        <div class="max-w-7xl mx-auto px-4 md:px-10">
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                
                <!-- Starter Plan -->
                <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-200">
                    <div class="mb-6">
                        <h3 class="text-2xl font-bold text-aiistech-dark mb-2"><?php esc_html_e('Starter', 'aiistech'); ?></h3>
                        <p class="text-gray-600"><?php esc_html_e('Perfect for small teams', 'aiistech'); ?></p>
                    </div>
                    <div class="mb-8">
                        <div class="flex items-baseline">
                            <span class="text-5xl font-bold text-aiistech-dark">$2,499</span>
                            <span class="text-gray-600 ml-2"><?php esc_html_e('/month', 'aiistech'); ?></span>
                        </div>
                    </div>
                    <ul class="space-y-4 mb-8">
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span class="text-gray-600"><?php esc_html_e('Up to 5 automation processes', 'aiistech'); ?></span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span class="text-gray-600"><?php esc_html_e('Basic RPA implementation', 'aiistech'); ?></span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span class="text-gray-600"><?php esc_html_e('Email support', 'aiistech'); ?></span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span class="text-gray-600"><?php esc_html_e('Monthly performance reports', 'aiistech'); ?></span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span class="text-gray-600"><?php esc_html_e('Basic analytics dashboard', 'aiistech'); ?></span>
                        </li>
                    </ul>
                    <a href="<?php echo esc_url(home_url('/contact')); ?>" class="block w-full text-center bg-aiistech-primary/10 hover:bg-aiistech-primary/20 text-aiistech-primary font-semibold py-3 rounded-xl transition-all">
                        <?php esc_html_e('Get Started', 'aiistech'); ?>
                    </a>
                </div>

                <!-- Professional Plan (Featured) -->
                <div class="bg-gradient-to-br from-aiistech-primary to-blue-600 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all relative transform md:scale-105">
                    <div class="absolute top-0 right-0 bg-white text-aiistech-primary text-sm font-bold px-4 py-1 rounded-bl-xl rounded-tr-xl">
                        <?php esc_html_e('POPULAR', 'aiistech'); ?>
                    </div>
                    <div class="mb-6">
                        <h3 class="text-2xl font-bold text-white mb-2"><?php esc_html_e('Professional', 'aiistech'); ?></h3>
                        <p class="text-white/90"><?php esc_html_e('For growing businesses', 'aiistech'); ?></p>
                    </div>
                    <div class="mb-8">
                        <div class="flex items-baseline">
                            <span class="text-5xl font-bold text-white">$4,999</span>
                            <span class="text-white/90 ml-2"><?php esc_html_e('/month', 'aiistech'); ?></span>
                        </div>
                    </div>
                    <ul class="space-y-4 mb-8">
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span class="text-white/90"><?php esc_html_e('Up to 15 automation processes', 'aiistech'); ?></span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span class="text-white/90"><?php esc_html_e('Advanced AI agents', 'aiistech'); ?></span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span class="text-white/90"><?php esc_html_e('Priority support (24/7)', 'aiistech'); ?></span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span class="text-white/90"><?php esc_html_e('Weekly performance reviews', 'aiistech'); ?></span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span class="text-white/90"><?php esc_html_e('Advanced analytics & insights', 'aiistech'); ?></span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span class="text-white/90"><?php esc_html_e('Dedicated account manager', 'aiistech'); ?></span>
                        </li>
                    </ul>
                    <a href="<?php echo esc_url(home_url('/contact')); ?>" class="block w-full text-center bg-white hover:bg-gray-100 text-aiistech-primary font-bold py-3 rounded-xl transition-all shadow-lg">
                        <?php esc_html_e('Get Started', 'aiistech'); ?>
                    </a>
                </div>

                <!-- Enterprise Plan -->
                <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-200">
                    <div class="mb-6">
                        <h3 class="text-2xl font-bold text-aiistech-dark mb-2"><?php esc_html_e('Enterprise', 'aiistech'); ?></h3>
                        <p class="text-gray-600"><?php esc_html_e('For large organizations', 'aiistech'); ?></p>
                    </div>
                    <div class="mb-8">
                        <div class="flex items-baseline">
                            <span class="text-5xl font-bold text-aiistech-dark"><?php esc_html_e('Custom', 'aiistech'); ?></span>
                        </div>
                    </div>
                    <ul class="space-y-4 mb-8">
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span class="text-gray-600"><?php esc_html_e('Unlimited automation processes', 'aiistech'); ?></span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span class="text-gray-600"><?php esc_html_e('Custom AI development', 'aiistech'); ?></span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span class="text-gray-600"><?php esc_html_e('White-glove support', 'aiistech'); ?></span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span class="text-gray-600"><?php esc_html_e('Real-time monitoring', 'aiistech'); ?></span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span class="text-gray-600"><?php esc_html_e('Custom integrations', 'aiistech'); ?></span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span class="text-gray-600"><?php esc_html_e('On-premise deployment options', 'aiistech'); ?></span>
                        </li>
                    </ul>
                    <a href="<?php echo esc_url(home_url('/contact')); ?>" class="block w-full text-center bg-aiistech-primary hover:bg-aiistech-primary/90 text-white font-semibold py-3 rounded-xl transition-all">
                        <?php esc_html_e('Contact Sales', 'aiistech'); ?>
                    </a>
                </div>

            </div>

            <!-- ROI Calculator CTA -->
            <div class="bg-gradient-to-r from-aiistech-primary/10 to-blue-600/10 rounded-2xl p-12 text-center">
                <h2 class="text-3xl font-bold text-aiistech-dark mb-4">
                    <?php esc_html_e('Calculate Your ROI', 'aiistech'); ?>
                </h2>
                <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    <?php esc_html_e('See how much you can save with our automation platform. Average clients achieve 280% ROI within 12 months.', 'aiistech'); ?>
                </p>
                <a href="<?php echo esc_url(home_url('/contact')); ?>" class="inline-block bg-aiistech-primary hover:bg-aiistech-primary/90 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl">
                    <?php esc_html_e('Get Free Assessment', 'aiistech'); ?>
                </a>
            </div>

        </div>
    </section>

</main><!-- #primary -->

<?php
get_footer();
