class GPS {
    constructor(port) {
        this.portName = port
        this.SerialPort = require('serialport')
        this.NodeNMEA = require('node-nmea')
    }

    start() {
        this.port = new this.SerialPort(this.portName, {baudRate: 9600})
        this.parser = this.port.pipe(new this.SerialPort.parsers.Readline({ delimiter: '\r\n'}))
        this.parser.on('data', (data) => {
            this.lastState = this.NodeNMEA.parse(data)
        })
    }

    stop() {
        this.port = null
        this.lastState = null
    }

    getData() {
        if (this.lastState === null) return null
        else return {
            latitude: this.lastState.loc.geojson.coordinates[1],
            longitude: this.lastState.loc.geojson.coordinates[0],
            altitude: this.lastState.altitude
        }
    }
}

module.exports = GPS