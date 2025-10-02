const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Kayıt olma
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name, surname, role } = req.body;

    // Basit doğrulama
    if (!email || !password || !name || !surname || !role) {
      return res.status(400).json({ success: false, message: 'Tüm alanlar zorunludur' });
    }

    // Email kullanımda mı kontrol et
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Bu email adresi zaten kullanımda' });
    }

    // Yeni kullanıcı oluştur
    const user = await User.create({
      email,
      password,
      name,
      surname,
      role,
    });

    // Token oluştur
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    // Yanıt gönder
    res.status(201).json({
      success: true,
      token,
      data: {
        user: { id: user._id, email: user.email, name: user.name, surname: user.surname, role: user.role },
      },
    });
  } catch (error) {
    // Duplicate key (unique) hatası
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Kayıt sırasında benzersiz alan hatası' });
    }

    // Validation hatası
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message).join('; ');
      return res.status(400).json({ success: false, message: messages });
    }

    // Diğer hataları bir üst middleware'e göndererek loglanmasını sağla
    next(error);
  }
});

// Giriş yapma
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Email ve şifre kontrolü
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email ve şifre gerekli'
      });
    }

    // Kullanıcıyı bul ve şifreyi kontrol et
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Email veya şifre hatalı'
      });
    }

    // Token oluştur
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Yanıt gönder
    res.status(200).json({
      success: true,
      token,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          surname: user.surname,
          role: user.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Mevcut kullanıcı bilgilerini al
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          surname: user.surname,
          role: user.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
