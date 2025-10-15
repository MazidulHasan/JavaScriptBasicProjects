const reviews = [
    {
        id:1,
        name: "name 1",
        job: "Job 1",
        img: "ava_1.png",
        des: "lorem ipsum asldjf sadjf"
    },
    {
        id:2,
        name: "name 2",
        job: "Job 2",
        img: "ava_2.png",
        des: "lorem 2"
    },
    {
        id:3,
        name: "name 3",
        job: "Job 3",
        img: "ava_3.png",
        des: "lorem 3"
    },
    {
        id:4,
        name: "name 4",
        job: "Job 4",
        img: "ava_4.png",
        des: "lorem 4"
    }
]


// html items
const img = document.querySelector("#person-img");
const author = document.querySelector("#author");
const job = document.querySelector("#job");
const des = document.querySelector("#info");

const prevBtn = document.querySelector(".fa-chevron-left");
const rightBtn = document.querySelector(".fa-chevron-right");
const rndBtn = document.querySelector(".random-btn");


let current_item = 0;

window.addEventListener("DOMContentLoaded", function(){
    showPerson(current_item);
})

function showPerson(index) {
    const item = reviews[index];
    img.src = item.img;
    author.textContent = item.name;
    job.textContent = item.job;
    des.textContent = item.des;
}

rightBtn.addEventListener("click", function(){
    console.log("current_item", current_item);
    current_item++;
    if (current_item > reviews.length-1) {
        current_item = 0;
    }
    showPerson(current_item);
})

prevBtn.addEventListener("click", function(){
    console.log("current_item", current_item);
    current_item--;
    if (current_item < 0) {
        current_item = reviews.length-1;
    }
    showPerson(current_item);
})

rndBtn.addEventListener("click", function() {
    const randomIndex = Math.floor(Math.random() * reviews.length-1);
    console.log("randomIndex",randomIndex);
    
    showPerson(randomIndex);
})