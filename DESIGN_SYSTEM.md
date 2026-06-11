# LABBOR Design Code

> Lightweight design-system reference for AI agents & Tailwind integration.
> **Product:** Зуботехническая STUDIO — SaaS CMS для зуботехнических лабораторий.
> **Stack:** React + TypeScript · Tailwind · [reactbits](https://reactbits.dev) (анимированные компоненты) · [lucide-react](https://lucide.dev) (иконки).

## TL;DR for agents
- **Theme:** dark-first. Canvas is pure black `#000`. Everything sits on near-black surfaces.
- **Accent:** single lime `#bdff67` — primary actions, selection, focus, positive status. Use sparingly.
- **Brand:** red `#d22934` only in the LABBOR logo mark + notification dot. Never as UI accent.
- **Font:** Montserrat (400/500/600/700). No other families.
- **Shape:** generous radii — pills for controls, 26–30px for cards/panels, 15px for fields.
- **Density:** roomy. Large type, large hit targets (min 44px), 14–26px gaps.
- **No gradients, no emoji, no drop shadows** except on floating overlays (modal/toast).

## Tokens
Source of truth: [`tokens.json`](./tokens.json). Tailwind v4 → [`theme.css`](./theme.css). Tailwind v3 → [`tailwind.labbor.js`](./tailwind.labbor.js).

### Color
| Role | Token | Hex |
|---|---|---|
| Canvas | `bg` | `#000000` |
| Surface 1–6 | `surface-1…6` | `#141414` `#171717` `#1c1c1c` `#212121` `#292929` `#333333` |
| Divider | `line` | `#2a2a2a` |
| Accent | `accent` / `accent-press` / `accent-soft` | `#bdff67` / `#a8eb52` / `#28391a` |
| Brand | `brand-red` / `brand-red-alt` | `#d22934` / `#da2525` |
| Text | `fg` / `fg-secondary` / `fg-tertiary` / `fg-muted` | `#fff` `#c5c5c5` `#b9b9b9` `#7e7e7e` |

**Status** (bg / fg pair — used in `Badge`):
`done` `#33491f`/`#bdff67` · `work` `#4a3d12`/`#f4cf57` · `wait` `#2f2f2f`/`#b9b9b9` · `dead` `#4a3434`/`#ff9699` · `lab` `#33336e`/`#aeb0ff` · `clinic` `#1d4a63`/`#79c7f0`

### Type scale (px)
`micro 13` · `caption 15` · `sm 17` · `base 18` · `md 20` · `lg 21` · `xl 23` · `2xl 28` · `3xl 34` · `4xl 40` · `stat 64`
Weights: labels/body 400–500, titles/badges/buttons 600.

### Radius
`field 15` · `image 14` · `card 26` · `modal 26` · `panel 30` · `pill 999`

### Spacing scale
`1 6` · `2 10` · `3 14` · `4 18` · `5 22` · `6 26` · `7 30` · `8 46` (px)

### Sizing
rail `108` · control/bell/search height `64` · avatar `60` (sm `46`) · icon-button `42` · min tap `44`

### Motion
fast `150ms` · base `180ms` · view-enter `320ms` · easing `cubic-bezier(.2,.8,.2,1)`
Patterns: cards lift on hover (`translateY(-4px)`), modals pop + scrim fade, toasts slide in from right, views fade-up on mount.

---

## Component inventory
Schematic only — names, role, recommended reactbits/lucide mapping. No implementation here.

### Shell & navigation
| Component | Role | reactbits | lucide-react |
|---|---|---|---|
| `AppShell` | rail + main column grid | — | — |
| `NavRail` | left icon nav, 108px, circular buttons | `Dock` / `GooeyNav` (optional) | `Home` `LayoutGrid` `LineChart` `Wallet` `FileText` |
| `TopBar` | logo · search · date · bell · profile | — | — |
| `Logo` | LABBOR mark + "STUDIO" wordmark | — | — |
| `SearchBar` | pill input | — | `Search` |
| `DatePill` | outlined pill, current date | — | `Calendar` |
| `NotificationBell` | round button + red dot | — | `Bell` |
| `ProfileChip` | avatar + name + role | — | — |

### Data display
| Component | Role | reactbits | lucide-react |
|---|---|---|---|
| `StatItem` | big number + label + delta | `CountUp` | `ArrowUp` `TrendingUp` |
| `DeltaPill` | +N change chip (up/bad) | — | `ArrowUp` `ArrowDown` |
| `OrderCard` | order summary, status, meta | `SpotlightCard` / `TiltedCard` | `TriangleAlert` |
| `Badge` | status chip, 6 variants | — | `Check` `TriangleAlert` `Repeat` |
| `Avatar` / `AvatarGroup` | tech / user photo | — | `User` (fallback) |
| `ToothChart` ⚑ | 32-tooth FDI dental chart, selectable | — | — (custom SVG) |
| `StageList` / `StageRow` ⚑ | work-stage timeline per order | `AnimatedList` | `ClipboardList` `Repeat` `TriangleAlert` |
| `ReadOnlyField` / `FieldRow` | labelled value, optional lock | — | `Lock` |
| `PhotoStrip` | order reference thumbnails | — | — |
| `TechCard` ⚑ | salary screen — tech + activity | — | `Wallet` |
| `ActivityCalendar` ⚑ | per-tech activity heatmap | — | `Calendar` |
| `WorkTypeRow` ⚑ | "Вид работы" reference row | — | `FileText` `ChevronRight` |

### Controls
| Component | Role | reactbits | lucide-react |
|---|---|---|---|
| `Button` | variants: `lime` / `ghost`, `block` | — | optional leading icon |
| `IconButton` | round 42px: default / lime / warn | — | any |
| `Toggle` | switch, lime when on | — | `Lock` (knob glyph) |
| `Select` | dropdown field + menu | `AnimatedList` (menu) | `ChevronDown` |
| `AmountInput` | currency field (₽) | — | — |
| `TextField` / `Textarea` | text entry | — | — |
| `HelpHint` | lime "?" affordance | — | `HelpCircle` |

### Feedback & overlay
| Component | Role | reactbits | lucide-react |
|---|---|---|---|
| `Modal` / `Dialog` | centered, scrim, pop-in (Отчёт / Замена техника / Штраф) | `AnimatedContent` | `X` |
| `Toast` / `Toaster` | bottom-right, auto-dismiss, ok/warn | `AnimatedList` | `Check` `TriangleAlert` |
| `Skeleton` | loading placeholder *(to add)* | — | — |
| `EmptyState` | no-data view *(to add)* | — | — |

⚑ = domain-specific (dental lab). Everything else is generic and reactbits/Tailwind-friendly.

### Roles (access scope — for later)
`super-admin` (платформа, тенанты) · `lab-admin` (наряды, техники, штрафы, зарплаты) · `tech` (мобильный: свои этапы, взять/сдать).

## Conventions
- **Selection / focus** = lime. **Destructive** = `dead` red. **Positive/done** = `done` green/lime.
- Read-only fields show a `Lock` glyph at the right; editable mode reveals action `IconButton`s.
- Badges are pills, 600 weight, 15px, with an optional 15px leading icon.
- Buttons & all pill controls use `rounded-pill`; cards `rounded-card`; panels `rounded-panel`; fields `rounded-field`.
- Prefer flex/grid + `gap`. Hover states are mandatory on interactive elements.
