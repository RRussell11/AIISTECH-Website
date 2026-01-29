<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 *
 * @package AIISTECH
 * @since 1.0.0
 */

get_header();
?>

<main id="primary" class="site-main">
    <div class="max-w-7xl mx-auto px-4 md:px-10 py-20">
        
        <?php if (have_posts()) : ?>

            <?php if (is_home() && !is_front_page()) : ?>
                <header class="page-header mb-12">
                    <h1 class="text-4xl font-bold text-aiistech-dark mb-4">
                        <?php single_post_title(); ?>
                    </h1>
                </header>
            <?php endif; ?>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <?php
                // Start the Loop
                while (have_posts()) :
                    the_post();
                    ?>
                    
                    <article id="post-<?php the_ID(); ?>" <?php post_class('bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow'); ?>>
                        <?php if (has_post_thumbnail()) : ?>
                            <div class="aspect-video overflow-hidden">
                                <a href="<?php the_permalink(); ?>">
                                    <?php the_post_thumbnail('large', array('class' => 'w-full h-full object-cover hover:scale-105 transition-transform duration-300')); ?>
                                </a>
                            </div>
                        <?php endif; ?>
                        
                        <div class="p-6">
                            <header class="entry-header mb-4">
                                <?php
                                if (is_singular()) :
                                    the_title('<h1 class="text-2xl font-bold text-aiistech-dark mb-2">', '</h1>');
                                else :
                                    the_title('<h2 class="text-xl font-bold text-aiistech-dark mb-2"><a href="' . esc_url(get_permalink()) . '" class="hover:text-aiistech-primary transition-colors">', '</a></h2>');
                                endif;
                                ?>
                                
                                <?php if ('post' === get_post_type()) : ?>
                                    <div class="text-sm text-gray-500">
                                        <time datetime="<?php echo get_the_date('c'); ?>"><?php echo get_the_date(); ?></time>
                                        <?php if (get_the_author()) : ?>
                                            <span class="mx-2">•</span>
                                            <span><?php echo esc_html__('By', 'aiistech'); ?> <?php the_author(); ?></span>
                                        <?php endif; ?>
                                    </div>
                                <?php endif; ?>
                            </header>

                            <div class="entry-summary text-gray-600 mb-4">
                                <?php the_excerpt(); ?>
                            </div>

                            <footer class="entry-footer">
                                <a href="<?php the_permalink(); ?>" class="inline-flex items-center text-aiistech-primary hover:text-aiistech-primary/80 font-medium transition-colors">
                                    <?php esc_html_e('Read More', 'aiistech'); ?>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="ml-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </a>
                            </footer>
                        </div>
                    </article>

                <?php
                endwhile;
                ?>
            </div>

            <?php
            // Pagination
            aiistech_posts_navigation();
            ?>

        <?php else : ?>

            <!-- No Content Found -->
            <div class="text-center py-20">
                <h2 class="text-3xl font-bold text-aiistech-dark mb-4">
                    <?php esc_html_e('Nothing Found', 'aiistech'); ?>
                </h2>
                <p class="text-gray-600 mb-8">
                    <?php esc_html_e('It seems we can\'t find what you\'re looking for. Perhaps searching can help.', 'aiistech'); ?>
                </p>
                <?php get_search_form(); ?>
            </div>

        <?php endif; ?>
        
    </div>
</main><!-- #primary -->

<?php
get_footer();
