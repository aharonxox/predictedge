# Deploying PredictionEdge to Vercel

PredictionEdge is a Next.js 14 App Router app. It ships cleanly to Vercel with
zero custom build configuration.

> **No billing anywhere.** There is no Stripe, no subscriptions, no webhooks,
> no pricing or billing pages, and no payment flow in this project. Do not add
> them during deployment.

## 1. Create a Supabase project

1. Go to <https://supabase.com> and create a new project.
2. In **Project Settings → API**, grab:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. In **Authentication → Providers**, enable **Email**.
4. In **Authentication → URL Configuration**, set:
   - **Site URL**: `https://<your-vercel-domain>`
   - **Redirect URLs**: add `https://<your-vercel-domain>/login` and
     `https://<your-vercel-domain>/reset-password`.

That&rsquo;s all the Supabase setup required — PredictionEdge uses Supabase Auth
out of the box and stores the 10-day trial start timestamp inside the
authenticated user&rsquo;s `user_metadata.trial_started_at`. No additional SQL
migrations are needed.

## 2. Import the repository into Vercel

1. Visit <https://vercel.com/new>.
2. Select **Import Git Repository** and pick `predictedge`.
3. Framework preset: **Next.js** (auto-detected).
4. Root directory: `./`.
5. Build command: `next build` (default).
6. Output directory: `.next` (default).

## 3. Set environment variables in Vercel

In **Project → Settings → Environment Variables**, add the following for all
three environments (Production, Preview, Development):

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<your-project-ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `<your Supabase anon key>` |
| `NVIDIA_API_KEY` | `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` |
| `NVIDIA_NIM_BASE_URL` | `https://integrate.api.nvidia.com/v1` |
| `NVIDIA_NIM_MODEL` | `meta/llama-3.1-70b-instruct` |
| `NEXT_PUBLIC_SITE_URL` | `https://<your-vercel-domain>` |

Keep the `NVIDIA_API_KEY` **exactly** as shown above.

## 4. First deploy

Click **Deploy**. Vercel will install dependencies, run `next build`, and
publish:

- Pages: `/`, `/signup`, `/login`, `/reset-password`, `/dashboard`, `/picks`,
  `/markets`, `/ai-chat`, `/account`.
- API routes: `/api/auth/signup`, `/api/auth/login`, `/api/auth/logout`,
  `/api/auth/me`, `/api/auth/reset-password`, `/api/ai/chat`,
  `/api/data/prediction-arena`.

Once the first deploy is live, update the Supabase **Site URL** and
**Redirect URLs** to point at the final Vercel domain.

## 5. Preview deploys

Every PR automatically gets a Vercel preview deployment. The `middleware.ts`
route guard enforces authentication on all protected routes, so previews are
safe to share with teammates.

## 6. Smoke test checklist

After a deploy, verify:

- [ ] `/` renders the landing page.
- [ ] `/signup` creates an account and redirects (or shows the email
      confirmation message if Supabase email confirmations are enabled).
- [ ] `/login` signs you in and redirects to `/dashboard`.
- [ ] `/dashboard`, `/picks`, `/markets`, `/ai-chat`, `/account` are protected
      and redirect to `/login` when logged out.
- [ ] `/ai-chat` returns a response from NVIDIA NIM; if the upstream is down,
      the UI renders the structured fallback message.
- [ ] `/api/data/prediction-arena` returns `{ arena, picks, markets, trial }`
      for authenticated users.

## 7. Troubleshooting

- **500 on protected routes** — you&rsquo;re missing
  `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Emails not sending** — in Supabase, verify the SMTP settings under
  Authentication → Emails, or enable the built-in provider for testing.
- **AI responses say &ldquo;fallback&rdquo;** — the UI never breaks; check
  `NVIDIA_API_KEY` and `NVIDIA_NIM_BASE_URL`, then look at the Vercel function
  logs for the precise error. PredictionEdge always falls back to structured
  research guidance when NVIDIA NIM is unreachable.

That&rsquo;s it — PredictionEdge is production-ready on Vercel.
