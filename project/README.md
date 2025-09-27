# StreamLink - Universal Companion App

StreamLink is a comprehensive companion app for streamers and viewers that connects with existing platforms (Twitch, YouTube, Kick, Instagram, TikTok, X) to centralize identity, stats, engagement, rewards, and light monetization.

## 🚀 Features

### Core Features
- **Universal Identity**: User can be Viewer or Streamer (or both) with OAuth login support
- **Multi-Platform Aggregator**: Connect streamer accounts and fetch followers, views, likes, comments, shares, latest videos/clips, live status
- **Engagement & Loyalty**: Cross-platform points system with streamer-configurable rewards
- **Real-Time Interactions**: Polls and lightweight mini-games (trivia, predictions)
- **Simple Marketplace**: Streamer products/services with Stripe Checkout payments
- **Notifications & Live Status**: Subscriptions to favorite streamers with live notifications
- **Public Universal Streamer Profile**: Public page showing linked platforms, global stats, and recent content

### Tech Stack
- **Monorepo**: Turborepo with pnpm workspaces
- **Mobile**: React Native (Expo), TypeScript, React Query, Zustand, Expo Router
- **API**: Node.js + NestJS, Prisma ORM, PostgreSQL
- **Worker**: NestJS microservice with BullMQ/Redis for scheduled jobs
- **Auth**: JWT with OAuth (Google/Apple) integration
- **Payments**: Stripe Checkout with webhooks
- **Notifications**: Expo Push + Email notifications

## 📁 Project Structure

```
streamlink-monorepo/
├── apps/
│   └── mobile/                 # React Native mobile app
├── packages/
│   ├── config/                 # Shared configuration
│   └── ui/                     # Shared UI components
├── services/
│   ├── api/                    # NestJS API server
│   └── worker/                 # Background job processor
├── docker-compose.yml          # Local development services
├── turbo.json                  # Turborepo configuration
└── package.json               # Root package.json
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- pnpm 8+
- Docker & Docker Compose

### Quick Start

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd streamlink-monorepo
   pnpm install
   ```

2. **Start local services**:
   ```bash
   docker-compose up -d
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run database migrations and seed**:
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

5. **Start all services**:
   ```bash
   pnpm dev
   ```

This will start:
- API server on http://localhost:3001
- Worker service on http://localhost:3002
- Mobile app via Expo CLI

### Available Scripts

- `pnpm build` - Build all packages and services
- `pnpm dev` - Start all services in development mode
- `pnpm test` - Run tests across all packages
- `pnpm lint` - Lint all code
- `pnpm db:migrate` - Run database migrations
- `pnpm db:seed` - Seed database with demo data
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:reset` - Reset database (destructive)

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. Key entities include:

- **User**: Core user entity with role-based access (VIEWER/STREAMER/BOTH)
- **LinkedPlatformAccount**: Connected social media accounts
- **StreamerProfile/ViewerProfile**: Role-specific profile data
- **ContentItem**: Aggregated content from platforms
- **StatsSnapshot**: Daily analytics snapshots
- **Reward/Redemption**: Points-based reward system
- **Poll/MiniGame**: Interactive engagement features
- **Product/Order**: Marketplace functionality

## 🔧 API Documentation

The API is fully documented with OpenAPI/Swagger. Once the API server is running, visit:
- **Swagger UI**: http://localhost:3001/api/docs

### Key Endpoints

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/streamers/{id}/profile` - Public streamer profile
- `GET /api/v1/viewers/following` - User's followed streamers
- `POST /api/v1/interactions/polls` - Create poll
- `GET /api/v1/marketplace/products/{streamerId}` - Streamer products

## 📱 Mobile App

The mobile app is built with React Native and Expo, featuring:

- **Dark theme** with cyan/aqua accent colors
- **Tab navigation** with Home, Discover, Live, Rewards, and Profile screens
- **Authentication flow** with onboarding, login, and registration
- **Real-time interactions** for polls and mini-games
- **Points and rewards system** with redemption tracking
- **Responsive design** optimized for mobile devices

### Key Screens

1. **Home**: Dashboard showing live streamers and following list
2. **Discover**: Browse and follow new streamers
3. **Live**: Real-time interactions, polls, and mini-games
4. **Rewards**: Points balance and redemption history
5. **Profile**: User settings and account management

## 🔄 Background Jobs

The worker service handles scheduled tasks:

- **Every 10 minutes**: Check live status across platforms
- **Hourly**: Sync latest content and stats
- **Daily**: Create stats snapshots for analytics
- **Webhooks**: Process platform and payment webhooks

## 🔐 Security Features

- **JWT Authentication** with refresh token rotation
- **Encrypted platform tokens** at rest
- **Rate limiting** on API endpoints
- **RBAC guards** for role-based access control
- **GDPR compliance** with data export/deletion

## 🧪 Testing

The project includes comprehensive testing:

- **Unit tests** for core business logic
- **Integration tests** for API endpoints
- **E2E tests** for critical user flows
- **Mobile tests** with React Native Testing Library

Run tests with:
```bash
pnpm test
```

## 🚀 Deployment

The application is containerized and ready for deployment:

- **Docker images** for API and worker services
- **Kubernetes manifests** in `/k8s` directory
- **GitHub Actions** for CI/CD pipeline
- **Environment-specific** configuration

## 📊 Demo Data

The seed script creates demo data including:
- 1 demo streamer account
- 50 demo viewer accounts
- Sample content items and stats
- Rewards and redemptions
- 14 days of analytics snapshots

Login with demo accounts:
- **Streamer**: `streamer@example.com` / `password123`
- **Viewer**: `viewer1@example.com` / `password123`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run linting and tests
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the [API documentation](http://localhost:3001/api/docs)
- Review the database schema in `services/api/prisma/schema.prisma`
- Examine the mobile app structure in `apps/mobile/`

---

**StreamLink** - Connecting creators and communities across all platforms 🌟