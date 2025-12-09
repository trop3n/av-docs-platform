import express from 'express';
import { body, validationResult } from 'express-validator';
import Diagram from '../models/Diagram.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all diagrams
router.get('/', authenticate, async (req, res) => {
  try {
    const { category, tags, isTemplate, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    if (isTemplate !== undefined) {
      query.isTemplate = isTemplate === 'true';
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const diagrams = await Diagram.find(query)
      .populate('author', 'username email')
      .sort({ updatedAt: -1 });

    res.json({ diagrams });
  } catch (error) {
    console.error('Error fetching diagrams:', error);
    res.status(500).json({ error: 'Error fetching diagrams' });
  }
});

// Get single diagram
router.get('/:id', authenticate, async (req, res) => {
  try {
    const diagram = await Diagram.findById(req.params.id)
      .populate('author', 'username email');

    if (!diagram) {
      return res.status(404).json({ error: 'Diagram not found' });
    }

    res.json({ diagram });
  } catch (error) {
    console.error('Error fetching diagram:', error);
    res.status(500).json({ error: 'Error fetching diagram' });
  }
});

// Create new diagram
router.post('/',
  authenticate,
  authorize('admin', 'editor'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('diagramData').notEmpty().withMessage('Diagram data is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, diagramData, category, tags, isTemplate } = req.body;

      const diagram = new Diagram({
        title,
        description,
        diagramData,
        category,
        tags,
        isTemplate: isTemplate || false,
        author: req.user._id
      });

      await diagram.save();
      await diagram.populate('author', 'username email');

      res.status(201).json({
        message: 'Diagram created successfully',
        diagram
      });
    } catch (error) {
      console.error('Error creating diagram:', error);
      res.status(500).json({ error: 'Error creating diagram' });
    }
  }
);

// Update diagram
router.put('/:id',
  authenticate,
  authorize('admin', 'editor'),
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('diagramData').optional().notEmpty().withMessage('Diagram data cannot be empty')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, diagramData, category, tags, isTemplate } = req.body;

      const diagram = await Diagram.findById(req.params.id);

      if (!diagram) {
        return res.status(404).json({ error: 'Diagram not found' });
      }

      // Update fields
      if (title) diagram.title = title;
      if (description !== undefined) diagram.description = description;
      if (diagramData) diagram.diagramData = diagramData;
      if (category) diagram.category = category;
      if (tags) diagram.tags = tags;
      if (isTemplate !== undefined) diagram.isTemplate = isTemplate;
      diagram.version += 1;

      await diagram.save();
      await diagram.populate('author', 'username email');

      res.json({
        message: 'Diagram updated successfully',
        diagram
      });
    } catch (error) {
      console.error('Error updating diagram:', error);
      res.status(500).json({ error: 'Error updating diagram' });
    }
  }
);

// Delete diagram
router.delete('/:id',
  authenticate,
  authorize('admin', 'editor'),
  async (req, res) => {
    try {
      const diagram = await Diagram.findByIdAndDelete(req.params.id);

      if (!diagram) {
        return res.status(404).json({ error: 'Diagram not found' });
      }

      res.json({ message: 'Diagram deleted successfully' });
    } catch (error) {
      console.error('Error deleting diagram:', error);
      res.status(500).json({ error: 'Error deleting diagram' });
    }
  }
);

// Duplicate diagram (useful for creating from templates)
router.post('/:id/duplicate',
  authenticate,
  authorize('admin', 'editor'),
  async (req, res) => {
    try {
      const originalDiagram = await Diagram.findById(req.params.id);

      if (!originalDiagram) {
        return res.status(404).json({ error: 'Diagram not found' });
      }

      const newDiagram = new Diagram({
        title: `${originalDiagram.title} (Copy)`,
        description: originalDiagram.description,
        diagramData: originalDiagram.diagramData,
        category: originalDiagram.category,
        tags: originalDiagram.tags,
        isTemplate: false,
        author: req.user._id
      });

      await newDiagram.save();
      await newDiagram.populate('author', 'username email');

      res.status(201).json({
        message: 'Diagram duplicated successfully',
        diagram: newDiagram
      });
    } catch (error) {
      console.error('Error duplicating diagram:', error);
      res.status(500).json({ error: 'Error duplicating diagram' });
    }
  }
);

export default router;
