module.exports = {
  manageDeadCreeps: () => {
    for (let room of Object.values(Game.rooms)) {
      for (const role of Object.keys(room.creeps))
        for (const creep in room.creeps[role]) {
          if (!Game.creeps[creep]) {
            delete Memory.creeps[creep];
            room.creeps[role].splice(
              room.creeps[role].findIndex((c) => c.name === creep),
              1
            );
          }
        }
    }
  },
  manageDeadRoom: () => {
    for (let room in global.rooms)
      if (!Game.rooms[room]) delete global.rooms[room];
  },
};
