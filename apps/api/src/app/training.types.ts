export interface Enrollment {
  id: string;
  participantName: string;
  participantEmail: string;
  checkedInAt?: string;
}

export interface TrainingSession {
  id: string;
  title: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructorId: string;
  instructorName: string;
  description: string;
  scheduledAt: string;
  durationMinutes: number;
  capacity: number;
  location: string;
  tags: string[];
  enrollments: Enrollment[];
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  bio: string;
  focusAreas: string[];
}

export interface EnrollParticipantPayload {
  participantName: string;
  participantEmail: string;
}
