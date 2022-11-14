const { SpawnManager, SpawnRequest } = require("./spawnManager");
const constants = require("./constants");

module.exports.RoomManager = class {
  constructor(roomName) {
    this.room = Game.rooms[roomName];
    this.spawnManagers = {};
    this.spawnProcessor = new module.exports.SpawnProcessor(roomName);

    this.manageSpawns = () => {
      for (let spawn of this.room.structures.spawn) {
        if (!this.spawnManagers[spawn.name])
          this.spawnManagers[spawn.name] = new SpawnManager(spawn.name);
      }

      this.spawnProcessor.checkSpawnConditions();
    };

    this.runCreeps = () => {
      for (let creep in this.room.allCreeps) {
        const role = require(`${creep.name.slice(0, creep.name.indexOf("-"))}`);

        role.run();
      }
    };
  }
};

module.exports.SpawnProcessor = class {
  constructor(roomName) {
    this.room = Game.rooms[roomName];

    this.checkSpawnConditions = () => {
      const spawn = this.room.structures.spawn[0];
      const manager = global.rooms[roomName].manager.spawnManagers[spawn.name];

      console.log(JSON.stringify(this.room.creeps, null, 2));

      if (this.room.creeps.harvester.length < this.room.sources.length)
        return manager.spawnCreep(
          new SpawnRequest("harvester", [WORK, MOVE], [WORK, MOVE], roomName)
        );

      if (this.room.creeps.hauler.length < this.room.harvesters.length * 2)
        return manager.spawnCreep(
          new SpawnRequest("hauler", [MOVE, CARRY], [MOVE, CARRY], roomName)
        );

      if (this.room.creeps.upgrader.length < 3) {
        if (this.room.haulers.length !== this.room.harvesters.length) return;

        return manager.spawnCreep(
          new SpawnRequest(
            "upgrader",
            [WORK, MOVE, CARRY],
            [WORK, CARRY],
            roomName
          )
        );
      }

      if (this.room.creeps.builder.length < 3) {
        if (this.room.controller.level < 2) return;

        return manager.spawnCreep(
          new SpawnRequest(
            "builder",
            [WORK, MOVE, CARRY],
            [WORK, MOVE, CARRY],
            roomName
          )
        );
      }
    };
  }
};

if (
  !Room.prototype.structures ||
  !Room.prototype.sources ||
  !Room.prototype.creeps
)
  Object.defineProperties(Room.prototype, {
    structures: {
      get() {
        if (this._structures) return this._structures;

        this._structures = {};

        for (let structure in constants.structures)
          this._structures[constants.structures[structure]] = [];

        for (let structure of this.find(FIND_STRUCTURES))
          this._structures[structure.structureType].push(structure);

        return this._structures;
      },
    },
    sources: {
      get() {
        if (this._sources) return this._sources;

        this._sources = [];

        for (let source in this.find(FIND_SOURCES)) this._sources.push(source);

        return this._sources;
      },
    },
    creeps: {
      get() {
        if (this._creeps) return this._creeps;

        this._creeps = {};

        for (let role of Object.values(constants.roles))
          if (!this._creeps[role]) {
            console.log(role);
            this._creeps[role] = [];
          }

        for (let creep of this.find(FIND_MY_CREEPS)) {
          const role = creep.name.slice(0, creep.name.indexOf("-"));

          if (!this._creeps[role]) this._creeps[role] = [];

          this._creeps[role].push(creep);
        }
      },
    },
  });
