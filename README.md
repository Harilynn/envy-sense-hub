# 🏭 Smart Industrial Health Monitoring System (SIHMS)

**Affordable Industry 4.0 Solution for MSMEs**  
Bridging IoT hardware simulation with a real-time web dashboard to enable predictive maintenance and reduce downtime in small-scale industries.

🔗 **Live Demo:** [envy-sense-hub.lovable.app](https://envy-sense-hub.lovable.app)  
🔗 **Wokwi Hardware Simulation:** [View Project](https://wokwi.com/projects/438008327608795137)  

---

## 📌 Problem Statement
In industrial hubs like Okhla and Bawana (Delhi), MSMEs face:
- Manual inspections → **High rejection rates**
- No predictive maintenance → **Frequent breakdowns**
- Low adoption of Industry 4.0 due to **high costs & lack of expertise**

**Impact:**
- Loss of production
- Increased operational costs
- Safety hazards
- Reduced machine lifespan by **20–30%**

---

## 💡 Our Solution
**SIHMS** — *Smart Industrial Health Monitoring System*  
An **ESP32-based IoT system** that continuously tracks **vibration**, **temperature**, **current**, **humidity**, and **gas emissions** to:
- Detect anomalies instantly  
- Trigger hardware alerts (LED, buzzer, LCD)  
- Display live sensor data and alerts on a **web dashboard**  
- Generate downloadable maintenance reports  

**Principle:** Prevention is better than cure.

---

## ✨ Features

### 1. **Hardware Prototype (Wokwi Simulation)**
- **ESP32 Microcontroller**
- **Sensors:**
  - MPU6050 — Vibration  
  - DHT22 — Temperature & Humidity  
  - ACS712 — Current  
  - MQ2 — Gas Emissions  
  - Optional: Air Quality & Sound Sensors
- **Alerts:**
  - Blinking LED & buzzer for critical conditions  
  - Flashing LCD messages (`"Overheat Alert"`, `"High Vibration"`)  

### 2. **Web Application**
- Paste live serial output from device/simulation into the dashboard
- Features:
  - **Real-time sensor visualization**
  - Automatic threshold detection
  - Active alert banners
  - Summary analysis (`"2 out of 5 parameters in alert zone"`)
  - **PDF report generation**
  - **No coding required** — easy for non-technical operators

---

## 🖥️ Tech Stack

### **Hardware**
- ESP32
- DHT22 (Temperature & Humidity)
- MPU6050 (Vibration)
- ACS712 (Current)
- MQ2 (Gas Sensor)
- LED, LCD, Buzzer

### **Software & Web**
- **Frontend:** React.js, Tailwind CSS, Radix UI
- **Simulation:** Wokwi
- **Alerts:** WebSocket-driven banners
- **Deployment:** Lovable.app

---

## 📊 System Architecture
```plaintext
[Sensors] → [ESP32] → [Data Processing & Threshold Detection]
       ↳ [Hardware Alerts: LED, LCD, Buzzer]
       ↳ [Serial Output] → [Web Dashboard]
🚀 Getting Started
1️⃣ Hardware Setup
Connect ESP32 with DHT22, MPU6050, ACS712, MQ2.

Upload Arduino code (includes threshold-based alerts).

Simulate in Wokwi or run on physical hardware.

2️⃣ Web Dashboard Setup
bash
Copy
Edit
# Clone repository
git clone https://github.com/<your-repo>.git
cd <your-repo>

# Install dependencies
npm install

# Start development server
npm run dev
Paste serial monitor data into the dashboard input.

Monitor live readings & download reports.

📌 Use Cases
MSME Factories — Affordable predictive maintenance

Training Labs — Teaching IoT & Industry 4.0 concepts

Pilot Projects — Testing before large-scale deployment

🔮 Future Improvements
Direct serial-to-web integration (no manual copy-paste)

AI/ML-based predictive maintenance insights

Mobile app with push notifications

Integration with cloud IoT platforms (AWS IoT, Azure IoT)

👩‍💻 Team
Team Jupiter — IGDTUW

Harleen Kaur

Disha Sharma

Gungun Jain
