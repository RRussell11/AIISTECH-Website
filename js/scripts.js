/**
 * AIISTECH Theme Scripts
 * 
 * @package AIISTECH
 * @since 1.0.0
 */

(function($) {
    'use strict';

    /**
     * Initialize when DOM is ready
     */
    $(document).ready(function() {
        
        // Smooth scrolling for anchor links
        $('a[href*="#"]:not([href="#"])').on('click', function() {
            if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && 
                location.hostname === this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html, body').animate({
                        scrollTop: target.offset().top - 80
                    }, 800);
                    return false;
                }
            }
        });

        // Mobile menu toggle
        $('#mobile-menu-toggle').on('click', function() {
            $('#mobile-menu').toggleClass('hidden flex');
            $('#menu-icon').toggleClass('hidden');
            $('#close-icon').toggleClass('hidden');
        });

        // Add active state to navigation
        var currentPath = window.location.pathname;
        $('.nav-menu a').each(function() {
            var linkPath = $(this).attr('href');
            if (currentPath === linkPath || (currentPath === '/' && linkPath === '/')) {
                $(this).addClass('text-aiistech-primary');
            }
        });

        // Lazy load images if browser doesn't support native lazy loading
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        } else {
            // Fallback for browsers that don't support lazy loading
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
            document.body.appendChild(script);
        }

        // Add animation on scroll
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        function handleScrollAnimations() {
            const elements = document.querySelectorAll('.fade-in-on-scroll');
            elements.forEach(element => {
                if (isInViewport(element)) {
                    element.classList.add('visible');
                }
            });
        }

        // Run on scroll
        window.addEventListener('scroll', handleScrollAnimations);
        // Run on page load
        handleScrollAnimations();

    });

    /**
     * Window load event
     */
    $(window).on('load', function() {
        // Add any window load specific code here
        console.log('AIISTECH Theme loaded successfully');
    });

})(jQuery);
