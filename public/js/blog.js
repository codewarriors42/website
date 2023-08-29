const readMoreBtns = document.querySelectorAll(".read-more");
const heightDefault = "9vh";

for (let readMore of readMoreBtns) {
  readMore.addEventListener("click", () => {
    let content = readMore.parentElement;
    const readMoreDiv = content.childNodes[3];
    console.log("click works");
    content.childNodes[1].classList.toggle("heightFull");
    console.log(readMore.childNodes);
    readMoreDiv.childNodes[3].classList.toggle("hide");
    readMoreDiv.childNodes[1].classList.toggle("hide");
  });
}

// SORT
let sorter = document.querySelector(".sort");
let opts = document.querySelector(".options");

if (sorter) {
  sorter.addEventListener("click", () => {
    sorter.classList.toggle("sortActive");
    opts.classList.toggle("optsActive");
  });
}

// SEARCH
function getMatches(input) {
  let matchList = [];

  for (let i = 0; i < titles.length; i++) {
    if (titles[i].toLowerCase().indexOf(input.toLowerCase()) != -1) {
      matchList.push(titles[i]);
    }
  }

  return matchList;
}

let search = document.querySelector("#searchBar");
let blogTitles = document.querySelectorAll(".unit h1");

let titles = [];
for (let title of blogTitles) {
  let h2 = title.textContent.toLowerCase();
  titles.push(h2);
}

let domTitles = document.querySelectorAll(".unit h1");

search.addEventListener("keyup", () => {
  document.querySelector(".items").style.display = "none";
  let usrInp = search.value.trim();
  let matches = getMatches(usrInp);
  if (usrInp == "") {
    for (let domTitle of domTitles) {
      domTitle.parentElement.style.display = "none";
    }
    document.querySelector(".titles").style.display = "none";
    document.querySelector(".items").style.display = "inline-block";
  } else {
    document.querySelector(".titles").style.display = "inline-block";
    for (let match of matches) {
      for (let title of titles) {
        if (match == title) {
          for (let domTitle of domTitles) {
            if (domTitle.textContent.toLowerCase() == title) {
              domTitle.parentElement.style.display = "block";
            }
          }
        }
      }
    }
  }
});

// SORTING
let options = document.querySelectorAll(".option");
let yrs = document.querySelectorAll(".year");

for (let option of options) {
  option.addEventListener("click", () => {
    if (option.textContent == "All") {
      for (let bog of document.querySelectorAll(".item")) {
        bog.style.display = "inline-block";
      }
      option.style.display = "none";
    } else {
      for (let bog of document.querySelectorAll(".item")) {
        bog.style.display = "none";
      }
      for (let yr of yrs) {
        if (parseInt(yr.textContent) == parseInt(option.textContent)) {
          yr.parentElement.style.display = "inline-block";
        }
      }
      document.querySelector(".allSort").style.display = "block";
    }
  });
}
