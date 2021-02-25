import { Router } from 'express';
import { parseISO } from 'date-fns';

import { container } from 'tsyringe';
import AppointmentsController from '../controllers/AppointmentController';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
