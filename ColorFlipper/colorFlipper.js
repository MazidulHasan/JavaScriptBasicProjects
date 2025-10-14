// Array of colors
const colors = ["red", "blue", "green", "purple", "orange", "pink", "yellow", "#f1c40f", "#2ecc71", "#9b59b6"];

// Get references
const btn = document.querySelector("#flipBtn");
const colorName = document.getElementById("colorName");

// Add event listener
btn.addEventListener("click", function() {
  // Pick random color
  const randomIndex = Math.floor(Math.random() * colors.length);
  const selectedColor = colors[randomIndex];

  // Change background
  document.body.style.backgroundColor = selectedColor;

  // Show color name
  colorName.textContent = selectedColor;
});
