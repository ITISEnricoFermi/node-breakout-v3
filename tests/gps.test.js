const GPS = require("../gps")

const gps = new GPS("COM3")

console.log(gps.getData())