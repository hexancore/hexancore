var logs = document.createElement("div");
document.body.appendChild(logs);
export function println(message) {
  message = typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
  logs.innerHTML += '<pre>' + message + '</pre><br>';
}

