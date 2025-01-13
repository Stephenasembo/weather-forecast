import domElements from './dom';
import { apiKeys, tempConversion } from './utilis';

const errorDivs = [];

function displayLoading() {
  domElements.todayDiv.innerHTML = '';
  domElements.forecastDiv.innerHTML = '';
  const div = document.createElement('div');
  div.textContent = 'Wait a moment while we load your data';
  domElements.weatherInfo.appendChild(div);
  div.classList.add('loading');
  errorDivs.push(div);
  return div;
}

function removeError(element) {
  domElements.weatherInfo.removeChild(element);
}

function displayCurrentDay(obj, convertTemp, location) {
  domElements.heading.textContent = `Displaying Weather Conditions For ${location}`;

  domElements.todayDiv.innerHTML = '';
  const newObj = obj;
  if (!newObj.precip) {
    newObj.precip = 0;
  }

  let symbol;
  if (convertTemp) {
    newObj.temp = tempConversion(obj.temp);
    symbol = '&deg;C';
  } else {
    symbol = '&deg;F';
  }

  domElements.todayDiv.innerHTML = `
  <div class = 'dataDiv'>
    <p>Today's weather condition is: ${obj.conditions}.</p>
    <p>The outlook is: ${obj.description}.</p>
    <p>Today's temperature is: ${obj.temp} ${symbol}.</p>
    <p>The cloud cover is: ${obj.cloudcover} %.</p>
    <p>The relative humidity is: ${obj.humidity} %.</p>
    <p>The visibility is: ${obj.visibility}</p>
    <p>The amount of precipitation fell or predicted to fall is: ${obj.precip}.</p>
    <p>The wind speed is: ${obj.windspeed} knots.</p>
  </div>`;

  // Only display snow for snowy areas
  if (obj.snow) {
    const snowPara = document.createElement('p');
    const dataDiv = document.querySelector('.dataDiv');
    snowPara.innerHTML = `The amount of snow fell or predicted to fall is ${obj.snow}.`;
    dataDiv.appendChild(snowPara);
  }
}

function displayForecast(arr, convertTemp, forecastDaysLength) {
  domElements.forecastDiv.innerHTML = '';
  const array = arr.slice(1, forecastDaysLength);
  array.forEach((day) => {
    const dayDiv = document.createElement('div');
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
    } = day;
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
    today.description = day.description;
    const date = day.datetime;
    if (!today.precip) {
      today.precip = 0;
    }
    let symbol;
    if (convertTemp) {
      symbol = '&deg;C';
    } else {
      symbol = '&deg;F';
    }
    dayDiv.innerHTML = `
      <p>${date}'s weather condition is: ${today.conditions}.</p>
      <p>The outlook is: ${today.description}.</p>
      <p>Today's temperature is: ${today.temp} ${symbol}.</p>
      <p>The cloud cover is: ${today.cloudcover} %.</p>
      <p>The relative humidity is: ${today.humidity} %.</p>
      <p>The visibility is: ${today.visibility}</p>
      <p>The amount of precipitation fell or predicted to fall is: ${today.precip}.</p>
      <p>The wind speed is: ${today.windspeed} knots.</p>`;
    // Only display snow for snowy areas
    if (today.snow) {
      const snowPara = document.createElement('p');
      snowPara.innerHTML = `The amount of snow fell or predicted to fall is: ${today.snow}.`;
      dayDiv.appendChild(snowPara);
    }
    domElements.forecastDiv.appendChild(dayDiv);
    dayDiv.classList.add('forecastDay');
  });
}

// Use a gif as background image
async function changeBackground(summary) {
  const backgroundImg = summary;
  const gifQuery = `https://api.giphy.com/v1/gifs/translate?api_key=${apiKeys.gifyKey}&s=${backgroundImg}`;
  try {
    let response = await fetch(gifQuery, { mode: 'cors' });
    if (response.ok) {
      response = await response.json();
      const imageUrl = response.data.images.original.url;
      const div = document.querySelector('.dataDiv');
      div.style.backgroundImage = `url(${imageUrl})`;
      div.style.backgroundSize = 'cover';
    }
  } catch (error) {
    console.log(error);
  }
}

async function changeForecastBackground(infoArr, forecastDaysLength) {
  let forecastDayDivs = document.querySelectorAll('.forecastDay');
  forecastDayDivs = Array.from(forecastDayDivs);
  const arr = infoArr.slice(1, forecastDaysLength);
  const imageUrlArr = [];

  let imageDiv = 0;
  arr.forEach((day) => {
    const gifQuery = `https://api.giphy.com/v1/gifs/translate?api_key=${apiKeys.gifyKey}&s=${day.icon}`;
    fetch(gifQuery, { mode: 'cors' })
      .then((responseResult) => {
        if (responseResult.ok) {
          responseResult.json()
            .then((responseData) => {
              const imageUrl = responseData.data.images.original.url;
              // imageUrlArr.push(imageUrl);
              forecastDayDivs[imageDiv].style.backgroundImage = `url(${imageUrl})`;
              forecastDayDivs[imageDiv].style.backgroundSize = 'cover';
              imageDiv += 1;
            });
        }
      });
  });

  for (let i = 0; i < imageUrlArr.length; i += 1) {
    forecastDayDivs[i].style.backgroundImage = `url(${imageUrlArr[i]})`;
    forecastDayDivs[i].style.backgroundSize = 'cover';
  }
}

export {
  displayLoading, removeError, displayCurrentDay,
  displayForecast, changeBackground, changeForecastBackground,
  errorDivs,
};
