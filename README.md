# Sharpe En3rgy Solutions — connected home concept

An independent, responsive website concept created by Lucas De Rossa. A real procedural Three.js home is the centre of an interactive solar / battery / comfort / hot water showroom. The home and twilight photography are illustrative. The original logo is supplied by the project owner; the technician photo is sourced from the company website.

![Desktop hero preview](docs/hero-preview.webp)

## Development

Node.js 22 or newer is recommended.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

## Cloudflare Pages

Connect this repository to **Workers & Pages → Create → Pages → Connect to Git**.

- Production branch: `main`
- Framework preset: `Vite` (or `None` with the same settings)
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: leave blank
- Node version: set `NODE_VERSION` to `22` if needed

Choose your project name before deploying; it determines the initial `pages.dev` address. No Workers runtime, database, API keys or server configuration is needed. Deployment is performed manually by the repository owner.

## Interaction and accessibility

Four service tabs move the camera around a geometrically modelled home. Floating cards, camera parallax and an energy path connect the scene to the business. Animation pauses off-screen; the pause control and reduced-motion preference are supported. The Canvas is decorative; controls, explanations, headings and links are accessible HTML. Devices without WebGL receive a photographic fallback. Touch keeps normal vertical scrolling. Soft gradients join the sections. Keyboard tabs support Left/Right, Home and End.

A local quote helper selects a service and suburb. It does not transmit or persist personal data; it directs visitors to the official quote system. No testimonials, savings figures or customer installation claims are invented.

## Official destinations

Quote: https://new.easybook.au/#easy-quote
Service booking: https://new.easybook.au/#service
Telephone: +61 8 8294 6333
Company site: https://en3rgy.au/

Search indexing is disabled for this speculative concept. Remove both the robots meta tag and `X-Robots-Tag` header only when approved for a real production site.
