import express from 'express'
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';




const app=express();
const server=http.createServer(app);

const io=new Server(server,{
    cors:{
        origin:'http://localhost:5173'
    }
});

app.use(cors())

io.on('connection',(socket)=>{
    console.log("user connected",socket.id);
})

app.get('/',(req,res)=>{
    res.send("hello worrld")
})
server.listen(3000,()=>{
    console.log("Server is running on port 3000");
})