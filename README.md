# Blueprint AI - Intelligent Test Case Generation Platform

Blueprint AI is an intelligent test case generation and management platform that leverages AI to help QA teams create comprehensive test cases, manage test runs, and integrate with Jira for seamless bug tracking.

## Features

### 🤖 AI-Powered Test Case Generation
- Generate comprehensive test cases using advanced AI models
- Support for BDD (Behavior-Driven Development) and Step-by-Step formats
- Intelligent coverage analysis and test methodology application
- Context-aware test case suggestions

### 📋 Test Management
- Organize test cases in hierarchical folder structures
- Create and manage test runs with assignment capabilities
- Track test execution status and results
- Generate detailed reports and analytics

### 👥 Collaborative Test Reviews
- Create test review requests with reviewer assignments
- Inline commenting system similar to GitHub PR reviews
- Approval workflow with status tracking
- Timeline view of review activities

### 🔗 Jira Integration
- Seamless OAuth integration with Jira
- Automatic bug creation for failed test cases
- Link test cases to Jira issues
- Configurable bug creation settings per project

### 🏢 Workspace Management
- Multi-workspace support with role-based access control
- Team member invitation and management
- Project-based access control
- Admin settings and configurations

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Authentication**: Supabase Auth with OAuth providers
- **AI Integration**: Google Vertex AI / Gemini
- **Deployment**: Vercel

## Project Structure

```
blueprint-ai/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── lib/                # Utilities and services
│   ├── hooks/              # Custom React hooks
│   └── types/              # TypeScript type definitions
├── supabase/
│   └── migrations/         # Database migrations
└── docs/                   # Documentation
```

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Supabase account and project
- Google Cloud account (for AI features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/vercel-appexert/sentinow-blueprint.git
cd sentinow-blueprint/blueprint-ai
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.sample .env
# Edit .env with your configuration
```

4. Start the development server:
```bash
pnpm dev
```

## Recent Updates

### Workspace Settings Improvements
- Enhanced WorkspaceSettings component with confirmation dialogs for member removal
- Improved UX with proper member deletion confirmation showing user details
- Added business email validation for workspace invitations
- Implemented resend invitation functionality with loading states
- Added proper error handling and toast notifications
- Improved UI with better spacing, icons, and status indicators

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Add tests if applicable
4. Submit a pull request

## License

This project is proprietary software developed by Appexert.