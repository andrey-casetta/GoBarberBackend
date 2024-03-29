import { Router } from 'express';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import ProfileController from '../controllers/ProfileController';

const profileController = new ProfileController();
const profileRouter = Router();

profileRouter.use(ensureAuthenticated);
profileRouter.put('/', profileController.update);
profileRouter.get('/', profileController.show);

export default profileRouter;
