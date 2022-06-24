const constants = require("./constants");

module.exports.SpawnManager = class {
  constructor(spawnName) {
    this.spawn = Game.spawns[spawnName];

    this.spawnCreep = (request) => {
      const creep = request.toJSON();

      this.spawn.spawnCreep(creep.body, creep.name, {
        energyStructures: [this.spawn, this.spawn.room.structures.extensions],
      });
    };
  }
};

module.exports.SpawnRequest = class {
  constructor(role, body, expansion, roomName) {
    this.role = role;
    this.body = body;
    this.expansion = expansion;

    this.calculateBody = () => {
      const cost = this.body
        .map((p) => constants.partCosts[p])
        .reduce((total, a) => a + total);
      const expansionCost = this.body
        .map((p) => constants.partCosts[p])
        .reduce((total, a) => a + total);

      let body = [];

      for (
        let i = 0;
        i <
        Math.floor(
          (Game.rooms[roomName].energyAvailable - cost) / expansionCost
        );
        i++
      ) {
        body.push(this.expansion);
      }
    };

    this.generateName = () =>
      `${this.role}-${Math.floor(Math.random() * 10000)}`;

    this.toJSON = () => {
      return {
        role: this.role,
        body: this.calculateBody(),
        name: this.generateName(),
      };
    };
  }
};

