# 油价看门狗 (🇦🇺袋鼠国版)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen)](https://nodejs.org/)
[![Status: Live](https://img.shields.io/badge/Status-Live-blue)](https://nodejs-fuelwatchdog.onrender.com/)

本项目是一个基于 **Node.js** 和 **Leaflet** 的全栈开源澳洲油价查询系统。通过交互式地图展示全澳各州的实时油价，并提供 14 天价格趋势分析，帮助用户在通货膨胀背景下节省开支。

🚀 **在线实例**: [https://nodejs-fuelwatchdog.onrender.com/](https://nodejs-fuelwatchdog.onrender.com/)

---

## ✨ 核心功能

* **交互式地图**: 实时加载视野范围内的油站，支持自动聚合与缩放渲染。
* **智能价格标注**: 
    * 🟩 **绿色**: 当前视野内的最低价站点。
    * 🟥 **红色**: 显著高于市场中位数的“高价站”。
* **14天趋势图**: 气泡弹窗内嵌 SVG 折线图，直观展示近期价格的高低位走势。
* **多维度过滤**: 支持按品牌、油品类型（U91, P95, P98, 柴油等）以及自定义价格区间筛选。
* **一键导航**: 深度集成 **Google Maps** 与 **Waze** 链接。

## 🛠️ 技术栈

* **前端**: 原生 JavaScript, Leaflet.js, CSS3
* **后端**: Node.js, Express.js
* **数据库**: MongoDB (利用 `2dsphere` 空间索引实现地理位置查询)

## 📊 数据来源说明

本项目诚挚感谢以下澳大利亚州政府提供的开放数据支持：

* **NSW / ACT / TAS**: 由 **API.NSW** 提供的 FuelCheck 数据，受新南威尔士州客户服务部 (Department of Customer Service) 支持。
* **QLD**: 由 **昆士兰州政府 (能源与气候部)** 提供的油价数据。
* **SA**: 由 **南澳大利亚州政府** 通过油价计划提供。
* **WA**: 数据来源于 **西澳 FuelWatch** 及矿业、工业监管与安全部。
* **VIC**: 数据由 **Service Victoria** 提供（注：根据要求，数据可能存在最高 24 小时的延迟）。
* **NT**: 通过各州法定的实时报告计划获取。

> *免责声明：数据按“原样”提供，不作任何保证。用户在加油前应以油站实时显示的标价为准。*

## 🤝 参与开发

欢迎通过以下方式完善本项目：
1.  **提交 Issue**: 报告 Bug 或提出新功能设想。
2.  **Pull Request**: 欢迎提交代码以优化数据解析逻辑。
3.  **项目仓库**: [https://github.com/DynastyKids/NodeJS-FuelWatchdog](https://github.com/DynastyKids/NodeJS-FuelWatchdog)

---

## 📄 版权信息
* Node.js (OpenJS Foundation)
* Leaflet (BSD-2-Clause)
* MongoDB (SSPL/Apache)
* 地图数据 © OpenStreetMap 贡献者