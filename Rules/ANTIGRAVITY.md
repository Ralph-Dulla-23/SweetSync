# SweetSync — Antigravity Vibe Coding Guidelines

**Version:** 1.0  
**Last updated:** May 8, 2026  
**Author:** Raphael  
**Companion to:** `CLAUDE.md`, `TECH.md`, `DESIGN.md`, `RELATIONSHIPS.md`

---

## Table of contents

1. [Model selection guide](#model-selection-guide)
2. [Before every mission](#before-every-mission)
3. [Mission structure guidelines](#mission-structure-guidelines)
4. [Guardrails — what to auto-execute vs always review](#guardrails--what-to-auto-execute-vs-always-review)
5. [SweetSync-specific agent rules](#sweetsync-specific-agent-rules)
6. [MCP servers to install](#mcp-servers-to-install)
7. [Skills to configure](#skills-to-configure)
8. [High-risk areas — extra caution required](#high-risk-areas--extra-caution-required)
9. [Prompt templates for common tasks](#prompt-templates-for-common-tasks)
10. [What to never delegate to the agent](#what-to-never-delegate-to-the-agent)
11. [Recovery when things go wrong](#recovery-when-things-go-wrong)

---

## Model selection guide

Antigravity supports multiple models. Use the right one for the job — wrong model choice burns credits fast with no quality gain.

| Task | Model | Why |
|---|---|---|
| Planning and architecture decisions | Claude Opus 4.6 | Deeper reasoning on complex interdependencies (state machine, RLS, real-time) |
| Writing components and screens | Claude Sonnet 4.6 | Fast, accurate for React Native / TypeScript patterns |
| Debugging and error fixing | Gemini 3.1 Pro (High) | Strong at reading stack traces and Expo-specific errors |
| Boilerplate and repetitive code | Gemini 3 Flash | Cheap, fast for things like form screens, list items, basic hooks |
| Supabase schema, migrations, RLS | Claude Sonnet 4.6 | Better at SQL correctness and security policy logic |
| Edge Function writing | Claude Sonnet 4.6 | Understands Deno runtime nuances better than Flash |
| UI iteration and style polish | Gemini 3.1 Pro (Low) | Good at visual decisions without burning high-credit model |

**Never use Opus for:** tab completions, boilerplate, or anything you'd normally autocomplete. Reserve it for tasks where reasoning depth genuinely changes the output — architecture decisions, complex state logic, RLS policy design.

---

## Before every mission

Do these four things before starting any agent mission. Skipping them is where most vibe coding sessions go wrong.

**1. Commit or stash current work**

The agent will modify files. If something goes wrong mid-mission, you need a clean restore point.

```bash
git add -A && git commit -m "checkpoint: before [mission name]"
```

**2. Review the relevant documentation**

Tell the agent which files to read before starting. Always include:
- `CLAUDE.md` — project structure, code patterns, rules
- The relevant section from `DESIGN.md` for any UI work
- The relevant section from `TECH.md` for any backend work
- `RELATIONSHIPS.md` for any database or state work

Example mission opener:
```
Before starting, read CLAUDE.md, then the Color system and Cards sections 
of DESIGN.md. Do not begin until you have confirmed you understand the 
card variant system and the no-shadow rule.
```

**3. Write the implementation plan yourself first (for complex missions)**

For missions touching more than 3 files or involving state logic, write a rough plan before the agent does. The agent's plan is faster but yours is more accurate for SweetSync's specific constraints. Use yours as the prompt, let the agent refine it.

**4. Set terminal execution to "Request review" for risky sessions**

For anything touching the database, edge functions, or environment variables, set the terminal policy to "Request review" before the mission starts. For low-risk UI work, "Always proceed" is fine.

---

## Mission structure guidelines

### One feature at a time

Never ask the agent to build multiple features in a single mission. SweetSync has 5 phases and 44+ use cases — running them all at once produces tangled, inconsistent code.

Good mission scope:
- "Build the Room interior screen with member list and progress bar"
- "Implement the schedule upload flow — file picker, Supabase Storage upload, Edge Function call"
- "Build the group heat map component with tappable slots"

Bad mission scope:
- "Build the entire scheduling flow including upload, AI processing, voting, and confirmation"
- "Set up the full Supabase backend"

### Review every implementation plan

The agent generates `implementation_plan.md` before writing code. Read the entire plan before approving. Check specifically:

- Does it touch files you didn't expect?
- Does it propose a database change without a migration?
- Does it plan to call Gemini from the client instead of an Edge Function?
- Does it propose adding new color values instead of using `constants/theme.ts`?
- Does it plan to write state transition logic client-side?

If any of those are yes, leave a comment on the plan and the agent will revise before proceeding.

### Break large missions into phases

For screens with multiple interactive parts (like the Room interior with member list + progress + heat map + upload CTA), break into:

Phase 1: Static layout and UI only — no data, hardcoded props  
Phase 2: Hook up real Supabase data  
Phase 3: Add real-time subscription  
Phase 4: Edge case handling (empty states, loading, errors)

This prevents the agent from trying to wire everything simultaneously and producing a screen that looks right but breaks in ways that are hard to trace.

---

## Guardrails — what to auto-execute vs always review

### Terminal execution: Always proceed (safe)

```
npx expo start
npx tsc --noEmit
npx eslint .
npx prettier --write .
git status
git add
git diff
npm install [package]
npx expo install [package]
```

### Terminal execution: Request review (check before running)

```
supabase db push
supabase functions deploy
supabase gen types typescript
git commit
git push
rm -rf
Any command with environment variables
Any command writing to .env files
```

### Code changes: Auto-approve (low risk)

- Changes to `app/(tabs)/` screens — display only, no backend
- Changes to `components/` — UI components with no Supabase calls
- Changes to `constants/theme.ts` — only if explicitly requested
- Changes to `assets/`

### Code changes: Always review before accepting (high risk)

- Any change to `supabase/migrations/` — schema changes are irreversible in production
- Any change to `supabase/functions/` — API keys and external calls live here
- Any change to `lib/supabase.ts` — the client initialization touches auth
- Any new import of environment variables
- Any new Supabase table or policy
- Any change to `types/database.ts` — should only be regenerated by CLI, not hand-edited
- Any change to session state transition logic
- Any new npm package added to `package.json` — check Deno compatibility for Edge Functions

### Never accept without manual testing

- The invite link deep link flow — test on a real device, not simulator
- Push notification permission timing — test on a fresh install
- Any Supabase RLS policy change — test with a different user account
- The schedule upload OCR extraction — test with a real photo
- Voting tie resolution — manually simulate a tie scenario

---

## SweetSync-specific agent rules

Add these to your Antigravity user rules or paste them at the start of complex missions.

```
## SweetSync agent rules

### Design system
- NEVER hardcode hex colors. Always import from constants/theme.ts.
- NEVER use drop shadows on cards. Cards use tinted fill + 0.5px border only.
- Fraunces font is used ONLY for: splash screen title, onboarding headline, 
  room names, AI results headline, activity name on voting screen, 
  confirmed event name. Use Plus Jakarta Sans for everything else.
- Card variants are: peach (rooms/people), indigo (AI/slots), 
  mint (confirmed/success), neutral (passive). Never mix semantics.

### Architecture
- NEVER call the Gemini API from client-side code. 
  All Gemini calls go through supabase/functions/.
- NEVER write session state transitions client-side. 
  State changes go through Supabase and are validated server-side.
- Edge Functions run on Deno, not Node.js. 
  Use npm: specifier for packages. Check Deno compatibility first.
- ALWAYS clean up Supabase real-time channel subscriptions on component unmount.

### Database
- EVERY new table needs RLS enabled and policies defined before data is written.
- NEVER edit types/database.ts manually. 
  It is generated by: supabase gen types typescript --local > types/database.ts
- ALWAYS add a migration file for schema changes. Never alter tables directly.
- Use composite unique constraints for: votes(slot_id, user_id), 
  activity_votes(activity_id, user_id), schedules(room_id, user_id).

### Security
- API keys (GEMINI_API_KEY, SUPABASE_SERVICE_ROLE_KEY) 
  belong in Edge Function environment variables only. Never in the client.
- Invite tokens must expire. Default: 72 hours. 
  Never use plain room IDs in invite URLs.
- File uploads must be validated server-side: 
  accepted types jpeg/png/heic/pdf, max 10MB, check MIME from bytes not header.

### Error handling
- Never surface raw Supabase or Gemini error messages to users.
- Gemini 429 errors must retry with exponential backoff. Never fail immediately.
- All user-facing errors: "Something went wrong — try again."
```

---

## MCP servers to install

Open the MCP Store in Antigravity (Agent session → "..." → MCP Servers) and install these. Priority order — install the top three before writing any code.

### Priority 1 — Install immediately

**Supabase MCP**
```json
{
  "supabase": {
    "command": "npx",
    "args": ["-y", "@supabase/mcp-server-supabase@latest",
             "--supabase-url", "YOUR_SUPABASE_URL",
             "--supabase-key", "YOUR_SUPABASE_SERVICE_ROLE_KEY"]
  }
}
```
What it gives the agent: direct read access to your database schema, ability to run read-only queries, table exploration, type generation. The agent can see your actual table structure instead of guessing from code.

**Context7**
```json
{
  "context7": {
    "command": "npx",
    "args": ["-y", "@upstash/context7-mcp@latest"]
  }
}
```
What it gives the agent: up-to-date documentation for Expo, React Native, Supabase, TypeScript, and React Navigation. Without this, the agent uses its training data which may have outdated API patterns — especially important for Expo Router v3 and Supabase v2.

**Sequential Thinking**
Available directly in the MCP Store — click Install. What it gives the agent: structured multi-step reasoning for complex tasks. Critical for sessions involving the session state machine, RLS policy design, or real-time subscription architecture.

### Priority 2 — Install before building specific features

**Expo MCP** (when building navigation and native features)
```json
{
  "expo": {
    "command": "npx",
    "args": ["-y", "@expo/mcp-server@latest"]
  }
}
```
What it gives the agent: Expo SDK documentation, EAS Build configuration help, push notification setup guidance.

**Playwright MCP** (when testing screens with the Browser Sub-Agent)
Available in MCP Store. What it gives the agent: ability to run automated UI tests on the web preview of your Expo app, capture screenshots of rendered components, and verify heat map grid rendering.

**GitHub MCP** (when managing branches and PRs)
```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_TOKEN" }
  }
}
```
What it gives the agent: create branches per feature, open PRs, review diffs before committing. Keeps the vibe coding workflow from becoming a single giant commit history.

### Priority 3 — Nice to have

**Qdrant MCP** (for saving working code snippets)

Saves code patterns that work well — the heat map computation, the RLS policies, the card component — so the agent can retrieve them in future sessions instead of regenerating from scratch.

**Figma MCP** (if you export Stitch designs to Figma)

If you export your Google Stitch mockups to Figma, this lets the agent read the design file and generate component code that matches the mockup directly.

### mcp_config.json — full config

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest",
               "--supabase-url", "${SUPABASE_URL}",
               "--supabase-key", "${SUPABASE_SERVICE_ROLE_KEY}"]
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}" }
    },
    "expo": {
      "command": "npx",
      "args": ["-y", "@expo/mcp-server@latest"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

Note: Sequential Thinking and Playwright install via the MCP Store UI — no manual config needed.

---

## Skills to configure

Antigravity Skills are loaded on-demand — they sit dormant until a mission matches them. Add these to `.agent/skills/`.

### `sweetsync-design.md`

```markdown
# SweetSync design system skill

Trigger: any mission involving UI components, screens, styling, colors, 
         fonts, spacing, or visual changes.

Rules:
- Import all colors from @/constants/theme.ts — no hardcoded hex values
- Import all spacing from @/constants/spacing.ts
- Cards: use Card component with variant prop (peach/indigo/mint/neutral)
  Never inline card styles.
- Fraunces font: splash title, onboarding headline, room names (detail view),
  AI results headline, activity name on vote screen, confirmed event name only.
  Everything else: Plus Jakarta Sans.
- No drop shadows. Cards defined by 0.5px border + tinted fill only.
- Border radius: cards 16px, buttons/inputs 12px, pills 999px, avatars 999px
- Screen horizontal padding: 20px
- Card internal padding: 16px
- Gap between cards: 12px
- Gap between sections: 24px

Reference: DESIGN.md
```

### `sweetsync-supabase.md`

```markdown
# SweetSync Supabase skill

Trigger: any mission involving database queries, real-time subscriptions,
         Edge Functions, auth, storage, or RLS policies.

Rules:
- Import Supabase client from @/lib/supabase.ts — never create a new client
- Always handle errors explicitly: const { data, error } = await supabase...
- Real-time subscriptions: always return cleanup in useEffect
- Edge Functions: Deno runtime, use npm: specifier, never Node-specific APIs
- RLS: every new table needs policies before data is written
- Never call Gemini from client — always via Edge Function
- Migrations: always create a file in supabase/migrations/, never alter directly
- Types: never edit types/database.ts manually

Reference: TECH.md → Database, CLAUDE.md → Supabase query pattern
```

### `sweetsync-state.md`

```markdown
# SweetSync session state machine skill

Trigger: any mission involving session status, phase transitions,
         voting logic, or room state changes.

States: collecting → processing → voting_slots → voting_activity → confirmed → expired

Guard conditions:
- collecting → processing: all members have confirmed_at IS NOT NULL
- processing → voting_slots: Gemini returned ≥ 1 slot
- voting_slots → voting_activity: all voted OR voting_deadline passed
- voting_activity → confirmed: majority winner OR host breaks tie
- Any state → expired: 72 hours without completion

Rules:
- State transitions happen via Edge Functions only — never client-side
- Client reads state and renders accordingly
- Tie-breaking is host-only action
- Expired state can restart to collecting via host action

Reference: RELATIONSHIPS.md → Session state machine
```

---

## High-risk areas — extra caution required

### 1. Deep link through auth

The invite link preserves `roomId` through OAuth. If the agent touches `app/join.tsx` or `app/_layout.tsx`, review carefully. A broken deep link is the single biggest first-session drop-off risk and it's easy to accidentally overwrite.

### 2. RLS policies

Every RLS policy change is a security decision. Review every policy line by line. The agent can generate syntactically correct SQL that has a logical hole — for example, allowing members to read other rooms' data by not constraining the room_id filter correctly.

### 3. Edge Function environment variables

The agent should never write env vars to client-side code. If you see `process.env.GEMINI_API_KEY` anywhere outside of `supabase/functions/`, reject it immediately.

### 4. Real-time subscription cleanup

The agent often forgets the cleanup return in useEffect. Always check that every `supabase.channel().subscribe()` call has a corresponding `supabase.removeChannel(channel)` in the cleanup function.

### 5. Heat map computation placement

`getHeatShade()` lives in `lib/heatmap.ts` and runs client-side. The agent may try to inline this logic into the HeatMap component. Do not allow it — the function must stay isolated for the future server-side migration.

### 6. Fraunces font placement

The agent frequently puts Fraunces on screens where it doesn't belong — settings, inputs, notifications. Any time the agent writes `fontFamily: fonts.display`, check the screen against the screen-by-screen type rules in `DESIGN.md`.

---

## Prompt templates for common tasks

Copy and adapt these. The structure — context first, constraints second, deliverable third — produces the most consistent results.

### Building a new screen

```
Read CLAUDE.md and the [relevant section] of DESIGN.md before starting.

Build the [screen name] screen for SweetSync. 

Context:
- This screen is [phase X] of the scheduling flow
- The user arrives here by [navigation path]
- The data comes from [table/hook]

Design constraints:
- Use [peach/indigo/mint/neutral] card variant for the main cards
- Screen title uses [Fraunces display-lg / Plus Jakarta Sans heading-lg]
- No drop shadows. No hardcoded colors.

Deliverable:
- app/[path].tsx — the screen file
- components/[ComponentName].tsx — any new reusable components
- No backend connections yet — use hardcoded props for now

Do not start until you've shown me the implementation plan.
```

### Adding a Supabase query

```
Read CLAUDE.md → Supabase query pattern before starting.

Add a [read/write/subscribe] operation for [feature] in SweetSync.

Table: [table name]
Operation: [what it does]
When triggered: [user action or lifecycle event]
RLS requirements: [who can access this data]

Constraints:
- Use the Supabase client from @/lib/supabase.ts
- Handle the error case explicitly
- If real-time: include channel cleanup in useEffect return

Deliverable:
- hooks/use[Feature].ts — the hook
- RLS policy SQL in a comment at the top if new access pattern

Do not proceed if this requires a schema change — flag it first.
```

### Building an Edge Function

```
Read CLAUDE.md → Edge Function pattern and TECH.md → AI call flow before starting.

Build a Supabase Edge Function for [feature] in SweetSync.

Function name: [name]
Trigger: [webhook event / manual call]
What it does: [description]
External calls: [Gemini / Expo Push / none]

Constraints:
- Deno runtime — use npm: specifier for all packages
- Rate limit check before any Gemini call
- Validate file type and size before any Storage access
- Retry with exponential backoff on 429 errors
- Never return raw error messages in the response body
- API keys from environment variables only — never hardcoded

Deliverable:
- supabase/functions/[name]/index.ts
- Environment variable list (names only, not values)
```

### Debugging a real-time subscription

```
I have a real-time subscription bug in [component/screen].

Current behaviour: [what's happening]
Expected behaviour: [what should happen]

The subscription is on table [table] for event [INSERT/UPDATE/DELETE] 
filtered by [filter condition].

Check:
1. Is the channel being cleaned up on unmount?
2. Is the filter correct for the RLS policies in place?
3. Is the component re-subscribing on every render due to a missing dependency?
4. Is the Supabase project paused (free tier)?

Do not change any other files while investigating this.
```

---

## What to never delegate to the agent

Some decisions are yours. The agent can suggest, but you decide.

**Security decisions**
- Which RLS policies to apply and how strict to make them
- Whether invite tokens should expire on first use or on time
- What data is included in push notification payloads

**Architecture decisions**  
- When to move heat map computation from client-side to server-side
- Whether to add Google Calendar sync in v1
- Which Supabase compute tier to upgrade to

**The invite link deep link flow**
Write this yourself. It's too critical to the first-session experience and too easy for the agent to get subtly wrong.

**Environment variable setup**  
Set up `.env` files manually. Never let the agent write or read your actual key values.

**App Store metadata and screenshots**  
This is creative and strategic — not something to delegate.

---

## Recovery when things go wrong

### Agent made unexpected file changes

```bash
# See what changed
git diff

# Revert all unstaged changes
git checkout -- .

# Or revert specific file
git checkout -- app/[screen].tsx
```

### Agent broke the TypeScript build

```bash
npx tsc --noEmit
```

Read every error. Don't ask the agent to fix them all at once — fix one file at a time to avoid the agent introducing new errors while fixing old ones.

### Agent introduced a breaking Supabase schema change

```bash
# Check migration history
supabase migration list

# Roll back last migration locally
supabase db reset
```

Never run `supabase db push` on production without reviewing the migration file manually first.

### Agent is going in circles on a bug

Stop the mission. Commit what works, check out a clean branch, and start a new mission with a precise description of the failing behaviour. Include the exact error message and the exact file. Vague bug descriptions produce vague fixes.

### Credits running low mid-mission

Switch to Gemini 3 Flash for the remainder of the mission. It's fast enough for completing straightforward file changes once the architecture is already planned. Save Sonnet and Opus for new missions where reasoning from scratch is needed.
