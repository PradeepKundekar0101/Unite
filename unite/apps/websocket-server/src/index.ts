import { WebSocketServer } from 'ws';
import { User } from './services/User';

const wss = new WebSocketServer({ port: 8001 });

wss.on('connection', function connection(ws) {
  try {
    let user = new User(ws)
    user.initHandlers()
  } catch (error) {
    console.log("Failed to initialize user")
    ws.close()
  }
});
wss.on("error",(err)=>{
  console.log(err)
   console.error("Websocker server failed")
})