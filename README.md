# Code Breaker

## 🎯 Draggable Pegs Game

This is a simple React-based interactive peg game where users can drag colored pegs and drop them onto slots. It supports both mouse and touch interactions for a responsive experience across desktop and mobile devices.

## 🚀 Features

- Drag-and-drop functionality using mouse or touch
- Snaps pegs back to original position if not dropped on a valid slot
- Colored peg stripes rendered via `linear-gradient`
- Modular and clean component structure

## 📁 Project Structure

```
/src
  ├── components
  │    └── DraggablePeg.jsx   # Draggable peg component
  ├── styles
  │    └── styles.css         # CSS for pegs, background, etc.
  └── App.jsx                 # Main application component
```

## 🧪 How to Run

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the app**

   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🎨 Styling

The dialog background is styled using `linear-gradient` with equal-sized color stripes:

```css
background: linear-gradient(
  to right,
  var(--peg-red) 0% 16.66%,
  var(--peg-blue) 16.66% 33.33%,
  var(--peg-green) 33.33% 50%,
  var(--peg-orange) 50% 66.66%,
  var(--peg-purple) 66.66% 83.33%,
  var(--peg-brown) 83.33% 100%
);
```

## 📱 Touch & Mouse Support

The `DraggablePeg` component supports:

- `mousedown`, `mousemove`, `mouseup`
- `touchstart`, `touchmove`, `touchend`

## 📌 Future Improvements

- Add scoring or logic for matching colors
- Make pegs cloneable instead of resetting
- Add sound effects or animations

## 🛠️ Built With

- React
- JavaScript (ES6+)
- CSS3

