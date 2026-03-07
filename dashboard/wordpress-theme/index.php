<?php
/**
 * The main template file
 *
 * @package AIITech_Dashboard
 * @since 1.0.0
 */

get_header();
?>

<main id="primary" class="site-main">
    <?php
    if (have_posts()) :
        while (have_posts()) :
            the_post();
            the_content();
        endwhile;
    else :
        ?>
        <div style="padding: 40px; text-align: center;">
            <h1>Welcome to AI ITECH Dashboard</h1>
            <p>Please create a page and assign the "AI ITECH Dashboard" template to it.</p>
        </div>
        <?php
    endif;
    ?>
</main>

<?php
get_footer();
?>
