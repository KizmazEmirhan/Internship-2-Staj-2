const mongoose = require('mongoose');

const parentConnectionSchema = new mongoose.Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'rejected'],
    default: 'pending'
  },
  connectionCode: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Her bağlantı için benzersiz kod oluşturma
parentConnectionSchema.pre('save', async function(next) {
  if (this.isNew) {
    this.connectionCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

// Bağlantı durumunu kontrol etme metodu
parentConnectionSchema.statics.checkConnection = async function(parentId, studentId) {
  const connection = await this.findOne({
    parentId,
    studentId,
    status: 'active'
  });
  return !!connection;
};

// Öğrencinin tüm ebeveynlerini bulma
parentConnectionSchema.statics.findStudentParents = async function(studentId) {
  return await this.find({
    studentId,
    status: 'active'
  }).populate('parentId', 'name surname email');
};

// Ebeveynin tüm öğrencilerini bulma
parentConnectionSchema.statics.findParentStudents = async function(parentId) {
  return await this.find({
    parentId,
    status: 'active'
  }).populate('studentId', 'name surname email');
};

module.exports = mongoose.model('ParentConnection', parentConnectionSchema);
