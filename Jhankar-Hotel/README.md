# Aryan Hotel Website

## Project Structure
```
aryan-hotel/
├── index.html          - Main landing page
├── booking.html        - Room booking page (with fixed price calculation)
├── food-order.html     - Food ordering page (separate page)
├── css/
│   └── style.css      - Custom styles
└── js/
    ├── main.js        - Main JavaScript (homepage)
    ├── booking.js     - Booking page JavaScript (FIXED PRICE CALCULATION)
    └── food-order.js  - Food order page JavaScript
```

## Fixed Issues

### 1. Room Price Calculation - FIXED ✓
- Now correctly calculates: **Price per night × Number of nights × Number of rooms**
- Real-time updates when:
  - Check-in/Check-out dates change
  - Room quantity changes
- Individual room totals display correctly
- Grand total updates automatically

### 2. Separate Food Ordering Page ✓
- Food ordering moved to dedicated page: `food-order.html`
- Button added on homepage near "Book Room" button
- Clean separation of booking and food ordering

### 3. Improved Structure ✓
- All files properly separated
- Organized CSS and JavaScript
- Better code maintainability

## Features

### Homepage (index.html)
- Hero slider with 7 images
- About section
- Rooms showcase
- Rajasthani cuisine gallery
- Facilities gallery
- Location map
- Two action buttons: "Book Room" and "Order Food"

### Booking Page (booking.html)
- Room selection with quantity controls
- Date selection (check-in/check-out)
- **FIXED: Correct price calculation**
- Real-time total updates
- Payment information form
- Booking confirmation

### Food Order Page (food-order.html)
- Browse food menu by categories
- Quantity controls for each item
- Cart system
- Delivery address form
- Order total calculation
- Order confirmation

## How to Use

1. Extract all files maintaining the folder structure
2. Open `index.html` in a web browser
3. Navigate using buttons or menu
4. Test booking with different dates and quantities

## Technical Details

- **Framework**: Tailwind CSS (CDN)
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Playfair Display, Poppins (Google Fonts)
- **JavaScript**: Vanilla JS (no dependencies)

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

---
Created for Aryan Hotel © 2025
