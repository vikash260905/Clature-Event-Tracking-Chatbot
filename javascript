function sendMessage() {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const message = input.value.trim();

  if (!message) return;

  chatBox.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
  input.value = "";

  const lowerMessage = message.toLowerCase();

  // Check if asking about today's or upcoming festivals
  if (lowerMessage.includes("today") || lowerMessage.includes("going on")) {
    const todayFestival = getTodayFestival();
    chatBox.innerHTML += `<div><strong>Bot:</strong> ${todayFestival}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
    return;
  }

  if (lowerMessage.includes("upcoming")) {
    const upcomingFestival = getUpcomingFestival();
    chatBox.innerHTML += `<div><strong>Bot:</strong> ${upcomingFestival}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
    return;
  }

  // General festival reply
  const localReply = getFestivalReply(lowerMessage);
  if (localReply) {
    chatBox.innerHTML += `<div><strong>Bot:</strong> ${localReply}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
    return;
  }

  // Fallback to server
  fetch("http://127.0.0.1:5000/chatbot?msg=" + encodeURIComponent(message))
    .then(response => response.text())
    .then(reply => {
      chatBox.innerHTML += `<div><strong>Bot:</strong> ${reply}</div>`;
      chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(error => {
      chatBox.innerHTML += `<div><strong>Bot:</strong> these detailsa are not avilable </div>`;
      console.error(error);
    });
}

// Festival data for 2025
const festivalDates = [
  { name: "Makar Sankranti", date: "2025-01-14", info: "📅 January 14, 2025 – Makar Sankranti is celebrated with kite flying and sweets!" },
  { name: "Republic Day", date: "2025-01-26", info: "🇮🇳 January 26, 2025 – Republic Day marks the adoption of India's Constitution." },
  { name: "Holi", date: "2025-03-14", info: "🎨 March 14, 2025 – Holi, the colorful festival of joy and love!" },
  { name: "Eid al-Fitr", date: "2025-03-31", info: "☪️ March 31, 2025 – Eid al-Fitr, marking the end of Ramadan." },
  { name: "Ram Navami", date: "2025-04-06", info: "🕉️ April 6, 2025 – Celebrating the birth of Lord Rama." },
  { name: "Raksha Bandhan", date: "2025-08-09", info: "🎁 August 9, 2025 – A celebration of sibling bonds." },
  { name: "Independence Day", date: "2025-08-15", info: "🇮🇳 August 15, 2025 – Celebrating India's independence." },
  { name: "Janmashtami", date: "2025-08-16", info: "🍼 August 16, 2025 – Lord Krishna's birthday celebration." },
  { name: "Ganesh Chaturthi", date: "2025-08-28", info: "🐘 August 28, 2025 – The birth of Lord Ganesha!" },
  { name: "Gandhi Jayanti", date: "2025-10-02", info: "🕊️ October 2, 2025 – Birthday of Mahatma Gandhi." },
  { name: "Dussehra", date: "2025-10-02", info: "🏹 October 2, 2025 – Victory of good over evil (Rama defeating Ravana)." },
  { name: "Diwali", date: "2025-10-20", info: "🪔 October 20, 2025 – Festival of Lights, symbolizing victory of light over darkness." },
  { name: "Christmas", date: "2025-12-25", info: "🎄 December 25, 2025 – Christmas celebrates the birth of Jesus Christ." }
];

function getFestivalReply(msg) {
  for (let fest of festivalDates) {
    if (msg.includes(fest.name.toLowerCase())) {
      return fest.info;
    }
  }
  return null;
}

function getTodayFestival() {
  const today = new Date().toISOString().split("T")[0];
  const match = festivalDates.find(fest => fest.date === today);
  return match ? `🎉 Today is ${match.name}! ${match.info}` : "📅 There is no major festival today.";
}

function getUpcomingFestival() {
  const today = new Date().toISOString().split("T")[0];
  const upcoming = festivalDates.find(fest => fest.date > today);
  return upcoming ? `🗓️ The next upcoming festival is ${upcoming.name} on ${upcoming.date}: ${upcoming.info}` : "🎊 You've reached the end of the 2025 festival list!";
}
