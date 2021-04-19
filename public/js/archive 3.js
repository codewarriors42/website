let tabs = document.querySelectorAll(".tab");

for (let tab of tabs) {
  tab.addEventListener("click", () => {
    document.querySelector(".activeTab").classList.remove("activeTab");
    tab.classList.add("activeTab");
  });
}

// SORT
let sorter = document.querySelector(".sort");
let opts = document.querySelector(".options");

sorter.addEventListener("click", () => {
  sorter.classList.toggle("sortActive");
  opts.classList.toggle("optsActive");
});

// SEARCH
let search = document.querySelector("#searchBar");
let cards = document.querySelectorAll(".card");
let headers = document.querySelectorAll(".header");

let titles = [];
for (let card of cards) {
  let h2 = card.children[2].children[0].textContent.toLowerCase();
  let h3 = card.children[2].children[1].textContent.toLowerCase();
  let h4 = card.children[3].children[1].textContent.toLowerCase();
  titles.push(h2);
  titles.push(h3);
  titles.push(h4);
}

search.addEventListener("keyup", () => {
  document.querySelector(".cards").style.paddingTop = "10vh";
  document.querySelector(".cards").style.paddingBottom = "10vh";
  let usrInp = search.value.trim();
  let matches = getMatches(usrInp);
  if (usrInp == "") {
    document.querySelector(".cards").style.paddingTop = "4vh";
    document.querySelector(".cards").style.paddingBottom = "4vh";
    for (let card of cards) {
      card.style.display = "flex";
    }
    for (let header of headers) {
      header.style.display = "flex";
    }
    document.querySelector(".headerLeft").style.visibility = "visible";
  } else {
    for (let card of cards) {
      card.style.display = "none";
    }
    for (let header of headers) {
      header.style.display = "none";
    }
    document.querySelector(".header").style.display = "flex";
    document.querySelector(".headerLeft").style.visibility = "hidden";
  }
  for (let match of matches) {
    for (let title of titles) {
      if (match == title) {
        document.querySelector(".cards").style.paddingTop = "4vh";
        document.querySelector(".cards").style.paddingBottom = "4vh";
        for (let card of cards) {
          if (card.children[2].children[0].textContent.toLowerCase() == title) {
            card.style.display = "flex";
            card.parentElement.previousElementSibling.style.display = "flex";
            if (
              document.querySelector(".header") ==
              card.parentElement.previousElementSibling
            ) {
              document.querySelector(".headerLeft").style.visibility =
                "visible";
            }
          } else if (
            card.children[2].children[1].textContent.toLowerCase() == title
          ) {
            card.style.display = "flex";
            card.parentElement.previousElementSibling.style.display = "flex";
            if (
              document.querySelector(".header") ==
              card.parentElement.previousElementSibling
            ) {
              document.querySelector(".headerLeft").style.visibility =
                "visible";
            }
          } else if (
            card.children[3].children[1].textContent.toLowerCase() == title
          ) {
            card.style.display = "flex";
            card.parentElement.previousElementSibling.style.display = "flex";
            if (
              document.querySelector(".header") ==
              card.parentElement.previousElementSibling
            ) {
              document.querySelector(".headerLeft").style.visibility =
                "visible";
            }
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

// SORTING
let options = document.querySelectorAll(".option");
let hTitles = document.querySelectorAll(".header h2");

for (let option of options) {
  option.addEventListener("click", () => {
    // Disappear
    for (let header of headers) {
      header.style.display = "none";
    }
    document.querySelector(".header").style.display = "flex";
    document.querySelector(".headerLeft").style.visibility = "hidden";
    for (let cs of document.querySelectorAll(".cards")) {
      cs.style.display = "none";
    }

    // All action
    if (option.textContent == "All") {
      document.querySelector(".allAddActive").classList.remove("allAddActive");
      for (let header of headers) {
        header.style.display = "flex";
      }
      document.querySelector(".headerLeft").style.visibility = "visible";
      for (let cs of document.querySelectorAll(".cards")) {
        cs.style.display = "flex";
      }
    } else {
      if (!document.querySelector(".allAddActive")) {
        document.querySelector(".allAdd").classList.add("allAddActive");
      }

      for (let hTitle of hTitles) {
        if (hTitle.textContent == option.textContent) {
          hTitle.parentElement.style.visibility = "visible";
          hTitle.parentElement.parentElement.style.display = "flex";
          hTitle.parentElement.parentElement.nextElementSibling.style.display =
            "flex";
        }
      }
    }
  });
}

// See all
let sas = document.querySelectorAll(".see h4");

for (let sa of sas) {
  sa.addEventListener("click", () => {
    if (sa.textContent == "See Less") {
      sa.textContent = "See All";
      let childs = sa.parentElement.parentElement.children;
      for (let child of childs) {
        child.style.display = "none";
      }
      let firs = document.querySelectorAll(".cards > .card:first-child");
      for (let fir of firs) {
        fir.style.display = "inline-block";
      }
      sa.parentElement.parentElement.lastElementChild.style.display = "block";
    } else {
      sa.textContent = "See Less";
      let childs = sa.parentElement.parentElement.children;
      for (let child of childs) {
        child.style.display = "inline-block";
      }
    }
  });
}
