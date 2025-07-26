
# CS-Girlies-Team3

# MuseMood

MuseMood is a fullstack hackathon project that combines an AI-powered aesthetic generator with a mood-based journaling and creative platform. It uses React, Express, Tailwind CSS, Drizzle ORM, and Vite, and is ready for deployment on Render.

---

## Features
- **Aesthetic Generator:** Generates moodboards, outfits, playlists, and poems using AI (OpenAI API).
- **Mood-based Journal:** Users select a mood and receive creative content tailored to their feelings.
- **Authentication:** Google OAuth and local login support.
- **Profile & History:** Users can view their previous entries and generated content.
- **Glassmorphism UI:** Modern, dreamy purple gradient theme with enhanced effects.
- **Mobile Responsive:** Optimized for all devices.

---

## Tech Stack
- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **Backend:** Express, Drizzle ORM, PostgreSQL
- **AI Integration:** OpenAI API
- **Authentication:** Passport.js (Google OAuth, Local)
- **Deployment:** Render (fullstack Node.js)

---

## Folder Structure
```
MuseMood/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── ...
│   ├── index.html
│   ├── index.css
│   └── main.tsx
├── server/
│   ├── index.ts
│   ├── db.ts
│   ├── auth.ts
│   ├── routes.ts
│   ├── storage.ts
│   ├── vite.ts
│   └── services/
│       └── openai.ts
├── shared/
│   └── schema.ts
├── dist/
│   └── (frontend build output)
├── package.json
├── README.md
└── ...
```

---

## Setup & Development

### 1. Install dependencies
```sh
npm install
```

### 2. Environment variables
Create a `.env` file in the root with:
```
DATABASE_URL=your_postgres_url
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
OPENAI_API_KEY=your_openai_key
SESSION_SECRET=your_session_secret
```

### 3. Local development
- Start backend & frontend (dev mode):
  ```sh
  npm run dev
  ```
- Build frontend for production:
  ```sh
  npm run build
  ```
- Start fullstack server (after build):
  ```sh
  npm run start
  ```

---

## Key Files
- `client/src/pages/`: Main app pages (journal, landing, profile, results, etc.)
- `client/src/components/`: UI components (cards, buttons, navigation, etc.)
- `server/index.ts`: Express server entry point
- `server/routes.ts`: API routes
- `server/services/openai.ts`: AI integration
- `shared/schema.ts`: Shared types/schema
- `index.css`: Global styles, theme, effects
- `package.json`: Scripts, dependencies

---

## Team Notes
- All colors and UI are unified to a dreamy purple gradient theme.
- Backend serves static frontend from `/dist`.
- All changes are pushed to GitHub.
- For any issues, check build output and environment variables.

---

## Useful Scripts
- `npm run dev` — Start backend in dev mode
- `npm run build` — Build frontend for production
- `npm run start` — Start fullstack server (Express + React)
- `npm run check` — TypeScript check
- `npm run db:push` — Push Drizzle ORM migrations

---
---

## Additional Coding & Collaboration Tips
- **Branching:** Always create a new branch for features or fixes. Use clear names (e.g., `feature/spotify-integration`, `fix/journal-bug`).
- **Pull Requests:** Open PRs for all changes. Add a summary and tag reviewers. Use GitHub Discussions for questions.
- **Code Reviews:** Review teammates' PRs for logic, style, and security. Leave constructive comments.
- **Commit Messages:** Write clear, descriptive commit messages (e.g., `Add Spotify API integration for playlists`).
- **Environment Variables:** Never commit `.env` files. Share secrets securely (e.g., via Render dashboard or encrypted chat).
- **Testing:** Use Postman, VS Code REST Client, or Insomnia for API testing. For frontend, use React Testing Library for components.
- **Debugging:** Use `console.log` for quick debugging, but remove before merging. For backend, use VS Code debugger or `node --inspect`.
- **Error Handling:** Always handle errors in API routes and show user-friendly messages in the UI.
- **Documentation:** Update README and code comments when adding new features or APIs.
- **Design Consistency:** Use shared UI components and Tailwind classes. Refer to `index.css` for theme variables.
- **Accessibility:** Use semantic HTML, ARIA labels, and test with screen readers for inclusivity.
- **Mobile First:** Test UI on mobile devices/emulators. Use responsive Tailwind classes.
- **Database:** For schema changes, update `shared/schema.ts` and run Drizzle migrations. Document changes in PRs.
- **API Rate Limits:** Be mindful of OpenAI and Spotify API rate limits. Implement caching or retries if needed.
- **Resources:**
  - [OpenAI API Docs](https://platform.openai.com/docs)
  - [Spotify API Docs](https://developer.spotify.com/documentation/web-api/)
  - [Render Docs](https://render.com/docs)
  - [Drizzle ORM Docs](https://orm.drizzle.team/docs)
  - [Tailwind CSS Docs](https://tailwindcss.com/docs)
  - [React Docs](https://react.dev/)
- **Team Communication:** Use GitHub Issues for bugs/tasks, and a team chat (Discord/Slack/WhatsApp) for quick questions.
**Onboarding:** New members should:
  1. Read this README.
  2. Clone the repo.
  3. Set up `.env` with required secrets.
  4. Run `npm install` to install dependencies.
  5. Run `npm run db:push` to apply database migrations (Drizzle ORM).
  6. Run `npm run build` to build the frontend for production.
  7. Run `npm run dev` for development or `npm run start` for fullstack server.
- **Help:** If stuck, check code comments, README, or ask in the team chat. Document solutions for future reference.
  ---

## Work Needs to Be Done
- Integrate OpenAI API for generating poems, moodboards, and outfit descriptions (see `server/services/openai.ts`).
- Integrate Spotify API for playlist generation (requires Spotify developer credentials and API integration).
- Complete Journal page UI/UX and connect to backend for saving entries.
- Polish user profile/history page for better navigation and filtering.
- Add error handling and loading states to all major flows.
- Improve mobile responsiveness and accessibility.
- Write more tests for backend and frontend components.
- Add documentation for API endpoints and data models.

---

## Integrations
- **OpenAI API:** Used for generating creative content (poems, moodboards, outfit ideas). See `server/services/openai.ts` for integration points. Requires `OPENAI_API_KEY` in `.env`.
- **Spotify API:** To be used for playlist generation. Will require OAuth flow and API calls to fetch playlists based on mood. Add `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` to `.env` when ready.

---

## User Flow
1. **Landing Page:** User arrives, sees intro and can log in (Google or local).
2. **Mood Selector:** User selects their current mood from options.
3. **Journal Entry:** User writes a journal entry and submits.
4. **AI Generation:** Backend uses OpenAI API to generate:
   - Poem
   - Moodboard (image links/descriptions)
   - Outfit suggestion
   - Playlist (via Spotify API, once integrated)
5. **Results Page:** User sees all generated content (poem, moodboard, outfit, playlist).
6. **Profile/History:** User can view previous entries and generated content.
7. **Navigation:** User can log out, view profile, or start a new journal entry.

---
#
# Additional Coding Tips
- Use TypeScript types from `shared/schema.ts` for consistency between frontend and backend.
- For new API routes, add them in `server/routes.ts` and document them in the README/API section.
- Use React hooks from `client/src/hooks/` for state and effect management.
- For UI, prefer using components from `client/src/components/ui/` for design consistency.
- Use Tailwind CSS utility classes for styling; global theme is set in `index.css`.
- When integrating new APIs (OpenAI, Spotify), store credentials in `.env` and never commit `.env` to git.
- Test backend endpoints with Postman or VS Code REST Client extension.
- Use `npm run check` to catch TypeScript errors early.
- For database changes, use Drizzle ORM migrations (`npm run db:push`).
- Always pull latest changes before starting new work and resolve merge conflicts promptly.
- Add comments to complex logic and keep code modular for easier collaboration.
- If stuck, check code comments, README, or ask in the team chat.
Happy hacking! 🚀
#
## Contact
For questions or help, reach out to the team lead or check the code comments for guidance.

---



