const {
    EventEmitter
} = require("events")

class GPS extends EventEmitter {
    constructor(port) {
        super()
        this.portName = port
        this.running = false
        this.SerialPort = require('serialport')
        this.NodeNMEA = require('node-nmea')
        this.start()
    }

    start() {
        if (!this.getState()) {
            this.port = new this.SerialPort(this.portName, {
                baudRate: 9600
            })

            const readline = new this.SerialPort.parsers.Readline({
                delimiter: '\r\n'
            })

            this.parser = this.port.pipe(readline)

            this.parser.on('data', (data) => {
                this.lastState = this.NodeNMEA.parse(data)
                this.emit('data', this.lastState)
            })

            this.running = true
        }
    }

    stop() {
        this.port = null
        this.lastState = null
        this.running = false
    }

    getState() {
        return this.running
    }

    getData() {
        if (this.getState())
            return this.lastState
    }

}

module.exports = GPS