---
name: skillens-design-system
description: Enforces the Skillens Sharp Minimalist / Editorial design system. Use when modifying or creating UI components to avoid "AI slop".
---

# Skillens Design System

You are building the UI for Skillens, a premium ATS application. We are using a strictly **Sharp Minimalist / Editorial** aesthetic. Do NOT use soft, generic SaaS templates, which are typically characterized as "AI slop".

## Core Principles (The "Anti-AI Slop" rules)
1. **No Soft Corners**: Elements must be perfectly sharp (`rounded-none`). In rare cases for small internal elements, maximum 2px (`rounded-[2px]`). Absolutely NO `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, or `rounded-full` (except for actual circles/avatars).
2. **No Soft Drop Shadows**: Do NOT use soft shadows (`shadow`, `shadow-md`, `shadow-lg`, `shadow-xl`, `drop-shadow`). Use `shadow-none` by default. If depth is needed, use hard borders or hard offset shadows (e.g., `shadow-[4px_4px_0_0_#070707]`).
3. **No Glassmorphism or Gradient Blobs**: Do NOT use `blur`, `backdrop-blur`, `mix-blend-mode`, or translucent backgrounds for effect. Backgrounds should be flat, solid, high-contrast colors from the palette.
4. **Flat Hierarchy (No Nested Cards)**: Do NOT put gray cards inside of other gray cards to establish hierarchy. Use whitespace (padding) and thin dividing lines (`border-t`, `border-b`) to separate sections.
5. **High Contrast Typography**: Use font weights deliberately. Headings should be bold (`font-bold`) using the display font, body text should be highly readable. Use negative space effectively.

## Color Palette (Tailwind Variables)
Use ONLY the following colors. Do NOT use arbitrary Tailwind colors (like `bg-gray-100` or `text-blue-500`).

- **Backgrounds**: `bg-brand-white` (#FEFEFE), `bg-brand-secondary` (#012631)
- **Primary Text**: `text-brand-dark` (#070707) on light backgrounds, `text-brand-white` (#FEFEFE) on dark backgrounds.
- **Accents/Buttons**: `bg-brand-primary` (#4B7B51), Hover: `bg-brand-dark-teal` (#2F4D55).
- **Highlights**: `text-brand-accent` (#A6E587) or `bg-brand-accent`.
- **Borders/Dividers**: `border-brand-gray-light` (#AFBCBE), `border-brand-gray-medium` (#829397), `border-brand-gray-dark` (#586D73).

## Implementation Examples

**Bad (AI Slop)**:
```tsx
<div className="bg-white rounded-xl shadow-lg p-6">
  <div className="bg-gray-50 rounded-lg p-4">
    <button className="bg-blue-500 rounded-full shadow-md ...">Submit</button>
  </div>
</div>
```

**Good (Sharp Editorial)**:
```tsx
<div className="bg-brand-white border border-brand-gray-light p-6 rounded-none">
  <div className="border-t border-brand-gray-light py-4">
    <button className="bg-brand-primary text-brand-white rounded-none hover:bg-brand-dark-teal transition-colors ...">Submit</button>
  </div>
</div>
```

**Form Inputs**:
Must use completely square edges (`rounded-none`), simple 1px borders (`border-brand-gray-light`), and focus states that change border color without soft ring shadows (`focus:ring-0 focus:border-brand-primary`).

Always refer back to these rules when touching any `className` in a `.tsx` component.
