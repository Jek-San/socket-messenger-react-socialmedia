const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000"
  }
})


let users = [];
const addUser = (userId, socketId) => {
  !users.some(user => user.userId === userId) &&
    users.push({ userId, socketId })
}

const removeUser = (socketId) => {
  users = users.filter(user => user.socketId !== socketId)
}

const getUser = (userId) => {
  console.log("getUser", userId)
  console.log("getUsers", users)
  return users.find(user => user.userId === userId)
}

io.on("connection", (socket) => {
  //when connect

  console.log("a user connection")

  //take userId and socketId from user
  socket.on("addUser", userId => {
    addUser(userId, socket.id)
    io.emit("getUsers", users)
  })

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    console.log(senderId, receiverId, text)
    const user = getUser(receiverId);
    console.log(user)
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text
    })

  })

  //when disconect
  socket.on("disconnect", () => {
    console.log("a user disconnected")
    removeUser(socket.id)
    io.emit("getUsers", users)

  })
})