import domElements from './dom';
import {
  displayLoading, removeError, displayCurrentDay,
  displayForecast, changeBackground, changeForecastBackground,
} from './ui';

let queryUrl;
const weatherKey = '28SUAPEDEBK3W6FMPLKTFMRFY';
const gifyKey = '7uCiKGp7r7hEKsspvlhqflcCvrQHKFis';
let forecastLength = null;
let shouldConvert = false;
let locationValue;

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

async function getWeatherData() {
  let loadingDiv;
  try {
    loadingDiv = displayLoading();
    let response = await fetch(queryUrl, { mode: 'cors' });
    if (response.ok) {
      errorDivs.forEach((div) => {
        removeError(div);
      });
      response = await response.json();
      const weatherData = unpackData(response);
      displayCurrentDay(weatherData.today);
      displayForecast(weatherData.forecast);
      changeBackground(weatherData.today.icon);
      changeForecastBackground(weatherData.forecast);
    } else if (response.status === 400) {
      loadingDiv.textContent = `Oops an error occured!
      Location entered may be invalid.`;
    } else {
      loadingDiv.textContent = 'Oops an error occured!';
    }
  } catch (err) {
    loadingDiv.textContent = 'Oops an error occured!';
  }
}

function getUserValues(event) {
  event.preventDefault();
  const dataConversionInput = document.querySelector(
    'input[type="checkbox"]:checked',
  );

  if (dataConversionInput) {
    shouldConvert = true;
  }
  locationValue = domElements.locationInput.value;
  if (!locationValue) {
    const error = displayLoading();
    error.textContent = 'Oops an error occured location can not be empty!';
    return;
  }
  if (domElements.forecastInput.value < 0 || domElements.forecastInput.value > 14) {
    const error = displayLoading();
    error.textContent = 'Oops an error occured! Minimum days for forecast is 0 and maximum is 15!';
    return;
  }
  queryUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locationValue}?key=${weatherKey}`;
  forecastLength = Number(domElements.forecastInput.value) + 1;
  clearForm(dataConversionInput);
  getWeatherData();
}

domElements.submitBtn.addEventListener('click', getUserValues);
