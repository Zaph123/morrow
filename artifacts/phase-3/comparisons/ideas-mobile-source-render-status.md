# Ideas populated mobile source render

The selected source is `artifacts/references/stitch/source-b/reference-export/ideas_mobile_list/code.html`. Its HTML loaded from loopback, but the Tailwind CDN script did not run: the main element remained `display: block` instead of the expected `display: flex`.

Failed browser requests:
- https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap: net::ERR_NETWORK_ACCESS_DENIED
- https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap: net::ERR_NETWORK_ACCESS_DENIED
- https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200: net::ERR_NETWORK_ACCESS_DENIED
- https://cdn.tailwindcss.com/: net::ERR_NETWORK_ACCESS_DENIED

The raw unstyled preview was excluded as a design comparison. See `ideas-list-mobile-morrow.png` for the app output; the original HTML remains unchanged.