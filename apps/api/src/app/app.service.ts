import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { instructorsSeed, sessionsSeed } from './data/training-data';
import {
  EnrollParticipantPayload,
  Enrollment,
  Instructor,
  TrainingSession,
} from './training.types';

@Injectable()
export class AppService {
  private readonly instructors: Instructor[] = instructorsSeed;

  private readonly sessions: TrainingSession[] = sessionsSeed;


  private findSession(sessionId: string): TrainingSession {
    const session = this.sessions.find((item) => item.id === sessionId);

    if (!session) {
      throw new NotFoundException('Training session not found');
    }

    return session;
  }

  private cloneSession(session: TrainingSession): TrainingSession {
    return {
      ...session,
      tags: [...session.tags],
      enrollments: session.enrollments.map((enrollment) => ({ ...enrollment })),
    };
  }
}
