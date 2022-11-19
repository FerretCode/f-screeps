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
      for (const role of Object.values(constants.roles)) {
        for (const creep of this.room.creeps[role]) {
          const roleModule = require(role);

          const creepClass = new roleModule.Creep(creep.name);

          creepClass.run();
        }
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

      if (this.room.creeps.harvester.length < this.room.sources.length)
        return manager.spawnCreep(
          new SpawnRequest("harvester", [WORK, MOVE], [WORK, MOVE], roomName)
        );

      if (
        this.room.creeps.hauler.length <
        this.room.creeps.harvester.length * 2
      ) {
        let body = [MOVE, CARRY];
        let expansion = [MOVE, CARRY];

        if (this.room.creeps.upgrader.length === 0) {
          body.push(WORK);
          expansion.push(WORK);
        }

        return manager.spawnCreep(
          new SpawnRequest("hauler", body, expansion, roomName)
        );
      }

      if (this.room.creeps.upgrader.length < 3) {
        if (
          this.room.creeps.hauler.length !==
          this.room.creeps.harvester.length * 2
        )
          return;

        if (
          this.room.controller.level <= 2 &&
          this.room.creeps.upgrader.length >= 2
        )
          return;

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

      if (this.room.creeps.surveyor.length < 1) {
        if (this.room.creeps.upgrader.length < 2) return;

        return;

        return manager.spawnCreep(
          new SpawnRequest("surveyor", [MOVE], [], roomName)
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
        if (Array.isArray(this._sources) && this._sources.length > 0)
          return this._sources;

        this._sources = this.find(FIND_SOURCES);

        return this._sources;
      },
    },
    creeps: {
      get() {
        // if (this._creeps) return this._creeps;

        this._creeps = {};

        for (let role of Object.values(constants.roles))
          if (!this._creeps[role]) {
            this._creeps[role] = [];
          }

        for (let creep of this.find(FIND_MY_CREEPS)) {
          const role = creep.name.slice(0, creep.name.indexOf("-"));

          if (!this._creeps[role]) this._creeps[role] = [];

          this._creeps[role].push(creep);
        }

        return this._creeps;
      },
    },
    droppedEnergy: {
      get() {
        this._droppedEnergy = this.find(FIND_DROPPED_RESOURCES);

        return this._droppedEnergy;
      },
    },
  });
