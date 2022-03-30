const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const twitterBtn = document.getElementById("twitter");
const newQuoteBtn = document.getElementById("new-quote");
const loader = document.getElementById("loader");
const errorNotification = document.getElementById("errorNotification");
const downloadQuoteBtn = document.getElementById("download-quote");

let apiQuotes = [];

function showLoadingSpinner() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

function removeLoadingSpinner() {
  quoteContainer.hidden = false;
  loader.hidden = true;
}

// Show new Quote
function newQuote() {
  showLoadingSpinner();
  // Pick a random quote from array
  const quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];
  // Check if Author field is blank and replace it with 'Unknown'
  if (!quote.author) {
    authorText.textContent = "Unknown";
  } else {
    authorText.textContent = quote.author;
  }
  // Check Quote length to determine styling
  if (quote.text.length > 120) {
    quoteText.classList.add("long-quote");
  } else {
    quoteText.classList.remove("long-quote");
  }
  // Set Quote, Hide Loader
  quoteText.textContent = quote.text;
  removeLoadingSpinner();
}

// Get quotes from api
async function getQuotes() {
  showLoadingSpinner();
  const apiUrl = "https://type.fit/api/quotes";
  try {
    const response = await fetch(apiUrl);
    apiQuotes = await response.json();
    newQuote();
  } catch (err) {
    apiQuotes = localQuotes;
    errorNotification.hidden = false;
    setTimeout(() => {
      errorNotification.hidden = true;
    }, 3000);
    newQuote();
  }
}

// Tweet Quote
function tweetQuote() {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteText.innerText} - ${authorText.innerText}`;
  window.open(twitterUrl, "_blank");
}

// Download Quote
downloadQuoteBtn.addEventListener("click", () => {
  const buttonContainer = document.querySelector(".button-container");
  quoteContainer.removeChild(buttonContainer);
  html2canvas(document.body).then(function (canvas) {
    canvas.toBlob(function (blob) {
      saveAs(blob, "quotes.png");
    });
  });
  quoteContainer.appendChild(buttonContainer);
});

// Event Listeners
newQuoteBtn.addEventListener("click", newQuote);
twitterBtn.addEventListener("click", tweetQuote);

// On Load
getQuotes();
