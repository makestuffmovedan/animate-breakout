function versionBlink () {
    strip.showColor(neopixel.colors(NeoPixelColors.Green))
    basic.pause(200)
    strip.showColor(neopixel.colors(NeoPixelColors.Black))
    basic.pause(200)
    strip.showColor(neopixel.colors(NeoPixelColors.Green))
    basic.pause(200)
    strip.showColor(neopixel.colors(NeoPixelColors.Black))
}
input.onButtonPressed(Button.A, function () {
    if (recording) {
        recording = 0
        serial.writeLine("STOP RECORD")
        strip.showColor(neopixel.colors(NeoPixelColors.White))
    } else {
        recording = 1
        playing = 0
        strip.showColor(neopixel.colors(NeoPixelColors.Red))
    }
})
function play () {
    while (playing == 1) {
        if (frame < anim_frames.length - 1) {
            anim_frame = anim_frames[frame]
            knob_p0 = anim_frame[0]
            knob_p1 = anim_frame[1]
            knob_p2 = anim_frame[2]
            servo_13 = Math.round(Math.map(knob_p0, 0, 1023, 0, 180))
            servo_14 = Math.map(knob_p1, 0, 1023, 0, 180)
            servo_15 = Math.map(knob_p2, 0, 1023, 0, 180)
            pins.servoWritePin(AnalogPin.P13, servo_13)
            pins.servoWritePin(AnalogPin.P14, servo_14)
            pins.servoWritePin(AnalogPin.P15, servo_15)
            colour_r = Math.map(knob_p0, 0, 1023, 255, 0)
            colour_g = Math.map(knob_p1, 0, 1023, 255, 0)
            colour_b = Math.map(knob_p2, 0, 1023, 255, 0)
            strip.showColor(neopixel.rgb(colour_r, colour_g, colour_b))
            serial.writeString("" + (knob_p0))
            serial.writeString("|")
            serial.writeLine("" + (servo_13))
            basic.pause(42)
            frame += 1
        } else {
            frame = 0
            serial.writeLine("LOOP")
        }
    }
}
function record () {
    anim_frames = []
    while (recording == 1) {
        strip.showColor(neopixel.colors(NeoPixelColors.Red))
        knob_p0 = pins.analogReadPin(AnalogReadWritePin.P0)
        knob_p1 = pins.analogReadPin(AnalogReadWritePin.P1)
        knob_p2 = pins.analogReadPin(AnalogReadWritePin.P2)
        servo_13 = Math.map(knob_p0, 0, 1023, 0, 180)
        servo_14 = Math.map(knob_p1, 0, 1023, 0, 180)
        servo_15 = Math.map(knob_p2, 0, 1023, 0, 180)
        pins.servoWritePin(AnalogPin.P13, servo_13)
        pins.servoWritePin(AnalogPin.P14, servo_14)
        pins.servoWritePin(AnalogPin.P15, servo_15)
        anim_frame = [knob_p0, knob_p1, knob_p2]
        anim_frames.push(anim_frame)
        serial.writeLine("" + (anim_frame[0]))
        basic.pause(42)
    }
}
input.onButtonPressed(Button.B, function () {
    if (playing) {
        playing = 0
        serial.writeLine("STOP - PLAY")
        strip.showColor(neopixel.colors(NeoPixelColors.White))
    } else {
        playing = 1
        recording = 0
        frame = 0
        strip.showColor(neopixel.colors(NeoPixelColors.Green))
    }
})
function sensorLevel () {
    if (sensor_current < sensor_max && sensor_current > sensor_min) {
        if (sensor_current > sensor_previous) {
            sensor_level = sensor_current
        }
    }
    sensor_level += -40
    sensor_previous = sensor_current
    serial.writeString("" + (sensor_level))
}
function move () {
    basic.pause(14)
    knob_p0 = pins.analogReadPin(AnalogReadWritePin.P0)
    knob_p1 = pins.analogReadPin(AnalogReadWritePin.P1)
    knob_p2 = pins.analogReadPin(AnalogReadWritePin.P2)
    sensor_current = pins.analogReadPin(AnalogReadWritePin.P4)
    sensorLevel()
    servo_13 = Math.map(knob_p0, 0, 1023, 0, 180)
    servo_14 = Math.map(knob_p1, 0, 1023, 0, 180)
    servo_15 = Math.map(sensor_level, sensor_min, sensor_max, 180, 0)
    pins.servoWritePin(AnalogPin.P13, servo_13)
    pins.servoWritePin(AnalogPin.P14, servo_14)
    pins.servoWritePin(AnalogPin.P15, servo_15)
    colour_r = Math.map(knob_p0, 0, 1023, 255, 0)
    colour_g = Math.map(knob_p1, 0, 1023, 255, 0)
    colour_b = Math.map(knob_p2, 0, 1023, 255, 0)
    strip.showColor(neopixel.rgb(colour_r, colour_g, colour_b))
}
let sensor_level = 0
let sensor_previous = 0
let sensor_current = 0
let colour_b = 0
let colour_g = 0
let colour_r = 0
let servo_15 = 0
let servo_14 = 0
let servo_13 = 0
let anim_frame: number[] = []
let anim_frames: number[][] = []
let frame = 0
let sensor_max = 0
let sensor_min = 0
let playing = 0
let recording = 0
let knob_p2 = 0
let knob_p1 = 0
let knob_p0 = 0
let strip: neopixel.Strip = null
serial.writeString("START")
strip = neopixel.create(DigitalPin.P8, 14, NeoPixelMode.RGB)
strip.setBrightness(50)
led.enable(false)
knob_p0 = 0
knob_p1 = 0
knob_p2 = 0
recording = 0
playing = 0
sensor_min = 200
sensor_max = 1000
strip.showColor(neopixel.colors(NeoPixelColors.White))
versionBlink()
basic.forever(function () {
    if (playing) {
        play()
    }
    if (recording) {
        record()
    } else {
        move()
    }
})
