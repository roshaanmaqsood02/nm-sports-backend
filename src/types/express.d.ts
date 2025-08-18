import 'express';
import { RequestUser } from './common/request-user.class';

declare module 'express' {
  export interface Request {
    user?: RequestUser;
  }
}