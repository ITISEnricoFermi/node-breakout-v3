const {
    EventEmitter
} = require("events")

class GPS extends EventEmitter {
    constructor(port) {
        this.portName = port
        this.SerialPort = require('serialport')
        this.NodeNMEA = require('node-nmea')
    }

    start() {
        this.port = new this.SerialPort(this.portName, {
            baudRate: 9600
        })
        this.parser = this.port.pipe(new this.SerialPort.parsers.Readline({
            delimiter: '\r\n'
        }))
        this.parser.on('data', (data) => {
            this.lastState = this.NodeNMEA.parse(data)
            this.emit('data', this.lastState)
        })
    }

    stop() {
        this.port = null
        this.lastState = null
    }

    getData() {
        return this.lastState
    }
}

module.exports = GPS