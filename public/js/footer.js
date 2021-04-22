const title = document.getElementById("titleF");
const cursor = document.getElementById("cursorF");

const typingDelay = 60;
const eraseDelay = 60;
const newTextDelay = 1000;
let textArrayIndex = 0;
let charIndex = 0;

const textArray = [
  "The code even killed the experts",
  "We build cool stuff and pwn at events",
  "Once a warrior, Always a Warrior",
];

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
  if (textArray.length) setTimeout(type, 1000);
});
