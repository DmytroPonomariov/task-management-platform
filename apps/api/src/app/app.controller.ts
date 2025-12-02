import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { EnrollParticipantPayload } from './training.types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 1. Implement getSessions endpoint
  // 2. Implement getCategories endpoint
  // 3. Implement enrollInSession endpoint. This endpoint enrolls the user in a session. 
  //      Adds new enrollment item to enrollments in session object
  //    Post "sessions/:id/enroll"
  //    Param id
  //    Body EnrollParticipantPayload
}
