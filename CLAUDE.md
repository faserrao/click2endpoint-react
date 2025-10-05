# Click2Endpoint React - Project Context

## Project Overview
Interactive wizard that helps users find the perfect C2M API endpoint for their document submission needs. Migrated from Streamlit to React for better UX and deployment flexibility.

**Repository:** https://github.com/faserrao/click2endpoint-react
**Deployed:** https://click2endpoint-react.vercel.app (phase1-ux-improvements branch)
**Location:** `~/Dropbox/Customers/c2m/projects/c2m-api/C2M_API_v2/click2endpoint/click2endpoint-react/`

---

## Branch Strategy

### Current Branches

1. **`original`** - Initial Streamlit migration
   - Base React/TypeScript/Vite setup
   - 8 endpoint mappings
   - Basic wizard flow
   - Code generation (Python/JS/cURL)
   - Local Express server for execution

2. **`phase1-ux-improvements`** - UX enhancements (DEPLOYED TO VERCEL)
   - Next/Back navigation buttons
   - Settings modal for credentials
   - Brighter credentials reminder card (yellow/orange gradient)
   - Mock server integration
   - Parameter collection forms
   - Three-panel layout (Result, Code Generator, Execution Output)

3. **`phase2-nlp-ai`** - AI/NLP features (DEVELOPMENT ONLY)
   - OpenAI GPT-4o-mini integration
   - Natural language use case parsing
   - AI suggestion badges in wizard
   - Feedback collection system
   - Audit logging (localStorage)
   - **Not for production deployment** - just R&D

4. **`phase3-aws-backend`** - AWS integration (PLANNED)
   - Reuse c2m-api-v2-security authentication service
   - Vercel serverless functions (replace local Express server)
   - Real AWS Cognito authentication
   - Production-ready security
   - Will replace phase1 when complete
   - See: `PHASE3_AWS_BACKEND_IMPLEMENTATION_PLAN.md`

---

## Key Architecture

### Current (Phase 1 - Deployed)
```
User → React Frontend (Vercel) → Local Express Server → Mock Server
                                   (localhost:3001)
```

### Target (Phase 3 - Planned)
```
User → React Frontend (Vercel) → Vercel Serverless → AWS Auth Service
                                    Functions         (API Gateway + Lambda + Cognito)
                                                    ↓
                                                  Mock/Production API
```

---

## Test Credentials

### Phase 1 (Current - Mock Server)
- **Client ID:** `test-client-123`
- **Client Secret:** `super-secret-password-123` (WRONG for AWS)
- **Mock Server:** `https://cd140b74-ed23-4980-834b-a966ac3393c1.mock.pstmn.io`
- **Note:** Auth endpoints return 401 (mock doesn't have auth implementation)

### Phase 3 (AWS - Correct Credentials)
- **Client ID:** `test-client-123`
- **Client Secret:** `test-secret-456` (CORRECT for AWS Cognito)
- **Auth URL:** `https://j0dos52r5e.execute-api.us-east-1.amazonaws.com/dev/auth/`
- **Source:** c2m-api-v2-security repo `.env` file

---

## Environment Variables

### Development (`.env.local`)
```bash
# Mock Server
VITE_DEFAULT_MOCK_URL=https://cd140b74-ed23-4980-834b-a966ac3393c1.mock.pstmn.io

# Postman API (optional - for mock server discovery)
VITE_POSTMAN_API_KEY_PERSONAL=
VITE_POSTMAN_API_KEY_TEAM=

# OpenAI (phase2 only)
VITE_OPENAI_API_KEY=sk-proj-...
```

### Vercel (Production - Phase 1)
- `VITE_POSTMAN_API_KEY_PERSONAL` - Set to your Postman personal API key
- `VITE_POSTMAN_API_KEY_TEAM` - Set to your Postman team API key (optional)
- No OpenAI key needed (phase2 not deployed)

### Vercel (Production - Phase 3)
- `VITE_AUTH_BASE_URL` - AWS auth endpoint
- `VITE_API_BASE_URL` - Production API URL (when available)
- No client credentials (handled server-side in Vercel functions)

---

## Port Allocation

- **5173** - Vite dev server (React frontend)
- **3001** - Express server (code execution)
- **3002** - Reserved for future backend services

Registered in: `/Users/frankserrao/Dropbox/Customers/stellario/projects/services`

---

## Key Files & Locations

### Configuration
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript settings
- `package.json` - Dependencies and scripts
- `.env.local` - Local environment variables (gitignored)

### Core Components
- `src/App.tsx` - Main application, routing, state management
- `src/components/QuestionCard.tsx` - Wizard question UI
- `src/components/ResultCard.tsx` - Endpoint recommendation display
- `src/components/CodeGenerator.tsx` - Python/JS/cURL code generation
- `src/components/ExecutionOutput.tsx` - Code execution results
- `src/components/ParameterCollector.tsx` - Dynamic parameter forms
- `src/components/SettingsModal.tsx` - Configuration UI (phase1+)
- `src/components/AIInput.tsx` - Natural language input (phase2 only)
- `src/components/AIFeedback.tsx` - AI feedback collection (phase2 only)

### Services
- `src/services/authService.ts` - AWS Cognito authentication (phase3)
- `src/services/postmanApi.ts` - Mock server discovery
- `src/services/nlpService.ts` - OpenAI integration (phase2 only)
- `src/utils/settings.ts` - localStorage settings management
- `src/utils/codeGenerators.ts` - Code template generation

### Data
- `src/data/questions.ts` - Wizard questions and decision tree
- `src/data/endpointMap.ts` - 8 endpoint configurations
- `src/data/ebnfSchemas.ts` - Parameter schemas for forms

### Backend
- `server.js` - Express server for code execution (phase1)
- `api/execute-code.ts` - Vercel serverless function (phase3 - planned)

### Documentation
- `PHASE3_AWS_BACKEND_IMPLEMENTATION_PLAN.md` - Phase 3 implementation guide
- `README.md` - Project overview and setup
- `click2endpoint-react-claude.log` - Session log (this session)

---

## Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Start dev server (Vite + Express)
npm run dev:all

# Or run separately
npm run dev        # Vite only (port 5173)
node server.js     # Express only (port 3001)
```

### Build & Deploy
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel
git push origin phase1-ux-improvements  # Auto-deploys
```

### Testing
```bash
# Run tests (when implemented)
npm test

# Type checking
npm run type-check
```

---

## Recent Changes

### 2025-10-04 (Evening) - Phase 3 AWS Backend Implementation Started
- ✅ Created `src/services/authService.ts` with AWS Cognito integration
  - Two-token flow (long-term 30-90 days → short-term 15 min)
  - sessionStorage for token caching (more secure than localStorage)
  - Automatic token refresh with expiry checking
  - Test connection functionality
- ✅ Updated `src/utils/codeGenerators.ts`
  - Fixed AUTH_BASE_URL to include `/auth` suffix
  - Updated default credentials: `test-secret-456` (AWS correct)
- ✅ Updated `src/components/AuthCredentials.tsx`
  - Changed default secret to `test-secret-456`
- ✅ Enhanced `src/components/SettingsModal.tsx`
  - Added "Test Connection" button with loading/success/error states
  - Status indicator with color-coded messages
  - Icon indicators (CheckCircle/XCircle/Loader)
- ✅ Updated environment variables
  - `.env.example` - Added VITE_DEFAULT_CLIENT_ID/SECRET
  - `.env.local` - Updated AUTH_BASE_URL with `/auth` suffix
- ⏳ Vercel serverless functions - Next task
- ⏳ Production deployment - Next task

### 2025-10-04 (Afternoon) - Phase 2 NLP/AI & Phase 3 Planning
- ✅ Created `nlpService.ts` with OpenAI GPT-4o-mini integration
- ✅ Created `AIInput.tsx` for natural language use case parsing
- ✅ Added AI suggestion badges to wizard (sparkle icons)
- ✅ Created `AIFeedback.tsx` for thumbs up/down feedback
- ✅ Implemented audit logging in localStorage
- ✅ Fixed import path bugs, model name, handleComplete crash
- ✅ Environment variable auto-loading from `.env.local`
- ✅ Made credentials reminder card more noticeable (yellow/orange gradient)
- ✅ Changed icon from gear to ⚠️ for urgency
- ✅ Added glowing border and high-contrast button
- ✅ Pushed phase1-ux-improvements to Vercel
- ✅ Created `PHASE3_AWS_BACKEND_IMPLEMENTATION_PLAN.md`
- ✅ Decided to reuse c2m-api-v2-security service
- ✅ Discovered correct AWS test credentials
- ✅ Planned 3-week implementation timeline

---

## Known Issues

### Phase 1 (Deployed)
- ❌ Deployed app has wrong credentials in localStorage (user must clear/update manually)
- ❌ Mock server auth endpoints return 401 (expected - no auth implementation)
- ⚠️ Postman API keys exposed in frontend (acceptable for demo, not for production)
- ⚠️ Local Express server required for code execution (not cloud-based)

### Phase 2 (Development)
- ⚠️ OpenAI API key exposed in frontend (not secure for production)
- ⚠️ AI suggestion badges sometimes don't show (timing issue with state)
- ⏳ Need to validate AI accuracy with more test cases

### Phase 3 (Planned)
- ⏳ Not implemented yet
- ⏳ Need to create Vercel serverless functions
- ⏳ Need to implement secure token storage
- ⏳ Need to sandbox code execution

---

## Next Steps

### Immediate (Optional)
- [ ] Test Phase 2 AI features with more use cases
- [ ] Improve AI prompt for better accuracy
- [ ] Add rate limiting to OpenAI calls

### Phase 3 Implementation (In Progress)
- [✅] Create `authService.ts` with AWS Cognito integration
- [✅] Fix credential defaults to use `test-secret-456`
- [✅] Add Test Connection UI to Settings modal
- [✅] Update environment variables configuration
- [ ] Test auth flow with deployed AWS endpoints
- [ ] Create Vercel serverless function for code execution
- [ ] Remove local Express server dependency
- [ ] Add comprehensive error handling
- [ ] Implement security sandbox for code execution
- [ ] Add monitoring and logging
- [ ] Deploy to Vercel and replace Phase 1

---

## Related Projects

### c2m-api-v2-security
- **Purpose:** AWS Cognito authentication service
- **Location:** `~/Dropbox/Customers/c2m/projects/c2m-api/C2M_API_v2/c2m-api-v2-security/`
- **Auth URL:** `https://j0dos52r5e.execute-api.us-east-1.amazonaws.com/dev/auth/`
- **Stack:** C2MCognitoAuthStack-dev
- **Credentials:** test-client-123 / test-secret-456

### c2m-api-repo
- **Purpose:** Main C2M API specification and Postman collections
- **Location:** `~/Dropbox/Customers/c2m/projects/c2m-api/C2M_API_v2/c2m-api-repo/`
- **Mock Server:** `https://cd140b74-ed23-4980-834b-a966ac3393c1.mock.pstmn.io`
- **Reference:** JWT authentication script at `postman/scripts/jwt-pre-request.js`

---

## Deployment Strategy

### Phase 1 (Current)
- Deployed to Vercel from `phase1-ux-improvements` branch
- Auto-deploys on push to this branch
- Temporary demo until Phase 3 is ready

### Phase 2 (Never Deploy)
- Development/research only
- Contains OpenAI integration (not production-ready)
- Security concerns with API key exposure

### Phase 3 (Future Production)
- Will replace Phase 1 deployment
- AWS backend integration
- Production-ready security
- Vercel serverless functions

---

## Important Notes

1. **Branch Independence:** All three feature branches (phase1, phase2, phase3) are independent
2. **Credentials Mismatch:** Phase 1 uses wrong secret (`super-secret-password-123` vs `test-secret-456`)
3. **Production Timeline:** Phase 3 estimated at 3 weeks when implementation starts
4. **Security:** Phase 1 and 2 are NOT production-ready security-wise
5. **User Storage:** localStorage used for settings (clear if credentials wrong on deployed app)

---

## Contact & Resources

- **GitHub:** https://github.com/faserrao/click2endpoint-react
- **Vercel:** https://click2endpoint-react.vercel.app
- **AWS Auth Service:** https://j0dos52r5e.execute-api.us-east-1.amazonaws.com/dev/auth/
- **Documentation:** See `PHASE3_AWS_BACKEND_IMPLEMENTATION_PLAN.md` for Phase 3 details

---

**Last Updated:** 2025-10-04 (Evening)
**Current Branch:** phase3-aws-backend (implementation in progress)
**Status:** Phase 1 deployed, Phase 2 complete (not deployed), Phase 3 auth integration complete (serverless functions pending)
