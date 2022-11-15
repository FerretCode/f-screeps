module.exports = {
  manageDeadCreeps: () => {
    for (let creep in Memory.creeps)
      if (!Game.creeps[creep]) {
        const room = Game.rooms[Memory.creeps[creep].originRoom];

        const role = room.creeps[creep.slice(0, creep.indexOf("-"))];
        role.splice(
          role.findIndex((c) => c.name === creep),
          1
        );

        delete Memory.creeps[creep];
      }
  },
  manageDeadRoom: () => {
    for (let room in global.rooms)
      if (!Game.rooms[room]) delete global.rooms[room];
  },
};
