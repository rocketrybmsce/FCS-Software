# Serial checkpoint protocol

Packets are newline-delimited JSON. The newline is the frame boundary, so the
ESP32 can buffer bytes until `\n` and parse one JSON object.

## Ground station to rocket

When **Check Avionics** is pressed:

```json
{"type":"command","command":"CHECK_AVIONICS","checkpoints":["barometer","IMU","GPS"]}
```

After all three checks pass, **Ready to Launch** sends:

```json
{"type":"command","command":"READY_TO_LAUNCH"}
```

## Rocket to ground station

The rocket responds to each sensor check:

```json
{"type":"checkpoint","checkpoint":"barometer","status":"pass"}
{"type":"checkpoint","checkpoint":"IMU","status":"pass"}
{"type":"checkpoint","checkpoint":"GPS","status":"pass"}
```

The dashboard marks a sensor only when its response has `status: "pass"`.
Without a connected serial device, the UI simulates these responses in order
for development and testing.

Flight state packets use the existing checkpoint order:

```json
{"type":"flight_state","state":1}
```

The state mapping is:

1. Motor Ignited
2. Motor Burnout
3. Apogee Reached
4. Recovery Triggered
5. Ground Reached

States are latched in the dashboard, so receiving state 3 keeps states 1 and 2
checked. Existing comma-separated telemetry packets remain supported.
