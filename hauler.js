class Creep {
  constructor(creepName) {
    this.name = creepName;
    this.creep = Game.creeps[this.name];

    this.run = () => {
      if (!this.creep.memory.spawn)
        this.creep.memory.spawn = this.creep.pos.findClosestByRange(
          FIND_MY_STRUCTURES,
          { filter: (s) => s.structureType === "spawn" }
        ).id;

      let job = this.creep.memory.job;

      if (job === "pickup") {
        this.pickupEnergy();
      } else if (job === "transfer") {
        this.transferOrUpgrade();
      }

      if (this.creep.store.getFreeCapacity() === this.creep.store.getCapacity())
        this.creep.memory.job = "pickup";
      else if (
        this.creep.store.getUsedCapacity(RESOURCE_ENERGY) ===
        this.creep.store.getCapacity()
      )
        this.creep.memory.job = "transfer";
    };

    this.getEnergySource = () => {
      const droppedEnergy = this.creep.room.droppedEnergy;
      const haulers = this.creep.room.creeps.hauler;
      const flag = this.creep.room.find(FIND_FLAGS, {
        filter: (f) => f.name.startsWith("upgradeContainer"),
      })[0];

      const source = droppedEnergy.filter(
        (r) =>
          r.resourceType === RESOURCE_ENERGY &&
          !r.pos.isEqualTo(flag.pos) &&
          haulers.filter((h) => h.memory.source === r.id).length < 2
      )[0];

      return source;
    };

    this.transferOrUpgrade = () => {
      const spawn = Game.getObjectById(this.creep.memory.spawn);
      const controller = this.creep.room.controller;
      const extensions = this.creep.room.structures.extension.filter(
        (e) => e.store.getFreeCapacity() > 0
      );

      if (!spawn || !controller) return this.creep.say("no targets");

      if (
        spawn.store.getUsedCapacity(RESOURCE_ENERGY) <
          spawn.store.getCapacity(RESOURCE_ENERGY) ||
        extensions.length > 0
      ) {
        if (extensions.length) {
          const target = extensions[0];

          if (this.creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
            this.creep.moveTo(target);
        } else {
          if (this.creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
            this.creep.moveTo(spawn);
        }
      } else if (!extensions.length) {
        if (this.creep.room.creeps.upgrader.length > 0) {
          const flag = this.creep.room.find(FIND_FLAGS, {
            filter: (f) => f.name.startsWith("upgradeContainer"),
          })[0];

          if (!this.creep.memory.container) {
            const container = this.creep.room
              .lookAt(flag.pos)
              .find((s) => s.structure);

            if (container) this.creep.memory.container = container.structure.id;
          }

          const container = Game.getObjectById(this.creep.memory.container);

          if (!container) {
            if (!this.creep.pos.isEqualTo(flag.pos)) this.shove(flag.pos);
            else this.creep.drop(RESOURCE_ENERGY);

            return;
          }

          if (creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
            creep.moveTo(container);
        } else {
          if (this.creep.upgradeController(controller) === ERR_NOT_IN_RANGE)
            this.creep.move(controller);
        }
      }
    };

    this.pickupEnergy = () => {
      if (!this.creep.memory.source) {
        const energy = this.getEnergySource();

        if (energy) this.creep.memory.source = energy.id;
      }

      const target = Game.getObjectById(this.creep.memory.source);

      if (!target) delete this.creep.memory.source;

      if (this.creep.pickup(target) === ERR_NOT_IN_RANGE)
        this.creep.moveTo(target);
    };

    this.shove = (pos) => {
      if (!this.creep.memory.destination)
        this.creep.memory.destination = [pos.x, pos.y];

      let destination = this.creep.memory.destination;

      destination = new RoomPosition(
        destination[0],
        destination[1],
        this.creep.room.name
      );

      this.creep.memory.destination = [pos.x, pos.y];

      if (
        !this.creep.pos.isEqualTo(destination) &&
        this.creep.pos.getRangeTo(destination) <= 1
      ) {
        const creep = destination.lookFor(LOOK_CREEPS)[0];

        if (creep) {
          creep.move(this.creep);
          this.creep.move(creep);
        } else this.creep.moveTo(destination);

        return;
      }

      this.creep.moveTo(destination);
    };
  }
}

module.exports = {
  Creep,
};
