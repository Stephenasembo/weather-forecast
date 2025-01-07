const locationInput = document.querySelector('input');
const submitBtn = document.querySelector('#submitBtn');
const todayDiv = document.querySelector('#today');
const forecastDiv = document.querySelector('#forecast');
const forecastInput = document.querySelector('#forecastLength');
const weatherInfo = document.querySelector('#weatherInfo');

let queryUrl;
let weatherKey = '28SUAPEDEBK3W6FMPLKTFMRFY';
let gifyKey = '7uCiKGp7r7hEKsspvlhqflcCvrQHKFis';
let weatherData = null;
let forecastLength = null;

submitBtn.addEventListener('click', getLocation)
function getLocation() {
  let locationValue = locationInput.value;
  locationInput.value = '';
  if (!locationValue) {
    console.log('location can not be empty');
    return;
  }
  queryUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locationValue}?key=${weatherKey}`;
  forecastLength = Number(forecastInput.value) + 1;
}

submitBtn.addEventListener('click', getWeatherData);
async function getWeatherData() {
  let loadingDiv;
  try {
    loadingDiv = displayLoading();
    let response = await fetch(queryUrl, {mode: 'cors'});
    if (response.ok) {
      weatherInfo.removeChild(loadingDiv);
      response = await response.json();
      console.log(response)
      let weatherData = unpackData(response);
      displayInfo(weatherData.today);
      displayForecast(weatherData.forecast);
      changeBackground(weatherData.today.icon);
      changeForecastBackground(weatherData.forecast);
    }
    else {
      loadingDiv.textContent = 'Oops an error occured!';
    }
  }
  catch (err) {
    console.log(err);
    loadingDiv.textContent = 'Oops an error occured!';
  }
}

// Retrieve the essential weather data
function unpackData(obj) {
  let {temp, conditions, cloudcover, feelslike, humidity, icon, visibility, windspeed, precip, snow} = obj.currentConditions;
  let today = {temp, conditions, cloudcover, feelslike, humidity, icon, visibility, windspeed, precip, snow};
  today.description = obj.description;

  let forecast = obj.days;
  return {today, forecast};
}

// Use a gif as background image
async function changeBackground(summary) {
  let backgroundImg = summary;
  let gifQuery = `https://api.giphy.com/v1/gifs/translate?api_key=${gifyKey}&s=${backgroundImg}`;
  try {
    let response = await fetch(gifQuery, {mode: 'cors'});
    if (response.ok) {
      response = await response.json();
      console.log(response);  
      let imageUrl = response.data.images.original.url;
      todayDiv.style.backgroundImage = `url(${imageUrl})`;
      todayDiv.style.backgroundSize = 'cover';
    }
  }
  catch (error) {
    console.log(error);
  }
  
}

async function changeForecastBackground(infoArr) {
  let forecastDayDivs = document.querySelectorAll('.forecastDay');
  forecastDayDivs = Array.from(forecastDayDivs);
  let arr = infoArr.slice(1, forecastLength);
  console.log(arr);
  let imageUrlArr = [];
  for (let day of arr) {
    let gifQuery = `https://api.giphy.com/v1/gifs/translate?api_key=${gifyKey}&s=${day.icon}`;
    let response = await fetch(gifQuery, {mode: 'cors'});
    if (response.ok) {
      response = await response.json();
      let imageUrl = response.data.images.original.url;
      imageUrlArr.push(imageUrl);
    }
  }

  for (let i = 0; i < imageUrlArr.length; i++) {
    forecastDayDivs[i].style.backgroundImage = `url(${imageUrlArr[i]})`;
    forecastDayDivs[i].style.backgroundSize = 'cover';
  }
}

function displayInfo(obj) {
  let heading = document.createElement('h2');
  heading.textContent = `Displaying Weather Conditions For ${locationValue}`;
  weatherInfo.appendChild(heading);
  
  const divInfo = document.querySelector('#today');
  divInfo.innerHTML = '';
  if (!obj.precip) {
    obj.precip = 0;
  }
  divInfo.innerHTML = `
  <div class = 'dataDiv'>
    <p>Today's weather condition is: ${obj.conditions}.</p>
    <p>The outlook is: ${obj.description}.</p>
    <p>Today's temperature is: ${obj.temp} F.</p>
    <p>The cloud cover is: ${obj.cloudcover} %.</p>
    <p>The relative humidity is: ${obj.humidity} %.</p>
    <p>The visibility is: ${obj.visibility}</p>
    <p>The amount of precipitation fell or predicted to fall is: ${obj.precip}.</p>
    <p>The wind speed is: ${obj.windspeed} knots.</p>
  </div>`;

  // Only display snow for snowy areas
  if (obj.snow){
      const snowPara = document.createElement('p');
      const dataDiv = document.querySelector('.dataDiv');
      snowPara.innerHTML = `The amount of snow fell or predicted to fall is ${obj.snow}.`;
      dataDiv.appendChild(snowPara);
  }
}

function displayForecast(arr) {
  forecastDiv.innerHTML = '';
  let array = arr.slice(1, forecastLength);
  console.log(array);
  for (let day of array) {
    const dayDiv = document.createElement('div');
    let {temp, conditions, cloudcover, feelslike, humidity, icon, visibility, windspeed, precip, snow} = day;
    let today = {temp, conditions, cloudcover, feelslike, humidity, icon, visibility, windspeed, precip, snow};
    today.description = day.description;

    let date = day.datetime;
    if (!today.precip) {
      today.precip = 0;
    }
    dayDiv.innerHTML = `
    <div class = 'forecastDay'>
      <p>${date}'s weather condition is: ${today.conditions}.</p>
      <p>The outlook is: ${today.description}.</p>
      <p>Today's temperature is: ${today.temp} F.</p>
      <p>The cloud cover is: ${today.cloudcover} %.</p>
      <p>The relative humidity is: ${today.humidity} %.</p>
      <p>The visibility is: ${today.visibility}</p>
      <p>The amount of precipitation fell or predicted to fall is: ${today.precip}.</p>
      <p>The wind speed is: ${today.windspeed} knots.</p>
    </div>`;
  
    // Only display snow for snowy areas
    if (today.snow){
      const parentDiv = document.querySelector('.forecastDay')
      const snowPara = document.createElement('p');
      snowPara.innerHTML = `<p>The amount of snow fell or predicted to fall is: ${today.snow}.</p>`;
      parentDiv.appendChild(snowPara);
    }  
    forecastDiv.appendChild(dayDiv);
  }
}

function displayLoading() {
  todayDiv.innerHTML = '';
  forecastDiv.innerHTML = '';
  const div = document.createElement('div');
  div.textContent = 'Wait a moment while we load your data';
  weatherInfo.appendChild(div);
  div.classList.add('loading');
  return div;
}