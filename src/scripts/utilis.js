import domElements from './dom';

function clearForm(checkbox) {
  domElements.locationInput.value = '';
  domElements.forecastInput.value = '';
  const checkboxInput = checkbox;
  if (checkboxInput) {
    checkboxInput.checked = false;
  }
}

function tempConversion(temperature) {
  return ((temperature - 32) * 5) / 9;
}

// Retrieve the essential weather data
function unpackData(obj) {
  const {
    temp,
    conditions,
    cloudcover,
    feelslike,
    humidity,
    icon,
    visibility,
    windspeed,
    precip,
    snow,
  } = obj.currentConditions;
  const today = {
    temp,
    conditions,
    cloudcover,
    feelslike,
    humidity,
    icon,
    visibility,
    windspeed,
    precip,
    snow,
  };
  today.description = obj.description;

  if (shouldConvert) {
    today.temp = tempConversion(today.temp);
  }
  const forecast = obj.days;
  return { today, forecast };
}

export { clearForm, tempConversion };
