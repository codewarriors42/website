let pageNums = document.querySelectorAll(".nums button");
if (pageNums.length > 5) {
  for (let pageNum of pageNums) {
    pageNum.style.display = "none";
  }
  let one = document.querySelector(".pageActive");
  one.style.display = "inline-block";
  if (one.nextElementSibling) {
    one.nextElementSibling.style.display = "inline-block";
    if (one.nextElementSibling.nextElementSibling) {
      one.nextElementSibling.nextElementSibling.style.display = "inline-block";
    }
  }
  if (one.previousElementSibling) {
    one.previousElementSibling.style.display = "inline-block";
    if (
      one.previousElementSibling !== document.querySelector(".nums button") ||
      one.previousElementSibling !==
        document.querySelector(".nums button").nextElementSibling
    ) {
      document.querySelector(".nums button").style.display = "inline-block";
      let span1 = document.createElement("SPAN");
      span1.innerHTML = "...";
      document
        .querySelector(".nums")
        .insertBefore(
          span1,
          document.querySelector(".nums").firstElementChild.nextElementSibling
        );
    }
    if (one.previousElementSibling.previousElementSibling) {
      one.previousElementSibling.previousElementSibling.style.display =
        "inline-block";
    }
  }
  document.querySelector(".nums").lastElementChild.style.display =
    "inline-block";

  let span = document.createElement("SPAN");
  span.innerHTML = "...";
  document
    .querySelector(".nums")
    .insertBefore(span, document.querySelector(".nums").lastElementChild);
}
