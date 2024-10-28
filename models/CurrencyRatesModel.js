import mongoose from "mongoose";
const currencyRatesSchema = new mongoose.Schema({
    lastUpdate : {
        type : String,
    },
    conversionRates : {
        type : Object,
    }
},{timestamps : true})

const currencyRatesModel = new mongoose.model("CurrencyRates", currencyRatesSchema);
export default currencyRatesModel;