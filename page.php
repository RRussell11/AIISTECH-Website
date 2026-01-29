<?php
/**
 * The template for displaying all pages
 *
 * @package AIISTECH
 * @since 1.0.0
 */

get_header();
?>

<main id="primary" class="site-main">
    <div class="max-w-7xl mx-auto px-4 md:px-10 py-20">
        
        <?php
        while (have_posts()) :
            the_post();
        ?>

            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                
                <?php if (has_post_thumbnail()) : ?>
                    <div class="mb-8 rounded-2xl overflow-hidden shadow-lg">
                        <?php the_post_thumbnail('large', array('class' => 'w-full h-auto')); ?>
                    </div>
                <?php endif; ?>
                
                <header class="entry-header mb-8">
                    <?php the_title('<h1 class="text-4xl md:text-5xl font-bold text-aiistech-dark mb-4">', '</h1>'); ?>
                </header>

                <div class="entry-content prose prose-lg max-w-none">
                    <?php
                    the_content();

                    wp_link_pages(array(
                        'before' => '<div class="page-links">' . esc_html__('Pages:', 'aiistech'),
                        'after'  => '</div>',
                    ));
                    ?>
                </div>

                <?php if (get_edit_post_link()) : ?>
                    <footer class="entry-footer mt-8">
                        <?php
                        edit_post_link(
                            sprintf(
                                wp_kses(
                                    __('Edit <span class="screen-reader-text">"%s"</span>', 'aiistech'),
                                    array(
                                        'span' => array(
                                            'class' => array(),
                                        ),
                                    )
                                ),
                                wp_kses_post(get_the_title())
                            ),
                            '<span class="edit-link">',
                            '</span>'
                        );
                        ?>
                    </footer>
                <?php endif; ?>
            </article>

            <?php
            // If comments are open or we have at least one comment, load up the comment template.
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
