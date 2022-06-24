const { SpawnManager } = require("./spawnManager");
const constants = require("./constants");

module.exports.RoomManager = class {
  constructor(roomName) {
    this.room = Game.rooms[roomName];
    this.spawnManagers = {};

    this.manageSpawns = () => {
      for (let spawn in this.room.structures.spawns) {
        if (!this.spawnManagers[spawn.name])
          this.spawnManagers[spawnName] = new SpawnManager(spawnName);

        if (this.spawnManagers[spawnName].queue.length > 0)
          this.spawnManagers[spawnName].spawnCreep();
      }
    };
  }
};

Object.defineProperty(Room.prototype, {
  get structures() {
    if (this.structures) return this.structures;

    this.structures = {};

    for (let structure in constants.structures)
      this.structures[constants.structures[structure]] = [];

    for (let structure of this.find(FIND_STRUCTURES))
      this.structures[structure.structureType].push(structure);

    return this.structures;
  },
});
