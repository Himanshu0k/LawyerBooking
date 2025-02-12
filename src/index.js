import express from "express";
import router from "./routes/routes.js";
import connectDB from "./config/db.js";

const app = express();

app.use(express.json());
connectDB();

app.use("/", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log("Hello world , its my new project h");
   console.log(`🚀 Server is running on port ${PORT}`);
});
