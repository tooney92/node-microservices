import {dirname} from "path";

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({ path: dirname( module.paths[1] ) + "/.env" });
}

import express from 'express';
import cors from "cors";
import mongoose from  "mongoose";
import productModel from "./model/product";
import helmet from 'helmet';

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/products', async (req, res)=>{
    let products = await productModel.find()
    res.json({products})
})

app.post('/api/products', async (req, res)=>{
    let products = await productModel.create(req.body)
    res.json({products})
})

app.get('/',  async (req, res)=> {
    res.send('Welcome to the microservices API');
})

app.use((req, res, next)=>{
    const error: any = new Error('page not found');
    error.status = 404;
    next(error);
})
app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        },
        handled: false
    });
})

mongoose.connect(process.env.databaseUrl, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
const db = mongoose.connection
db.on("open", ()=>{
    console.log("mongodb connectedd");
})
app.listen(3000, ()=>{
    console.log('we up and running port 3000')
})
