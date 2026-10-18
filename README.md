# TerraPulse – Greenhouse Telemetry Portal

TerraPulse is a web-based application for recording greenhouse sensor readings, validating environmental data, and monitoring conditions across greenhouse bays.

## Features

- Record Bay ID, pH, electrical conductivity (EC), temperature, and humidity.
- Validate sensor inputs with real-time error feedback.
- Classify readings as **Optimal**, **Warning**, or **Critical Hazard**.
- Save telemetry records using browser `localStorage`.
- Delete individual logs or clear the entire queue.

## Technologies

- HTML5
- CSS3
- JavaScript
- localStorage API

## Project Structure

```text
CSI3150-F25-Assignment2/
├── index.html
├── styles.css
├── app.js
└── README.md
```

## Getting Started

1. Clone or download the repository.
2. Open the project folder.
3. Launch `index.html` in a web browser.

## Usage Notes

Enter the greenhouse bay information and sensor readings into the form. Submit valid readings to view their environmental status in the telemetry queue. Records remain saved after refreshing the page in the same browser.

## Data Persistence

Telemetry records are stored locally in the browser under:

`terrapulse_telemetry_records_v1`

Records persist after refreshing the page but are not synchronized across devices.

## Author

Developed by Dani Romaya as part of a web development assignment/project for CSI 3150 - Fall 2026.
