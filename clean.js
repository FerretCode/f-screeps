module.exports = {
  manageDeadCreeps: () => {
    for (let creep in Memory.creeps)
      if (!Game.creeps[creep]) delete Memory.creeps[creep];
  },
  manageDeadRoom: () => {
    for (let room in global.rooms)
      if (!Game.rooms[room]) delete global.rooms[room];
  },
};
