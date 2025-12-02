import { Instructor, TrainingSession } from '../training.types';

export const instructorsSeed: Instructor[] = [
  {
    id: 'inst-ari',
    name: 'Ari McConnell',
    email: 'ari@nextworklabs.com',
    focusAreas: ['Leadership', 'Remote Collaboration'],
    bio: '11-year facilitator specializing in hybrid leadership labs.',
  },
  {
    id: 'inst-lena',
    name: 'Lena Dawkins',
    email: 'lena@crewspark.org',
    focusAreas: ['Product Discovery', 'Coaching'],
    bio: 'Former product director who now coaches early-career leads.',
  },
  {
    id: 'inst-cho',
    name: 'Dr. Kim Cho',
    email: 'kim@neurocoach.io',
    focusAreas: ['Psychological Safety', 'Communication'],
    bio: 'Organizational psychologist focused on high-trust teams.',
  },
];

export const sessionsSeed: TrainingSession[] = [
  {
    id: 'session-lead-01',
    title: 'Leading Hybrid Creatives',
    category: 'Leadership',
    level: 'Intermediate',
    instructorId: 'inst-ari',
    instructorName: 'Ari McConnell',
    description:
      'Toolkit for guiding distributed design squads with purpose-built rituals and async story flows.',
    scheduledAt: '2024-09-22T15:00:00.000Z',
    durationMinutes: 75,
    capacity: 18,
    location: 'Virtual',
    tags: ['async rituals', 'feedback', 'ritual design'],
    enrollments: [
      {
        id: 'enroll-1',
        participantName: 'Jordan Hayes',
        participantEmail: 'jordan@northwind.dev',
        checkedInAt: '2024-09-22T15:03:00.000Z',
      },
      {
        id: 'enroll-2',
        participantName: 'Priya Chandra',
        participantEmail: 'priya@westloop.co',
      },
    ],
  },
  {
    id: 'session-coach-01',
    title: 'Coaching for Product Discovery',
    category: 'Product',
    level: 'Advanced',
    instructorId: 'inst-lena',
    instructorName: 'Lena Dawkins',
    description:
      'Deep dive into co-creating experiments with IC PMs, balancing metrics, and qualitative insights.',
    scheduledAt: '2024-09-25T17:30:00.000Z',
    durationMinutes: 90,
    capacity: 16,
    location: 'Chicago Hub',
    tags: ['coaching', 'experiments', 'story mapping'],
    enrollments: [
      {
        id: 'enroll-3',
        participantName: 'Tori Sanders',
        participantEmail: 'tori@searchlight.io',
        checkedInAt: '2024-09-25T17:35:00.000Z',
      },
    ],
  },
  {
    id: 'session-psych-01',
    title: 'Psychological Safety Drills',
    category: 'Team Health',
    level: 'Beginner',
    instructorId: 'inst-cho',
    instructorName: 'Dr. Kim Cho',
    description:
      'Micro-experiments for IC leads who need to normalize reflection, feedback, and conflict mapping.',
    scheduledAt: '2024-09-27T12:00:00.000Z',
    durationMinutes: 60,
    capacity: 20,
    location: 'Virtual',
    tags: ['safety', 'communication', 'conflict mapping'],
    enrollments: [
      {
        id: 'enroll-4',
        participantName: 'Nia Park',
        participantEmail: 'nia@makerlane.com',
      },
      {
        id: 'enroll-5',
        participantName: 'Beto Torres',
        participantEmail: 'beto@clover.ai',
      },
    ],
  },
  {
    id: 'session-insight-01',
    title: 'Insight Sprints for Staff+ Engineers',
    category: 'Technical Enablement',
    level: 'Intermediate',
    instructorId: 'inst-ari',
    instructorName: 'Ari McConnell',
    description:
      'Hands-on lab for mapping research spikes, collapsing unknowns, and keeping exec sponsors synced.',
    scheduledAt: '2024-10-03T19:00:00.000Z',
    durationMinutes: 120,
    capacity: 14,
    location: 'Virtual',
    tags: ['staff+', 'research spikes', 'exec comms'],
    enrollments: [],
  },
];
