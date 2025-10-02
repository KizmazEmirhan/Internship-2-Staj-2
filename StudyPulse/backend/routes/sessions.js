const express = require("express");
const Session = require("../models/Session");
const auth = require("../middleware/auth");

module.exports = function (sendEvent) {
  const router = express.Router();

  // Tüm kullanıcı oturumlarını getir (kullanıcıya göre)
  router.get("/", auth, async (req, res, next) => {
    try {
      const { startDate, endDate, subject } = req.query;
      const query = { userId: req.user.id };

      if (startDate || endDate) {
        query.startTime = {};
        if (startDate) query.startTime.$gte = new Date(startDate);
        if (endDate) query.startTime.$lte = new Date(endDate);
      }

      if (subject) {
        query.subject = subject;
      }

      const sessions = await Session.find(query).sort({ startTime: -1 });
      res.json(sessions);
    } catch (err) {
      next(err);
    }
  });

  // Yeni session
  router.post("/", auth, async (req, res, next) => {
    try {
      const payload = { ...req.body, userId: req.user.id };
      const session = new Session(payload);
      await session.save();

      // SSE event tetikle
      sendEvent("session:update", session);

      res.status(201).json(session);
    } catch (err) {
      next(err);
    }
  });

  // Session güncelleme
  router.put("/:id", auth, async (req, res, next) => {
    try {
      const { id } = req.params;
      const session = await Session.findById(id);
      if (!session) return res.status(404).json({ success: false, message: 'Session bulunamadı' });
      if (session.userId.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Bu oturumu güncelleme izniniz yok' });

      Object.assign(session, req.body);
      await session.save();

      sendEvent("session:update", session);

      res.json(session);
    } catch (err) {
      next(err);
    }
  });

  // Session silme
  router.delete("/:id", auth, async (req, res, next) => {
    try {
      const { id } = req.params;
      const session = await Session.findById(id);
      if (!session) return res.status(404).json({ success: false, message: 'Session bulunamadı' });
      if (session.userId.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Bu oturumu silme izniniz yok' });

      await Session.findByIdAndDelete(id);

      sendEvent("session:end", { id });

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  });

  // İstatistik endpoint'i
  router.get('/stats/summary', auth, async (req, res, next) => {
    try {
      const { startDate, endDate } = req.query;
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();

      const totalStudyTime = await Session.getTotalStudyTime(req.user.id, start, end);
      const subjectDistribution = await Session.getSubjectDistribution(req.user.id, start, end);

      res.json({ totalStudyTime, subjectDistribution });
    } catch (err) {
      next(err);
    }
  });

  return router;
};
