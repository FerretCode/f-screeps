class Creep {
  constructor(creepName) {
    this.name = creepName;
    this.creep = Game.creeps[this.name];

    this.run = () => {

    }

    this.getSource = () => {
      const sources = this.creep.room.sources;
      const harvesters = this.creep.room.creeps.harvester;

      console.log(harvesters)

      const source = sources.filter(
        (s) => harvesters.filter((h) => h.memory.source === s.id) 
      )[0];

      return source
    }
  }
}

module.exports = {
  Creep
}