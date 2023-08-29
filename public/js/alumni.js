// SEARCH
let search = document.querySelector("#searchBar");
let cards = document.querySelectorAll(".card");

let titles = [];
for (let card of cards) {
  let h2 = card.querySelector("h2").textContent.toLowerCase();
  let h3 = card.querySelector("h3").textContent.toLowerCase();
  titles.push(h2);
  titles.push(h3);
}

search.addEventListener("keyup", (e) => {
  document.querySelector(".cards").style.paddingTop = "10vh";
  document.querySelector(".cards").style.paddingBottom = "10vh";
  let usrInp = search.value.trim();
  let matches = getMatches(usrInp);
  if (usrInp == "") {
    document.querySelector(".cards").style.paddingTop = "0";
    document.querySelector(".cards").style.paddingBottom = "0";
    for (let card of cards) {
      card.style.display = "flex";
    }
    let heads = document.querySelectorAll(".header");
    for (let head of heads) {
      head.style.display = "flex";
    }
    document.querySelector(".year").style.visibility = "visible";
  } else {
    for (let card of cards) {
      card.style.display = "none";
    }
    let heads = document.querySelectorAll(".header");
    for (let head of heads) {
      head.style.display = "none";
    }
    document.querySelector(".header").style.display = "flex";
    document.querySelector(".year").style.visibility = "hidden";
  }
  for (let match of matches) {
    for (let title of titles) {
      if (match == title) {
        document.querySelector(".cards").style.paddingTop = "0";
        document.querySelector(".cards").style.paddingBottom = "0";
        for (let card of cards) {
          if (card.querySelector("h2").textContent.toLowerCase() == title) {
            card.style.display = "flex";
            card.parentElement.previousElementSibling.style.display = "flex";
          } else if (
            card.querySelector("h3").textContent.toLowerCase() == title
          ) {
            card.style.display = "flex";
            card.parentElement.previousElementSibling.style.display = "flex";
          }
        }
      }
    }
  }
});

function getMatches(input) {
  let matchList = [];

  for (let i = 0; i < titles.length; i++) {
    if (titles[i].toLowerCase().indexOf(input.toLowerCase()) != -1) {
      matchList.push(titles[i]);
    }
  }

  return matchList;
}

// SORT
let sorter = document.querySelector(".sort");
let opts = document.querySelector(".options");

sorter.addEventListener("click", () => {
  sorter.classList.toggle("sortActive");
  opts.classList.toggle("optsActive");
});
