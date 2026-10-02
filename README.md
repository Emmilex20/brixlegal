# Brix Legal Practice & Consultancy

A high-fidelity Next.js rebuild of the Brix Legal public website, based on the firm's live visual identity and content. The project also includes a native, multi-step consultation intake flow instead of sending prospective clients to Calendly.

## Features

- Responsive homepage matching the Brix Legal cream, charcoal and orange design system
- Fixed desktop navigation and slide-out mobile navigation
- Animated hero, client ticker, firm profile and key metrics
- Practice areas, process, team, testimonials, insights and careers sections
- Contact, newsletter, WhatsApp and social links
- Four-step consultation intake flow at `/consultation`
- Responsive layouts for desktop, tablet and mobile
- Accessible form labels, navigation controls and reduced-motion support

## Local development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
pnpm build
pnpm start
```

## Stack

- Next.js 15
- React 19
- TypeScript
- Framer Motion
- Lucide React

Brand imagery used by the site is stored in `public/`.
