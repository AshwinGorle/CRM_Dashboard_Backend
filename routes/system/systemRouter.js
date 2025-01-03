import express from 'express';
import SystemController from '../../controllers/System/SystemController.js';

const systemRouter = express.Router();

// Route to get entire system config
systemRouter.get('/', SystemController.getSystemConfig);
systemRouter.put('/', SystemController.updateSystemConfig);

// Route to update wonSalesStage
systemRouter.put('/won-stage', SystemController.updateWonStage);

// Route to get wonSalesStage
systemRouter.get('/won-stage', SystemController.getWonStage);

// Route to update submittedTenderStage
systemRouter.put('/submitted-tender-stage', SystemController.updateSubmittedTenderStage);

// Route to get submittedTenderStage
systemRouter.get('/submitted-tender-stage', SystemController.getSubmittedTenderStage);

export default systemRouter;
