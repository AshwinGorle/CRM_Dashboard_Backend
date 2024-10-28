import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import clientMasterRouter from '../routes/client/clientMasterRoute.js';
import connectDb from "../connectDb.js"
import { error } from '../middlewares/error.middleware.js';
import cors from 'cors';
import contactMasterRouter from '../routes/contact/contactMasterRoute.js';
import tenderMasterRouter from '../routes/tender/tenderMasterRoute.js';
import registrationMasterRouter from '../routes/registration/registrationMasterRouter.js';
import configurationRoute from '../routes/configuration/configurationRoute.js';
import teamRouter from '../routes/team/teamRouter.js';
import businessDevelopmentRouter from '../routes/business Development/businessDevelomentRoute.js';
import opportunityRouter from '../routes/opportunity/opportunityRoute.js'
import homePage from '../home.js';
import uploadRouter from '../routes/upload/uloadTestRoute.js';
import authRouter from '../routes/Authentication/AuthRoute.js';
import userRouter from '../routes/Authentication/userRoute.js';
import authenticateToken from '../middlewares/authenticateToken.js';
import currencyRateRouter from '../routes/currency rates/currencyRateRoute.js';
import dashboardRouter from '../routes/dashboard/dashboardRoute.js';
import roleRouter from '../routes/role/roleRouter.js';
import "../Testing/InsertPredefinePermissions.js.js"
const app = express();
const corsOptions = {
    origin: [ "https://crm-frontend-sigma-green.vercel.app","http://localhost:3000"],
    // origin: "*",
    methods : ["POST", "GET", "PUT", "DELETE"],
    credentials : true,
}

app.use(cors(corsOptions));
dotenv.config();

app.use(express.urlencoded({extended : false}));
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DATABASE2_URL; 
connectDb(DB_URL);

app.get('/',homePage);
app.use('/auth', authRouter);
app.use(authenticateToken);
app.use('/role', roleRouter);
app.use('/user',userRouter)
app.use('/client' ,clientMasterRouter);
app.use('/team', teamRouter );
app.use('/contact', contactMasterRouter);
app.use('/bd', businessDevelopmentRouter);
app.use('/tender',tenderMasterRouter);
app.use('/opportunity', opportunityRouter);
app.use('/registration', registrationMasterRouter);
app.use('/configuration', configurationRoute);
app.use('/upload', uploadRouter);
app.use('/currency', currencyRateRouter);
app.use('/dashboards', dashboardRouter);
app.use(error);

app.listen(4321, ()=>{
    console.log('Server is running on port port 4321.....');
})
