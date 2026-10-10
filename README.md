# StressFree AI

**A private, supportive AI companion that helps someone pause, understand what
they feel, take one small step, and reach real human help when it matters.**

It is an emotional-wellbeing companion. It is **not** a therapist, doctor, or
counsellor, and it says so on every screen that could imply otherwise.

Built India-first: free at the point of need, trilingual (English, Hindi,
Gujarati), low-data, and wired directly to Tele-MANAS 14416 and the other
national helplines.

---

## The idea, in one screen

```
listen  →  reflect the feeling  →  ask ONE gentle question
        →  suggest ONE small action  →  check whether it helped
```

No lectures, no ten-tip lists, no toxic positivity, no fake certainty. When the
person is at risk, the conversation stops being a conversation and becomes a
route to a trained human being.

## What it is not

- Not a therapist, psychologist, psychiatrist or doctor, and not a replacement
  for one.
- It does not diagnose. It cannot tell you whether you have depression or
  anxiety, and it never will.
- It does not comment on medication, dosage or medical reports.
- It cannot keep you safe on its own. It is software, and software is not a
  person.

## Safety is the product, not a feature

The most important design decision in this repo: **safety runs before the model
and cannot be talked around.**

```
message ──▶ deterministic triage ──▶ level 3 (crisis)   ──▶ fixed, reviewed reply + helplines, stop
                    │                   level 2 (elevated) ──▶ safety check reply + helplines, stop
                    │                   level 0-1 ─────────▶ model ──▶ output guard ──▶ reply
                    └─ lexicon + negation + false-positive suppression, per language
```

- **`lib/safety/triage.ts`** — a deterministic lexicon across English, Hindi and
  Gujarati with negation handling, idioms suppression ("this exam is killing me"
  does **not** trigger the crisis path), plan/means/timeframe escalation, and
  risk kinds for suicide, self-harm, harm to others, abuse, medical emergency,
  exploitation and more.
- **`lib/safety/crisis.ts`** — the reviewed crisis and elevated replies. These
  are fixed strings, never model output. They state plainly that this is an AI,
  ask directly about immediate danger, and route to a trusted person and a
  helpline.
- **`lib/safety/outputGuard.ts`** — post-generation guard that strips
  diagnostic claims, medication talk and dependency-building language from
  model output.
- **`lib/helplines.ts`** — the only escalation targets the product ships with,
  each with `verifiedAgainst` recording where the number was last confirmed.
- **Under-18s** get guardian-aware mode: no memory between sessions, no
  profiling, and always a route to a trusted adult or Childline 1098.

**Personalisation never uses gender, caste, religion or any other immutable
trait.** The app adapts to what the person actually says: their stated need,
the domain of stress, the intensity, their age band and their chosen language.
"Boys have anger issues, girls have mood swings" is both clinically wrong and
harmful, and there is a comment in `lib/ai/prompt.ts` saying so, because that
assumption is the obvious wrong turn for a product like this.

## Features

| Area | What exists |
| --- | --- |
| Emotion-aware chat | Reflects, asks one question, offers one small action. Asks the person to confirm a guess rather than asserting it. |
| "What do you need now?" | vent · calm down · solve a problem · make a plan · distract me · talk to a human |
| Student mode | Exam planner with days-left and topic ticks, a 20-minute focus timer, three same-day goals, career-pressure reframes, faculty-conflict scripts, and a copyable email. |
| Calm tools | Box breathing (4-4-6-2), 5-4-3-2-1 grounding, one-line journal. |
| Mood check-in | 1-5 score, tags, note, two-week trend. |
| Support circle | Save trusted contacts and copy a message: *"I'm having a hard time; can we talk?"* |
| Privacy dashboard | See what is stored, export everything as JSON, delete the conversation, erase everything. |
| Multilingual | Full UI in English, Hindi, Gujarati — typed so a missing translation is a compile error. |
| PWA | Installable to the home screen while the native app is being built. |

## Repo layout

```
app/                    Next.js App Router
  api/chat/route.ts     the only path to the model: validate → runTurn → reply
  api/status/route.ts   which provider and rate-limit store are live
  api/resources/route.ts the curated helpline list, for the mobile client
  chat · tools · student · safety · privacy
components/             UI. ChatScreen, StudentMode, CrisisPanel, Grounding, …
lib/
  ai/                   provider adapters, system prompt, offline demo responder
  safety/               triage, crisis copy, output guard
  analysis.ts           domain / emotion heuristics for tool selection
  helplines.ts          curated, verified helplines
  i18n.ts               en / hi / gu copy
  client/               localStorage store and persistence
mobile/                 Expo app (see mobile/README.md)
scripts/smoke.mjs       safety regression suite
```

## Getting started

```bash
npm install
cp .env.example .env.local     # optional: with no key it runs in demo mode
npm run dev                    # http://localhost:3000
```

**It runs with no API key at all.** Replies then come from reviewed,
hand-written templates in `lib/ai/demo.ts`, and every safety path still works.
That is deliberate: the deployed site is never broken for a first visitor.

### Environment variables

| Variable | Required | What it does |
| --- | --- | --- |
| `GEMINI_API_KEY` | one of these two | Google Gemini. Free tier, strong Hindi/Gujarati. |
| `GEMINI_MODEL` | no | Defaults to `gemini-flash-latest`. Pin a dated model in production. |
| `OPENAI_API_KEY` | one of these two | Any OpenAI-compatible endpoint. |
| `OPENAI_BASE_URL` | no | Point it at Groq, Together, OpenRouter, Ollama, vLLM… |
| `OPENAI_MODEL` | no | Defaults to `gpt-4o-mini`. |
| `RATE_LIMIT_PER_MINUTE` | no | Defaults to 20. Applies per client key. |
| `REDIS_REST_URL`, `REDIS_REST_TOKEN` | no | Shared rate-limit store (Upstash Redis REST API). **Without these the limiter is per-instance and is not a real quota.** |

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project → import the repo.** Framework is detected as
   Next.js; no build settings to change.
3. Add environment variables, at minimum `GEMINI_API_KEY`. Add
   `REDIS_REST_URL`/`REDIS_REST_TOKEN` before you tell anyone about it, so the
   rate limit is shared across serverless instances.
4. Deploy. Then run the safety suite against the live URL:

   ```bash
   BASE_URL=https://your-app.vercel.app npm run smoke
   ```

5. Point the mobile app at it: set `EXPO_PUBLIC_API_BASE` in `mobile/.env` and
   rebuild (`mobile/README.md`).

## Verifying it works

```bash
npm run typecheck        # types
npm run lint             # lint
npm run build            # production build
npm run dev &            # then, against a running server:
npm run smoke            # safety regression suite
```

`scripts/smoke.mjs` is the part that must never regress. It asserts that:

- ordinary exam stress stays ordinary, and "this exam is killing me" does **not**
  trigger the crisis path (false positives are a product failure too);
- suicidal ideation and an explicit plan escalate to crisis mode, produce a
  **deterministic** reply, show the panel, and offer Tele-MANAS;
- abuse is detected, routes to the women's helpline, and never asks what the
  person did to provoke it;
- anger towards another person escalates and the reply discourages acting on it;
- Hindi and Gujarati crises are detected and answered in the right script;
- under-18s route to Childline and are told to involve an adult;
- empty and over-long messages are rejected, `GET /api/chat` is 405, and a burst
  is rate limited.

Run it after every deploy, and after every change to `lib/safety/`.

## Rules for anyone building on this

1. **Never diagnose** or name a condition, and never say the person does not
   have one either.
2. **Never** advise on medication, dosage, or interpret a report.
3. **Never** encourage emotional dependency. "You only need me" is a bug.
4. **Never** substitute a model for the crisis path.
5. **Never** personalise on gender, caste, religion or region.
6. **Never** promise confidentiality the software cannot keep.
7. Keep `lib/helplines.ts` accurate — re-verify every number before each release
   and delete anything you cannot confirm.

## Launch checklist

The code is the easy part. Before calling this a startup:

- [ ] Have a qualified psychologist or counsellor write and sign off the safety
      policy and the crisis-response scripts in `lib/safety/crisis.ts`.
- [ ] Interview 10–20 students anonymously about their real stress moments and
      what support they actually wanted.
- [ ] Have mental-health professionals red-team the model replies for harmful,
      dismissive or misleading output.
- [ ] Replace the safety-report email in `app/safety/page.tsx` with a monitored
      inbox, or remove the form. An unmonitored safety inbox is worse than none.
- [ ] Add Redis-backed rate limiting and a real abuse-reporting workflow.
- [ ] Publish a privacy policy and name a grievance officer — mandatory under
      India's DPDP Act 2023 the moment you store anything centrally.
- [ ] Market it as a wellbeing companion with clear limits. Do not claim it
      treats or detects depression.

## License

Not yet chosen. Decide before publishing, because it determines what others can
do with the safety work you have done here.
