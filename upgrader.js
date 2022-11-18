class Creep {
  constructor(creepName) {
    this.name = creepName;
    this.creep = Game.creeps[this.name];

    this.run = () => {
      let target = Game.getObjectById(this.creep.memory.target);

      if (!this.creep.memory.target) {
        const flag = this.creep.room.find(FIND_FLAGS, {
          filter: (f) => f.name.startsWith("upgradeContainer"),
        })[0];

        const pos = this.creep.room.lookAt(flag.pos);

        let container = pos.filter((p) => {
          if (p.structure)
            if (p.structure.structureType === "container") return pos;

          return undefined;
        })[0];

        let energy = pos.filter((pos) => {
          if (pos.resource)
            if (pos.resource.resourceType === "energy") return pos;

          return undefined;
        })[0];

        if (container) {
          container = container.structure;

          if (container.store.getUsedCapacity(RESOURCE_ENERGY) === 0)
            this.creep.memory.job = "transfer";

          if (container.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            this.creep.memory.target = container.id;
            target = container;
          }
        } else if (energy) {
          energy = energy.resource;

          this.creep.memory.target = energy.id;
          target = energy;
        } else {
          creep.say("No Sources");
        }
      }

      if (!target) return delete this.creep.memory.target;

      let job = this.creep.memory.job;

      if (job === "pickup") {
        this.creep.moveTo(target, { reusePath: 50 });
        if (creep.pickup(target) === ERR_INVALID_TARGET)
          this.creep.withdraw(
            target,
            RESOURCE_ENERGY,
            this.creep.store.getFreeCapacity(RESOURCE_ENERGY)
          );
      } else if (job === "transfer") {
        if (
          this.creep.upgradeController(creep.room.controller) ===
          ERR_NOT_IN_RANGE
        )
          this.creep.moveTo(creep.room.controller);
      }

      if (this.creep.store.getFreeCapacity() === this.creep.store.getCapacity())
        this.creep.memory.job = "pickup";
      if (this.creep.store.getUsedCapacity() === this.creep.store.getCapacity())
        this.creep.memory.job = "transfer";
    };
  }
}

module.exports = {
  Creep,
};
