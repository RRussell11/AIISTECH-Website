<?php
/**
 * Template Name: Home Page
 * Template Post Type: page
 *
 * @package AIISTECH
 * @since 1.0.0
 */

get_header();
?>

<main id="primary" class="site-main">
    
    <!-- Hero Section -->
    <section class="gradient-hero text-white py-24 md:py-32">
        <div class="max-w-7xl mx-auto px-4 md:px-10">
            <div class="max-w-4xl mx-auto text-center">
                <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                    <?php 
                    $hero_title = get_field('hero_title');
                    echo $hero_title ? esc_html($hero_title) : esc_html__('Integrated AI Automation & PSA Platform', 'aiistech');
                    ?>
                </h1>
                <p class="text-xl md:text-2xl text-aiistech-white/90 mb-12 leading-relaxed">
                    <?php 
                    $hero_subtitle = get_field('hero_subtitle');
                    echo $hero_subtitle ? esc_html($hero_subtitle) : esc_html__('Empower Mid-Market Enterprises with Intelligent Automation, Agentic AI, and RPA', 'aiistech');
                    ?>
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="<?php echo esc_url(home_url('/contact')); ?>" class="bg-aiistech-primary hover:bg-aiistech-primary/90 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl">
                        <?php esc_html_e('Start Free Assessment', 'aiistech'); ?>
                    </a>
                    <a href="#features" class="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all">
                        <?php esc_html_e('Learn More', 'aiistech'); ?>
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 md:px-10">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div class="space-y-2">
                    <div class="text-5xl font-bold text-aiistech-primary">280%</div>
                    <div class="text-gray-600"><?php esc_html_e('Average ROI', 'aiistech'); ?></div>
                </div>
                <div class="space-y-2">
                    <div class="text-5xl font-bold text-aiistech-primary">60%</div>
                    <div class="text-gray-600"><?php esc_html_e('Cost Reduction', 'aiistech'); ?></div>
                </div>
                <div class="space-y-2">
                    <div class="text-5xl font-bold text-aiistech-primary">85%</div>
                    <div class="text-gray-600"><?php esc_html_e('Faster Processing', 'aiistech'); ?></div>
                </div>
                <div class="space-y-2">
                    <div class="text-5xl font-bold text-aiistech-primary">24/7</div>
                    <div class="text-gray-600"><?php esc_html_e('Automated Operations', 'aiistech'); ?></div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20">
        <div class="max-w-7xl mx-auto px-4 md:px-10">
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-bold text-aiistech-dark mb-4">
                    <?php esc_html_e('Platform Features', 'aiistech'); ?>
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    <?php esc_html_e('Comprehensive AI automation tools designed for mid-market enterprises', 'aiistech'); ?>
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Feature 1: Agentic AI -->
                <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                    <div class="w-14 h-14 bg-aiistech-primary/10 rounded-xl flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08A2.5 2.5 0 0 0 12 19.5a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5"/>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-aiistech-dark mb-4"><?php esc_html_e('Agentic AI', 'aiistech'); ?></h3>
                    <p class="text-gray-600 leading-relaxed">
                        <?php esc_html_e('Self-learning AI agents that adapt to your business processes and make intelligent decisions autonomously.', 'aiistech'); ?>
                    </p>
                </div>

                <!-- Feature 2: RPA Integration -->
                <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                    <div class="w-14 h-14 bg-aiistech-primary/10 rounded-xl flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="8" y="8" width="8" height="8" rx="2"/>
                            <path d="M4 8V6a2 2 0 0 1 2-2h2"/>
                            <path d="M4 16v2a2 2 0 0 0 2 2h2"/>
                            <path d="M16 4h2a2 2 0 0 1 2 2v2"/>
                            <path d="M16 20h2a2 2 0 0 0 2-2v-2"/>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-aiistech-dark mb-4"><?php esc_html_e('RPA Integration', 'aiistech'); ?></h3>
                    <p class="text-gray-600 leading-relaxed">
                        <?php esc_html_e('Seamlessly integrate robotic process automation with your existing systems for maximum efficiency.', 'aiistech'); ?>
                    </p>
                </div>

                <!-- Feature 3: PSA Platform -->
                <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                    <div class="w-14 h-14 bg-aiistech-primary/10 rounded-xl flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 3v18h18"/>
                            <path d="m19 9-5 5-4-4-3 3"/>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-aiistech-dark mb-4"><?php esc_html_e('PSA Platform', 'aiistech'); ?></h3>
                    <p class="text-gray-600 leading-relaxed">
                        <?php esc_html_e('Professional Services Automation to streamline project management, resource allocation, and billing.', 'aiistech'); ?>
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-aiistech-primary to-blue-600 text-white">
        <div class="max-w-4xl mx-auto px-4 md:px-10 text-center">
            <h2 class="text-4xl md:text-5xl font-bold mb-6">
                <?php esc_html_e('Ready to Transform Your Business?', 'aiistech'); ?>
            </h2>
            <p class="text-xl mb-8 text-white/90">
                <?php esc_html_e('Get a free automation assessment and discover how AI can drive 280% ROI for your enterprise.', 'aiistech'); ?>
            </p>
            <a href="<?php echo esc_url(home_url('/contact')); ?>" class="inline-block bg-white text-aiistech-primary hover:bg-gray-100 font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl">
                <?php esc_html_e('Get Started Today', 'aiistech'); ?>
            </a>
        </div>
    </section>

</main><!-- #primary -->

<?php
get_footer();
