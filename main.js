const { RoomManager } = require("./roomManager");
const { manageDeadCreeps, manageDeadRoom } = require("./clean");

if (!global.rooms) global.rooms = {};

manageDeadCreeps();
manageDeadRoom();

for (let room in Game.rooms) {
  if (!global.rooms[room]) {
    global.rooms[room] = {
      manager: new RoomManager(room),
      planned: false,
    };
  }

  global.rooms[room].manager.manageSpawns();
  global.rooms[room].manager.runCreeps();
}
