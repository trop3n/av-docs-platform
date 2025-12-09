import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Document from './models/Document.js';
import Diagram from './models/Diagram.js';

dotenv.config();

// WARNING: This seed script is for DEVELOPMENT ONLY
// Do NOT use these credentials in production
// Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in your .env file

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Document.deleteMany({});
    await Diagram.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user from environment variables
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
    const adminUsername = process.env.SEED_ADMIN_USERNAME || 'admin';

    const adminUser = await User.create({
      username: adminUsername,
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    });
    console.log('Created admin user');

    // Create sample documents
    const sampleDocs = [
      {
        title: 'HDMI Signal Flow Best Practices',
        content: `# HDMI Signal Flow Best Practices

## Introduction
HDMI (High-Definition Multimedia Interface) is a standard for transmitting uncompressed video and audio data.

## Key Considerations
- Maximum cable length: 50 feet for standard HDMI cables
- Use certified cables for 4K/HDR content
- Consider HDMI 2.1 for 8K and high refresh rates

## Common Issues
- Signal degradation over long distances
- HDCP handshake failures
- Resolution/refresh rate limitations

## Solutions
- Use HDMI extenders or fiber optic cables for long runs
- Implement HDMI distribution amplifiers for multiple displays
- Keep firmware updated on all devices`,
        category: 'Video',
        tags: ['HDMI', 'Video', 'Troubleshooting'],
        author: adminUser._id
      },
      {
        title: 'Dante Audio Network Setup Guide',
        content: `# Dante Audio Network Setup Guide

## What is Dante?
Dante is a combination of software, hardware, and network protocols that deliver uncompressed, multi-channel, low-latency digital audio over a standard Ethernet network.

## Network Requirements
- Gigabit Ethernet switches (managed switches recommended)
- Quality of Service (QoS) configuration
- Separate VLAN for audio traffic (recommended)

## Best Practices
1. Use dedicated network infrastructure for Dante
2. Enable IGMP snooping on switches
3. Set switch ports to 1Gbps, full duplex
4. Disable Energy Efficient Ethernet (EEE)
5. Use CAT6 or better cabling

## Troubleshooting
- Check network switch configuration
- Verify all devices are on the same subnet
- Use Dante Controller to monitor network health
- Check for network loops`,
        category: 'Audio',
        tags: ['Dante', 'Audio', 'Network', 'Setup'],
        author: adminUser._id
      },
      {
        title: 'Control System Programming Standards',
        content: `# Control System Programming Standards

## Naming Conventions
- Use descriptive names for all devices and variables
- Follow camelCase for variables: displayPower, audioVolume
- Use UPPER_CASE for constants: MAX_VOLUME, DEFAULT_SOURCE

## Code Organization
- Group related functions together
- Comment complex logic
- Use modules for reusable code

## User Interface Design
- Keep interfaces simple and intuitive
- Use consistent button layouts across pages
- Provide feedback for all user actions
- Include help text where needed

## Testing
- Test all button functions
- Verify feedback displays correctly
- Test error handling
- Document all macros and custom functions`,
        category: 'Control',
        tags: ['Control Systems', 'Programming', 'Best Practices'],
        author: adminUser._id
      }
    ];

    const createdDocs = await Document.insertMany(sampleDocs);
    console.log(`Created ${createdDocs.length} sample documents`);

    // Create sample diagram templates
    const sampleDiagrams = [
      {
        title: 'Basic Conference Room Setup',
        description: 'Standard conference room with display, video conferencing, and audio system',
        category: 'Conference Room',
        tags: ['Template', 'Conference', 'Basic'],
        isTemplate: true,
        author: adminUser._id,
        diagramData: {
          nodes: [
            {
              id: 'node-1',
              type: 'default',
              position: { x: 250, y: 50 },
              data: { label: 'Video Conferencing System' },
              style: {
                background: '#2196F3',
                color: 'white',
                border: '2px solid #222',
                borderRadius: '8px',
                padding: '10px'
              }
            },
            {
              id: 'node-2',
              type: 'default',
              position: { x: 100, y: 200 },
              data: { label: 'Display' },
              style: {
                background: '#F44336',
                color: 'white',
                border: '2px solid #222',
                borderRadius: '8px',
                padding: '10px'
              }
            },
            {
              id: 'node-3',
              type: 'default',
              position: { x: 400, y: 200 },
              data: { label: 'Audio DSP' },
              style: {
                background: '#4CAF50',
                color: 'white',
                border: '2px solid #222',
                borderRadius: '8px',
                padding: '10px'
              }
            },
            {
              id: 'node-4',
              type: 'default',
              position: { x: 250, y: 350 },
              data: { label: 'Control Processor' },
              style: {
                background: '#9C27B0',
                color: 'white',
                border: '2px solid #222',
                borderRadius: '8px',
                padding: '10px'
              }
            }
          ],
          edges: [
            {
              id: 'edge-1',
              source: 'node-1',
              target: 'node-2',
              type: 'smoothstep',
              animated: true,
              markerEnd: { type: 'arrowclosed' },
              label: 'HDMI'
            },
            {
              id: 'edge-2',
              source: 'node-1',
              target: 'node-3',
              type: 'smoothstep',
              animated: true,
              markerEnd: { type: 'arrowclosed' },
              label: 'Audio'
            },
            {
              id: 'edge-3',
              source: 'node-4',
              target: 'node-2',
              type: 'smoothstep',
              animated: false,
              markerEnd: { type: 'arrowclosed' },
              label: 'Control'
            },
            {
              id: 'edge-4',
              source: 'node-4',
              target: 'node-3',
              type: 'smoothstep',
              animated: false,
              markerEnd: { type: 'arrowclosed' },
              label: 'Control'
            }
          ]
        }
      },
      {
        title: 'Dante Audio Network Template',
        description: 'Standard Dante audio network with multiple devices',
        category: 'Audio Network',
        tags: ['Template', 'Dante', 'Audio', 'Network'],
        isTemplate: true,
        author: adminUser._id,
        diagramData: {
          nodes: [
            {
              id: 'node-1',
              type: 'default',
              position: { x: 300, y: 50 },
              data: { label: 'Network Switch (Gigabit)' },
              style: {
                background: '#FF9800',
                color: 'white',
                border: '2px solid #222',
                borderRadius: '8px',
                padding: '10px'
              }
            },
            {
              id: 'node-2',
              type: 'default',
              position: { x: 100, y: 200 },
              data: { label: 'Dante Microphone 1' },
              style: {
                background: '#4CAF50',
                color: 'white',
                border: '2px solid #222',
                borderRadius: '8px',
                padding: '10px'
              }
            },
            {
              id: 'node-3',
              type: 'default',
              position: { x: 300, y: 200 },
              data: { label: 'Dante DSP' },
              style: {
                background: '#4CAF50',
                color: 'white',
                border: '2px solid #222',
                borderRadius: '8px',
                padding: '10px'
              }
            },
            {
              id: 'node-4',
              type: 'default',
              position: { x: 500, y: 200 },
              data: { label: 'Dante Amplifier' },
              style: {
                background: '#4CAF50',
                color: 'white',
                border: '2px solid #222',
                borderRadius: '8px',
                padding: '10px'
              }
            }
          ],
          edges: [
            {
              id: 'edge-1',
              source: 'node-1',
              target: 'node-2',
              type: 'smoothstep',
              animated: true,
              markerEnd: { type: 'arrowclosed' },
              label: 'Ethernet'
            },
            {
              id: 'edge-2',
              source: 'node-1',
              target: 'node-3',
              type: 'smoothstep',
              animated: true,
              markerEnd: { type: 'arrowclosed' },
              label: 'Ethernet'
            },
            {
              id: 'edge-3',
              source: 'node-1',
              target: 'node-4',
              type: 'smoothstep',
              animated: true,
              markerEnd: { type: 'arrowclosed' },
              label: 'Ethernet'
            }
          ]
        }
      },
      {
        title: 'Multi-Display Video Wall',
        description: 'Video wall system with processor and multiple displays',
        category: 'Video',
        tags: ['Template', 'Video Wall', 'Display'],
        isTemplate: true,
        author: adminUser._id,
        diagramData: {
          nodes: [
            {
              id: 'node-1',
              type: 'default',
              position: { x: 50, y: 50 },
              data: { label: 'Source 1 (HDMI)' },
              style: {
                background: '#00BCD4',
                color: 'white',
                border: '2px solid #222',
                borderRadius: '8px',
                padding: '10px'
              }
            },
            {
              id: 'node-2',
              type: 'default',
              position: { x: 50, y: 150 },
              data: { label: 'Source 2 (HDMI)' },
              style: {
                background: '#00BCD4',
                color: 'white',
                border: '2px solid #222',
                borderRadius: '8px',
                padding: '10px'
              }
            },
            {
              id: 'node-3',
              type: 'default',
              position: { x: 300, y: 100 },
              data: { label: 'Video Wall Processor' },
              style: {
                background: '#2196F3',
                color: 'white',
                border: '2px solid #222',
                borderRadius: '8px',
                padding: '10px'
              }
            },
            {
              id: 'node-4',
              type: 'default',
              position: { x: 550, y: 30 },
              data: { label: 'Display 1' },
              style: {
                background: '#F44336',
                color: 'white',
                border: '2px solid #222',
                borderRadius: '8px',
                padding: '10px'
              }
            },
            {
              id: 'node-5',
              type: 'default',
              position: { x: 550, y: 100 },
              data: { label: 'Display 2' },
              style: {
                background: '#F44336',
                color: 'white',
                border: '2px solid #222',
                borderRadius: '8px',
                padding: '10px'
              }
            },
            {
              id: 'node-6',
              type: 'default',
              position: { x: 550, y: 170 },
              data: { label: 'Display 3' },
              style: {
                background: '#F44336',
                color: 'white',
                border: '2px solid #222',
                borderRadius: '8px',
                padding: '10px'
              }
            }
          ],
          edges: [
            {
              id: 'edge-1',
              source: 'node-1',
              target: 'node-3',
              type: 'smoothstep',
              animated: true,
              markerEnd: { type: 'arrowclosed' }
            },
            {
              id: 'edge-2',
              source: 'node-2',
              target: 'node-3',
              type: 'smoothstep',
              animated: true,
              markerEnd: { type: 'arrowclosed' }
            },
            {
              id: 'edge-3',
              source: 'node-3',
              target: 'node-4',
              type: 'smoothstep',
              animated: true,
              markerEnd: { type: 'arrowclosed' }
            },
            {
              id: 'edge-4',
              source: 'node-3',
              target: 'node-5',
              type: 'smoothstep',
              animated: true,
              markerEnd: { type: 'arrowclosed' }
            },
            {
              id: 'edge-5',
              source: 'node-3',
              target: 'node-6',
              type: 'smoothstep',
              animated: true,
              markerEnd: { type: 'arrowclosed' }
            }
          ]
        }
      }
    ];

    const createdDiagrams = await Diagram.insertMany(sampleDiagrams);
    console.log(`Created ${createdDiagrams.length} sample diagram templates`);

    console.log('\n=== Seed Data Summary ===');
    console.log(`Admin User: ${adminEmail} / ${adminPassword}`);
    console.log(`Documents: ${createdDocs.length}`);
    console.log(`Diagram Templates: ${createdDiagrams.length}`);
    console.log('\nSeeding completed successfully!');
    console.log('\nWARNING: Change the admin password immediately in production!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
