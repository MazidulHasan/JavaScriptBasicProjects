// Array of colors
const colors = ["red", "blue", "green", "purple", "orange", "pink", "yellow", "#f1c40f", "#2ecc71", "PurleIsh"];

// Get references
const btn = document.querySelector("#flipBtn");
const colorName = document.getElementById("colorName");

// Add event listener
btn.addEventListener("click", function() {
  // Pick random color
  const randomIndex = Math.floor(Math.random() * colors.length);
  console.log("randomIndex",randomIndex);
  
  const selectedColor = colors[randomIndex];
  console.log("selectedColor",selectedColor);
  
  // Change background
  document.body.style.backgroundColor = selectedColor;

  // Show color name
  colorName.textContent = selectedColor;
});
