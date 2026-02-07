# 🐕 Fuel Price Watch Dog (Australia)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen)](https://nodejs.org/)
[![Status: Live](https://img.shields.io/badge/Status-Live-blue)](https://nodejs-fuelwatchdog.onrender.com/)

An open-source, full-stack fuel price monitoring system built with **Node.js** and **Leaflet**. This project visualizes real-time fuel prices across Australian states to help users find the best deals through interactive maps and historical trend analysis.

🚀 **Live Demo**: [https://nodejs-fuelwatchdog.onrender.com/](https://nodejs-fuelwatchdog.onrender.com/)

---

## ✨ Features

* **Interactive Map**: Real-time station loading based on map bounds using Leaflet.
* **Smart Price Highlighting**: 
    * 🟩 **Green**: Best deals in the current view.
    * 🟥 **Red**: Prices significantly higher than the market median.
* **14-Day Trends**: Integrated SVG sparklines showing price history and Low/High records in station popups.
* **Advanced Filtering**: Filter by brand, fuel type (U91, P95, P98, DL, etc.), and custom price ranges.
* **App Integration**: Direct navigation links for **Google Maps** and **Waze**.

## 🛠️ Tech Stack

* **Frontend**: Vanilla JS, Leaflet.js, CSS3
* **Backend**: Node.js, Express.js
* **Database**: MongoDB (with `2dsphere` index)

## 📊 Data Attribution & Sources

This project acknowledges the following Australian State Governments for providing open data:

* **NSW / ACT / TAS**: FuelCheck data provided by **API.NSW** supported by the Department of Customer Service NSW.
* **QLD**: Fuel price data provided by **State of Queensland (Department of Energy and Climate)**.
* **SA**: Fuel price data provided by **South Australia Government** via the fuel pricing scheme.
* **WA**: Data sourced from **WA FuelWatch**, Department of Mines, Industry Regulation and Safety.
* **VIC**: Fuel price data provided by **Service Victoria** (Note: data may be delayed up to 24 hours as required).
* **NT**: Sourced via respective state-mandated real-time reporting schemes.

> *Note: The data is provided "as is" without warranty. Users should verify prices at the station before fueling.*

## 🤝 Contribution

1.  **Submit Issues**: Report bugs or suggest features.
2.  **Pull Requests**: Contributions for data source optimization are welcome.
3.  **Repository**: [https://github.com/DynastyKids/NodeJS-FuelWatchdog](https://github.com/DynastyKids/NodeJS-FuelWatchdog)

---

## 📄 Credits
* Node.js (OpenJS Foundation)
* Leaflet (BSD-2-Clause)
* MongoDB (SSPL/Apache)
* Map Data © OpenStreetMap contributors