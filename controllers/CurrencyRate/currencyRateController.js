import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import currencyRatesModel from "../../models/CurrencyRatesModel.js";

class CurrencyRateController {
  static updateCurrencyRates = async (id) => {
    const res = await fetch(process.env.CURRENCY_RATE_API, {
      method: "GET",
    });
    const data = await res.json();

    if (!id) {
      const newCurrencyRates = await currencyRatesModel.create({
        lastUpdate: data.time_last_update_utc,
        conversionRates: data.conversion_rates,
      });
      return newCurrencyRates;
    } else {
      const updatedCurrencyRates = await currencyRatesModel.findByIdAndUpdate(
        id,
        {
          lastUpdate: data.time_last_update_utc,
          conversionRates: data.conversion_rates,
        }
      );
      console.log("updated currency rates  : ", updatedCurrencyRates);
      return updatedCurrencyRates;
    }
  };

  static getCurrencyRates = catchAsyncError(async (req, res) => {
    const allCurrencyRates = await currencyRatesModel.find({});

    if (allCurrencyRates.length == 0) {
      console.log("Creating new currency");
      const newCurrencyRates = await this.updateCurrencyRates();
      return res.send({
        status: "success",
        message: "Currency fetched successfully",
        data: newCurrencyRates,
      });
    } else {
      console.log("Checking the existing currency rates");
      let currencyRates = allCurrencyRates[0];
      const currentTime = Date.now();
      const updatedAt = new Date(currencyRates.updatedAt).getTime();
      console.log("updated at : ", updatedAt);
      console.log("current time : ", currentTime);
      const diffInHours = (currentTime - updatedAt) / (1000 * 60 * 60);
      console.log("Time difference : ",diffInHours);
      if (diffInHours > 24) {
        console.log("updating the existing currency rates as its older than 24");
        currencyRates = await this.updateCurrencyRates(currencyRates._id);
      } 
      return res.send({status : "success", message : "Currency fetched successfully", data : currencyRates});
    }
  });
}

export default CurrencyRateController;
