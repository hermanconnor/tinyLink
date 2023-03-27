import { ReqUser } from '../ReqUser.js';

declare global {
  namespace Express {
    interface Request {
      user?: ReqUser;
    }
  }
}
