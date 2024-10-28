import mongoose from "mongoose";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import RevenueMasterModel from "../../models/RevenueMasterModel.js";
import { ServerError } from "../../utils/customErrorHandler.utils.js";
import OpportunityMasterModel from "../../models/OpportunityMasterModel.js";

class RevenueController {

    
    
    static handleRevenue  = async(revenueArray, opportunity, session) =>{
        console.log("entered handle revenue")
        for(const revenue of revenueArray){
            if(revenue._id && revenue.delete){
               await this.deleteRevenue(revenue._id, opportunity._id, session)
            }
            else if(revenue._id){
               await this.updateRevenue(revenue, session);
            }else{
               const newRevenue = await this.createRevenue(revenue, session);
               opportunity.revenue.push(newRevenue._id);
            }
        }
    }

    static createRevenue = async(revenue, session) => {
        console.log("create revenue called for :", revenue)
        const { year, Q1, Q2, Q3, Q4 } = revenue
        let total = 0;
        if(Q1)total += Number(Q1);
        if(Q2)total += Number(Q2);
        if(Q3)total += Number(Q3);
        if(Q4)total += Number(Q4);
        // Create a new instance of the RevenueMasterModel
        const newRevenue = new RevenueMasterModel({
            year,
            total,
            Q1,
            Q2,
            Q3,
            Q4,
        });
        await newRevenue.save({session});
        console.log("new revenue created :", newRevenue)
        return newRevenue;
    }

    static updateRevenue = async (revenue ,session) => {
        console.log("update revenue called for :", revenue)
        const fetchedRevenue = await RevenueMasterModel.findById(revenue._id);
        if (!fetchedRevenue) throw new ServerError("NotFound", "Revenue");
        Object.keys(revenue).forEach((key) => {
            if(key !=="_id")
             fetchedRevenue[key] = revenue[key];
        });
        fetchedRevenue.total = fetchedRevenue.Q1 + fetchedRevenue.Q2 + fetchedRevenue.Q3 + fetchedRevenue.Q4 
        const updatedRevenue = await fetchedRevenue.save({session});
        console.log("updated revenue", updatedRevenue)
    }
    
    static deleteRevenue = async (id , opportunityId , session) => {
        console.log("delete revenue called for :", id )
        const opportunity = await OpportunityMasterModel.findById(opportunityId);
        const revenue = await RevenueMasterModel.findById(id);

        if(!opportunity) throw new ServerError("NotFound","Opportunity (while deleting revenue)");
        if(!revenue) throw new ServerError("NotFound","revenue (while deleting revenue)");

        opportunity.revenue = opportunity.revenue.filter((revenueId)=>revenueId != id);

        const deletedRevenue = await RevenueMasterModel.findByIdAndDelete(id).session(session);
        await opportunity.save({session});
        console.log("deleted Revenue : ",deletedRevenue)
    };

    static getAllRevenues = catchAsyncError(async (req, res, next) => {
        const revenues = await RevenueMasterModel.find();

        res.status(200).json({
            status: 'success',
            message: 'All Revenue records retrieved successfully',
            data: revenues,
        });
    });

    static getRevenueById = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const revenue = await RevenueMasterModel.findById(id);

        if (!revenue) throw new ServerError("NotFound", "Revenue");

        res.status(200).json({
            status: 'success',
            message: 'Revenue record retrieved successfully',
            data: revenue,
        });
    });

   

}

export default RevenueController;
