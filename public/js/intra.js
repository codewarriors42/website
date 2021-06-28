const cards = document.querySelectorAll(".card");
const popup = document.querySelector(".popup");

for (let card of cards) {
  card.addEventListener("click", () => {
    setTimeout(() => {
      // Set values
      popup.children[0].textContent = card.children[0].textContent;
      popup.children[1].textContent = card.children[1].textContent;

      // DO NOT REMOVE THESE COMMENTS ----------------------------------------------------------------

<<<<<<< HEAD
      // popup.children[2].children[0].setAttribute(
      //   "href",
      //   card.children[2].textContent
      // );
=======
      popup.children[2].children[0].setAttribute(
        "href",
        card.children[2].textContent
      );
>>>>>>> afc6475156f4b6802ae80ae1075167cf9102d848
      popup.children[2].children[1].setAttribute(
        "href",
        card.children[3].textContent
      );

      popup.children[2].children[0].classList.remove("rem");
      popup.children[2].children[0].textContent = "Prompts";

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
        popup.children[2].children[0].classList.add("rem");
      } else if (popup.children[0].textContent === "Crypt Wars") {
<<<<<<< HEAD
        // popup.children[2].children[0].setAttribute(
        //   "href",
        //   "https://intracw.ml"
        // );
=======
        popup.children[2].children[0].setAttribute("href", "");

        // TEMPORARY
        popup.children[2].children[0].style.display = "none";
        // TEMPORARY END

>>>>>>> afc6475156f4b6802ae80ae1075167cf9102d848
        popup.children[2].children[0].textContent = "Play";
      }

      document.querySelector("main").classList.add("blur");
      popup.classList.remove("hide");
      document.querySelector(".cards-container").style.pointerEvents = "none";
      document.querySelector(".vid").style.pointerEvents = "none";
      document.querySelector(".hero").style.pointerEvents = "none";
    }, 10);
    setTimeout(() => {
      document.querySelector(".blur").addEventListener("click", () => {
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
<<<<<<< HEAD
const cardContainer= document.querySelector(".cards-container")
=======
const cardContainer = document.querySelector(".cards-container");
>>>>>>> afc6475156f4b6802ae80ae1075167cf9102d848

noticeBtn.addEventListener("click", () => {
  cardContainer.classList.toggle("hidden");
  if (noticeBtn.innerHTML === "I understand, show event details") {
    noticeBtn.innerHTML = "Hide Event Details";
  } else {
    noticeBtn.innerHTML = "I understand, show event details";
  }
<<<<<<< HEAD
})
=======
});
>>>>>>> afc6475156f4b6802ae80ae1075167cf9102d848
