import domElements from './dom';
import {
  displayLoading, removeError, displayCurrentDay,
  displayForecast, changeBackground, changeForecastBackground,
  errorDivs,
} from './ui';
import { clearForm, unpackData, apiKeys } from './utilis';
import '../styles/styles.css';

let queryUrl;
let forecastLength = null;
let shouldConvert = false;
let locationValue;

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
      const weatherData = unpackData(response, shouldConvert);
      displayCurrentDay(weatherData.today, shouldConvert, locationValue);
      displayForecast(weatherData.forecast, shouldConvert, forecastLength);
      changeBackground(weatherData.today.icon);
      changeForecastBackground(weatherData.forecast, forecastLength);
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
  queryUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locationValue}?key=${apiKeys.weatherKey}`;
  forecastLength = Number(domElements.forecastInput.value) + 1;
  clearForm(dataConversionInput);
  getWeatherData();
}

domElements.submitBtn.addEventListener('click', getUserValues);
