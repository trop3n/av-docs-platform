import mongoose from 'mongoose';

const diagramSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  diagramData: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    // Will store react-flow data: { nodes: [], edges: [] }
  },
  category: {
    type: String,
    default: 'General'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isTemplate: {
    type: Boolean,
    default: false
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  version: {
    type: Number,
    default: 1
  }
});

// Update timestamp on save
diagramSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Diagram', diagramSchema);
