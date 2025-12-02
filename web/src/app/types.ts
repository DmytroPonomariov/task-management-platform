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
  level: string;
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

export interface InstructorDashboardSession {
  sessionId: string;
  title: string;
  scheduledAt: string;
  capacity: number;
  enrolled: number;
  attended: number;
  attendanceRate: number;
  attendance: Enrollment[];
}

