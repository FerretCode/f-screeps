class Creep {
  constructor(creepName) {
    this.name = creepName;
    this.creep = Game.creeps[this.name];

    this.run = () => {
      if (!this.creep.memory.source) {
        const source = this.getSource();

        if (!source) return this.creep.say("no source");

        this.creep.memory.source = source.id;
      }

      const source = Game.getObjectById(this.creep.memory.source);

      if (this.creep.harvest(source) === ERR_NOT_IN_RANGE)
        this.creep.moveTo(source);
    };

    this.getSource = () => {
      const sources = this.creep.room.sources;
      const harvesters = this.creep.room.creeps.harvester;

      const source = sources.filter(
        (s) => !harvesters.filter((h) => h.memory.source === s.id).length
      )[0];

      return source;
    };
  }
}

module.exports = {
  Creep,
};
