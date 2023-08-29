let search = document.querySelector("#searchBar");
let cards = document.querySelectorAll(".tS");

let titles = [];
for (let card of cards) {
    let h2 = card.children[2].textContent.toLowerCase();
    let h3 = card.children[3].textContent.toLowerCase();

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
            if (card.children[2].textContent.toLowerCase() === "yajha") {
                card.classList.add("hide");
            }
            if (card.children[2].textContent.toLowerCase() === "pr0coder") {
                card.classList.add("hide");
            }
        }
    } else {
        for (let card of cards) {
            card.style.display = "none";
        }
    }
    for (let match of matches) {
        for (let title of titles) {
            if (match == title) {
                document.querySelector(".cards").style.paddingTop = "0";
                document.querySelector(".cards").style.paddingBottom = "0";
                for (let card of cards) {
                    if (card.children[2].textContent.toLowerCase() == title) {
                        card.style.display = "flex";
                        if (
                            (card.children[2].textContent.toLowerCase() ===
                                "yajha" ||
                                card.children[2].textContent.toLowerCase() ===
                                    "pr0coder") &&
                            usrInp !== ""
                        ) {
                            card.classList.remove("hide");
                        }
                    } else if (
                        card.children[3].textContent.toLowerCase() == title
                    ) {
                        card.style.display = "flex";
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
