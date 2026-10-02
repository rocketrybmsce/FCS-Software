# BMSCE Rocketry Ground Station Dashboard

The BMSCE Rocketry Ground Station is a browser-based flight-control dashboard
for monitoring an ESP32/LoRa rocket receiver. It connects to the receiver over
the browser's Web Serial API, displays live telemetry, performs pre-launch
avionics checks, tracks flight-state checkpoints, plots GPS position, and
stores validated telemetry in a CSV flight log.

The application is intended for a local ground-station computer. It does not
require a cloud service or an external serial bridge.

## 🌟 Key Features
- **Live Web Serial Connectivity**: Connect natively to receiver modules (ESP32/LoRa) directly through the browser. No external Python scripts required.
- **Flight Checkpoints Checkmarks**: Real-time detection of flight states (Launch Ready, Motor Ignited, Motor Burnout, Apogee Reached, Recovery Triggered, Ground Reached) using operator confirmation, acceleration, and velocity data.
- **Real-Time Data Visualization**: High-performance React/Recharts plotting Pressure, Temperature (T1/T2), Distance vs. Time, and Height vs. Time.
- **Validated CSV Logging**: Only correctly formatted rocket telemetry packets
  are timestamped and appended to `public/flight_log.csv`; sensor responses,
  debug text, malformed packets, and unrelated serial data are excluded.
- **3D Rocket Orientation**: Live 3D model visualization responding to incoming Pitch, Yaw, and Roll IMU data using React Three Fiber.
- **Offline 2D Mapping**: Fully local GPS routing plotted on a Leaflet map utilizing locally cached map tiles, ensuring reliability in remote launch environments without internet.
- **Dynamic Distance Calculation**: Uses the Haversine formula to compute accurate 2D surface distance relative to customizable Ground Station coordinates.

---

## 💻 System Requirements

**1. Software Requirements:**
- **Node.js**: Version 16.0 or higher is required (v18+ recommended). [Download Node.js here](https://nodejs.org/).
- **Git**: To clone the repository.
- **Web Browser**: **Google Chrome** or **Microsoft Edge** are MANDATORY. 
  *(Note: Firefox and Safari do not support the Web Serial API used for hardware communication).*

**2. Hardware Requirements:**
- Ground Station Receiver (ESP32/Arduino + LoRa module) connected via USB.
- Or an Arduino running the flight simulation script provided for testing.

---

## 🚀 Installation Guide

### Step 1: Clone and Install
Open PowerShell, Command Prompt, or a terminal and run:

```bash
git clone https://github.com/Suprabh07/FCS_Software
cd FCS-Software/bmsce-rocketry-app
npm install
```

The `npm install` command uses the dependency versions declared in
`bmsce-rocketry-app/package.json`.

### Step 2: Configure Offline Map Tiles (CRITICAL for No-Internet Launches)
Since launch sites often lack internet, the map uses cached offline tiles instead of live Google/OSM servers.
1. Download the map tiles archive from
   **[Download Map Tiles](https://drive.google.com/file/d/1fl1dtvSjqZJmKBLjTjwtNxQKtdUCdCX2/view?usp=sharing)**.
2. Extract it into `bmsce-rocketry-app/public`.
3. Confirm the resulting layout is:

```text
bmsce-rocketry-app/public/map_tiles/{z}/{x}/{y}.png
```

If the tiles are missing, the dashboard can still start, but the offline map
will not render its cached background.

### Step 3: Set Ground Station GPS Coordinates
For the distance calculator to work, it needs to know where the antenna is located.
1. In `bmsce-rocketry-app`, create a file named `.env`.
2. Add the ground-station coordinates:
```env
VITE_GROUND_STATION_LAT=12.9410
VITE_GROUND_STATION_LON=77.5655
```

These values are used as the reference point for the Haversine ground-station
distance calculation. Restart Vite after changing `.env`.

---

## 🏃‍♂️ Running the Dashboard

From `bmsce-rocketry-app`, start the local development server:

```bash
npm run dev
```

Open **Google Chrome** or **Microsoft Edge** and navigate to
`http://localhost:5173/`.

Useful project commands:

```bash
npm run lint       # Run ESLint
npm run build      # Create a production build
npm run preview    # Preview the production build locally
```

---

## 📖 Usage Guide

### Connecting to the rocket receiver

1. Connect the USB receiver to the ground-station computer.
2. Confirm that the receiver firmware and the dashboard use the same baud rate.
   The default is `115200`.
3. Select the baud rate and click **START**.
4. In the browser port picker, select the receiver's COM port.
5. The dashboard opens after the serial connection is established.

The browser may require a secure context. `localhost` is supported by Chrome
and Edge for Web Serial. The port can be selected only after a user gesture,
which is why the connection begins with the **START** button.

### Running the avionics check

1. Click **Check Avionics** in the Checkpoints panel.
2. The dashboard sends `$GTR,Check`.
3. The rocket checks the barometer, IMU, and GPS.
4. The rocket sends `$RTG,1`, `$RTG,2`, and `$RTG,3` as each sensor passes.
5. The dashboard marks each sensor with a checkmark.
6. **Ready to Launch** remains disabled until all three confirmations arrive.
7. After all checks pass, click **Ready to Launch**. The dashboard sends
   `$GTR,Ready`.

When no serial port is available, the development UI simulates the three
successful sensor responses so the interface can be tested without hardware.

### Sensor configuration

The pre-launch sensor list and its response numbers are maintained in:

```text
bmsce-rocketry-app/src/config/sensors.json
```

The file contains one object per sensor:

```json
[
  { "name": "barometer", "number": 1 },
  { "name": "IMU", "number": 2 },
  { "name": "GPS", "number": 3 }
]
```

To add a sensor or change a sensor's response number, edit this JSON file and
restart the development server. The dashboard uses it for the checklist
labels, initial checklist state, `$GTR,Check` sensor order, `$RTG,<number>`
acknowledgement mapping, and the Ready-to-Launch gate. Sensor numbers should be
unique positive integers, and names should match the names implemented by the
rocket firmware.

### Telemetry and flight-state display

The dashboard accepts telemetry from the rocket, updates the graphs and map,
and displays the rocket orientation in the 3D view. Flight-state packets latch
the corresponding checkpoint and all earlier checkpoints in the sequence.

### CSV log

The local logger appends valid telemetry to:

```text
bmsce-rocketry-app/public/flight_log.csv
```

Each saved row contains the computer timestamp followed by the original
telemetry packet. The file is not a general-purpose serial dump.

---

## 📡 Serial Data Protocol

Packets are plain strings terminated by `\n`.

**Ground station to rocket:**

```text
$GTR,Check
$GTR,Ready
```

`$GTR` means **Ground To Rocket**. The command is exact and case-sensitive:

| Packet | Meaning |
|---|---|
| `$GTR,Check` | Start the barometer, IMU, and GPS check sequence |
| `$GTR,Ready` | Tell the rocket that the operator has approved launch readiness |

The rocket confirms the three sensors with `$RTG,1` (barometer), `$RTG,2`
(IMU), and `$RTG,3` (GPS). `$RTG` means **Rocket To Ground**.

| Response | Sensor confirmed |
|---|---|
| `$RTG,1` | Barometer |
| `$RTG,2` | IMU |
| `$RTG,3` | GPS |

Sensor responses are acknowledgements, not telemetry. They are used to update
the Checkpoints panel and are never written to the CSV flight log.

**Rocket telemetry:**

```text
$RTG,1,1,vx,vy,vz,ax,ay,az,roll,pitch,yaw,alt,pressure\n
$RTG,1,2,lat,lon,vbat,current,t1,t2\n
```

The `state` field is the flight state received from the rocket. Packet type `1`
contains IMU/barometer data; packet type `2` contains GPS/system data.

### Telemetry packet 1: IMU and barometer

```text
$RTG,1,1,vx,vy,vz,ax,ay,az,roll,pitch,yaw,alt,pressure
```

| Position | Field | Unit / description |
|---:|---|---|
| 1 | `$RTG` | Packet direction marker |
| 2 | `state` | Numeric flight-state value |
| 3 | `1` | IMU/barometer packet type |
| 4 | `vx` | X velocity, m/s |
| 5 | `vy` | Y velocity, m/s |
| 6 | `vz` | Z/vertical velocity, m/s |
| 7 | `ax` | X acceleration, m/s² |
| 8 | `ay` | Y acceleration, m/s² |
| 9 | `az` | Z acceleration, m/s² |
| 10 | `roll` | Roll angle, degrees |
| 11 | `pitch` | Pitch angle, degrees |
| 12 | `yaw` | Yaw angle, degrees |
| 13 | `alt` | Altitude, metres |
| 14 | `pressure` | Atmospheric pressure, pascals |

This packet must contain exactly 14 comma-separated fields after splitting the
complete line.

### Telemetry packet 2: GPS and system data

```text
$RTG,1,2,lat,lon,vbat,current,t1,t2
```

| Position | Field | Unit / description |
|---:|---|---|
| 1 | `$RTG` | Packet direction marker |
| 2 | `state` | Numeric flight-state value |
| 3 | `2` | GPS/system packet type |
| 4 | `lat` | Latitude, decimal degrees |
| 5 | `lon` | Longitude, decimal degrees |
| 6 | `vbat` | Battery voltage, volts |
| 7 | `current` | Current, amperes |
| 8 | `t1` | Temperature channel 1, °C |
| 9 | `t2` | Temperature channel 2, °C |

This packet must contain exactly 10 comma-separated fields after splitting the
complete line.

The numeric `STATE|<number>` value is:

1. Launch Ready
2. Motor Ignited
3. Motor Burnout
4. Apogee Reached
5. Recovery Triggered
6. Ground Reached

`Launch Ready` is set when the avionics checks pass and the operator clicks
**Ready to Launch**. Each later state latches all preceding states in the
dashboard.

### Protocol rules

- Use plain ASCII strings, not JSON.
- Terminate every packet with a newline (`\n`).
- `$GTR,Check` starts the sensor-check sequence.
- `$GTR,Ready` marks the rocket ready for launch.
- `$RTG,1` confirms the barometer, `$RTG,2` confirms the IMU, and `$RTG,3`
  confirms the GPS.
- `$RTG,<state>,1,...` contains IMU/barometer telemetry and must contain 14
  comma-separated fields.
- `$RTG,<state>,2,...` contains GPS/system telemetry and must contain 10
  comma-separated fields.
- The `state` field must be a valid flight-state number.
- Only valid `$RTG,<state>,1,...` and `$RTG,<state>,2,...` packets are written to
  the CSV flight log.
- Sensor acknowledgements, debug messages, startup text, malformed packets,
  and unrelated serial data are not written to the CSV log.

### Packet examples

Valid examples:

```text
$RTG,1
$RTG,2
$RTG,3
$RTG,1,1,0.000,0.000,50.500,0.000,0.000,9.810,0.100,0.200,-0.100,1400.200,85000.000
$RTG,1,2,12.941500,77.566000,12.400,1.500,25.000,24.000
```

Ignored or invalid examples:

```text
ESP32 sensor-check test ready
{"type":"telemetry"}
$RTG,1,1,missing,fields
$RTG,3,3,1,2,3
$RTG,1,2,12.94,77.56,not-a-number,1.5,25,24
```

The receiver should not mix human-readable debug output into the telemetry
stream. If debugging is required, use a separate serial interface or disable
debug output before flight operations.

---

## 🔬 Checkpoint Verification Logic
The software dynamically reads physics data to trigger checks:
1. **Motor Ignited**: Vertical Acceleration (\a\) spikes > 15 m/s².
2. **Motor Burnout**: Sustained ignition drops to coast phase (\a\ < 5 m/s²).
3. **Apogee Reached**: Vertical Velocity (\z\) drops below zero.
4. **Recovery Triggered**: Post-apogee shock spike detected (\v\ > 10 m/s²).
5. **Ground Reached**: Recovery is active and overall speed drops near zero (\v\ < 1 m/s).
