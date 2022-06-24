const { RoomManager } = require("./roomManager");

global.rooms = {};

for (let room in Game.rooms) {
  if (!global.rooms[room]) {
    global.rooms[room] = {
      manager: new RoomManager(room),
      planned: false,
    };
  }
}
