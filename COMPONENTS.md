# Component Structure

This project has been refactored to use a modular component-based architecture. Below is the breakdown of all components:

## 📁 Component Directory

All components are located in: `/src/components/`

### 🧩 Components Overview

#### 1. **Header.tsx**
- Top navigation bar with logo, navigation links, search bar, and cart
- Sticky positioning for persistent navigation
- Responsive design (mobile menu hidden on small screens)

#### 2. **Hero.tsx**
- Main hero section with gradient background
- Contains:
  - Badge with location tag
  - Main heading with colored text
  - Description text
  - CTA buttons (Shop Now & Browse Collection)
  - Three feature icons (Free shipping, Curated in Barcelona, Returns)
- Animated background blur effects

#### 3. **ProductCard.tsx**
- Reusable product card component
- Props:
  - `name`: Product name
  - `price`: Sale price
  - `originalPrice`: Original price (shown as strikethrough)
  - `color`: Gradient color classes
  - `tag`: Optional badge (e.g., "NEW")
- Hover effects on card and icon

#### 4. **ProductGrid.tsx**
- Section wrapper for product collections
- Props:
  - `title`: Section title
  - `products`: Array of product objects
- Displays products in a responsive grid (2 cols mobile → 5 cols desktop)
- Includes "VIEW ALL" link

#### 5. **Collections.tsx**
- Displays collection cards with discount badges
- Props:
  - `collections`: Array of collection objects
- Each collection includes:
  - Title
  - Description
  - Background gradient
  - Optional discount badge

#### 6. **AuthenticSpec.tsx**
- Displays authentication specification categories
- Props:
  - `items`: Array of spec items (name + description)
- 4-column responsive grid
- Hover effects

#### 7. **Locations.tsx**
- Shows store locations with city cards
- Props:
  - `cities`: Array of city names
- 6-column responsive grid
- "VISIT STORE" CTA button for each location

#### 8. **Footer.tsx**
- Site footer with multiple sections:
  - Brand information with logo
  - Shop links
  - Help links
  - About links
  - Bottom bar with copyright and legal links
- 4-column responsive layout

## 🎨 Design Features

### Color Scheme
- Background: `#0a1628` (dark blue)
- Card background: `#162a45` (lighter blue)
- Primary accent: Green (`#16a34a`)
- Secondary accent: Yellow
- Text: White with gray variants

### Hover Effects
- Scale transformations on icons
- Color transitions on text
- Shadow effects with green glow
- Smooth transitions (duration-300)

### Responsive Breakpoints
- Mobile: 1-2 columns
- Tablet (md): 3-4 columns
- Desktop (lg): 4-6 columns

## 📄 Main Page Structure

`/src/app/page.tsx` imports all components and passes data as props:

```tsx
<div className="flex flex-col min-h-screen">
  <Header />
  <main>
    <Hero />
    <ProductGrid title="NEW RELEASES" products={newReleases} />
    <ProductGrid title="BEST SELLERS" products={bestSellers} />
    <Collections collections={collections} />
    <AuthenticSpec items={authenticSpecs} />
    <Locations cities={cities} />
  </main>
  <Footer />
</div>
```

## 🚀 Benefits of This Structure

1. **Reusability**: Components like `ProductCard` and `ProductGrid` can be reused across multiple pages
2. **Maintainability**: Each component is isolated and easy to update
3. **Scalability**: Easy to add new sections or modify existing ones
4. **Type Safety**: TypeScript interfaces ensure prop consistency
5. **Separation of Concerns**: Data is separated from presentation
6. **Clean Code**: Each component has a single responsibility

## 🔧 How to Use Components

### Example: Adding a new product section

```tsx
const newProducts = [
  { name: 'Product Name', price: '€99', originalPrice: '€149', color: 'from-blue-100 to-blue-200' }
];

<ProductGrid title="NEW SECTION" products={newProducts} />
```

### Example: Customizing the Hero

Edit `/src/components/Hero.tsx` to change:
- Main heading text
- Description
- CTA button labels
- Feature icons and text

## 📦 Component Dependencies

- All components use Tailwind CSS for styling
- `Footer.tsx` uses Next.js `Image` component
- No external UI libraries (fully custom components)

## 🎯 Next Steps

To further enhance the project, consider:
1. Adding a Shop page with filtering
2. Creating a Product Detail page
3. Implementing a shopping cart system
4. Adding animations with Framer Motion
5. Creating admin components for content management
