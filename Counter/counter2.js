let count = 0;
const countView = document.querySelector("#value");
const buttons = document.querySelectorAll(".btn");

buttons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const action = e.currentTarget.classList;

    if (action.contains("increase")) count++;
    else if (action.contains("decrease")) count--;
    else if (action.contains("reset")) count = 0;

    updateCountDisplay();
  });
});

function updateCountDisplay() {
  countView.textContent = count;
  countView.style.color = count > 0 ? "green" : count < 0 ? "red" : "black";
}
