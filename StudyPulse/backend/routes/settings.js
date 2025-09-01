const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');

// Kullanıcı ayarlarını getir
router.get('/', auth, async (req, res) => {
  try {
    let settings = await Settings.findOne({ userId: req.user.id });
    
    // Eğer ayarlar yoksa varsayılan ayarları oluştur
    if (!settings) {
      settings = await Settings.createDefaultSettings(req.user.id);
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Kullanıcı ayarlarını güncelle
router.put('/', auth, async (req, res) => {
  try {
    let settings = await Settings.findOne({ userId: req.user.id });
    
    if (!settings) {
      settings = await Settings.createDefaultSettings(req.user.id);
    }

    settings = await Settings.updateUserSettings(req.user.id, req.body);

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Tema ayarını güncelle
router.put('/theme', auth, async (req, res) => {
  try {
    const { theme } = req.body;
    
    if (!['light', 'dark', 'system'].includes(theme)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz tema değeri'
      });
    }

    const settings = await Settings.updateUserSettings(req.user.id, { theme });

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Bildirim ayarlarını güncelle
router.put('/notifications', auth, async (req, res) => {
  try {
    const settings = await Settings.updateUserSettings(req.user.id, {
      notifications: req.body
    });

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Gizlilik ayarlarını güncelle
router.put('/privacy', auth, async (req, res) => {
  try {
    const settings = await Settings.updateUserSettings(req.user.id, {
      privacy: req.body
    });

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Çalışma tercihlerini güncelle
router.put('/study-preferences', auth, async (req, res) => {
  try {
    const settings = await Settings.updateUserSettings(req.user.id, {
      studyPreferences: req.body
    });

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Dil ayarını güncelle
router.put('/language', auth, async (req, res) => {
  try {
    const { language } = req.body;
    
    if (!['tr', 'en'].includes(language)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz dil değeri'
      });
    }

    const settings = await Settings.updateUserSettings(req.user.id, { language });

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
