# Salary Meter (월급 미터기)

Real-time salary calculator with a retro 1980s Korean taxi meter aesthetic.

## Features

- **Two Themes**: 
  - 🚖 **Taxi Mode**: Retro cyberpunk aesthetic with LED displays
  - 📊 **Minimal Mode**: Clean, modern Notion-style interface

- **Real-time Calculation**: Watch your salary accumulate second by second
- **Milestone Tracking**: See what you can afford as you earn
- **Overtime Mode**: Apply custom multipliers (1.5x, 2x, etc.)
- **Stealth Bar**: Minimal progress bar that expands on hover
- **Settlement**: End your work session and see daily/monthly totals

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Lucide React Icons

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Build for Production

```bash
npm run build
```

The `dist` folder will contain the production-ready files.

## Deploy to Vercel

### Method 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to deploy your project.

### Method 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite configuration
6. Click "Deploy"

### Method 3: Deploy from Local Build

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder:
```bash
vercel --prod
```

## Environment Variables

No environment variables needed. All calculations are done client-side.

## Usage

1. **Setup**: Enter your monthly salary, payday, start time, and end time
2. **Start**: Click "미터기 켜기" (Start Meter) to begin tracking
3. **Monitor**: Watch your earnings accumulate in real-time
4. **Overtime**: Click "할증" to apply overtime multipliers
5. **Settlement**: Click "지불" to end your session and see totals

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT
