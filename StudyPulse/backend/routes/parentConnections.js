const express = require('express');
const router = express.Router();
const ParentConnection = require('../models/ParentConnection');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Yeni ebeveyn bağlantısı oluştur
router.post('/', auth, async (req, res) => {
  try {
    const { studentEmail } = req.body;

    // Ebeveyn rolünü kontrol et
    if (req.user.role !== 'parent') {
      return res.status(403).json({
        success: false,
        message: 'Sadece ebeveynler bağlantı oluşturabilir'
      });
    }

    // Öğrenciyi bul
    const student = await User.findOne({ email: studentEmail, role: 'student' });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Öğrenci bulunamadı'
      });
    }

    // Mevcut bağlantıyı kontrol et
    const existingConnection = await ParentConnection.findOne({
      parentId: req.user.id,
      studentId: student._id,
      status: { $in: ['pending', 'active'] }
    });

    if (existingConnection) {
      return res.status(400).json({
        success: false,
        message: 'Bu öğrenci ile zaten bir bağlantınız var'
      });
    }

    // Yeni bağlantı oluştur
    const connection = await ParentConnection.create({
      parentId: req.user.id,
      studentId: student._id
    });

    res.status(201).json({
      success: true,
      data: connection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Bağlantı isteğini onayla veya reddet
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz durum değeri'
      });
    }

    const connection = await ParentConnection.findById(req.params.id);
    
    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Bağlantı bulunamadı'
      });
    }

    // Öğrenci rolünü ve yetkiyi kontrol et
    if (req.user.role !== 'student' || connection.studentId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bu işlem için yetkiniz yok'
      });
    }

    if (connection.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Bu bağlantı isteği zaten işlenmiş'
      });
    }

    connection.status = status;
    await connection.save();

    res.status(200).json({
      success: true,
      data: connection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Kullanıcının bağlantılarını listele
router.get('/', auth, async (req, res) => {
  try {
    let connections;
    const { status } = req.query;

    // Role göre bağlantıları getir
    if (req.user.role === 'parent') {
      connections = await ParentConnection.findParentStudents(req.user.id);
    } else if (req.user.role === 'student') {
      connections = await ParentConnection.findStudentParents(req.user.id);
    }

    // Durum filtrelemesi
    if (status) {
      connections = connections.filter(conn => conn.status === status);
    }

    res.status(200).json({
      success: true,
      data: connections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Belirli bir bağlantının detaylarını getir
router.get('/:id', auth, async (req, res) => {
  try {
    const connection = await ParentConnection.findById(req.params.id)
      .populate('parentId', 'name surname email')
      .populate('studentId', 'name surname email');
    
    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Bağlantı bulunamadı'
      });
    }

    // Bağlantıya erişim yetkisi kontrolü
    if (![connection.parentId._id.toString(), connection.studentId._id.toString()].includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Bu bağlantıya erişim izniniz yok'
      });
    }

    res.status(200).json({
      success: true,
      data: connection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Bağlantıyı sil
router.delete('/:id', auth, async (req, res) => {
  try {
    const connection = await ParentConnection.findById(req.params.id);
    
    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Bağlantı bulunamadı'
      });
    }

    // Silme yetkisi kontrolü
    if (![connection.parentId.toString(), connection.studentId.toString()].includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Bu bağlantıyı silme izniniz yok'
      });
    }

    await connection.remove();

    res.status(200).json({
      success: true,
      message: 'Bağlantı başarıyla silindi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
