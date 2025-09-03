const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const auth = require('../middleware/auth');

// Yeni çalışma oturumu oluştur
router.post('/', auth, async (req, res) => {
  try {
    const session = await Session.create({
      ...req.body,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Kullanıcının tüm çalışma oturumlarını getir
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate, subject } = req.query;
    const query = { userId: req.user.id };

    // Tarih filtresi
    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = new Date(startDate);
      if (endDate) query.startTime.$lte = new Date(endDate);
    }

    // Konu filtresi
    if (subject) {
      query.subject = subject;
    }

    const sessions = await Session.find(query).sort({ startTime: -1 });

    res.status(200).json({
      success: true,
      data: sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Belirli bir çalışma oturumunu getir
router.get('/:id', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Çalışma oturumu bulunamadı'
      });
    }

    // Kullanıcı sadece kendi oturumlarını görebilir
    if (session.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bu oturuma erişim izniniz yok'
      });
    }

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Çalışma oturumunu güncelle
router.put('/:id', auth, async (req, res) => {
  try {
    let session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Çalışma oturumu bulunamadı'
      });
    }

    // Kullanıcı sadece kendi oturumlarını güncelleyebilir
    if (session.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bu oturumu güncelleme izniniz yok'
      });
    }

    session = await Session.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Session update error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Çalışma oturumunu sil
router.delete('/:id', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Çalışma oturumu bulunamadı'
      });
    }

    // Kullanıcı sadece kendi oturumlarını silebilir
    if (session.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bu oturumu silme izniniz yok'
      });
    }

    await Session.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Çalışma oturumu başarıyla silindi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Kullanıcının çalışma istatistiklerini getir
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let start = startDate ? new Date(startDate) : new Date(0);
    let end = endDate ? new Date(endDate) : new Date();

    // Toplam çalışma süresi
    const totalStudyTime = await Session.getTotalStudyTime(req.user.id, start, end);

    // Konu dağılımı
    const subjectDistribution = await Session.getSubjectDistribution(req.user.id, start, end);

    res.status(200).json({
      success: true,
      data: {
        totalStudyTime,
        subjectDistribution
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
