const title = document.getElementById("title");
const cursor = document.getElementById("cursor");

const textArray = [
  "We are the warriors that built this town",
  "soBig wasn't so big this year",
  "Once a warrior, always a warrior.",
  "We build cool stuff and pwn at events",
];
const typingDelay = 60;
const eraseDelay = 60;
const newTextDelay = 2000;
let textArrayIndex = 0;
let charIndex = 0;

let type = () => {
  if (charIndex < textArray[textArrayIndex].length) {
    if (!cursor.classList.contains("cursorActive"))
      cursor.classList.add("cursorActive");
    title.textContent += textArray[textArrayIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingDelay);
  } else {
    cursor.classList.remove("cursorActive");
    setTimeout(erase, newTextDelay);
  }
};

let erase = () => {
  if (charIndex > 0) {
    if (!cursor.classList.contains("cursorActive"))
      cursor.classList.add("cursorActive");
    title.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(erase, eraseDelay);
  } else {
    cursor.classList.remove("cursorActive");
    textArrayIndex++;
    if (textArrayIndex >= textArray.length) {
      textArrayIndex = 0;
    }
    setTimeout(type, typingDelay + 1100);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (textArray.length) setTimeout(type, 4400);
});

// FOOTER
const title2 = document.getElementById("titleF");
const cursor2 = document.getElementById("cursorF");

const typingDelay2 = 60;
const eraseDelay2 = 60;
const newTextDelay2 = 2000;
let textArrayIndex2 = 0;
let charIndex2 = 0;

const textArray2 = [
  "The code killed even the experts",
  "soBig wasn't so big this year",
  "We build cool stuff and pwn at events",
];

let type2 = () => {
  if (charIndex2 < textArray2[textArrayIndex2].length) {
    if (!cursor2.classList.contains("cursorActive"))
      cursor2.classList.add("cursorActive");
    title2.textContent += textArray2[textArrayIndex2].charAt(charIndex2);
    charIndex2++;
    setTimeout(type2, typingDelay2);
  } else {
    cursor2.classList.remove("cursorActive");
    setTimeout(erase2, newTextDelay2);
  }
};

let erase2 = () => {
  if (charIndex2 > 0) {
    if (!cursor2.classList.contains("cursorActive"))
      cursor2.classList.add("cursorActive");
    title2.textContent = textArray2[textArrayIndex2].substring(
      0,
      charIndex2 - 1
    );
    charIndex2--;
    setTimeout(erase2, eraseDelay2);
  } else {
    cursor2.classList.remove("cursorActive");
    textArrayIndex2++;
    if (textArrayIndex2 >= textArray2.length) {
      textArrayIndex2 = 0;
    }
    setTimeout(type2, typingDelay2 + 1100);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (textArray2.length) setTimeout(type2, 4400);
});

// UNITS

let units = document.querySelectorAll(".unit");

for (let unit of units) {
  unit.addEventListener("click", () => {
    unit.classList.toggle("unitActive");
  });
}
