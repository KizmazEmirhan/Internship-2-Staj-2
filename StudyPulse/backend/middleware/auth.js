const jwt = require('jsonwebtoken');
const { promisify } = require('util');

module.exports = async (req, res, next) => {
  try {
    // Token'ı al
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Giriş yapmanız gerekiyor'
      });
    }

    // Token'ı doğrula
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Kullanıcıyı isteğe ekle
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Geçersiz token'
    });
  }
};
