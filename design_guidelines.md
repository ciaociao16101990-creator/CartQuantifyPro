# Design Guidelines: Package Cart Management System

## Design Approach
**System:** Material Design-inspired utility interface
**Rationale:** This is a data-intensive inventory management tool requiring efficiency, clarity, and mobile reliability. Material Design principles provide clear visual hierarchy, touch-friendly components, and proven patterns for forms and data display.

## Typography

**Font Family:** Inter (Google Fonts)
- Primary: Inter for all UI text
- Numeric: Inter with tabular-nums for counters and quantities

**Type Scale:**
- Cart Headers: text-2xl font-semibold
- Section Titles: text-lg font-medium
- Form Labels: text-sm font-medium
- Body/Input Text: text-base
- Counter Display: text-4xl font-bold (live counter)
- Helper Text: text-xs
- Button Text: text-sm font-medium

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, and 12
- Component padding: p-4 or p-6
- Section spacing: space-y-6 or space-y-8
- Form gaps: gap-4
- Card padding: p-6
- Button padding: px-6 py-3

**Container Structure:**
- Max width: max-w-4xl mx-auto (desktop)
- Mobile: Full width with px-4 padding
- Cards: Contained with rounded-lg and shadow-sm

## Component Library

### Core Components

**1. Cart Initialization Card**
- Large card at top with rounded-lg border
- Three dropdown selects in grid (grid-cols-1 md:grid-cols-3 gap-4)
- Prominent "Start Cart" button at bottom (full width on mobile, auto on desktop)
- Visual hierarchy: Card title → Form fields → Primary action

**2. Live Counter Display**
- Prominent position below initialization (or top when cart active)
- Large text displaying: "18 / 72" with progress ring or bar
- Visual feedback: Green when < 60, amber when 60-71, green when = 72
- Include small text showing current cart number

**3. Add Package Form**
- Sticky or fixed position for quick access on mobile
- Three fields in responsive grid:
  - Variety dropdown (searchable on mobile)
  - Length dropdown (quick select)
  - Quantity number input
- "Add Package" button (primary, full width on mobile)

**4. Package List View**
- Table layout on desktop (variety, length, quantity, actions)
- Card layout on mobile (stacked, swipeable)
- Each row/card includes:
  - Variety name (bold)
  - Length (with cm suffix)
  - Quantity badge
  - Edit icon button
  - Delete icon button
- Alternating row backgrounds for readability on desktop

**5. Cart Summary Cards**
- Completed carts shown as collapsible cards
- Header: Cart name, destination, tag, bucket type, total count
- Expandable to show full package list
- Border accent based on status

**6. Export Button**
- Fixed bottom-right on desktop (floating action button style)
- Full-width sticky at bottom on mobile
- Icon: Download/Excel icon
- Text: "Export All Carts"

### Form Elements
- Inputs: border, rounded-md, focus:ring-2 focus:ring-offset-0
- Dropdowns: Native select with custom arrow icon
- Number inputs: Large touch targets (min-h-12 on mobile)
- All inputs: Consistent height (h-11)

### Buttons
- Primary: Solid background, rounded-lg, shadow-sm
- Secondary: Outlined, rounded-lg
- Icon buttons: Circular or square, p-2, hover states
- Disabled: Reduced opacity and no pointer events

### Icons
**Library:** Heroicons (outline and solid variants)
- Plus icon: Add package
- Trash icon: Delete package
- Pencil icon: Edit package
- Download icon: Export
- Check icon: Cart completed
- Arrow icons: Dropdowns

## Visual Hierarchy & Interaction

**Priority Levels:**
1. Live counter (most prominent)
2. Add package form (always accessible)
3. Package list (scrollable, primary content)
4. Cart initialization (when starting)
5. Export functionality (always visible but secondary)

**States:**
- Default: Clean, minimal
- Active/Focus: Clear ring indication
- Disabled: Grayed out with reduced opacity
- Success: Green accent when cart completes
- Error: Red border/text for validation issues

**Mobile Considerations:**
- Minimum touch target: 44x44px for all interactive elements
- Sticky "Add Package" section on mobile
- Bottom sheet style for edit/delete confirmations
- Pull-to-refresh for package list (optional enhancement)
- Safe area padding for notched devices

## Animations

**Minimal, Purposeful Animations:**
- Counter increment: Quick number change with slight scale
- Package added: Slide-in animation for new list item
- Cart completion: Brief success animation (checkmark)
- Delete: Fade out and collapse
- All transitions: 150-200ms duration

## Data Display

**Package List:**
- Clear visual separation between items
- Scannable layout (aligned columns on desktop)
- Grouping by variety or length (optional toggle)

**Cart Completion:**
- Visual confirmation: Success message + auto-advance
- Cart archive: Collapsed view with expand option
- Cart numbering: "Cart 1", "Cart 2" clearly labeled

## Mobile-Specific Patterns

- Single column layout throughout
- Larger form inputs (min-h-12)
- Sticky headers for context
- Bottom action buttons for primary actions
- Swipe gestures for delete (optional)
- Native select elements for better mobile UX

## Accessibility

- Proper label associations for all inputs
- ARIA labels for icon-only buttons
- Focus visible indicators
- Keyboard navigation support
- Screen reader announcements for counter updates
- Error messages clearly associated with fields

## Italian Language Support

- All labels, buttons, and messages in Italian
- Proper formatting for numbers (comma as decimal separator if needed)
- Date format: DD/MM/YYYY if timestamps needed

This design prioritizes speed, clarity, and reliability for rapid package entry and tracking. The interface should feel professional, efficient, and trustworthy for daily operational use.