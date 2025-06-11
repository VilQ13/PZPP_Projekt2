const quoteEl = document.getElementById('quote');
const authorEl = document.getElementById('author');
const newQuoteBtn = document.getElementById('newQuote');

const quotes = [
    { text: "Don't wait for opportunity. Create it.", author: "George Bernard Shaw" },
    { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
    { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
    { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Dream big. Start small. Act now.", author: "Robin Sharma" },
    { text: "Quality means doing it right when no one is looking.", author: "Henry Ford" },
    { text: "Great things never come from comfort zones.", author: "Unknown" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
    { text: "Stay positive, work hard, make it happen.", author: "Unknown" },
    { text: "Success doesn’t come from what you do occasionally, it comes from what you do consistently.", author: "Marie Forleo" },
    { text: "Your limitation—it’s only your imagination.", author: "Unknown" },
    { text: "Work hard in silence, let your success be your noise.", author: "Frank Ocean" },
    { text: "Don’t watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
    { text: "Success is not in what you have, but who you are.", author: "Bo Bennett" },
    { text: "Don’t limit your challenges. Challenge your limits.", author: "Unknown" },
    { text: "Be so good they can’t ignore you.", author: "Steve Martin" },
    { text: "You don’t have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
    { text: "Strive for progress, not perfection.", author: "Unknown" },
    { text: "Don’t be busy. Be productive.", author: "Unknown" },
    { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
    { text: "What you do today can improve all your tomorrows.", author: "Ralph Marston" },
    { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
    { text: "Nothing will work unless you do.", author: "Maya Angelou" },
    { text: "Small steps every day.", author: "Unknown" },
    
];

function getRandomQuote() {
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    quoteEl.textContent = `"${random.text}"`;
    authorEl.textContent = random.author || "Unknown";
}

newQuoteBtn.addEventListener("click", getRandomQuote);
window.addEventListener("load", getRandomQuote);
