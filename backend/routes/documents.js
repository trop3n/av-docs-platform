import express from 'express';
import { body, validationResult } from 'express-validator';
import Document from '../models/Document.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all documents
router.get('/', authenticate, async (req, res) => {
  try {
    const { category, tags, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const documents = await Document.find(query)
      .populate('author', 'username email')
      .sort({ updatedAt: -1 });

    res.json({ documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Get single document
router.get('/:id', authenticate, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('author', 'username email');

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({ document });
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Error fetching document' });
  }
});

// Create new document
router.post('/',
  authenticate,
  authorize('admin', 'editor'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, content, category, tags } = req.body;

      const document = new Document({
        title,
        content,
        category,
        tags,
        author: req.user._id
      });

      await document.save();
      await document.populate('author', 'username email');

      res.status(201).json({
        message: 'Document created successfully',
        document
      });
    } catch (error) {
      console.error('Error creating document:', error);
      res.status(500).json({ error: 'Error creating document' });
    }
  }
);

// Update document
router.put('/:id',
  authenticate,
  authorize('admin', 'editor'),
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('content').optional().notEmpty().withMessage('Content cannot be empty')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, content, category, tags } = req.body;

      const document = await Document.findById(req.params.id);

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      // Update fields
      if (title) document.title = title;
      if (content) document.content = content;
      if (category) document.category = category;
      if (tags) document.tags = tags;
      document.version += 1;

      await document.save();
      await document.populate('author', 'username email');

      res.json({
        message: 'Document updated successfully',
        document
      });
    } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).json({ error: 'Error updating document' });
    }
  }
);

// Delete document
router.delete('/:id',
  authenticate,
  authorize('admin', 'editor'),
  async (req, res) => {
    try {
      const document = await Document.findByIdAndDelete(req.params.id);

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      res.json({ message: 'Document deleted successfully' });
    } catch (error) {
      console.error('Error deleting document:', error);
      res.status(500).json({ error: 'Error deleting document' });
    }
  }
);

export default router;
