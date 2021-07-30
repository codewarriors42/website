const cards = document.querySelectorAll(".cards-container .card");
const popup = document.querySelector(".popup");

for (let card of cards) {
  card.addEventListener("click", () => {
    if (document.querySelector(".hide-res"))
      document.querySelector(".hide-res").classList.remove("hide-res");
    setTimeout(() => {
      // Set values
      popup.children[0].textContent = card.children[0].textContent;
      popup.children[1].textContent = card.children[1].textContent;

      // DO NOT REMOVE THESE COMMENTS ----------------------------------------------------------------

      popup.children[2].children[0].setAttribute(
        "href",
        card.children[2].textContent
      );
      popup.children[2].children[1].setAttribute(
        "href",
        card.children[3].textContent
      );

      popup.children[2].children[0].classList.remove("rem");
      // popup.children[2].children[0].classList.remove("blurBtn");
      popup.children[2].children[0].textContent = "Prompt";

      if (popup.children[0].textContent === "Crossword") {
        popup.children[2].children[1].setAttribute(
          "href",
          card.children[3].textContent
        );
        popup.children[2].children[0].classList.add("rem");
      } else if (popup.children[0].textContent === "Quiz") {
        popup.children[2].children[1].setAttribute(
          "href",
          card.children[3].textContent
        );
        popup.children[2].children[0].classList.add("rem");
      } else if (popup.children[0].textContent === "Competitive Programming") {
        popup.children[2].children[1].setAttribute(
          "href",
          card.children[3].textContent
        );
        popup.children[2].children[0].textContent = "Start";
      } else if (popup.children[0].textContent === "Techathlon") {
        popup.children[2].children[0].setAttribute(
          "href",
          "https://crypt-wars.code-warriors.org/"
        );
        popup.children[2].children[0].textContent = "Start";
      } else if (popup.children[0].textContent === "PC Gaming") {
        popup.children[2].children[0].setAttribute("href", "");
        popup.children[2].children[1].classList.add("hide-res");
      } else if (popup.children[0].textContent === "Sci-Napse") {
        popup.children[2].children[0].setAttribute("href", "");
        popup.children[2].children[1].classList.add("hide-res");
      } else if (popup.children[0].textContent === "Digital Art") {
        popup.children[2].children[0].setAttribute("href", "");
        popup.children[2].children[1].classList.add("hide-res");
      } else if (popup.children[0].textContent === "Surprise") {
        popup.children[2].children[0].setAttribute("href", "");
        popup.children[2].children[1].classList.add("hide-res");
      }

      document.querySelector("main").classList.add("blur");
      popup.classList.remove("hide");
      document.querySelector(".cards-container").style.pointerEvents = "none";
      document.querySelector(".vid").style.pointerEvents = "none";
      document.querySelector(".hero").style.pointerEvents = "none";
    }, 10);
    setTimeout(() => {
      document.querySelector("main.blur").addEventListener("click", () => {
        console.log("oye");
        popup.classList.add("hide");
        document.querySelector(".blur")
          ? document.querySelector(".blur").classList.remove("blur")
          : "";
        document.querySelector(".cards-container").style.pointerEvents = "all";
        document.querySelector(".vid").style.pointerEvents = "all";
        document.querySelector(".hero").style.pointerEvents = "all";
      });

      document.querySelector(".popup i").addEventListener("click", () => {
        popup.classList.add("hide");
        document.querySelector(".blur")
          ? document.querySelector(".blur").classList.remove("blur")
          : "";
        document.querySelector(".cards-container").style.pointerEvents = "all";
        document.querySelector(".vid").style.pointerEvents = "all";
        document.querySelector(".hero").style.pointerEvents = "all";
      });
    }, 100);
  });
}

// Notice

const noticeBtn = document.querySelector(".notice-btn");
const cardContainer = document.querySelector(".cards-container");
