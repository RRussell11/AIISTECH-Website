# AIITech - AI-Native Automation & PSA Platform
## Website Landing Page Repository

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)](https://tailwindcss.com/)

> Converting mid-market service firms into pilot customers through vertical-specific automation solutions

## Overview

This repository contains the client-facing marketing website for AIITech Org, an AI-driven Professional Services Automation (PSA) platform integrated with intelligent automation services [file:7]. The website targets mid-market organizations (500-5,000 employees) in healthcare, manufacturing, and BFSI sectors.

### Primary Goals
- Convert visitors into qualified leads through automation readiness assessments
- Achieve 5-10 qualified leads per month
- Demonstrate 280% average ROI and 18-month payback periods
- Drive pilot engagements within 60-90 days

## Features

### Core Pages
- **Homepage**: AI-native platform introduction with interactive workflow demonstrations
- **Solutions Hub**: Vertical-specific pages for Healthcare, Manufacturing, BFSI, and Professional Services
- **Services**: Implementation, Managed Services (Bronze/Silver/Gold), and Advisory offerings
- **Pricing**: Transparent PSA tiers, bundled packages, and interactive ROI calculator
- **Case Studies**: Social proof with detailed customer success metrics
- **Blog**: Thought leadership content for SEO and organic lead generation

### Key Components
- 🎯 **Interactive ROI Calculator**: Real-time calculations based on industry and transaction volume
- 📊 **Live Platform Demo**: Tab-based interface showcasing Projects, Time Tracking, Billing, Resources, Automation, and Analytics
- 🔒 **HIPAA/SOC 2 Compliance Badges**: Trust signals for healthcare and financial services clients
- 📱 **Fully Responsive**: Mobile-first design with dark mode support
- ⚡ **Performance Optimized**: Target page load under 1.5 seconds

## Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) - React-based with SSR/ISR support
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first with custom design system
- **Components**: [Radix UI](https://www.radix-ui.com/) or Headless UI - Accessible, unstyled primitives
- **Forms**: React Hook Form + Zod validation
- **Animations**: CSS transitions (0.3s smooth) + Canvas for interactive calculators
- **AI Integration**: [Google Gemini AI](https://ai.google.dev/) - Intelligent chat, recommendations, and content analysis

### Backend & Infrastructure
- **Hosting**: [Vercel](https://vercel.com/) or Netlify - Edge functions, automatic SSL
- **CDN**: [Cloudflare](https://www.cloudflare.com/) - Global performance, DDoS protection
- **CMS**: [Contentful](https://www.contentful.com/) or Sanity - Headless CMS for blog content
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL) - Case studies and metadata

### Analytics & Marketing
- **Analytics**: Google Analytics 4 (GA4) + Segment.io
- **Forms**: Typeform or HubSpot - Assessment lead capture
- **Heatmaps**: [Hotjar](https://www.hotjar.com/) - User behavior analysis
- **CRM**: HubSpot (free tier) or Mailchimp - Email automation
- **Scheduling**: [Calendly](https://calendly.com/) - Demo booking integration


## 🤖 Google Gemini AI Integration

This project features a comprehensive integration with Google's Gemini AI to power intelligent interactions, recommendations, and content analysis.

### Features

- ✅ **Streaming and Non-Streaming Responses**: Support for both real-time streaming and traditional request-response patterns
- ✅ **Conversation History Management**: Maintains context across multiple interactions
- ✅ **Type-Safe API**: Full TypeScript support with Zod validation
- ✅ **Reusable Components**: Pre-built chat interface and provider pattern
- ✅ **Custom Hook**: Easy-to-use `useGemini` hook for any component
- ✅ **Server-Side Security**: API keys never exposed to the client
- ✅ **Error Handling**: Comprehensive error handling and user feedback

### Quick Start

#### 1. Get a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

#### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API key:

```bash
GEMINI_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_GEMINI_MODEL=gemini-pro
```

#### 3. Install Dependencies

```bash
npm install
```

#### 4. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000/demo](http://localhost:3000/demo) to see the Gemini AI chat in action!

### Usage Examples

#### Using the GeminiChat Component

```tsx
import GeminiChat from '@/components/ai/GeminiChat';

export default function MyPage() {
  return (
    <div className="h-screen">
      <GeminiChat 
        stream={true}
        welcomeMessage="Hello! How can I help you today?"
      />
    </div>
  );
}
```

#### Using the useGemini Hook

```tsx
'use client';

import { useGemini } from '@/hooks/useGemini';

export default function CustomChatComponent() {
  const { messages, isLoading, sendMessage, clearHistory } = useGemini({
    stream: true,
  });

  const handleSend = async () => {
    await sendMessage("What are the benefits of AI automation?");
  };

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>
          <strong>{msg.role}:</strong> {msg.content}
        </div>
      ))}
      <button onClick={handleSend} disabled={isLoading}>
        Send Message
      </button>
    </div>
  );
}
```

#### Calling the API Route Directly

```typescript
const response = await fetch('/api/gemini', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Explain the ROI of automation',
    history: [], // Optional conversation history
    stream: false,
    model: 'gemini-pro'
  }),
});

const data = await response.json();
console.log(data.text);
```

### File Structure

```
/app
  /api
    /gemini
      route.ts              # API endpoint with streaming support
  /demo
    page.tsx                # Demo page showcasing Gemini chat
  layout.tsx                # Root layout
  page.tsx                  # Homepage
  globals.css               # Global styles

/components
  /ai
    GeminiChat.tsx          # Pre-built chat UI component
    GeminiProvider.tsx      # React Context provider

/hooks
  useGemini.ts              # Custom React hook for Gemini

/lib
  /gemini
    client.ts               # Server-side Gemini client
    types.ts                # TypeScript type definitions

.env.example                # Example environment variables
.env.local                  # Your actual environment variables (git-ignored)
```

### API Reference

#### POST /api/gemini

Request body:
```typescript
{
  prompt: string;          // The user's message (required)
  history?: Array<{        // Optional conversation history
    role: 'user' | 'model';
    content: string;
    timestamp?: number;
  }>;
  stream?: boolean;        // Enable streaming (default: false)
  model?: string;          // Model name (default: gemini-pro)
}
```

Response (non-streaming):
```typescript
{
  text: string;            // The AI's response
  error?: string;          // Error message if request failed
}
```

Response (streaming):
```
data: {"text": "chunk of text", "done": false}
data: {"text": "another chunk", "done": false}
data: {"text": "", "done": true}
```

### Integration Points

The Gemini AI integration can be used throughout the website:

1. **Interactive ROI Calculator** (`/pricing`): Provide intelligent recommendations based on user inputs
2. **Assessment Forms**: Analyze responses and generate personalized automation readiness insights
3. **Customer Support** (`/demo`): AI-powered chat widget for visitor queries
4. **Content Generation**: Assist in generating case study summaries or blog content previews

### Security Best Practices

✅ **Implemented Security Measures:**

- API key stored in environment variables (server-side only)
- Never exposed to client-side JavaScript
- Request validation using Zod schemas
- Error messages sanitized to prevent information leakage
- Input length limits to prevent abuse

⚠️ **Recommendations for Production:**

- Implement rate limiting (e.g., using `@vercel/rate-limit` or Redis)
- Add user authentication for personalized experiences
- Monitor API usage and set quotas
- Implement content filtering for user inputs
- Add logging for debugging and analytics
- Consider caching common queries to reduce API calls

### Available Models

- **gemini-pro**: Best for text-based interactions (chat, analysis, recommendations)
- **gemini-pro-vision**: For future image analysis capabilities

### Troubleshooting

**Build fails with Tailwind CSS error:**
```bash
npm install -D @tailwindcss/postcss
```

**API returns "GEMINI_API_KEY is not set":**
- Make sure `.env.local` exists with `GEMINI_API_KEY=your_key`
- Restart the development server after adding environment variables

**Streaming doesn't work:**
- Ensure your hosting platform supports streaming responses
- Vercel and most modern platforms support Server-Sent Events (SSE)

**Type errors with Zod:**
- This project uses Zod v4+ which uses `.issues` instead of `.errors`
- Make sure dependencies are up to date: `npm update`

### Testing

Test the integration:

```bash
# Start development server
npm run dev

# Visit the demo page
# http://localhost:3000/demo

# Try these prompts:
# - "What are the benefits of AI automation in healthcare?"
# - "How can I calculate ROI for automation projects?"
# - "Explain HIPAA compliance requirements"
```

### Future Enhancements

- [ ] Add conversation export/import
- [ ] Implement multi-modal capabilities (image analysis)
- [ ] Add voice input/output
- [ ] Create specialized assistants for different verticals (healthcare, manufacturing, BFSI)
- [ ] Implement RAG (Retrieval Augmented Generation) with company documentation
- [ ] Add A/B testing for prompt engineering
- [ ] Create analytics dashboard for AI interactions

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Google Gemini API key (free tier available)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/RRussell11/AIISTECH-Website.git
cd AIISTECH-Website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

---

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Google Gemini AI Documentation](https://ai.google.dev/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

