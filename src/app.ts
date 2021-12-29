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
const mqtt = require('mqtt')
import {mqttConfig} from "./config/mqtt-config";
const connectUrl = `mqtt://localhost`
const emqtClient = mqtt.connect(connectUrl, mqttConfig)

const createTopic = 'node/admin/product/created'
const updateTopic = 'node/admin/product/updated'
const deleteTopic = 'node/admin/product/deleted'
const likeTopic = 'node/admin/product/liked'


app.get('/api/products', async (req, res)=>{
    let products = await productModel.find()
    res.json({products})
})

app.patch('/api/products/like/:id', async (req, res)=>{
    let product = await productModel.findOneAndUpdate({_id: req.params.id}, {
        $inc: {likes: 1}
    },{
        new: true
    })
    emqtClient.publish(likeTopic, JSON.stringify({admin_id: product.admin_id}), { qos: 1, retain: false }, (error) => {
        if (error) {
            console.error(error)
        }
        console.log('sent ---> liked payload')
    })
    res.json({product})
})


app.get('/api/products/:id', async (req, res)=>{
    let product = await productModel.findOne({_id: req.params.id})
    res.json({product})
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
    console.log(`mongodb connectedd ${process.env.databaseUrl}`);
})

emqtClient.on('connect', () => {
    emqtClient.subscribe([createTopic, updateTopic, deleteTopic], () => {
        console.log(`Subscribe to topic '${[createTopic, updateTopic, deleteTopic]}'`)
    })
})

emqtClient.on('message', async (topic, payload) => {

    let formatedData =  JSON.parse(payload)
    if (topic == createTopic){
        const newProduct: any = {}
        newProduct.admin_id = formatedData._id
        newProduct.title = formatedData.title
        newProduct.image = formatedData.image
        newProduct.likes = formatedData.likes
        let products = await  productModel.create(newProduct)
        console.log('Received Message:', topic, formatedData)
    }

    if (topic == updateTopic){
        let adminId = formatedData._id
        delete formatedData._id
        delete formatedData.createdAt
        delete formatedData.likes
        delete formatedData.__v
        // console.log(formatedData, {admin_id: adminId})
        await productModel.findOneAndUpdate({admin_id: adminId}, {
            $set: formatedData
        })
    }

    if (topic == deleteTopic){
        console.log(formatedData, "deleted ----->")
       await productModel.findOneAndDelete({admin_id: formatedData.admin_id})
    }
})

app.listen(3030, ()=>{
    console.log('micro service we up and running port 3030')
})
