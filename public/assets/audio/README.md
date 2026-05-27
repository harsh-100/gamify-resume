# Audio assets

Drop two files here for background music:

- `bgm.mp3` — primary format, broad browser support
- `bgm.ogg` — fallback for some Firefox/Linux setups (optional but recommended)

The game looks for `bgm-main` and starts looping it on the first user interaction (clicking "Start Journey"). If both files are missing, the game runs in silence — the menu shows "(no music loaded)" instead of crashing.

## Recommended free downloads (all royalty-free, no attribution required for game use)

### Pixabay Music (easiest — direct MP3 download, CC0)
1. https://pixabay.com/music/search/8-bit%20adventure/
2. https://pixabay.com/music/search/chiptune%20loop/
3. https://pixabay.com/music/search/pixel%20game/

Pick any track you like, download the MP3, rename to `bgm.mp3`, drop it in this folder.

### Specific tracks I'd suggest for the vibe
- Pixabay → "8 Bit Adventure" by AlexiAction — upbeat, fits an exploration game
- Pixabay → "Pixelland" by Kevin MacLeod — bouncy and warm
- Pixabay → "Retro Wave" / "Game Boy" style loops — anything looping cleanly under 2 minutes

### OpenGameArt.org (more variety, all free)
- https://opengameart.org/art-search-advanced?keys=chiptune+loop&field_art_type_tid%5B%5D=12

### Kevin MacLeod (free with optional attribution)
- https://incompetech.com/music/royalty-free/music.html → Filter by "Chiptune"

## Format conversion

If your file is a `.wav` or `.flac`, convert it to MP3:
- Web: https://cloudconvert.com/wav-to-mp3
- CLI: `ffmpeg -i input.wav -b:a 128k bgm.mp3`

## SFX — Collect sound (the orb-pickup "ding")

Drop this file:
- `sfx-collect.mp3` — plays when the player collects a skill orb

### Recommended downloads (free, royalty-free)

**Easiest — Pixabay (direct MP3, no login, CC0):**
1. https://pixabay.com/sound-effects/search/coin/ — classic "ding" / "ping" coin sounds
2. https://pixabay.com/sound-effects/search/collect/ — pickup-flavored sounds
3. https://pixabay.com/sound-effects/search/pickup/ — same vibe

**Specific picks that fit a retro platformer:**
- Pixabay → "Coin" by freesound_community — clean 8-bit "ding"
- Pixabay → "Power Up" — slightly punchier
- Pixabay → "Retro Coin" — chiptune-flavored

**Other free sources:**
- Freesound.org (needs free account): https://freesound.org/search/?q=coin+pickup+8bit
- Kenney's Interface Sounds Pack (CC0, no account): https://kenney.nl/assets/interface-sounds — bundle of ~50 UI/pickup sounds, can pick any "click" or "select"
- Kenney's Sci-Fi Sounds: https://kenney.nl/assets/sci-fi-sounds — has nice pickup tones

### Tips for picking
- Length: under 0.5 seconds so it doesn't pile up if you grab orbs rapidly
- Volume: should be quiet enough that hearing 5 in a row isn't annoying (the game plays at 55% volume already)
- Style: a single "ding" / "ping" / "pop" works best — avoid musical phrases

### After downloading
1. Rename to `sfx-collect.mp3`
2. Drop in this folder (`gamify/public/assets/audio/sfx-collect.mp3`)
3. Refresh the browser — the sound plays every time you collect a skill orb

If your file is `.wav`, convert via https://cloudconvert.com/wav-to-mp3 first.

## More SFX — now wired in code, just drop the files

The game looks for these in addition to `sfx-collect.mp3`:

- `sfx-jump.mp3` — short blip when player jumps (~0.1s)
- `sfx-hit.mp3` — soft "oof" when player touches an enemy (~0.2s)
- `sfx-win.mp3` — short fanfare on reaching the goal flag (~1–2s)

If a file is missing the game just stays silent for that event — nothing breaks.

### Where to grab them (free, royalty-free)

- **Jump:** Pixabay → search "jump 8-bit" → https://pixabay.com/sound-effects/search/jump/
- **Hit:** Pixabay → search "hit retro" or "hurt" → https://pixabay.com/sound-effects/search/hit/
- **Win:** Pixabay → search "win 8-bit" or "level up" → https://pixabay.com/sound-effects/search/win/
- **One-stop bundle:** [Kenney's Sci-Fi Sounds](https://kenney.nl/assets/sci-fi-sounds) or [Interface Sounds](https://kenney.nl/assets/interface-sounds) — both CC0, lots of options for each event

Save as `.mp3` (or `.ogg` for a fallback) into this folder. Refresh the browser to hear them.

## Resume PDF — required for the finale

After Level 8, the finale shows a "Download Resume" button. It tries to download:

- `/assets/resume/Harsh_Agarwal_Resume.pdf`

Drop your CV at `gamify/public/assets/resume/Harsh_Agarwal_Resume.pdf` and the button works. If the file is missing, the button still appears but the download will 404.
