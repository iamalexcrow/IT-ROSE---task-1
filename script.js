import deepMerge from "./merge.js";

let conversionTable;
let extra;

// GET JSON FILES 
window.onload = async function () {
  const json1 = await fetch("./conversion_rules.json");
  const json2 = await fetch("./extra_conversion_rules.json");
  conversionTable = await json1.json();
  extra = await json2.json();
}
// BUTTONS LISTENERS
const convertBtn = document.getElementById("convertBtn");
convertBtn.addEventListener("click", validateInputs);

const addMoreDataBtn = document.getElementById("addBtn");
addMoreDataBtn.addEventListener("click", addMoreData);

// ADD MORE METRICS FUNCTIONALITY
function addMoreData() {
  const merged = deepMerge(conversionTable, extra);
  const fromList = document.getElementById("inputUnits");
  const toList = document.getElementById("outputUnits");

  Object.keys(merged).forEach((key) => {
    const element = document.querySelector(`option[value="${key}"]`);
    if (!element) {
      const newOption = document.createElement("option");
      newOption.value = key;
      newOption.textContent = key;
      const clone1 = newOption.cloneNode(true);
      const clone2 = newOption.cloneNode(true);
      fromList.appendChild(clone1);
      toList.appendChild(clone2);
    }
  });
  addMoreDataBtn.removeEventListener("click", addMoreData);
  addMoreDataBtn.remove();
}

// SUBMIT FUNCTIONALITY
function validateInputs() {
  const value = document.getElementById("inputValue").value;
  const fromUnit = document.getElementById("inputUnits").value;
  const toUnit = document.getElementById("outputUnits").value;

  if (!value) {
    alert("Please enter the value");
    return;
  }
  if (value <= 0) {
    alert("Value should be more than 0");
    return;
  }

  if (!toUnit) {
    alert("Please select the input unit");
    return;
  }

  if (!fromUnit) {
    alert("Please select the output unit");
    return;
  }
  const json = {
    "distance": { "unit": fromUnit, "value": value },
    "convert_to": toUnit,
  };
  convert(json);
}

function convert(json) {
  let value = (json.distance.value * conversionTable[json.distance.unit][`to_${json.convert_to}`]).toFixed(2);
  if (value) {
    parseResult(json, value)
  } else {
    alert("Something went wront. Try to change some params")
  }
}

function parseResult(json, value) {
  const requestedInput = document.getElementById("requestedInput");
  const requestedOutput = document.getElementById("requestedOutput");
  const humanOutput = document.getElementById("humanOutput");

  requestedInput.innerHTML = `<div>Requested Input: <span>${JSON.stringify(json)}</span></div>`;
  requestedOutput.innerHTML = `<div>Requested Output: <span>${JSON.stringify({"unit": json.convert_to, "value": value,})}</span></div>`;
  humanOutput.innerHTML = `<div>Human Readable Output: <span>${value} ${json.convert_to}</span></div>`;
}
