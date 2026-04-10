# 🎨 Esubi 3D Asset Development Checklist

> A staged guide to evolving Esubi from static images to Duolingo-level animations.

---

## Overview

```
CURRENT STATE                         GOAL STATE
─────────────────                     ──────────────────
┌─────┐                               ┌─────┐
│ 😊  │  Static PNGs                  │ 😊  │  Full 3D Esubi
│     │  CSS animations               │ ╲│╱ │  Lottie/Rive animations
└─────┘  4 expressions                └──┼──┘  Infinite expressions
                                         │     Interactive reactions
         ──────────────────────────────►       Duolingo-level quality
              Your Journey
```

---

## Phase 1: Reference Image Collection

### Priority Schedule (1-2 images/day from Nano Banana)

| Day | Image | Prompt Modifier | Status |
|-----|-------|-----------------|--------|
| 1 | Front view (idle) | "front view, facing camera" | ✅ Have |
| 2 | Front view (searching) | "front view, spiral eyes, searching" | ✅ Have |
| 3 | Front view (celebrating) | "front view, star eyes, arms raised" | ✅ Have |
| 4 | Front view (confused) | "front view, question mark, tilted head" | ✅ Have |
| 5 | **3/4 Front Right** | "three-quarter view, turned slightly right" | ⬜ Need |
| 6 | **Side Profile (Right)** | "side view, profile, facing right" | ⬜ Need |
| 7 | **3/4 Back Right** | "three-quarter back view, showing back of head" | ⬜ Need |
| 8 | **Back View** | "back view, facing away from camera" | ⬜ Nice to have |
| 9 | **Top-Down** | "top-down view, bird's eye, looking at antenna" | ⬜ Nice to have |
| 10 | **Bottom-Up** | "low angle, looking up at Esubi" | ⬜ Optional |

### Required Reference Views (Minimum for 3D)

```
           TOP
            │
            ▼
         ┌─────┐
         │  ◯  │  ← Antenna placement
         └─────┘
            
    ┌───────────────────────────────────┐
    │                                   │
    │   FRONT        3/4         SIDE   │
    │                                   │
    │    ┌─┐        ┌─┐         ┌─┐    │
    │   │◉◉│       │◉◉│        │◉ │    │
    │   │‿ │       │‿ │        │‿ │    │
    │    ╲╱         ╲╱          └─┘    │
    │                                   │
    │   ✅ HAVE    ⬜ NEED     ⬜ NEED  │
    │                                   │
    └───────────────────────────────────┘
```

### Nano Banana Prompts

**Base prompt (copy and modify):**
```
Ken Sugimori watercolor art style, cute device mascot character 
named Esubi (SB-060). Rounded cream/warm beige body (#F0DFC8) with 
watercolor texture. Circular blue screen face (#8DCFEF) with 
coral-red frame ring (#D4736A). Small red antenna on top. Stubby 
arms, small feet. [VIEW/EXPRESSION]. Style: Official Pokemon 
character art, soft watercolor, paper texture visible, warm 
lighting, white background.
```

**View-specific additions:**

| View | Add to prompt |
|------|---------------|
| 3/4 Front | "three-quarter view, turned 45 degrees to the right, showing depth of rounded body" |
| Side Profile | "side view, perfect profile, facing right, showing the curve and thickness of body" |
| 3/4 Back | "three-quarter back view, turned away, showing back of screen frame and body" |
| Back | "back view, facing completely away from camera, showing back of head and body" |
| Top-Down | "top-down view, bird's eye perspective, looking down at top of head and antenna" |
| Bottom-Up | "low angle view, looking up at Esubi from below, heroic perspective" |

**Expression additions:**

| Expression | Add to prompt |
|------------|---------------|
| Idle/Happy | "gentle smile, dot eyes, relaxed pose" |
| Searching | "spiral/swirl eyes, open mouth 'o' shape, antenna slightly tilted" |
| Celebrating | "star-shaped eyes, big open smile, arms raised up in joy" |
| Confused | "dot eyes, small 'o' mouth, question mark floating nearby, head tilted" |
| Error/Worried | "curved worried eyebrows, small frown, concerned expression" |
| Waving | "one arm raised, waving, friendly smile" |
| Sleepy | "half-closed eyes, small content smile, relaxed pose" |
| Excited | "wide sparkling eyes, big smile, slight bounce pose" |

### File Naming Convention

```
esubi-[view]-[expression]-[version].png

Examples:
esubi-front-idle-v1.png
esubi-3q-front-searching-v1.png
esubi-side-idle-v1.png
esubi-back-idle-v1.png
esubi-top-idle-v1.png
```

### Image Quality Checklist

For each generated image, verify:

- [ ] Consistent body proportions with other images
- [ ] Same cream/beige color tone (#F0DFC8 range)
- [ ] Screen frame is coral-red (#D4736A range)
- [ ] Screen is blue gradient (#8DCFEF range)
- [ ] Antenna is present and correct size
- [ ] Arms are stubby, mitten-like
- [ ] Feet are small and rounded
- [ ] Watercolor texture is visible
- [ ] White/off-white background (easy to remove)
- [ ] High resolution (aim for 1024px+)

---

## Phase 2: Image Preparation

### Before Blender Import

| Task | Tool | Status |
|------|------|--------|
| Remove backgrounds | Remove.bg or Photoshop | ⬜ |
| Resize to consistent dimensions | Any image editor | ⬜ |
| Create reference sheet | Photoshop/Canva | ⬜ |
| Extract color palette | Coolors.co or eyedropper | ⬜ |
| Note proportions/measurements | Manual | ⬜ |

### Reference Sheet Template

Create a single image with all views arranged:

```
┌─────────────────────────────────────────────────────────┐
│                    ESUBI REFERENCE SHEET                │
├───────────┬───────────┬───────────┬───────────┬────────┤
│           │           │           │           │        │
│   FRONT   │  3/4 VIEW │   SIDE    │   BACK    │  TOP   │
│           │           │           │           │        │
│   ┌───┐   │   ┌───┐   │   ┌───┐   │   ┌───┐   │ ┌───┐ │
│   │   │   │   │   │   │   │   │   │   │   │   │ │   │ │
│   └───┘   │   └───┘   │   └───┘   │   └───┘   │ └───┘ │
│           │           │           │           │        │
├───────────┴───────────┴───────────┴───────────┴────────┤
│  HEIGHT: 1.0 unit  │  BODY WIDTH: 0.75  │  DEPTH: 0.5  │
│  SCREEN: 0.45 diam │  ANTENNA: 0.2 high │  ARM: 0.22   │
└─────────────────────────────────────────────────────────┘
```

### Proportion Guide (from esubi-design-spec.json)

| Part | Relative Size |
|------|---------------|
| Total height | 1.0 (base unit) |
| Body height | 0.65 |
| Body width | 0.75 |
| Screen diameter | 0.45 |
| Screen frame width | 0.04 |
| Antenna height | 0.2 |
| Antenna tip diameter | 0.06 |
| Arm length | 0.22 |
| Arm width | 0.12 |
| Leg height | 0.12 |
| Leg width | 0.18 |

---

## Phase 3: Blender Modeling

### Learning Milestones

| Week | Skill | Resource | Hours | Status |
|------|-------|----------|-------|--------|
| 1 | Blender navigation | Blender Guru Part 1 | 2 | ⬜ |
| 1 | Basic shapes & transforms | YouTube basics | 2 | ⬜ |
| 1 | Modifiers (subdivision) | YouTube tutorial | 1 | ⬜ |
| 2 | Character modeling basics | "Simple character" tutorial | 3 | ⬜ |
| 2 | Model Esubi body | Practice | 3 | ⬜ |
| 2 | UV unwrapping basics | YouTube tutorial | 2 | ⬜ |
| 3 | Texture painting | YouTube tutorial | 2 | ⬜ |
| 3 | Apply watercolor textures | Practice | 3 | ⬜ |
| 3 | Basic rigging | "Simple rig" tutorial | 3 | ⬜ |
| 4 | Rig Esubi | Practice | 3 | ⬜ |
| 4 | Basic animation | YouTube tutorial | 2 | ⬜ |

### Modeling Checklist

| Part | Technique | Status |
|------|-----------|--------|
| Body | Rounded cube → Subdivision modifier → Sculpt | ⬜ |
| Screen | Circle → Extrude → Inset for depth | ⬜ |
| Screen frame | Torus → Scale/flatten | ⬜ |
| Antenna stem | Cylinder → Slight taper | ⬜ |
| Antenna tip | UV Sphere | ⬜ |
| Arms | Rounded cube → Shape keys for poses | ⬜ |
| Legs | Rounded cube → Position | ⬜ |
| Eyes/mouth | Texture on screen OR separate mesh | ⬜ |

### Blender File Organization

```
esubi-3d/
├── esubi-model-v1.blend        ← Main model file
├── esubi-rigged-v1.blend       ← With armature
├── esubi-animated-v1.blend     ← With animations
├── textures/
│   ├── esubi-body-diffuse.png
│   ├── esubi-body-normal.png
│   ├── esubi-screen-idle.png
│   ├── esubi-screen-searching.png
│   └── esubi-screen-celebrating.png
├── references/
│   ├── esubi-reference-sheet.png
│   └── [all Nano Banana images]
└── exports/
    ├── esubi-idle.fbx
    ├── esubi-searching.fbx
    └── esubi-celebrating.fbx
```

### Rigging Checklist

| Bone | Controls | Status |
|------|----------|--------|
| Root | Overall position/rotation | ⬜ |
| Body | Main body movement | ⬜ |
| Head (optional) | If separate from body | ⬜ |
| Antenna | Wiggle/sway | ⬜ |
| Arm.L | Left arm pose | ⬜ |
| Arm.R | Right arm pose | ⬜ |
| Foot.L | Left foot (optional) | ⬜ |
| Foot.R | Right foot (optional) | ⬜ |

---

## Phase 4: Animation

### Core Animations to Create

| Animation | Frames | Loop? | Priority | Status |
|-----------|--------|-------|----------|--------|
| Idle/Breathing | 60 | Yes | P0 | ⬜ |
| Searching | 30 | Yes | P0 | ⬜ |
| Celebrating | 45 | No (play once) | P0 | ⬜ |
| Waving | 30 | No | P1 | ⬜ |
| Confused head tilt | 40 | Yes | P1 | ⬜ |
| Error/Worried | 30 | Yes | P1 | ⬜ |
| Entrance (bounce in) | 20 | No | P2 | ⬜ |
| Exit (bounce out) | 20 | No | P2 | ⬜ |
| Click reaction | 15 | No | P2 | ⬜ |
| Hover reaction | 10 | No | P2 | ⬜ |

### Animation Details

**Idle/Breathing:**
```
Frame 0:  Scale 1.0
Frame 30: Scale 1.02, slight Y raise
Frame 60: Scale 1.0
+ Antenna: gentle sway ±2°
```

**Searching:**
```
Frame 0:  Normal
Frame 15: Body tilt -3°, antenna tilt +10°
Frame 30: Body tilt +3°, antenna tilt -10°
+ Screen: Swap to spiral eyes texture
+ Optional: Subtle glow pulse
```

**Celebrating:**
```
Frame 0:  Normal position
Frame 10: Squash (Y: 0.95, X: 1.05)
Frame 20: Stretch + Jump (Y: 1.1, position +0.2)
Frame 30: Land + Squash
Frame 45: Return to normal
+ Arms: Raise from frame 15-40
+ Screen: Star eyes texture
+ Particles: Sparkles (if using Rive)
```

---

## Phase 5: Export to Web

### Option A: Rive (Recommended)

| Step | Task | Status |
|------|------|--------|
| 1 | Export Esubi layers as SVG/PNG from Blender | ⬜ |
| 2 | Import into Rive (rive.app) | ⬜ |
| 3 | Set up state machine | ⬜ |
| 4 | Create animations in Rive | ⬜ |
| 5 | Add interactivity (hover, click) | ⬜ |
| 6 | Export as .riv file | ⬜ |
| 7 | Integrate with React (@rive-app/react) | ⬜ |

### Option B: Lottie (After Effects)

| Step | Task | Status |
|------|------|--------|
| 1 | Export animation as image sequence | ⬜ |
| 2 | Import to After Effects | ⬜ |
| 3 | Rebuild/trace as vector shapes | ⬜ |
| 4 | Animate using shape layers | ⬜ |
| 5 | Install Bodymovin plugin | ⬜ |
| 6 | Export as Lottie JSON | ⬜ |
| 7 | Integrate with React (lottie-react) | ⬜ |

### React Integration Checklist

| Task | Status |
|------|--------|
| Install @rive-app/react or lottie-react | ⬜ |
| Create EsubiAnimated.tsx component | ⬜ |
| Set up state machine triggers | ⬜ |
| Connect to useEsubi() context | ⬜ |
| Test all expression transitions | ⬜ |
| Optimize file size (<100KB goal) | ⬜ |
| Test on mobile devices | ⬜ |
| Add reduced-motion fallback | ⬜ |

---

## Quality Checkpoints

### After Phase 1 (References)
- [ ] Have at least 5 different angles
- [ ] All images have consistent style
- [ ] Colors match across all images
- [ ] Saved at high resolution

### After Phase 3 (Model)
- [ ] Model matches reference proportions
- [ ] Smooth subdivisions, no harsh edges
- [ ] Textures capture watercolor feel
- [ ] Model is "clean" (no overlapping faces, good topology)

### After Phase 4 (Animation)
- [ ] Animations feel smooth (no jerky movements)
- [ ] Timing feels natural (not too fast/slow)
- [ ] All expressions are covered
- [ ] Loops are seamless

### After Phase 5 (Web)
- [ ] File size is small (<100KB)
- [ ] Animations play smoothly on mobile
- [ ] State transitions work correctly
- [ ] Fallback for reduced-motion preference
- [ ] Matches the personality of static Esubi

---

## Resources

### Blender Learning
| Resource | URL | Notes |
|----------|-----|-------|
| Blender Download | blender.org | Free! |
| Blender Guru (Donut) | YouTube | Best beginner tutorial |
| Grant Abbitt | YouTube | Great for characters |
| Blender Manual | docs.blender.org | Reference |

### Rive Learning
| Resource | URL | Notes |
|----------|-----|-------|
| Rive | rive.app | Free tier available |
| Rive YouTube | YouTube | Official tutorials |
| Rive Community | rive.app/community | Example files |

### Lottie Learning
| Resource | URL | Notes |
|----------|-----|-------|
| LottieFiles | lottiefiles.com | Hosting + examples |
| Bodymovin | aescripts.com | AE plugin (free) |
| lottie-react | npm | React integration |

### Color Reference
| Part | Hex | RGB |
|------|-----|-----|
| Body main | #F0DFC8 | 240, 223, 200 |
| Body light | #F7EBD8 | 247, 235, 216 |
| Body shadow | #E5D0B5 | 229, 208, 181 |
| Frame main | #D4736A | 212, 115, 106 |
| Screen main | #8DCFEF | 141, 207, 239 |
| Antenna tip | #D4534A | 212, 83, 74 |
| Sparkle | #FFD93D | 255, 217, 61 |

---

## Progress Tracker

```
Phase 1: References    [████████░░░░░░░░░░░░] 40% (4/10 images)
Phase 2: Preparation   [░░░░░░░░░░░░░░░░░░░░]  0%
Phase 3: Modeling      [░░░░░░░░░░░░░░░░░░░░]  0%
Phase 4: Animation     [░░░░░░░░░░░░░░░░░░░░]  0%
Phase 5: Web Export    [░░░░░░░░░░░░░░░░░░░░]  0%

Overall Progress:      [██░░░░░░░░░░░░░░░░░░]  8%
```

---

## Notes & Observations

*Use this section to jot down learnings, issues, and solutions as you progress.*

### Session Log

| Date | Activity | Notes |
|------|----------|-------|
| | | |
| | | |
| | | |

---

*Last Updated: [Date]*
*Target Completion: ~6-8 weeks*
