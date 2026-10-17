(function () {
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

  // Status evaluation: critical, optimal, critical hazard
  function evaluateStatus(ph, ec, temperature, humidity) {
    if (
      (ph < 5.0 || ph > 7.5) &&
      (temperature < 55 || temperature > 95) &&
      (ec < 0.2 || ec > 4.5) &&
      (humidity < 30 || humidity > 90)
    ) {
      return { level: "critical", label: "Critical Hazard" };
    }
    if (
      ph >= 5.5 &&
      ph <= 6.5 &&
      temperature >= 64.4 &&
      temperature <= 71.6 &&
      ec >= 1.0 &&
      ec <= 2.0 &&
      humidity >= 50 &&
      humidity <= 70
    ) {
      return { level: "optimal", label: "Optimal" };
    }
    return { level: "warning", label: "Warning" };
  }

  // Dynamic form input error validation
  function validateInput(data) {
    const errors = [];

    if (!data.bayID.trim()) {
      errors.push("Bay Id is a required field");
    }

    if (isNaN(data.ph) || data.ph < 0 || data.ph > 14) {
      errors.push("PH must be a number and between 0 to 14");
    }

    if (isNaN(data.ec) || data.ec < 0 || data.ec > 10) {
      errors.push(
        "Electrical Conductivity (EC) must be a number and between 0 to 10 mS/cm",
      );
    }

    if (
      isNaN(data.temperature) ||
      data.temperature < 14 ||
      data.temperature > 140
    ) {
      errors.push(
        "Temperature must be a number and between 14 to 140 degree F",
      );
    }

    if (isNaN(data.humidity) || data.humidity < 0 || data.humidity > 100) {
      errors.push("Relative Humidity must be a number and between 0 to 100 %");
    }
    return errors;
  }

  // Dynamic input field error validation
  function validateField(input, min, max) {
    const value = input.value.trim();
    const number = Number(value);

    const invalid =
      value === "" || !Number.isFinite(number) || number < min || number > max;

    input.classList.toggle("input-invalid", invalid);
  }

  // Check values immediately as the technician types
  inputPh.addEventListener("input", () => {
    validateField(inputPh, 0, 14);
  });

  inputEc.addEventListener("input", () => {
    validateField(inputEc, 0, 10);
  });

  inputTemp.addEventListener("input", () => {
    validateField(inputTemp, 14, 140);
  });

  inputHumidity.addEventListener("input", () => {
    validateField(inputHumidity, 0, 100);
  });

  // Clear invalid styling when the form is reset
  sensorForm.addEventListener("reset", () => {
    [inputPh, inputEc, inputTemp, inputHumidity].forEach((input) => {
      input.classList.remove("input-invalid");
    });
  });

  // form submit button event handling
  sensorForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = {
      id: crypto.randomUUID(),
      bayID: inputBayId.value,
      ph: parseFloat(inputPh.value),
      ec: parseFloat(inputEc.value),
      temperature: parseFloat(inputTemp.value),
      humidity: parseFloat(inputHumidity.value),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const validationErrors = validateInput(formData);

    if (validationErrors.length > 0) {
      displayError(validationErrors.join(" "));
      return;
    }

    hideError();

    formData.status = evaluateStatus(
      formData.ph,
      formData.ec,
      formData.temperature,
      formData.humidity,
    );

    records.unshift(formData);

    saveRecords();

    render();

    sensorForm.reset();

    inputBayId.focus();
  });

  // Delete individual logs button event handling
  telemetryRecords.addEventListener("click", function (event) {
    const target = event.target;
    if (target.classList.contains("btn-delete-log")) {
      const recordID = target.dataset.id;
      records = records.filter(function (record) {
        return record.id !== recordID;
      });
      saveRecords();
      render();
    }
  });

  // Clear all logs button event handling
  clearAllBtn.addEventListener("click", (event) => {
    if (records.length === 0) return;
    if (confirm("Are you sure you want to delete all greenhouse records?")) {
      records = [];
      saveRecords();
      render();
    }
  });

  // Dyanmic rendering of telemetry cards
  function render() {
    queueNumber.textContent = records.length;

    if (records.length === 0) {
      emptyState.classList.remove("hidden");
      telemetryRecords.innerHTML = "";
      return;
    }

    emptyState.classList.add("hidden");

    const fragment = document.createDocumentFragment();

    records.forEach(function (rec) {
      const article = document.createElement("article");
      article.className = "telemetry-card status-" + rec.status.level;

      article.innerHTML = `
            <div class="telemetry-info">
              <h3>Bay ID: ${escapeHTML(rec.bayID)}</h3>
              <p class="telemetry-timestamp">Logged at ${rec.timestamp}</p>
                <div class="sensor-readings">
                    <p>pH: <span class = sensor-values>${rec.ph}</span></p>
                    <p>Electrical Conductivity: <span class = sensor-values>${rec.ec} mS/cm</span></p>
                    <p>Temperature: <span class = sensor-values>${rec.temperature.toFixed(1)} &deg;F</span></p>
                    <p>Relative Humidity: <span class = sensor-values>${rec.humidity} %</span></p>
                </div>
            </div>
            <div class="telemetry-actions">
              <span class="status-badge ${rec.status.level}">${rec.status.label}</span>
              <button class="btn btn-outline-danger btn-sm btn-delete-log" data-id="${rec.id}">Delete Log</button>
            </div>`;

      fragment.appendChild(article);
    });

    telemetryRecords.innerHTML = "";
    telemetryRecords.appendChild(fragment);
  }

  function displayError(message) {
    errorBanner.textContent = message;
    errorBanner.classList.remove("hidden");
  }

  function hideError() {
    errorBanner.textContent = "";
    errorBanner.classList.add("hidden");
  }

  function escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
})();
