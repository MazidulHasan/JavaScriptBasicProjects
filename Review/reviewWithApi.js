// html items
const img = document.querySelector("#person-img");
const author = document.querySelector("#author");
const job = document.querySelector("#job");
const des = document.querySelector("#info");
const achivements = document.querySelector("#post_achivements");

const prevBtn = document.querySelector(".fa-chevron-left");
const rightBtn = document.querySelector(".fa-chevron-right");
const rndBtn = document.querySelector(".random-btn");


let current_item = 0;
let reviews = [];

window.addEventListener("DOMContentLoaded", async function(){
    await fetchPosts();
    console.log("review.length", reviews.length);
    if (reviews.length > 0) {
        showPerson(current_item);
    } else {
        author.textContent = "No data found";
    }
})

async function fetchPosts() {
    try {
        console.log("requesting the api");
        const response = await fetch("https://dummyjson.com/posts");
        console.log("Api request complete");
        const data = await response.json();
        console.log("data",  data);
        reviews = data.posts;
        console.log("reviews", reviews);
    } catch (error) {
        console.log(error);
    }
}

function showPerson(index) {
  const item = reviews[index];
  const image_rnd = `ava_${Math.floor(Math.random() * 3)}.png`;
  console.log("image_rnd",image_rnd);
  
  img.src = image_rnd;

  // Title of post (like author name)
  author.textContent = item.title;

  // Tags act like “job” or “category”
  job.textContent = item.tags.join(", ");

  // Combine body + reaction info
  des.textContent = item.body;
  achivements.textContent = `❤️ Likes: ${item.reactions.likes} | 👎 Dislikes: ${item.reactions.dislikes} | 👁️ Views: ${item.reactions.views} | 👤 User: ${item.userId}`;
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