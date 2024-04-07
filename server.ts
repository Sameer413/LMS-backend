require('dotenv').config();
import { app } from "./app";
import connectDB from "./utils/db";



connectDB();

app.listen(process.env.PORT, () => {
    console.log("Server is connected!");
});