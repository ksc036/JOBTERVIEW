const express = require("express");
const http = require("http");
const cors = require("cors");
const {setRooms,joinRoom, outRoom, deleteRoom}  = require("./DB");




const app = express();
// const uri = "wss://i9a701.p.ssafy.io/";
const uri = "http://localhost:3060";
const port = 4060;
//setting cors 
app.use(cors({
    origin: uri,
    credentials: true
  }));

app.all('/*', function(req, res, next) {
    console.log(res);
    res.header("Access-Control-Allow-Origin", uri);
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
app.get("/",(req,res) =>{
     res.send("change")});

const httpServer = http.createServer(app);
var io = require('socket.io')(httpServer, {
    cors: {
        origin: uri,
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true,
    transportOptions: {
        polling: {
            extraHeaders: { // Polling transport의 헤더 설정
                "Access-Control-Allow-Origin": uri,
                "Access-Control-Allow-Headers": "X-Requested-With"// 예: 토큰 기반 인증 헤더 추가
              }
        },
        websocket: {
          extraHeaders: { // WebSocket transport의 헤더 설정
            "Access-Control-Allow-Origin": uri,
            "Access-Control-Allow-Headers": "X-Requested-With"// 예: 토큰 기반 인증 헤더 추가
          }
        }
      }
});





//로컬최종
let users ={};
let socketToRoom ={};
let maxRoomCheck ={};
let pwdRoomCheck ={};
//connection event handler
io.on('connection' , function(socket) {
    socket.on('join_room', (data) => {
        console.log(data);
        if(users[data.roomName]){

            if(users[data.roomName].length<maxRoomCheck[data.roomName]){
                users[data.roomName].push({id:socket.id, nickname : data.nickname})
                //디비에 참가 인원 상승시키기
                joinRoom(data.roomName);
            }else{
                return;
                //에러 리턴하기
            }
            
        }else{ //없으면 data.roomName
            users[data.roomName] = [{id:socket.id, nickname : data.nickname, maxNum:data.maxNum}];
            maxRoomCheck[data.roomName] = data.maxNum;
            pwdRoomCheck[data.roomName] = data.roomPassword;
            const today = new Date();
            //디비에 방 생성
            setRooms(today, data.maxNum, 1, data.roomName, data.roomPassword)
                .then((result) => {
                    console.log("방 생성 완료:", result);
                    // 필요한 추가 작업을 수행할 수 있습니다.
                })
                .catch((error) => {
                    console.error("방 생성 오류:", error);
                });
            
        }
        socketToRoom[socket.id] = data.roomName;
        socket.join(data.roomName);
        //  console.log(`[${socketToRoom[socket.id]}]: ${socket.id} enter`);
        console.log(users);
        //나갈때 잘 지워줘야겠다.
         const usersInThisRoom = users[data.roomName].filter(user => user.id !== socket.id)
        io.sockets.to(socket.id).emit('all_users', usersInThisRoom);
    });

    socket.on("offer",(data)=>{
        console.log(data.offerReceiveID);
        socket.to(data.offerReceiveID).emit("getOffer", data);
    })

    socket.on("answer",(data)=>{
        socket.to(data.answerReceiveID).emit("getAnswer",data);
    })

    socket.on("candidate",(data) =>{
        socket.to(data.candidateReceiveID).emit("getCandidate",data);
    })



    //여기까지 웹 RTC영상처리
    socket.on('send_message', (chat) => {
        console.log(chat);
        socket.to(chat.roomName).emit("receive_message",chat);
    });

    socket.on('disconnect', () => {
        console.log(`[${socketToRoom[socket.id]}]: ${socket.id} exit`);
    
        const roomID = socketToRoom[socket.id];
        //console.log(roomID+"탈주자")
        let room = users[roomID];
        if (room) {
            room = room.filter(user => user.id !== socket.id);
            outRoom(roomID);
            
            users[roomID] = room;
            if (room.length === 0) {
                delete users[roomID];
                delete maxRoomCheck[roomID];
                deleteRoom(roomID);
                return;
            }
        }
        socket.to(roomID).emit('user_exit', {id: socket.id});
        console.log(users);
    });

    socket.on("disconnecting", () =>{
        socket.rooms.forEach(room => {
            socket.to(room).emit("bye");
        });
    });
})

const handleListen = () => console.log(`Listening on ${port}`);
httpServer.listen(port, handleListen);
// httpServer.listen(port,handleListen);
//팀테스트 마침