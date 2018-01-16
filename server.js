"use strict";

//回傳一個具有express的library的物件，當作處理request的Callback
const express = require("express");
const ExpressPeerServer = require("peer").ExpressPeerServer;
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");

//const db = require('./app/lib/db.js');

// //HTTPS參數;
// const option = {
//     key: fs.readFileSync("./public/certificate/privatekey.pem"),
//     cert: fs.readFileSync("./public/certificate/certificate.pem")
// };

//對https Server內傳入express的處理
const server = require("http").createServer(app);
app.use(
    bodyParser.urlencoded({
        type: "image/*",
        extended: false,
        limit: "50mb"
    })
);
app.use(
    bodyParser.json({
        type: "application/*",
        limit: "50mb"
    })
);
app.use(
    bodyParser.text({
        type: "text/plain"
    })
);

let peerServerOption = {
    debug: false
};
app.use("/peerjs", ExpressPeerServer(server, peerServerOption));

const io = require("socket.io")(server);

server.listen(8080);

let roomList = [];
let userInRoom = {};
let votingCounter = {};
let animalName = {
    1: "貓貓",
    2: "狗狗",
    3: "猩猩",
    4: "獅子",
    5: "無尾熊",
    6: "兔兔",
    7: "老虎",
    8: "狐狸"
};
console.log(
    "已啟動伺服器!" +
    "userInRoom: " +
    JSON.stringify(userInRoom) +
    "roomList: " +
    roomList
);
io.on("connection", function (socket) {
    //console.log("有人連線囉~" + socket.id);
    socket.emit("setRoomList", roomList);

    socket.on("giveMeMySocketId", () => {
        socket.emit("gotSocketID", socket.id);
    });

    //連線到房間內部
    socket.on("IAmAt", function (location, room) {
        // if (location == "/meeting") {
        //     if (!userInRoom.hasOwnProperty(room)) {
        //         socket.emit("joinRoom");
        //         //console.log("欸沒房啦 先加一波");
        //     } else if (!userInRoom[room]) {
        //         socket.emit("joinRoom");
        //         //console.log("欸有房啦 你進來");
        //     }
        // }
        socket.emit("joinRoom");
    });

    // socket.on("OpenBrain", function(list) {
    //     socket.broadcast.emit("OpenBrainForAll", list);
    // });

    socket
        .on("join", function (room) {
            console.log(room);
            //將使用者加入房間
            socket.join(room);
            console.log(roomList.includes(room));
            //console.log("有人加入房間囉" + socket.id + "加入了" + room);
            if (!roomList.includes(room)) {
                //將房間加入"房間"列表
                roomList.push(room);
                console.log("沒有這房間，加一波之後" + roomList);
                socket.broadcast.emit("setRoomList", roomList);
                socket.emit("setRoomList", roomList);
            }

            if (!userInRoom.hasOwnProperty(room)) {
                //房間不存在，沒有人要通知，就通知新人，然後給牠隨機一種動物
                let randomNum = Math.floor(Math.random() * 8) + 1; //1~8
                let obj = {
                    id: socket.id,
                    animal: animalName[randomNum],
                    num: randomNum
                };
                userInRoom[room] = [obj];
                socket.emit("setParticipantList", userInRoom[room]);
            } else if (
                //房間存在，有人在裡面，但新人不存在房間裡
                userInRoom.hasOwnProperty(room)
            ) {
                //而且新人不在房間裡
                let isInRoom = false;
                userInRoom[room].map(participant => {
                    if (participant.id == socket.id) {
                        isInRoom = true;
                    }
                });
                if (!isInRoom) {
                    //就把新人加在名單最前面>把名單整份發過去
                    let tempAnimal = Object.assign({}, animalName);
                    //準備分發動物，刪除房內現有動物
                    userInRoom[room].map(userObject => {
                        delete tempAnimal[userObject.num];
                    });
                    //隨機抽一個
                    let randomNum = Math.floor(
                        Math.random() * Object.keys(tempAnimal).length
                    );
                    //做成物件
                    let obj = {
                        id: socket.id,
                        animal: tempAnimal[Object.keys(tempAnimal)[randomNum]],
                        num: Object.keys(tempAnimal)[randomNum]
                    };
                    //把使用者加到最前面，並送出去
                    userInRoom[room].unshift(obj);
                    socket.emit("setParticipantList", userInRoom[room]);
                    //對房間內的人，發出新人加入的訊息
                    socket.to(room).emit("addParticipantList", obj);
                }
            }
            console.log("跑完了", room, userInRoom[room], roomList);
        })
        .on("joinFinish", () => {
            socket.emit("joinSuccess");
        })
        .on("leaveRoom", function () {
            console.log("有人離開房間囉~" + socket.id);
            let room = Object.keys(socket.rooms)[1];
            //如果有這房間
            if (userInRoom[room] && roomList.includes(room)) {
                if (
                    Object.keys(userInRoom[room]).length == 1 &&
                    userInRoom[room][0].id == socket.id
                ) {
                    //如果房間裏面只有他，就把房間刪掉
                    socket.emit("delRoom", room);
                    socket.broadcast.emit("delRoom", room);
                    roomList.splice(roomList.indexOf(room), 1);
                    delete userInRoom[room];
                    console.log("房間已刪除!" + room + JSON.stringify(userInRoom));
                } else if (Object.keys(userInRoom[room]).length !== 1) {
                    //房間有超過一人
                    userInRoom[room].map((userObj, index) => {
                        if (userObj.id == socket.id) {
                            userInRoom[room].splice(index, 1);
                        }
                    });
                    console.log(userInRoom[room]);
                }
                socket.emit("delParticipantList", socket.id);
                socket.to(room).emit("delParticipantList", socket.id);
                socket.emit("participantDisconnected", socket.id);
                socket.to(room).emit("participantDisconnected", socket.id);
                socket.leave(room);
            }
            console.log("離開跑完了", userInRoom[room], roomList);
        })
        .on("disconnecting", function () {
            console.log("有人斷線囉~" + socket.id);
            let room = Object.keys(socket.rooms)[1];
            if (userInRoom[room]) {
                if (userInRoom[room].length == 1) {
                    //如果房間裏面只有他，就把房間刪掉
                    //socket.emit("delRoom", room);
                    socket.broadcast.emit("delRoom", room);
                    roomList.splice(roomList.indexOf(room), 1);
                    delete userInRoom[room];
                    console.log("房間已刪除!" + room);
                } else {
                    //房間有超過一人
                    userInRoom[room].map((userObj, index) => {
                        if (userObj.id == socket.id) {
                            userInRoom[room].splice(index, 1);
                        }
                    });
                    console.log(userInRoom[room]);
                }
                socket.emit("delParticipantList", socket.id);
                socket.to(room).emit("delParticipantList", socket.id);
                socket.emit("participantDisconnected", socket.id);
                socket.to(room).emit("participantDisconnected", socket.id);
            }
            socket.leave(room);
            console.log("離開跑完了", userInRoom[room], roomList);
        });

    socket
        .on("newParticipantA", function (msgSender, room, userName) {
            socket.to(room).emit("newParticipantB", msgSender);
            socket.to(room).emit("setRemoteUserName", {
                id: msgSender,
                name: userName
            });
        })
        .on("chatMessage", record => {
            let room = Object.keys(socket.rooms)[1];
            socket.to(room).emit("chatMessage", record);
        })
        .on("setRemoteVideoState", (state, remotePeer) => {
            let room = Object.keys(socket.rooms)[1];
            socket.to(room).emit("setRemoteVideoState", state, remotePeer);
        })
        .on("setRemoteAudioState", (state, remotePeer) => {
            let room = Object.keys(socket.rooms)[1];
            socket.to(room).emit("setRemoteAudioState", state, remotePeer);
        })
        .on("setRemoteUserName", (sender, userName, receiver) => {
            socket
                .to(receiver)
                .emit("setRemoteUserName", { id: sender, name: userName });
        });
    socket
        .on("setAgenda", function (list) {
            let room = Object.keys(socket.rooms)[1];
            socket.to(room).emit("setAgenda", list);
        })
        .on("newAgenda", () => {
            let room = Object.keys(socket.rooms)[1];
            socket.to(room).emit("newAgenda");
        })
        .on("deleteAgenda", key => {
            let room = Object.keys(socket.rooms)[1];
            socket.to(room).emit("deleteAgenda", key);
        })
        .on("updateAgenda", obj => {
            let room = Object.keys(socket.rooms)[1];
            socket.to(room).emit("updateAgenda", obj);
        })
        .on("doneAgenda", key => {
            let room = Object.keys(socket.rooms)[1];
            socket.to(room).emit("doneAgenda", key);
        });

    socket
        .on("createVote", (votingDetail, time) => {
            let room = Object.keys(socket.rooms)[1];
            votingCounter[room] = io.sockets.adapter.rooms[room].length;
            //發給房內所有人，包含發起投票的人
            //console.log(votingDetail)
            io.in(room).emit("gotCreateVote", votingDetail, time);
        })
        .on("gotVoteFromUser", voteContent => {
            let room = Object.keys(socket.rooms)[1];
            votingCounter[room] = votingCounter[room] - 1;
            // console.log(room);
            io.in(room).emit("gotVoteFromServer", voteContent); //把投票內容告訴房內所有人
            if (votingCounter[room] == 0) {
                io.in(room).emit("votingIsFinish");
            }
        });

    socket.on("recognitionRecord", function (_history) {
        let room = Object.keys(socket.rooms)[1];
        //console.log("有結果!")
        socket.to(room).emit("remoteUserRecognitionRecord", _history);
    });

    socket
        .on("setGrid", obj => {
            let room = Object.keys(socket.rooms)[1];
            socket.to(room).emit("setGrid", obj);
        })
        .on("setGridStart", () => {
            let room = Object.keys(socket.rooms)[1];
            socket.to(room).emit("setGridStart");
        });
    //1018 Andy Added 電子白板
    socket
        .on("drawing", data => {
            let room = Object.keys(socket.rooms)[1];
            socket.to(room).emit("drawing", data);
        })
        .on("reset", key => {
            let room = Object.keys(socket.rooms)[1];
            socket.to(room).emit("reset", key);
        });

    //1028 Andy Added 預約開會
    socket.on("reserveMeeting", data => {
        let room = Object.keys(socket.rooms)[1];
        socket.to(room).emit("AddReservation", data);
    });

    socket.on("setAllUserRandomHat", randomNumberArray => {
        let room = Object.keys(socket.rooms)[1];
        let hatList = {};
        let array = randomNumberArray;
        userInRoom[room].map(participant => {
            let hat = array.shift();
            hatList[participant.id] = hat;
        });
        io.in(room).emit("setSixhatList", hatList);
    });

    socket
        .on("shareScreenInvoke", uuid => {
            let room = Object.keys(socket.rooms)[1];
            socket.to(room).emit("callShareScreenInvoker", socket.id, uuid);
        })
        .on("closeShareScreen", () => {
            let room = Object.keys(socket.rooms)[1];
            socket.to(room).emit('callCloseShareScreenInvoker', socket.id)
        });
});

//沒有定義路徑，則接收到請求就執行這個函數
app.use(express.static(__dirname + "/public"));

app.get("*", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});
