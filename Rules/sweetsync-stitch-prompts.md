# SweetSync — Google Stitch Prompts

**Version:** 1.0  
**Last updated:** May 5, 2026  
**Usage:** Paste each prompt individually into Google Stitch. Apply the Global Design Token block to every screen before running individual screen prompts.

---

## Global design tokens (apply to every screen)

Paste this block at the start of every prompt or save it as a reusable style in Stitch.

```
Design system:
- Background: #FAFAF9 (warm near-white)
- Surface (cards, modals): #FFFFFF
- Font — display/headings: Fraunces 700, used only for brand moments, room names, AI reveal, confirmed events
- Font — body/UI: Plus Jakarta Sans 400 and 600, used for all functional text
- Border radius: 16px for cards, 12px for buttons and inputs, 8px for pills and badges, 999px for avatars and toggles
- No drop shadows anywhere. Cards are defined by a 0.5px border and a tinted background.
- Card types: Peach card (#FDF6F0 fill, #F5C4B3 border), Indigo card (#EEEDFE fill, #AFA9EC border), Mint card (#E1F5EE fill, #9FE1CB border), Neutral card (#F5F4F1 fill, rgba(0,0,0,0.07) border)
- Primary CTA button: #D85A30 fill, white text, 12px radius, 14px height, Plus Jakarta Sans 600 15px
- Indigo CTA button: #534AB7 fill, white text, same specs
- Active tab color: #D85A30
- Inactive tab color: #A0A0A0
- Screen horizontal padding: 20px
- Card internal padding: 16px
- Gap between cards: 12px
- Gap between sections: 24px
- Mobile frame: iPhone 14 Pro, 393 x 852pt
```

---

## Screen 1 — Splash

```
Design a mobile splash screen for an app called SweetSync on iPhone 14 Pro.

Background: solid #FDF6F0 (warm peach white), full screen.

Center of screen: a 4-pointed star / sparkle shape (like a compass star with four equal points), approximately 64x64pt, filled solid #534AB7 (deep indigo). No glow, no gradient, flat fill.

Below the star, 20pt gap: the app name "SweetSync" in Fraunces 700, 40pt, color #1A1918, centered.

Below the name, 10pt gap: the tagline "Plan things together." in Plus Jakarta Sans 400, 15pt, color #6B6B6B, centered.

64pt below the tagline: a primary CTA button labeled "Get Started", full-width minus 40pt horizontal margin, 52pt tall, #D85A30 fill, white text, Plus Jakarta Sans 600 15pt, 12pt border radius.

16pt below the button: a text link "Sign in instead" in Plus Jakarta Sans 600 14pt, color #534AB7, centered, no underline.

No status bar content. No bottom navigation. Completely minimal — white space above and below the centered content cluster.
```

---

## Screen 2 — Onboarding

```
Design a mobile onboarding screen for SweetSync on iPhone 14 Pro. This is the first screen after splash — a single hero onboarding slide, not a carousel.

Background: gradient from #FDF6F0 (top) to #EEEDFE (bottom), very subtle, almost flat.

Upper 55% of screen: a centered illustration area showing 5 abstract circular avatar bubbles arranged in a loose organic ring (not a perfect circle). Each bubble is a solid colored circle (colors: #D85A30, #534AB7, #0F6E56, #854F0B, #993556) with a white initial letter inside. Between the bubbles, thin connecting lines in rgba(0,0,0,0.08). In the center of the ring: the same 4-pointed star sparkle from the splash, 32pt, #534AB7.

Lower 45% of screen:
- Headline: "Plan things" in Fraunces 700, 36pt, #1A1918, left-aligned, 20pt from left edge
- Second line: "together." in Fraunces 700 italic, 36pt, #D85A30, left-aligned
- 12pt gap
- Body: "Upload your schedule, let AI find the gaps, pick what to do." in Plus Jakarta Sans 400, 15pt, #6B6B6B, left-aligned, line height 1.5
- 32pt gap
- "Get Started" button: full width minus 40pt margin, 52pt tall, #D85A30, white text, Plus Jakarta Sans 600 15pt, 12pt radius
- 14pt gap
- "Sign in instead" text link centered, Plus Jakarta Sans 600 14pt, #534AB7

No navigation bar. No tab bar. Status bar at top.
```

---

## Screen 3 — Home (rooms list)

```
Design the Home screen of SweetSync on iPhone 14 Pro. This is the main landing screen showing the user's rooms.

Status bar at top (system default, light content).

Header row (20pt horizontal padding):
- Left: small greeting "Hey, Raphael" in Plus Jakarta Sans 400 12pt #6B6B6B, with "Your Rooms" below it in Fraunces 700 26pt #1A1918
- Right: circular avatar 36pt diameter, #F5C4B3 fill, letter "R" in Plus Jakarta Sans 600 14pt #712B13

Below header, 16pt gap, scrollable list of room cards. Each card uses the Peach card style (#FDF6F0 fill, #F5C4B3 0.5pt border, 16pt radius, 16pt internal padding, 12pt gap between cards).

Show 3 room cards:

Card 1 — "Friday Gang":
- Top row: room name "Friday Gang" in Fraunces 700 20pt #712B13 on left, status pill "Voting open" on right (#F5C4B3 fill, #712B13 text, Plus Jakarta Sans 600 10pt, 999pt radius, 3pt 9pt padding)
- Bottom row: 5 stacked avatar circles (22pt, overlapping by 6pt, colors #D85A30 #534AB7 #0F6E56 #854F0B #993556, white initials 8pt) on left, "5 slots found" in Plus Jakarta Sans 400 11pt #993C1D on right

Card 2 — "Study Squad":
- Top row: "Study Squad" Fraunces 700 20pt #712B13, status pill "Waiting" (#E5E3DC fill #444441 text)
- Bottom row: 3 avatars (#534AB7 #0F6E56 #D85A30), "2 of 3 uploaded" Plus Jakarta Sans 400 11pt #888780

Card 3 — "Weekend Plans":
- Top row: "Weekend Plans" Fraunces 700 20pt #712B13, status pill "Confirmed" (#9FE1CB fill #04342C text)
- Bottom row: 3 avatars, "Movie Night · May 10" Plus Jakarta Sans 400 11pt #0F6E56

Bottom tab bar: white #FFFFFF, 0.5pt top border rgba(0,0,0,0.08), 58pt tall.
5 tabs: Home (active, house icon #D85A30 + label "Home" #D85A30), Calendar (calendar icon #A0A0A0 + "Calendar"), a centered raised indigo pill button 38pt diameter #534AB7 with white plus icon, Votes (checklist icon #A0A0A0 + "Votes"), Profile (person icon #A0A0A0 + "Profile").
All tab labels Plus Jakarta Sans 600 9pt.
```

---

## Screen 4 — Room interior

```
Design the Room interior screen of SweetSync on iPhone 14 Pro. This shows the inside of a room called "Friday Gang".

Status bar top. No bottom tab bar (this is a detail screen).

Header (20pt padding):
- Back chevron "← Rooms" in Plus Jakarta Sans 600 12pt #D85A30
- Room name "Friday Gang" in Fraunces 700 26pt #1A1918
- "5 members" in Plus Jakarta Sans 400 12pt #6B6B6B

Progress row (below header, 10pt gap):
- Label row: "Schedules uploaded" Plus Jakarta Sans 600 11pt #6B6B6B left, "3 of 5" Plus Jakarta Sans 600 11pt #D85A30 right
- Thin progress bar: 4pt tall, full width, #rgba(0,0,0,0.07) background, 60% fill in #D85A30, 999pt radius

Member list (16pt gap below progress, no left/right card — items are open rows with a 0.5pt bottom divider rgba(0,0,0,0.05)):

Each row: 30pt avatar circle left, name Plus Jakarta Sans 600 13pt #1A1918 + status Plus Jakarta Sans 400 11pt below, check indicator 20pt circle right.

Row 1: avatar #D85A30 "R" | "Raphael" + "You · Host" | green check circle #E1F5EE fill with #0F6E56 checkmark
Row 2: avatar #534AB7 "J" | "Jamie" + "Uploaded" | same green check
Row 3: avatar #0F6E56 "M" | "Marco" + "Uploaded" | same green check
Row 4: avatar #888780 "T" | "Trisha" + "Not uploaded yet" #A0A0A0 | empty circle #F5F4F1 fill rgba(0,0,0,0.1) border
Row 5: avatar #993556 "A" | "Ana" + "Not uploaded yet" #A0A0A0 | empty circle same style

Below member list, 12pt gap:
Peach nudge card (#FDF6F0, #F5C4B3 border, 12pt radius, 12pt padding): "Waiting on 2 members" Plus Jakarta Sans 600 12pt #712B13, then "Trisha and Ana haven't uploaded yet. Nudge them?" Plus Jakarta Sans 400 11pt #993C1D

12pt gap:
Indigo button "Find Free Time" full width 52pt tall #534AB7, white text Plus Jakarta Sans 600 15pt, 12pt radius, opacity 0.45 (disabled state)

Below button: "All schedules needed to continue" Plus Jakarta Sans 400 10pt #A0A0A0 centered
```

---

## Screen 5 — Group calendar (heat map view)

```
Design the Group Calendar screen of SweetSync on iPhone 14 Pro. This is the heat map tab inside a room, showing group availability.

Status bar top. Header: back chevron in #D85A30, "Friday Gang" Fraunces 700 22pt #1A1918, "5 members" Plus Jakarta Sans 400 12pt #6B6B6B.

Below header: two tab pills in a row, 12pt gap from header.
- "Group" tab: active, #EEEDFE fill #534AB7 text, 12pt radius, Plus Jakarta Sans 600 12pt
- "My Schedule" tab: inactive, transparent #A0A0A0 text same font

Heat map grid below tabs:

Column headers: 7 day columns. Day labels (Mon Tue Wed Thu Fri Sat Sun) in Plus Jakarta Sans 600 10pt #6B6B6B, centered above each column. Today (Thu) column label in #D85A30.

Left column: time labels every 2 hours from 8 AM to 10 PM, Plus Jakarta Sans 400 10pt #A0A0A0, right-aligned, 32pt wide.

Grid: 7 columns × 14 rows (each row = 1 hour). Cell size approximately 30pt wide × 26pt tall. Cell corner radius 3pt.

Color the cells as follows (showing a realistic group schedule pattern):
- Most cells Monday–Wednesday 8AM–4PM: #534AB7 (deep indigo — everyone busy, classes)
- Thursday–Friday 8AM–12PM: #AFA9EC (mixed)
- Saturday 10AM–12PM: #EEEDFE (mostly free)
- Saturday 4PM–7PM: completely white/transparent — this is the free slot
- Saturday 4PM–7PM cells: add a 2pt #D85A30 border ring around the 3 cells in this block, indicating this is the AI-found free slot
- Sunday afternoon 2PM–5PM: white/near-white cells, another potential free zone
- Evening slots most days: #EEEDFE to #AFA9EC (lighter, partially free)

A small legend row below the grid: gradient swatch from white to #534AB7, label "Free" on left, "Busy" on right, Plus Jakarta Sans 400 10pt #6B6B6B.

Bottom of screen: a floating bottom sheet peeking up 80pt showing: "Tap any slot to see who's free" Plus Jakarta Sans 400 12pt #6B6B6B centered, and a drag handle bar 32pt wide 4pt tall #D3D1C7 centered at top of sheet.
```

---

## Screen 6 — My schedule (personal view)

```
Design the personal schedule tab of SweetSync on iPhone 14 Pro. This is the "My Schedule" tab inside the room calendar — shown automatically after a user uploads their schedule for verification.

Status bar top. Header: "My Schedule" Fraunces 700 22pt #1A1918, "Tap to edit · Add or remove blocks" Plus Jakarta Sans 400 12pt #6B6B6B.

Two tab pills same as group calendar screen, but "My Schedule" is active (#EEEDFE fill #534AB7 text), "Group" is inactive.

Week navigation row: left chevron | "May 5 – May 11" Plus Jakarta Sans 600 13pt #1A1918 centered | right chevron. Both chevrons #D85A30.

Personal week calendar grid below. 7 day columns, time slots from 8AM–8PM. Column headers same as group calendar.

Show the user's busy blocks as peach cards on the grid:
- Monday 9AM–12PM: block "Math 101" #FDF6F0 fill #F5C4B3 border, "Math 101" Plus Jakarta Sans 600 11pt #712B13 inside, 8pt radius
- Monday 1PM–3PM: block "Physics Lab" same style
- Tuesday 8AM–11AM: block "English" same style
- Wednesday 9AM–12PM: block "Math 101" same style
- Wednesday 2PM–4PM: block "Study Group" same style
- Thursday 8AM–10AM: block "English" same style
- Friday 9AM–12PM: block "Math 101" same style

Empty slots (free time) remain as the #FAFAF9 page background — no fill, no border.

Bottom floating bar: "Looks good? Confirm your schedule" Plus Jakarta Sans 600 14pt #1A1918 left, confirm button #D85A30 "Confirm" 36pt tall right. Bar background white, 0.5pt top border rgba(0,0,0,0.08).
```

---

## Screen 7 — AI processing

```
Design the AI processing screen of SweetSync on iPhone 14 Pro. This is the loading state shown after all schedules are uploaded and the AI is finding free time.

Background: #FAFAF9 full screen.

Vertically centered cluster:
- Top: the 4-pointed star sparkle icon 48pt, #534AB7 fill, with a soft animated pulse ring around it (show as a 72pt circle, #EEEDFE fill, centered behind the star — representing the pulse glow state)
- 20pt gap
- Headline: "Finding your" in Fraunces 700 28pt #3C3489 centered, then "free time..." on next line same style
- 12pt gap
- Body: "Cross-referencing 5 schedules" in Plus Jakarta Sans 400 14pt #6B6B6B centered
- 20pt gap
- A thin indigo progress line: full width minus 60pt margin, 3pt tall, 999pt radius, background #EEEDFE, animated fill in #534AB7 at approximately 60% fill

Below the centered cluster, 48pt gap:
3 small status rows, left-aligned 40pt from left edge:
- checkmark circle #E1F5EE + "Raphael's schedule" Plus Jakarta Sans 400 13pt #1A1918 — completed
- checkmark circle #E1F5EE + "Jamie's schedule" — completed
- loading spinner circle #EEEDFE + "Finding overlaps..." Plus Jakarta Sans 400 13pt #6B6B6B — in progress

No tab bar. No navigation header.
```

---

## Screen 8 — AI results

```
Design the AI results screen of SweetSync on iPhone 14 Pro. This is the moment the AI surfaces free time slots.

Status bar top. Header (20pt padding):
- "← Friday Gang" Plus Jakarta Sans 600 12pt #534AB7 as back link
- "We found 3" Fraunces 700 22pt #3C3489
- "free slots" Fraunces 700 22pt #3C3489 (second line)
- 4pt gap: "Based on everyone's schedule" Plus Jakarta Sans 400 12pt #6B6B6B

Scrollable list of 3 indigo slot cards (#EEEDFE fill, #AFA9EC 0.5pt border, 16pt radius, 16pt padding, 12pt gap):

Card 1 (best slot — 5 of 5 free):
- Top right: pill "5 of 5" #AFA9EC fill #26215C text Plus Jakarta Sans 600 9pt
- "Saturday · May 10" Fraunces 700 italic 16pt #3C3489
- "4:00 – 7:00 PM" Plus Jakarta Sans 600 18pt #3C3489
- "3 hrs · Everyone free" Plus Jakarta Sans 400 11pt #534AB7
- 8pt gap: row of 5 stacked avatar circles 20pt each, overlapping 5pt

Card 2 (4 of 5 free):
- Pill "4 of 5" #E5E3DC fill #444441 text
- "Sunday · May 11" Fraunces italic 16pt #3C3489
- "2:00 – 5:00 PM" Plus Jakarta Sans 600 18pt #3C3489
- "3 hrs · Marco unavailable" Plus Jakarta Sans 400 11pt #534AB7

Card 3 (4 of 5 free):
- Pill "4 of 5" same neutral style
- "Friday · May 9" Fraunces italic 16pt #3C3489
- "6:00 – 9:00 PM" Plus Jakarta Sans 600 18pt #3C3489
- "3 hrs · Trisha unavailable" Plus Jakarta Sans 400 11pt #534AB7

Below cards, 16pt gap:
Full-width indigo button "Vote on a Slot" #534AB7 fill white text Plus Jakarta Sans 600 15pt 52pt tall 12pt radius.
```

---

## Screen 9 — Voting (time slots)

```
Design the voting screen for time slots in SweetSync on iPhone 14 Pro. Members are marking their availability for AI-found slots.

Status bar top. Header (20pt padding):
- "← Results" Plus Jakarta Sans 600 12pt #534AB7
- "Pick your slot" Fraunces 700 22pt #1A1918
- "3 voted · 2 remaining" Plus Jakarta Sans 400 12pt #6B6B6B

List of 3 indigo voting cards (#EEEDFE fill, #AFA9EC border, 16pt radius, 16pt padding, 12pt gap):

Each card has:
- Top section: slot label (Fraunces 700 italic 15pt #3C3489) + availability note (Plus Jakarta Sans 400 11pt #534AB7) on left, vote count pill on right
- 8pt gap
- Row of 3 response pills spanning full card width with 6pt gaps between them

Card 1 — Saturday May 10, 4–7 PM:
- "Sat, May 10 · 4–7 PM" + "Everyone can make it" | pill "5 votes" #AFA9EC fill #26215C text
- Response pills: "Free" selected (#E1F5EE fill #9FE1CB 1.5pt border #085041 text, Plus Jakarta Sans 600 10pt), "Prefer" unselected (#EEEDFE fill #AFA9EC border #3C3489 text), "Can't" unselected (#FCEBEB fill #F09595 border #791F1F text)
- All pills 999pt radius, 28pt tall, equal width

Card 2 — Sunday May 11, 2–5 PM:
- "Sun, May 11 · 2–5 PM" + "4 of 5 free" | pill "3 votes" #E5E3DC fill #444441 text
- Response pills: "Free" unselected, "Prefer" selected (indigo active state #EEEDFE fill #AFA9EC 1.5pt border), "Can't" unselected

Card 3 — Friday May 9, 6–9 PM:
- "Fri, May 9 · 6–9 PM" + "4 of 5 free" | pill "2 votes" neutral
- Response pills: "Free" unselected, "Prefer" unselected, "Can't" selected (#FCEBEB fill #F09595 1.5pt border)

Below cards:
Full-width peach button "Confirm My Votes" #D85A30 fill white text Plus Jakarta Sans 600 15pt 52pt tall 12pt radius.
```

---

## Screen 10 — Voting (activity suggestions)

```
Design the activity voting screen of SweetSync on iPhone 14 Pro. After the time slot is confirmed, members vote on what to do.

Status bar top. Header:
- "← Slot confirmed" Plus Jakarta Sans 600 12pt #0F6E56 (mint, signaling success)
- "What should we do?" Fraunces 700 22pt #1A1918
- "Saturday, May 10 · 4–7 PM" Plus Jakarta Sans 400 12pt #6B6B6B
- Mint confirmation pill: "Slot confirmed" #9FE1CB fill #04342C text

AI suggested activities section label: "AI suggestions" Plus Jakarta Sans 600 11pt #A0A0A0 uppercase 0.06em letter-spacing, 16pt gap below header.

3 activity cards (peach: #FDF6F0 fill, #F5C4B3 border, 16pt radius, 16pt padding, 12pt gap):

Card 1: "Movie Night" Fraunces 700 italic 17pt #712B13 | "3 hrs · Perfect for 5 people" Plus Jakarta Sans 400 11pt #993C1D | vote pill "4 votes" #F5C4B3 fill #712B13 text | response pills same 3-option style as time voting
Card 2: "Dinner out" Fraunces italic 17pt | "3 hrs · Group dinner" | "3 votes" | response pills
Card 3: "Game night" Fraunces italic 17pt | "3 hrs · Stay in" | "2 votes" | response pills

Section label "Suggested by members" Plus Jakarta Sans 600 11pt #A0A0A0 uppercase.

1 neutral card (#F5F4F1 fill, rgba(0,0,0,0.07) border): "Karaoke" Fraunces italic 17pt #1A1918 | "Added by Jamie" Plus Jakarta Sans 400 11pt #6B6B6B | response pills

Below: "+ Suggest something" text button Plus Jakarta Sans 600 13pt #534AB7 centered with a small plus icon left.

Full-width #D85A30 "Confirm My Votes" button at bottom.
```

---

## Screen 11 — Confirmed event

```
Design the confirmed event screen of SweetSync on iPhone 14 Pro. This is the celebration screen shown when both a time slot and activity are confirmed.

Full screen background: #E1F5EE (mint, no other color).

Vertically centered content:

Top: the 4-pointed sparkle star icon 52pt, solid #0F6E56 fill.
12pt gap.
Room label: "FRIDAY GANG" Plus Jakarta Sans 600 11pt #0F6E56, letter-spacing 0.08em, centered.
6pt gap.
Event name: "Movie Night" Fraunces 700 italic 36pt #085041 centered.
"is happening!" Plus Jakarta Sans 400 15pt #0F6E56 centered.

24pt gap.

Mint details card (#E1F5EE fill, #9FE1CB 0.5pt border, 16pt radius, 16pt padding, full width minus 40pt margin):
- Row 1: small calendar icon #0F6E56 + "Saturday, May 10" Plus Jakarta Sans 600 14pt #085041
- Divider line 0.5pt rgba(15,110,86,0.15)
- Row 2: small clock icon #0F6E56 + "4:00 PM – 7:00 PM" Plus Jakarta Sans 600 14pt #085041

16pt gap.

Row of 5 overlapping avatar circles (28pt each, overlapping 8pt, border #E1F5EE 2pt, colors #D85A30 #534AB7 #0F6E56 #854F0B #993556, white initials 10pt), centered.
"5 people going" Plus Jakarta Sans 400 11pt #0F6E56 centered, 6pt below.

24pt gap.

Two buttons full width minus 40pt margin:
- "Add to Calendar" #085041 fill white text Plus Jakarta Sans 600 15pt 52pt tall 12pt radius
- 10pt gap
- "Share with Group" transparent fill #0F6E56 1pt border #0F6E56 text, same size

No tab bar. No navigation header. Pure celebration screen.
```

---

## Screen 12 — Global calendar tab

```
Design the global Calendar tab screen of SweetSync on iPhone 14 Pro. This is the standalone calendar showing the user's personal schedule and all confirmed events across all rooms.

Status bar top.

Header (20pt padding):
- "Calendar" Fraunces 700 26pt #1A1918 left
- Small month/year label "May 2026" Plus Jakarta Sans 400 13pt #6B6B6B right

Week strip below header: horizontal scrollable row of 7 day pills.
- Each pill: day letter (M T W T F S S) Plus Jakarta Sans 600 10pt above, date number Plus Jakarta Sans 600 14pt below
- Today (Tuesday 5): active pill #D85A30 fill, white text, 999pt radius, 32pt wide 40pt tall
- Other days: transparent background, #6B6B6B text

Below week strip, full-week time grid (same layout as My Schedule tab):
- Time labels left column 8AM–10PM in Plus Jakarta Sans 400 10pt #A0A0A0
- 7 day columns

Busy blocks (personal schedule, peach cards):
- Mon 9AM–12PM: "Math 101" peach block #FDF6F0 fill #F5C4B3 border
- Wed 9AM–12PM: "Math 101" peach block
- Fri 9AM–12PM: "Math 101" peach block

Confirmed event blocks (mint cards — these come from different rooms):
- Sat 4PM–7PM: mint block #E1F5EE fill #9FE1CB border, "Movie Night" Plus Jakarta Sans 600 11pt #085041 inside, small "Friday Gang" label Plus Jakarta Sans 400 9pt #0F6E56 below the name

Free zones remain #FAFAF9 (no fill, no border) — the contrast between peach blocks, mint events, and empty space tells the full story.

Bottom tab bar: Calendar tab active (#D85A30 icon and label), all others inactive (#A0A0A0). Same 5-tab structure: Home, Calendar (active), + pill, Votes, Profile.
```

---

## Screen 13 — Profile

```
Design the Profile screen of SweetSync on iPhone 14 Pro.

Status bar top.

Header (20pt padding):
- "Profile" Fraunces 700 26pt #1A1918

User card (neutral card style #F5F4F1 fill rgba(0,0,0,0.07) border, 16pt radius, 16pt padding):
- Left: avatar circle 52pt #D85A30 fill, "R" white Plus Jakarta Sans 600 20pt
- Right of avatar: "Raphael" Plus Jakarta Sans 600 16pt #1A1918, "raphael@email.com" Plus Jakarta Sans 400 13pt #6B6B6B below

Section label "My schedule" Plus Jakarta Sans 600 11pt #A0A0A0 uppercase letter-spacing, 24pt gap.

Settings rows (open rows with 0.5pt bottom divider rgba(0,0,0,0.06), 16pt height each, 20pt vertical padding):
Row: "Uploaded schedules" Plus Jakarta Sans 400 14pt #1A1918 left | "3 files" Plus Jakarta Sans 400 13pt #6B6B6B + right chevron #A0A0A0
Row: "Edit my schedule" | right chevron

Section label "Notifications" 24pt gap.
Row: "New invites" | toggle (on, #D85A30 track)
Row: "Schedule reminders" | toggle (on)
Row: "Voting opened" | toggle (on)
Row: "Event reminders" | toggle (on)

Section label "Account" 24pt gap.
Row: "Sign out" Plus Jakarta Sans 400 14pt #D85A30 (destructive color, no chevron)

Bottom tab bar: Profile tab active #D85A30, others inactive #A0A0A0.
```

---

## Usage notes

**Order to generate:** Run screens in this order for best consistency — 1, 3, 7, 8, 11, then 4, 5, 6, 9, 10, 12, 13. Start with the simplest screens (splash, home, AI processing) to establish the visual language before tackling complex ones (calendar heat map, voting).

**Consistency tips:**
- Always include the Global design tokens block at the start of each prompt
- Reference previously generated screens when running later ones: "Match the card style from the Home screen"
- The Fraunces font may render as a serif placeholder — specify "use a heavy serif with slight warmth, not a geometric sans"
- If Stitch rounds corners differently, call out "16pt border radius on cards, not pill-shaped"

**What to check per screen:**
- Cards have no drop shadows — only tinted fill + 0.5pt border
- Fraunces is used only at the moments listed — never on task/functional screens
- Peach (#D85A30) appears only on primary CTAs and active tab states
- Indigo (#534AB7) appears only on AI-related actions and the Create tab pill
- Mint (#0F6E56 / #E1F5EE) appears only on confirmed/success states
