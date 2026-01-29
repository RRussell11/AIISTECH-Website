<?php
/**
 * The template for displaying all single posts
 *
 * @package AIISTECH
 * @since 1.0.0
 */

get_header();
?>

<main id="primary" class="site-main">
    <div class="max-w-4xl mx-auto px-4 md:px-10 py-20">
        
        <?php
        while (have_posts()) :
            the_post();
        ?>

            <article id="post-<?php the_ID(); ?>" <?php post_class('bg-white rounded-2xl shadow-lg overflow-hidden'); ?>>
                
                <?php if (has_post_thumbnail()) : ?>
                    <div class="aspect-video overflow-hidden">
                        <?php the_post_thumbnail('large', array('class' => 'w-full h-full object-cover')); ?>
                    </div>
                <?php endif; ?>
                
                <div class="p-8 md:p-12">
                    <header class="entry-header mb-8">
                        <?php the_title('<h1 class="text-4xl md:text-5xl font-bold text-aiistech-dark mb-4">', '</h1>'); ?>
                        
                        <div class="flex flex-wrap items-center gap-4 text-gray-600">
                            <time datetime="<?php echo get_the_date('c'); ?>" class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"/>
                                    <polyline points="12 6 12 12 16 14"/>
                                </svg>
                                <?php echo get_the_date(); ?>
                            </time>
                            
                            <?php if (get_the_author()) : ?>
                                <span class="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                                        <circle cx="12" cy="7" r="4"/>
                                    </svg>
                                    <?php the_author(); ?>
                                </span>
                            <?php endif; ?>
                            
                            <?php if (has_category()) : ?>
                                <span class="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/>
                                        <path d="M7 7h.01"/>
                                    </svg>
                                    <?php the_category(', '); ?>
                                </span>
                            <?php endif; ?>
                        </div>
                    </header>

                    <div class="entry-content prose prose-lg max-w-none">
                        <?php
                        the_content(sprintf(
                            wp_kses(
                                __('Continue reading<span class="screen-reader-text"> "%s"</span>', 'aiistech'),
                                array(
                                    'span' => array(
                                        'class' => array(),
                                    ),
                                )
                            ),
                            wp_kses_post(get_the_title())
                        ));

                        wp_link_pages(array(
                            'before' => '<div class="page-links">' . esc_html__('Pages:', 'aiistech'),
                            'after'  => '</div>',
                        ));
                        ?>
                    </div>

                    <?php if (has_tag()) : ?>
                        <footer class="entry-footer mt-8 pt-8 border-t border-gray-200">
                            <div class="flex flex-wrap items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/>
                                    <path d="M7 7h.01"/>
                                </svg>
                                <?php the_tags('<span class="text-gray-600">', ', ', '</span>'); ?>
                            </div>
                        </footer>
                    <?php endif; ?>
                </div>
            </article>

            <?php
            // Post navigation
            aiistech_post_navigation();

            // Comments section
            if (comments_open() || get_comments_number()) :
                echo '<div class="mt-12 bg-white rounded-2xl shadow-lg p-8">';
                comments_template();
                echo '</div>';
            endif;

        endwhile;
        ?>
        
    </div>
</main><!-- #primary -->

<?php
get_footer();
