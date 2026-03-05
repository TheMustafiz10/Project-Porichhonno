# পরিচ্ছন্ন — Design System Documentation

## 🎨 Color Scheme

This project uses a **green and emerald** color palette to represent sustainability and eco-friendliness.

### Primary Colors (Green)

Used for: Main UI, headers, backgrounds, general elements

| Color | Tailwind Class | Usage |
|-------|---------------|-------|
| Green 50 | `bg-green-50` | Page backgrounds |
| Green 100 | `bg-green-100` | Progress bars background |
| Green 200 | `border-green-200` | Borders, subtle dividers |
| Green 500 | `bg-green-500` | User avatar background |
| Green 600 | `bg-green-600` | Badges, progress bars fill |
| Green 700 | `bg-green-700` | Profile banner, call-to-action sections, daily tips |
| Green 800 | `bg-green-800` | Navbar, footer, strong text |
| Green 900 | `text-green-900` | Headings, primary text |

### Accent Colors (Emerald)

Used for: Sidebar navigation, interactive elements (to make them "pop")

| Color | Tailwind Class | Usage |
|-------|---------------|-------|
| Emerald 50 | `bg-emerald-50` | Sidebar button inactive background |
| Emerald 100 | `hover:bg-emerald-100` | Sidebar button hover state |
| Emerald 200 | `border-emerald-200` | Sidebar borders and dividers |
| Emerald 300 | `border-emerald-300` | Sidebar button borders |
| Emerald 500 | `bg-emerald-500` | Sidebar active button, hamburger menu |
| Emerald 600 | `text-emerald-600` | Sidebar stats text |
| Emerald 700 | `text-emerald-700` | Sidebar link text |

### Additional UI Colors

| Color | Usage |
|-------|-------|
| White | Card backgrounds, text on dark backgrounds |
| Gray 500 | Secondary text, placeholders |
| Gray 600 | Tertiary text |

## 🧭 Component-Specific Color Usage

### Navbar
```tsx
className="bg-green-800 text-white"
```

### Sidebar Navigation
- **Container**: `bg-white border-emerald-200`
- **Active Link**: `bg-emerald-500 text-white shadow-lg`
- **Inactive Link**: `text-emerald-700 bg-emerald-50 border-emerald-300`
- **Hover**: `hover:bg-emerald-100`
- **Hamburger Button**: `bg-emerald-500 hover:bg-emerald-600`

### User Profile Banner
```tsx
className="bg-green-700 text-white"
// Avatar: bg-green-500
// Badges: bg-green-600
```

### Cards & Containers
```tsx
className="bg-white border-green-200 shadow-sm"
```

### Progress Bars
```tsx
// Track: bg-green-100
// Fill: bg-green-600
```

### Buttons (Primary)
```tsx
className="bg-green-600 hover:bg-green-700 text-white"
```

### Daily Eco-Tip
```tsx
className="bg-green-700 text-white"
// Category badge: bg-green-600
```

## 📐 Design Principles

1. **Consistency**: Use green tones for general UI, emerald for sidebar/navigation
2. **Contrast**: Ensure text is readable (green-900 on light backgrounds, white on dark)
3. **Hierarchy**: Darker shades (700-900) for important elements, lighter shades (50-200) for backgrounds
4. **Interactive Feedback**: Emerald colors make navigation elements stand out and "pop"
5. **Eco-Friendly Theme**: Green palette reinforces the recycling/sustainability message

## 🎯 Quick Reference for Developers

When creating new components:
- **Page background**: `bg-green-50`
- **Card/Panel**: `bg-white border-green-200 shadow-sm`
- **Heading**: `text-green-900`
- **Body text**: `text-green-700` or `text-gray-600`
- **Primary button**: `bg-green-600 hover:bg-green-700 text-white`
- **Sidebar element**: Use `emerald` shades
- **Borders**: `border-green-200` (general) or `border-emerald-200` (sidebar)

## 🌐 Brand Identity

- **Project Name**: পরিচ্ছন্ন (Bengali for "Clean")
- **Logo**: 🌿
- **Tagline**: Sustainable Recycling Tracker
- **Footer**: © 2026 পরিচ্ছন্ন

## 📂 Key Files to Reference

If sharing design system with teammates, include these files:

1. **This file** (`DESIGN.md`) - Complete color scheme documentation
2. `components/profile/CollapsibleSidebar.tsx` - Emerald sidebar implementation
3. `components/Navbar.tsx` - Green navbar pattern
4. `components/profile/ProfileContent.tsx` - User banner and card styling
5. `app/globals.css` - Global Tailwind configuration
6. `tailwind.config.ts` - Tailwind theme customization (if applicable)

## 🔄 Component Examples

### Example Card
```tsx
<div className="bg-white rounded-xl border border-green-200 p-6 shadow-sm">
  <h2 className="text-lg font-semibold text-green-900 mb-4">
    Card Title
  </h2>
  <p className="text-green-700">Content goes here</p>
</div>
```

### Example Sidebar Link
```tsx
<Link
  href="/page"
  className={pathname === '/page' 
    ? 'bg-emerald-500 text-white shadow-lg' 
    : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-300'
  }
>
  Page Name
</Link>
```

### Example Button
```tsx
<button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-all">
  Button Text
</button>
```

---

**Last Updated**: March 2026  
**Maintained by**: পরিচ্ছন্ন Team
