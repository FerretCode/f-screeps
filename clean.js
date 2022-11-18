module.exports = {
  manageDeadCreeps: () => {
    for (let room in global.rooms) {
      const gameRoom = Game.rooms[room];

      for (const role of Object.keys(gameRoom.creeps))
        for (const creep of gameRoom.creeps[role])
          if (!Game.creeps[creep.name]) {
            delete Memory.creeps[creep.name];
            gameRoom.creeps[role].splice(
              gameRoom.creeps[role].findIndex((c) => c.name === creep.name),
              1
            );
          }
    }
  },
  manageDeadRoom: () => {
    for (let room in global.rooms)
      if (!Game.rooms[room]) delete global.rooms[room];
  },
};
