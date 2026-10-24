# Monetization Guide / Guía de monetización

Sakura Requiem is designed to be **free to play, complete, and fair**. Nothing
is locked behind a paywall: all six chapters, the Rift Trials, the shop, all
relics and all three save slots are available to every player. The paid content
is cosmetic and optional.

This guide explains what is already implemented, how to connect a real store,
and what to change before you publish.

---

## 1. What ships in the box

| Feature | Status | Where |
| --- | --- | --- |
| Moonlight Supporter Pack (cosmetic costumes, 500 Embers, art card) | Implemented, code-based | `js/config.js`, `js/save.js`, `js/ui.js` |
| Supporter code entry screen | Implemented | Title → Support |
| Owner mode via URL (`?supporter=1`) | Implemented | `js/config.js` / `js/app.js` |
| Donation / store buttons | Placeholders | `js/config.js` → `support` |
| Ad slots | Disabled placeholders | `js/config.js` → `ads` |
| Privacy-friendly analytics stub | Disabled | `js/config.js` → `analytics` |
| Privacy policy and license | Included | `PRIVACY.md`, `LICENSE` |

### The supporter pack

The pack grants:

- **Moonlight costumes** — alternate colour palettes for Hana, Yuki and Ren,
  applied everywhere their portraits are drawn.
- **500 Embers** — the meta currency used for permanent upgrades and Rift
  Trials retries. Embers can also be earned by playing, so this is a
  convenience, not an exclusive advantage.
- **Art card** — a bonus illustration shown from the Support screen.

It never unlocks chapters, stats, relics or difficulty options.

---

## 2. Wiring up payments

### Option A — itch.io (recommended for a first release)

1. Create the game page on itch.io and upload a ZIP of this folder.
2. Set the game to **Free** and enable **"Pay what you want"** with a suggested
   price (for example US$4.99). This alone accepts donations.
3. Create a second project called *Sakura Requiem — Moonlight Supporter Pack*,
   priced at US$4.99, and upload a small text/PDF file containing one or more
   codes from `SR.config.premium.codes`.
4. itch.io generates a unique download key per buyer. You can either:
   - give every buyer the same code (simplest, honour-system), or
   - use itch.io's key API / a tiny serverless function to map each key to a
     code (stronger).
5. Put the store URL in `js/config.js`:

```js
support: {
  enabled: true,
  itch: 'https://your-handle.itch.io/sakura-requiem',
  kofi: '',
  patreon: '',
  github: 'https://github.com/your-handle/sakura-requiem',
  email: 'hello@example.com'
}
```

### Option B — Ko-fi / Buy Me a Coffee

Use a **Ko-fi Shop** item or a **Ko-fi Commission** for the supporter pack. Ko-fi
can deliver a file automatically after payment. Put the shop URL in
`support.kofi`. Donations can use the same link.

### Option C — Stripe Payment Links / Lemon Squeezy / Gumroad

1. Create a product priced at US$4.99.
2. Configure the success page or receipt to show the supporter code.
3. Paste the checkout URL into `support.itch` (the field is just a URL slot; you
   can rename it in `js/config.js` and the UI label in `js/i18n.js`).

For a stronger implementation, use the provider's webhook to email a code, or
serve the game from a small backend that validates a license key. The current
build is fully static, so validation is client-side by design.

### Option D — your own backend

If you want real license validation:

1. Add an endpoint such as `POST /api/redeem` that accepts a code and returns
   `{ ok: true }` only once per purchase.
2. Replace the `SR.Save.redeemCode` check with a `fetch` to that endpoint.
3. Keep an offline fallback so the game still works without a network.

Do **not** put Stripe secret keys, webhook secrets or private API tokens in this
repository. Anything in `js/` is public.

---

## 3. Changing the codes and price

Open `js/config.js`:

```js
premium: {
  enabled: true,
  productName: 'Moonlight Supporter Pack',
  price: '$4.99',
  codes: ['SAKURA-MOON-2026', 'PETAL-SUPPORTER'],
  bonusEmbers: 500,
  perks: ['moonlightSkins', 'bonusEmbers', 'artCard']
}
```

- **Change the codes before publishing.** The defaults are public in this repo.
- Codes are normalised: uppercase, spaces and dashes removed. `sakura moon 2026`
  matches `SAKURA-MOON-2026`.
- Add as many codes as you like. A buyer only needs one.
- To test the owner experience without a code, open
  `index.html?supporter=1` once; it enables the pack locally.

### A note on client-side codes

Because the game is static, a determined user can read the codes in
`js/config.js`. This is an **honour-system** model, common for small indie games
and "pay what you want" releases. It is honest, simple and has no server costs.
If revenue justifies it, move to server-side validation (Option D) or use
platform license keys.

---

## 4. Ads (optional, off by default)

Ads are disabled and no ad SDK is bundled. If you choose to enable them:

```js
ads: {
  enabled: true,
  provider: 'custom',
  showOnResults: true,
  showOnMap: false,
  slotHtml: '<div id="my-ad-slot"></div>'
}
```

Then load your provider's script in `index.html` and fill the slot. Keep these
rules in mind:

- **Never interrupt combat** or place ads over the command dock.
- **No ads on the title screen** or during story dialogue.
- **Consent first** in the EU/UK (GDPR/ePrivacy). Use a certified CMP.
- **No ads for children.** If you market to under-13s, disable ads entirely
  (COPPA).
- Ad networks such as AdSense often reject thin or low-traffic game pages.
  Sponsorships, itch.io, Ko-fi and direct sales usually earn more for a game
  this size.

Recommended: keep ads off. A single US$4.99 cosmetic pack with a 1–3% conversion
rate is usually better than ad revenue, and it respects players.

---

## 5. Analytics (optional, privacy-friendly)

The stub sends nothing while `enabled: false`. If you want to know which
chapters players reach, prefer cookieless tools:

- **GoatCounter** — free for non-commercial, simple script.
- **Plausible** / **Umami** — self-hostable or paid, GDPR-friendly.
- **Cloudflare Web Analytics** — free, no cookies.

Example with GoatCounter (add to `index.html`):

```html
<script data-goatcounter="https://YOURCODE.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>
```

Then set `analytics.enabled: true` in `js/config.js` so the game's own stub does
not double-count. Never send names, emails or save contents.

---

## 6. Pricing and positioning

| Product | Suggested price | Notes |
| --- | --- | --- |
| Base game | Free | Removes friction; the whole story is playable. |
| Moonlight Supporter Pack | US$4.99 | Cosmetic + convenience. $2.99–$7.99 all work. |
| Soundtrack / art book (future) | US$2.99–$5.99 | Requires exporting the procedural audio/art. |
| Donation | Any | Ko-fi / itch "pay what you want". |

Tips:

- Show the pack **after** the player has experienced a chapter, not on first
  launch. The current Support button is always available but never blocking.
- Use regional pricing on itch.io/Steam so the pack is affordable worldwide.
- Bundle the pack with the soundtrack later to raise average order value.
- Never sell power. If you add a paid relic, make an equivalent free one
  obtainable through play.

---

## 7. Launch checklist

- [ ] Replace the placeholder URLs in `js/config.js` (`support.*`).
- [ ] Replace the default supporter codes with private ones.
- [ ] Fill `support.email` and update `PRIVACY.md` contact section.
- [ ] Set the real price in `premium.price` and in the store listing.
- [ ] Add your domain to `og:url` (optional) and confirm `assets/og.png` renders
      on social platforms.
- [ ] Test a purchase end-to-end and redeem the code in a fresh browser profile.
- [ ] Confirm the game works from `file://` and over HTTPS.
- [ ] Add an age rating if your store requires one (itch.io uses IARC).
- [ ] Check the license of every asset — this project ships only original,
      code-generated art and audio, so there is nothing to clear.
- [ ] Publish `PRIVACY.md` at a public URL and link it from the store page.
- [ ] Keep the repository's `LICENSE` asset exception intact.

---

## 8. Legal and tax notes (not legal advice)

- **Original IP.** The name, characters, story, art and music in this repository
  are original. Do not add copyrighted anime art, fonts, music or sound effects
  without a licence.
- **Taxes.** Digital sales may require VAT/GST registration depending on your
  country and volume. itch.io and Lemon Squeezy can act as merchant of record and
  handle tax; direct Stripe sales usually do not.
- **Refunds.** Publish a refund policy on your store page. For digital goods,
  many jurisdictions allow a 14-day withdrawal unless you obtain explicit
  consent to immediate delivery.
- **Platform fees.** itch.io lets you choose the revenue share (default 10%);
  Ko-fi takes 0–5%; Stripe charges a per-transaction fee.
- **Claims.** Avoid claiming the game is "complete" if you plan to add paid DLC
  later; describe the pack as cosmetic support.

---

## 9. Revenue sketch

A rough model, not a promise:

| Monthly players | Conversion | Pack price | Gross |
| --- | --- | --- | --- |
| 1,000 | 1% | $4.99 | ~$50 |
| 10,000 | 2% | $4.99 | ~$998 |
| 50,000 | 2% | $4.99 | ~$4,990 |

After platform and payment fees (roughly 10–15%), subtract any hosting costs
(static hosting is often free). The best lever is not the price; it is reaching
players who enjoy turn-based RPGs.

---

## 10. Roadmap ideas that respect players

- **Soundtrack DLC** — export the Web Audio themes to WAV/MP3 and sell them.
- **Art book** — high-resolution character sheets and location concepts.
- **Cosmetic packs** — seasonal costumes, no stat changes.
- **"Name a spirit" tier** — a supporter's name in the credits (with consent).
- **Demo + wishlist** — publish the first two chapters free on itch.io and link
  to the full web build.

---

## Español (resumen)

- El juego es **gratis y completo**. El pack de apoyo es solo cosmético y otorga
  500 Brasas, trajes alternativos y una ilustración extra.
- Cambia los **códigos** en `js/config.js` antes de publicar: los actuales son
  públicos. El canje es del lado del cliente (sistema de confianza).
- Conecta tu tienda rellenando `support.itch`, `support.kofi` o `support.patreon`.
  Para pagos reales usa itch.io, Ko-fi Shop, Lemon Squeezy, Gumroad o Stripe
  Payment Links.
- Los **anuncios** y las **analíticas** están desactivados. Si los activas,
  cumple con el RGPD y no interrumpas el combate.
- No pongas claves secretas en `js/`: todo el código es público.
- Precio sugerido: **US$4.99** (rango $2.99–$7.99). Nunca vendas poder.
- Antes de lanzar: reemplaza URLs y correos, prueba una compra completa, publica
  `PRIVACY.md` y conserva la excepción de activos en `LICENSE`.

---

*This document is informational and is not legal, tax or financial advice.
Consult a professional for your jurisdiction.*
