const sendMail = require("./utils/sendMail");

(async () => {
  await sendMail(
    "dailytasksoffice@gmail.com",
    "✅ Testing Brevo HTTP API",
    "<h3>Hello from HTTP API 🚀</h3><p>No more socket errors!</p>"
  );
})();
