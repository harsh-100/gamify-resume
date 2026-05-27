# Assets Required — Harsh's Dev Quest

This document lists **every visual, audio, and text asset** the game needs. Each entry says:

- **Source plan** — one of:
  - 🟢 **Free library** — can be pulled from Kenney.nl / itch.io / OpenGameArt with zero custom work
  - 🟡 **Library + edit** — start from a free asset, palette-swap or recolor to match the style guide
  - 🔴 **Custom / generate** — you need to provide it (AI-generated, hand-drawn, or commissioned)
- **Spec** — exact dimensions, frame count, format
- **Description** — the prompt-grade description you can paste into an image generator

> **Master style rules** (apply to everything visual):
> - **Aesthetic:** Retro 8/16-bit pixel art, sharp pixels, no anti-aliasing
> - **Palette:** 16 colors. Recommend the *Sweetie 16* palette from Lospec — it includes warm yellows (for Jaipur), cool blues (for Dortmund), greens, purples
> - **Player sprite size:** 32×32 px
> - **Tile size:** 16×16 px
> - **Enemy size:** 32×32 px
> - **Backgrounds:** 960×540 px (game's logical resolution)
> - **Format:** PNG, transparency where needed
> - **Style references when prompting AI:** "16-bit pixel art, Stardew Valley style, Sweetie 16 palette, sharp pixels, no anti-aliasing, transparent background"

---

## 1. Character Sprites

### 1.1 Player — Harsh (the protagonist)
- **Source plan:** 🔴 Custom / generate (this is the most important sprite — it's *you*)
- **Spec:** Single sprite sheet, 32×32 per frame. Needs these animations on one sheet:
  - Idle — 2 frames
  - Run — 4 frames
  - Jump — 1 frame
  - Fall — 1 frame
- **Description for generation:**
  > 16-bit pixel art character sprite sheet, 32×32 per frame, transparent background. A young South Asian man with short dark hair, wearing a casual purple/blue hoodie and dark jeans, sneakers. Friendly face, slight smile. Confident posture. Provide 8 frames in a single horizontal strip in this order: 2 idle frames (subtle breathing), 4 running frames (left foot fwd, mid, right foot fwd, mid), 1 jumping frame (arms up, legs tucked), 1 falling frame (arms out). Sweetie 16 palette, sharp pixels, no anti-aliasing.
- **File:** `public/assets/sprites/player.png`
- **Notes:** Optionally provide a second sheet for Level 7+ (Germany) where he's wearing a coat — adds visual progression. Marked 🟡 optional.

### 1.2 Player progression variants (optional)
- **Source plan:** 🟡 Edit the base sprite
- **Variants:**
  - Level 1–3: Hoodie + jeans (base sprite)
  - Level 4–5: Casual shirt (slightly more "professional" look)
  - Level 6: Office wear / button-up
  - Level 7–8: Adds a coat (Germany winter)
- **Description:** Same character, same sheet structure, just clothing swap. Only do this if you want the polish — game works fine with one sprite.

---

## 2. Enemies / Obstacles

### 2.1 "Bug" enemy (generic, used in Levels 1–3)
- **Source plan:** 🟢 Free library (Kenney's Pixel Platformer pack has bug enemies)
- **Spec:** 32×32, 2-frame walk animation
- **Description if generating:** Cute pixel-art beetle/bug, 32×32, side-view, walking animation 2 frames, red shell with black spots, friendly not scary. Sweetie 16 palette.
- **File:** `public/assets/sprites/bug.png`

### 2.2 "Confusion cloud" (Level 1 — Jaipur)
- **Source plan:** 🔴 Custom / generate
- **Spec:** 32×32, 3-frame loop (gentle pulse)
- **Description:** A small pixel-art question-mark cloud, 32×32, 3 frames pulsing softly. Light grey wisps with a yellow `?` symbol in the center. Slightly transparent edges. Sweetie 16 palette.
- **File:** `public/assets/sprites/confusion-cloud.png`

### 2.3 "Browser-compat bug" (Level 2 — Tribal Connect)
- **Source plan:** 🟡 Library + edit (palette-swap two copies of the base bug)
- **Spec:** Two variants of the base bug — one blue (Chrome), one teal (IE)
- **Description:** Same 32×32 bug sprite, palette-swapped to blue and teal-grey
- **File:** `public/assets/sprites/bug-chrome.png`, `bug-ie.png`

### 2.4 "PostgreSQL elephant boss" (Level 3 — IMG Global)
- **Source plan:** 🔴 Custom / generate
- **Spec:** 64×64, 2-frame walk
- **Description:** Pixel-art elephant boss enemy, 64×64, side-view, dark blue color to evoke PostgreSQL's logo. Friendly cartoonish, not scary. 2-frame walking animation. Small crown or "DB" symbol on its back. Sweetie 16 palette.
- **File:** `public/assets/sprites/postgres-boss.png`

### 2.5 "Code review red marks" (Level 4 — Ongraph Trainee)
- **Source plan:** 🟢 Free library (or just CSS-draw a red squiggle if generating is overkill)
- **Spec:** 16×16, 2-frame wiggle
- **Description:** Pixel art red squiggly underline, 16×16, like a spellcheck underline. 2-frame subtle wiggle.
- **File:** `public/assets/sprites/red-mark.png`

### 2.6 "Flaky test platform" (Level 5 — Ongraph Dev)
- **Source plan:** 🟡 Reuse base platform tile, add a flicker animation in code (no extra asset needed)

### 2.7 "Type Error giant" boss (Level 5 — Ongraph Dev)
- **Source plan:** 🔴 Custom / generate
- **Spec:** 96×96, 2-frame idle
- **Description:** Large pixel-art monster boss, 96×96, made of glowing red error text fragments, vaguely humanoid shape. Looks like a "TypeError" come to life. Red and orange glow. Sweetie 16 palette.
- **File:** `public/assets/sprites/type-error-boss.png`

### 2.8 "Manual paper stack" (Level 6 — Celebal)
- **Source plan:** 🔴 Custom / generate
- **Spec:** 32×32, 2-frame shuffle
- **Description:** Pixel-art stack of paper documents, 32×32, side-view, vaguely cartoonish with arms/legs hinted (paperwork that walks). 2-frame shuffle animation. Beige/white papers with grey text lines. Sweetie 16 palette.
- **File:** `public/assets/sprites/paper-stack.png`

### 2.9 "Scaling spike" (Level 7 — Dortmund)
- **Source plan:** 🟡 Reuse platform tile, scale dynamically in code

---

## 3. Skill Orbs (collectibles)

All skill orbs share the same 16×16 base shape — a glowing circle with a tech logo inside. This makes them feel like a set.

### 3.1 Base orb sprite
- **Source plan:** 🔴 Custom / generate (one base + logo overlays)
- **Spec:** 16×16, 4-frame glow animation
- **Description:** Pixel-art glowing energy orb, 16×16, circular, soft white glow with a colored core. 4-frame pulse animation. Transparent background. Sweetie 16 palette.
- **File:** `public/assets/sprites/orb-base.png`

### 3.2 Tech logos (icon overlay per skill)
- **Source plan:** 🟢 Free library — Simple Icons (simpleicons.org) has SVGs for virtually every tech listed. Convert to 12×12 pixel art either by hand or with an SVG-to-pixelart converter.
- **Logos needed** (from your real timeline):
  - Level 1: C, C++, Java, HTML, CSS, JavaScript, MySQL
  - Level 2: HTML, CSS, PHP, MySQL *(dedupe with Level 1 — same orb sprites reused)*
  - Level 3: Node.js, Express, JWT, PostgreSQL, EJS
  - Level 4: JavaScript, React, Node.js, Express, MongoDB
  - Level 5: Next.js, Redux, Supabase, TypeScript, Playwright, Prisma
  - Level 6: Power Apps, Power Automate, Dataverse, Model-Driven Apps, Canvas Apps
  - Level 7: System Design, System Architecture, VM, Cloud, Docker, Kubernetes, DevOps, MySQL
- **Total unique orbs:** ~28
- **Files:** `public/assets/sprites/orbs/{techname}.png` (e.g. `react.png`, `nodejs.png`)
- **Notes:** "System Design" / "System Architecture" / "DevOps" don't have official logos — generate simple icon glyphs for those (a blueprint icon, a network-node icon, an infinity loop respectively).

---

## 4. Tilesets (platforms & ground)

### 4.1 Generic platformer tileset
- **Source plan:** 🟢 Free library — **Kenney's Pixel Platformer** (CC0). Use this as the base for every level's platforms.
- **Spec:** 16×16 tiles, includes ground, edges, corners, platform variants
- **File:** `public/assets/tilesets/platforms.png`

### 4.2 Per-level palette variants
- **Source plan:** 🟡 Library + recolor — take the Kenney tileset and palette-swap per level theme
- **Variants needed:** Jaipur (sandstone yellow), Tribal Connect (beige), IMG (server-green), Ongraph (blue), Celebal (Microsoft blue), Dortmund (cool grey), Showcase (neon dark)
- **Files:** `tilesets/platforms-{level}.png`

---

## 5. Backgrounds (one per level)

These are the *defining visual* of each chapter. Worth investing time here.

### 5.1 Level 1 — Jaipur college
- **Source plan:** 🔴 Custom / generate
- **Spec:** 960×540 PNG, parallax-friendly (extends slightly off-screen)
- **Description:** Pixel art background, 960×540, retro 8/16-bit style, warm sandstone palette (yellows, oranges, terracotta). Foreground: silhouette of an Indian college building with arches. Midground: a few palace domes and minarets. Sky: warm gradient from yellow at horizon to soft orange. Some birds as silhouettes. Sweetie 16 palette. Stardew Valley meets Indian architecture.
- **File:** `public/assets/backgrounds/level-1-jaipur.png`

### 5.2 Level 2 — Tribal Connect office
- **Source plan:** 🔴 Custom / generate
- **Spec:** 960×540 PNG
- **Description:** Pixel art interior office background, 960×540, early-2000s vibe. Beige walls, a beige CRT computer monitor on a wooden desk, a stack of papers, a small plant in the corner, fluorescent overhead light. Slight warm tint. Sweetie 16 palette, retro pixel art, Stardew Valley style.
- **File:** `public/assets/backgrounds/level-2-tribal.png`

### 5.3 Level 3 — IMG Global server room
- **Source plan:** 🔴 Custom / generate
- **Spec:** 960×540 PNG
- **Description:** Pixel art server room background, 960×540, green-tinted ambient lighting. Rows of tall black server racks with small blinking LEDs (green and amber). Cables on the floor. A faint Node.js logo glow somewhere in the back. Slight haze. Sweetie 16 palette, retro pixel art.
- **File:** `public/assets/backgrounds/level-3-img.png`

### 5.4 Level 4 — Ongraph open office (trainee)
- **Source plan:** 🔴 Custom / generate
- **Spec:** 960×540 PNG
- **Description:** Pixel art open-plan modern office background, 960×540, bright lighting, blue accent walls. Several desks with monitors showing code. Whiteboards with simple diagrams. A coffee machine in the corner. Floor-to-ceiling windows showing a city skyline. Sweetie 16 palette, retro pixel art.
- **File:** `public/assets/backgrounds/level-4-ongraph-trainee.png`

### 5.5 Level 5 — Ongraph dev (scaled-up office)
- **Source plan:** 🔴 Custom / generate
- **Spec:** 960×540 PNG
- **Description:** Same office as Level 4 but evolved — more monitors per desk, dual-screen setups, sticker-covered laptops, a large screen on the wall showing a Next.js black-and-white aesthetic dashboard. Slightly darker, more focused mood. Sweetie 16 palette, retro pixel art.
- **File:** `public/assets/backgrounds/level-5-ongraph-dev.png`

### 5.6 Level 6 — Celebal / Microsoft corporate
- **Source plan:** 🔴 Custom / generate
- **Spec:** 960×540 PNG
- **Description:** Pixel art corporate office background, 960×540, Microsoft blue palette. A wall covered in flowchart diagrams — boxes connected by arrows (like Power Automate flows). A large screen showing a Power Apps interface. Clean, polished, slightly formal feel. Sweetie 16 palette.
- **File:** `public/assets/backgrounds/level-6-celebal.png`

### 5.7 Level 7 — Dortmund cityscape
- **Source plan:** 🔴 Custom / generate
- **Spec:** 960×540 PNG, parallax-friendly (3 layers ideal)
- **Description:** Pixel art European cityscape background, 960×540, cool blue-grey palette. Foreground: cobblestone street with a bicycle parked. Midground: traditional German half-timbered buildings. Background: a cathedral silhouette (inspired by Dortmund's Reinoldikirche). Sky: cool overcast grey-blue. Gentle snow particles falling. Sweetie 16 palette, retro pixel art.
- **File:** `public/assets/backgrounds/level-7-dortmund.png`
- **Bonus:** If you can split into 3 parallax layers (sky, buildings, foreground) save as 3 separate PNGs — looks amazing in motion.

### 5.8 Level 8 — Projects Showcase "matrix room"
- **Source plan:** 🔴 Custom / generate
- **Spec:** 960×540 PNG
- **Description:** Pixel art dark sci-fi room background, 960×540, near-black floor and walls with a faint grid pattern. Glowing neon portals (cyan, magenta, green) arranged along a horizontal row, each a vertical oval ~80×120 pixels with swirling particles inside. Subtle floating pixels in the air. Sweetie 16 palette but emphasize the neon colors. Cyberpunk meets retro arcade.
- **File:** `public/assets/backgrounds/level-8-showcase.png`

### 5.9 Finale scene background
- **Source plan:** 🔴 Custom / generate (could reuse Level 8 with a spotlight overlay)
- **Spec:** 960×540 PNG
- **Description:** Pixel art ceremonial scene, 960×540. Dark background with a single soft spotlight beam from above shining onto the center of the screen. In the distance, faint silhouettes of all previous level backgrounds layered as a parallax montage (Jaipur arches → office → Dortmund cathedral). Subtle particle stars. Sweetie 16 palette.
- **File:** `public/assets/backgrounds/finale.png`

---

## 6. UI Elements

### 6.1 Buttons (menu, pause, dialogs)
- **Source plan:** 🟢 Free library — Kenney's UI Pack
- **Spec:** Multiple states (idle, hover, pressed). Pixel-style chunky buttons.

### 6.2 Dialog box / story card frame
- **Source plan:** 🟡 Library + edit, or 🔴 custom for personality
- **Spec:** A 9-slice frame (so it can stretch) for story cards. ~640×360 displayed size.
- **Description if custom:** Pixel art dialog box border, 9-slice scalable, parchment beige with a thin dark border and small ornamental corners. Retro JRPG style.
- **File:** `public/assets/ui/dialog-frame.png`

### 6.3 Mobile control buttons (left, right, jump)
- **Source plan:** 🟢 Free library — Kenney's onScreen Controls pack
- **Files:** `public/assets/ui/btn-left.png`, `btn-right.png`, `btn-jump.png`

### 6.4 Skill tree node/connector
- **Source plan:** 🔴 Custom (small, easy)
- **Spec:** 24×24 node sprite + 16×4 connector line
- **Description:** Pixel art skill tree node, 24×24, glowing hexagon with a slot in the center for a tech logo. Two states: locked (dim grey) and unlocked (glowing). Plus a thin connector line sprite to link nodes. Sweetie 16 palette.
- **File:** `public/assets/ui/skill-node.png`, `skill-connector.png`

### 6.5 Game logo / title
- **Source plan:** 🔴 Custom / generate
- **Spec:** ~480×120, transparent PNG
- **Description:** Pixel art game title text reading **"HARSH'S DEV QUEST"** in a chunky 16-bit RPG-style font, with a small drop shadow. Colors: indigo and cyan gradient (matches portfolio brand). Optionally add a tiny pixel-art controller or floppy-disk icon next to it. Retro pixel art style.
- **File:** `public/assets/ui/title-logo.png`

---

## 7. Audio

### 7.1 Background music — main loop
- **Source plan:** 🟢 Free library — Pixabay, OpenGameArt, or Free Music Archive. Search for: *"chiptune ambient loop"*, *"16-bit adventure music"*.
- **Spec:** 1–2 min seamless loop, OGG + MP3
- **Suggested vibe:** Upbeat but not frantic. Think Stardew Valley or Undertale ruins. Adventurous, hopeful.
- **File:** `public/assets/audio/bgm-main.ogg` + `.mp3`

### 7.2 Background music — Dortmund (Level 7) [optional swap]
- **Source plan:** 🟢 Free library
- **Suggested vibe:** Calmer, more contemplative, slightly European folk hints. *"chiptune folk loop"*
- **File:** `public/assets/audio/bgm-dortmund.ogg` + `.mp3`

### 7.3 SFX (sound effects)
All available free from **freesound.org** or **Kenney's Audio Pack** (CC0):
- **Source plan:** 🟢 Free library
- **Sounds needed:**
  - `sfx-jump.ogg` — a short "boing" / "blip"
  - `sfx-land.ogg` — soft thud
  - `sfx-collect.ogg` — bright "ding" / chime when collecting an orb
  - `sfx-hit.ogg` — soft "oof" on touching an enemy
  - `sfx-level-complete.ogg` — short triumphant fanfare (1–2 sec)
  - `sfx-menu-click.ogg` — UI click
  - `sfx-portal-open.ogg` — magical whoosh (for Level 8 portals)
- **File:** `public/assets/audio/sfx-*.ogg`

---

## 8. Other content (you provide, no generation needed)

### 8.1 Resume PDF
- **What:** Your latest CV
- **File:** `public/assets/resume/Harsh_Agarwal_Resume.pdf`
- **Notes:** This is *the* reward for finishing the game. Keep it updated.

### 8.2 Project portal data
- **What:** A photo / screenshot for each of the 7 real projects to display in the portal modal
- **Spec:** 480×270 PNG each (16:9 thumbnails)
- **Files:** `public/assets/projects/{project-id}.png`
- **Notes:** Can reuse the project images already in the parent portfolio's `public/images/` folder — check those first before creating new ones.

### 8.3 Open Graph image (for social shares)
- **Source plan:** 🟡 Screenshot Level 1 once it's built, add the title overlay
- **Spec:** 1200×630 PNG
- **File:** `public/assets/og-image.png`

---

## Summary — what *you* need to generate

If you want to minimize work, here's the **minimum custom asset list** to ship the game:

**Must generate (10 items):**
1. Player sprite sheet (§1.1)
2. Confusion cloud (§2.2)
3. PostgreSQL elephant boss (§2.4)
4. Type Error giant boss (§2.7)
5. Manual paper stack (§2.8)
6. Base orb sprite (§3.1)
7. 8 level backgrounds + 1 finale (§5.1–5.9) — **the biggest art workload**
8. Game title logo (§6.5)
9. Dialog frame (§6.2) — *optional, can use library*
10. Skill tree node (§6.4) — *optional, can use library*

**Get from free libraries (cuts most work):**
- Generic bug enemies → Kenney Pixel Platformer
- Platforms / tileset → Kenney Pixel Platformer (palette-swap per level)
- UI buttons → Kenney UI Pack
- Mobile controls → Kenney onScreen Controls
- All SFX → Kenney Audio Pack or freesound.org
- BGM → Pixabay or Free Music Archive
- Tech logos → Simple Icons (simpleicons.org)

**Recommended generation tools for the custom items:**
- **Aseprite** ($20 one-time) — gold standard for hand-finishing pixel art
- **Pixel-art-focused AI generators:** Replicate's `pixel-art` model, or Scenario's pixel-art LoRA
- **General AI (Midjourney/DALL-E):** Use prompts above, then downscale + posterize through Aseprite or an online "pixelate" filter to enforce true pixel-art consistency

If you generate the 9 backgrounds + 1 player sprite first, the game can ship even if everything else uses library defaults. Backgrounds + character are where the storytelling lives.
