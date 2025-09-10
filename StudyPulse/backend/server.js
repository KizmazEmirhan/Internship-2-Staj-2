const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Çevre değişkenlerini yükleme
dotenv.config();

// Express uygulamasını oluşturma
const app = express();

// Middleware'leri kurma
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route'ları içe aktarma ve kullanma
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/sessions", require("./routes/sessions"));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/parent-connections", require("./routes/parentConnections"));

// Hata işleme middleware'i
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Sunucu hatası",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// MongoDB bağlantısı ve sunucu başlatma
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
  }
}

startServer()


