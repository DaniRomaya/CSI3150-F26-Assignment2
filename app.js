(function (){
    "use strict()";

    const STORAGE_KEY = "terrapulse_telemetry_records_v1";

    const queueNumber = document.getElementById("queue-number");
    const errorBanner = document.getElementById("form-error-banner");
    const sensorForm = document.getElementById("sensor-form");
    const emptyState = document.getElementById("empty-state");
    const clearAllBtn = document.getElementById("clear-all-btn");
    const telemetryRecords = document.getElementById("telemetry-records");

    const inputBayId = document.getElementById("bay-id");
    const inputPh = document.getElementById("ph");
    const inputEc = document.getElementById("ec");
    const inputTemp = document.getElementById("temperature");
    const inputHumidity = document.getElementById("humidity");

    let records = loadRecords();

    render();

    function loadRecords() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error("Failed to load records from your data store", error);
            return [];
            
        }
    }

    function saveRecords() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        } catch (error) {
            console.error("Failed to write to your data store", error);
        }
    }

    function
})