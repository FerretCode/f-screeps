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
      } else if (job === "transfer") {
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

      const source = droppedEnergy.filter(
        (r) =>
          r.resourceType === RESOURCE_ENERGY &&
          haulers.filter((h) => h.memory.source === r.id).length < 2
      )[0];

      return source;
    };

    this.transferOrUpgrade = () => {

    };

    this.pickupEnergy = () => {
      if (!this.creep.memory.source) {
        const energy = this.getEnergySource();

        if (energy )
      }
    }
  }
}

module.exports = {
  Creep,
};
