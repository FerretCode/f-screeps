class Creep {
  constructor(creepName) {
    this.name = creepName;
    this.creep = Game.creeps[this.name];

    this.run = () => {};
  }
}

module.exports = {
  Creep,
};
