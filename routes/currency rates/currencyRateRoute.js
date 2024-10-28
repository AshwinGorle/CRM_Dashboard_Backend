import { Router } from "express";
import CurrencyRateController from "../../controllers/CurrencyRate/currencyRateController.js";
const currencyRateRouter = Router();

//--------------------------------ArcheType---------------------------

currencyRateRouter.get('/', CurrencyRateController.getCurrencyRates);

export default currencyRateRouter;