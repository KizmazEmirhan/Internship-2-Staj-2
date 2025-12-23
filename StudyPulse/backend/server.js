const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || [
      "http://localhost:5173",
      "https://studypulsefrontend.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SSE client listesi
let clients = [];

// SSE endpoint
app.get("/api/sessions/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  clients.push(res);

  req.on("close", () => {
    clients = clients.filter((client) => client !== res);
  });
});

// Event gönderme fonksiyonu
function sendEvent(event, data) {
  clients.forEach((res) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

// Route’lar
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/sessions", require("./routes/sessions")(sendEvent));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/parent-connections", require("./routes/parentConnections"));
app.use('/api/tasks', require('./routes/tasks'))
app.use('/api/daynotes', require('./routes/daynotes'))

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Sunucu hatası",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB bağlantısı başarılı");

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Sunucu ${PORT} portunda çalışıyor`);
    });
  } catch (err) {
    console.error("MongoDB bağlantı hatası:", err);
    // Daha açıklayıcı hata mesajı (özellikle SRV/DNS ENOTFOUND durumları için)
    if (err && err.code === "ENOTFOUND" && err.syscall === "querySrv") {
      // MONGO_URI içinden host kısmını almaya çalış (ör: user:pass@hostname/..)
      const raw = process.env.MONGO_URI || "";
      const hostMatch = raw.match(/@([^/\?]+)/);
      const hostname = hostMatch ? hostMatch[1] : "<host-ismi-bulunamadi>";

      console.error("\nBulgu: DNS SRV (_mongodb._tcp) kaydı çözümlenemiyor.");
      console.error("Muhtemel nedenler: yanlış host ismi, ağ/DNS erişimi engellenmiş veya bağlantı dizesi hatalı.");
      console.error("Öneriler:");
      console.error(`- .env içindeki MONGO_URI değerini kontrol edin. Host: ${hostname}`);
      console.error("- İnternet bağlantınızı ve DNS ayarlarınızı kontrol edin.");
      console.error("- PowerShell üzerinde SRV kaydını test edin (örnek komutlar):");
      console.error(`  nslookup -type=SRV _mongodb._tcp.${hostname}`);
      console.error("  veya");
      console.error(`  Resolve-DnsName -Type SRV _mongodb._tcp.${hostname}`);
      console.error("- Eğer SRV (mongodb+srv) çözümlenemiyorsa, MongoDB Atlas'tan 'Standard (mongodb://)' bağlantı dizesini alın ve .env'de kullanın.");
      console.error("- Ayrıca, kullanıcı/parola bilgilerini (özel karakterler varsa) URL-encode ettiğinizden emin olun.");
    }
    // Bağlantı kurulamazsa süreci sonlandır; deploy ortamınızda process manager varsa yeniden başlatma yapılır.
    process.exit(1);
  }
}

startServer();
