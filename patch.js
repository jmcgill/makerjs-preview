const makerjs = require('makerjs');

function Inches(i) {
  return i;
}

function MM(i) {
  return i / 25.4;
}

function circle(r, opt_x, opt_y) {
  const x = opt_x || 0;
  const y = opt_y || 0;
  this.models = {
    circle: {
      paths: {
        c: makerjs.model.move(new makerjs.paths.Circle([0, 0], r), [x, y]),
      },
    },
  };
}

function circleWithCross(r, opt_x, opt_y) {
  const x = opt_x || 0;
  const y = opt_y || 0;
  this.models = {
    circle: {
      paths: {
        c: makerjs.model.move(new makerjs.paths.Circle([0, 0], r), [x, y]),
        l1: new makerjs.paths.Line([x - r, y], [x + r, y]),
        l2: new makerjs.paths.Line([x, y - r], [x, y + r]),
      },
    },
  };
}

function DiameterToRadius(d) {
  return d / 2;
}

const pegDiameter = 2;
const spacing = 4;

function holes() {
  this.models = {};

  for (var y = 0; y < 3; ++y) {
    for (var x = 0; x < 4; ++x) {
      this.models[`${x}-${y}`] = new circleWithCross(DiameterToRadius(pegDiameter), spacing * y, spacing * x);
    }
  }
}

function lightingSlots() {
  const slotSize = 0.5;
  const clearance = 0.25;

  this.models = {};

  for (var y = 0; y < 3; ++y) {
    for (var x = 0; x < 4; ++x) {
      this.models[`a_${x}-${y}`] = new circle(DiameterToRadius(pegDiameter) + clearance, spacing * y, spacing * x);
      this.models[`b_${x}-${y}`] = new circle(DiameterToRadius(pegDiameter) + clearance + slotSize, spacing * y, spacing * x);
    }
  }
}

function main() {
  this.models = {
    holes: new holes(),
    lightingSlots: new lightingSlots(),
    border: makerjs.model.move(new makerjs.models.RoundRectangle(14, 18, 1.5), [-3, -3])
  };

  this.units = makerjs.unitType.Inch;
}

module.exports = main;
