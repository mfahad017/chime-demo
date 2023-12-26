import { Router } from 'express';
import { startMeeting } from '../controller/create-meeting';

const router = Router();

router.get('/', startMeeting);

export default router;
