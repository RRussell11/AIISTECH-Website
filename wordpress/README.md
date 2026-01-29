# WordPress export

The `page-lambda-proof.php` template mirrors the existing SPA landing page so the same content can be rendered inside a WordPress theme. It uses inline styles to avoid extra build tooling and expects the bundled assets in the sibling `lambda-proof` folder (currently only `hero-visual.svg`).

## How to use

1. Copy `wordpress/page-lambda-proof.php` and the `wordpress/lambda-proof` asset folder into your active theme (e.g. `wp-content/themes/your-theme/`).
2. In the WordPress admin, create a new page and select **ΛProof Landing Page** under *Template*.
3. Publish the page. The template includes anchors for Overview, How it Works, Protocols, Developers, Paper, and Contact to match the SPA navigation.

### Troubleshooting

- If the template does not appear in the dropdown, confirm the file lives in your active theme root (or `templates/` for some block themes) and that it includes the `Template Post Type: page` header.

## Notes

- Fonts are loaded from Google Fonts (`Inter`). Adjust the `<link>` tags if your theme already handles typography.
- CTA links point to the Citizen Gardens contact email (`info@citizengardens.org`) and the ΛProof whitepaper PDF at `https://citizengardens.org/wp-content/uploads/2025/11/Λproof-Whitepaper-1.pdf`.
- Because styles are inline, the template will not conflict with the theme’s enqueue pipeline but can be moved into a dedicated stylesheet if preferred.
