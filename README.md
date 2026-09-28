# BMSCE Rocketry Ground Station Dashboard

A high-performance, offline-capable Ground Station dashboard built for the **BMSCE Rocketry** club. This application connects directly to flight hardware via the browser's Web Serial API to receive, visualize, log, and analyze flight telemetry in real-time.

## 🌟 Key Features
- **Live Web Serial Connectivity**: Connect natively to receiver modules (ESP32/LoRa) directly through the browser. No external Python scripts required.
- **Flight Checkpoints Checkmarks**: Real-time detection of flight events (Motor Ignited, Motor Burnout, Apogee Reached, Recovery Triggered, Ground Reached) using acceleration and velocity data.
- **Real-Time Data Visualization**: High-performance React/Recharts plotting Pressure, Temperature (T1/T2), Distance vs. Time, and Height vs. Time.
- **Automated CSV Background Logging**: A custom local backend plugin automatically timestamps and continuously appends all incoming raw serial data to \public/flight_log.csv\ completely transparently.
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
Open your terminal or command prompt and run the following commands:
1. Clone the repository (if you haven't already and have a remote URL)     
git clone https://github.com/Suprabh07/FCS_Software

2. Navigate to the App directory   
cd bmsce-rocketry-app

3. Install all necessary NPM packages     
npm install

### Step 2: Configure Offline Map Tiles (CRITICAL for No-Internet Launches)
Since launch sites often lack internet, the map uses cached offline tiles instead of live Google/OSM servers.
1. Download the map tiles zip file from this specific Google Drive link:
   👉 **[Download Map Tiles](https://drive.google.com/file/d/1fl1dtvSjqZJmKBLjTjwtNxQKtdUCdCX2/view?usp=sharing)**
2. Navigate to the \public\ folder inside the \bmsce-rocketry-app\ directory.
3. Extract the downloaded zip directly into public.
4. Ensure the folder structure is perfectly aligned like this:
   \bmsce-rocketry-app/public/map_tiles/{z}/{x}/{y}.png\

### Step 3: Set Ground Station GPS Coordinates
For the distance calculator to work, it needs to know where the antenna is located.
1. In the \bmsce-rocketry-app\ folder, create a new file named \.env\.
2. Add your launchpad/ground station GPS coordinates:
```env
VITE_GROUND_STATION_LAT=12.9410
VITE_GROUND_STATION_LON=77.5655
```

---

## 🏃‍♂️ Running the Dashboard

Start the local development server (this enables both the UI and the automated CSV logger):

npm run dev


1. Open **Google Chrome** or **Edge**.
2. Navigate to \http://localhost:5173\.

---

## 📖 Usage Guide

**Connecting to the Rocket Receiver:**
1. On the dashboard loading screen, select your radio receiver's **Baud Rate** from the dropdown loop (Default is \115200\).
2. Click **START**.
3. A browser security prompt will appear. Select the COM port (e.g., \COM3\ or \COM5\) corresponding to your plugged-in receiver module.
4. If valid data is flowing, the dashboard will appear and graphs will animate immediately!

**Where limits and logs are saved:**
- **CSV Logs**: As soon as connection is established, all raw serial data is automatically logged into \bmsce-rocketry-app/public/flight_log.csv\ with exact PC timestamps.
- **Flight Checkpoints**: Located next to the Height graph, these will automatically check off as the rocket meets specific acceleration/velocity parameters during flight.

---

## 📡 Serial Data Protocol

Packets are plain strings terminated by `\n`.

**Ground station to rocket:**

```text
$GTR,Check
$GTR,Ready
```

The rocket confirms the three sensors with `$RTG,1` (barometer), `$RTG,2`
(IMU), and `$RTG,3` (GPS).

**Rocket telemetry:**

```text
$RTG,state,1,vx,vy,vz,ax,ay,az,roll,pitch,yaw,alt,pressure
$RTG,state,2,lat,lon,vbat,current,t1,t2
```

The numeric `state` value is the flight state received from the rocket:

1. Motor Ignited
2. Motor Burnout
3. Apogee Reached
4. Recovery Triggered
5. Ground Reached

### Protocol rules

- Use plain ASCII strings, not JSON.
- Terminate every packet with a newline (`\n`).
- `$GTR,Check` starts the sensor-check sequence.
- `$GTR,Ready` marks the rocket ready for launch.
- `$RTG,1` confirms the barometer, `$RTG,2` confirms the IMU, and `$RTG,3`
  confirms the GPS.
- `$RTG,state,1,...` contains IMU/barometer telemetry and must contain 14
  comma-separated fields.
- `$RTG,state,2,...` contains GPS/system telemetry and must contain 10
  comma-separated fields.
- The `state` field must be a valid flight-state number.
- Only valid `$RTG,state,1,...` and `$RTG,state,2,...` packets are written to
  the CSV flight log.
- Sensor acknowledgements, debug messages, startup text, malformed packets,
  and unrelated serial data are not written to the CSV log.

The CSV flight log stores only valid `$RTG,state,1,...` and
`$RTG,state,2,...` telemetry packets. Sensor-check responses, debug messages,
startup text, malformed packets, and unrelated serial data are excluded.

---

## 🔬 Checkpoint Verification Logic
The software dynamically reads physics data to trigger checks:
1. **Motor Ignited**: Vertical Acceleration (\a\) spikes > 15 m/s².
2. **Motor Burnout**: Sustained ignition drops to coast phase (\a\ < 5 m/s²).
3. **Apogee Reached**: Vertical Velocity (\z\) drops below zero.
4. **Recovery Triggered**: Post-apogee shock spike detected (\v\ > 10 m/s²).
5. **Ground Reached**: Recovery is active and overall speed drops near zero (\v\ < 1 m/s).
