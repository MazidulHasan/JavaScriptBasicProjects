// value
const countView = document.querySelector("#value");
const increaseBtn = document.querySelector(".increase");
const decreaseBtn = document.querySelector(".decrease");
const resetBtn = document.querySelector(".reset");

let count = 0;

increaseBtn.addEventListener("click", ()=>{
    count++;
    updateCountdisplay();
});

decreaseBtn.addEventListener("click", ()=>{
    count--;
    updateCountdisplay();
});

resetBtn.addEventListener("click", ()=>{
    count = 0;
    updateCountdisplay();
});

function updateCountdisplay() {
    countView.textContent = count;

    if (count > 0) {
        countView.style.color = "green";
    } else if (count < 0) {
        countView.style.color = "red";
    } else {
        countView.style.color = "black";
    }
}