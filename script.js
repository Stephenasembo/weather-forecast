const locationInput = document.querySelector('input');
const submitBtn = document.querySelector('#submitBtn');
const todayDiv = document.querySelector('#today');

let queryUrl;
let weatherKey = '28SUAPEDEBK3W6FMPLKTFMRFY';
let gifyKey = '7uCiKGp7r7hEKsspvlhqflcCvrQHKFis';
let weatherData = null;

submitBtn.addEventListener('click', getLocation)
function getLocation() {
  let locationValue = locationInput.value;
  locationInput.value = '';
  if (!locationValue) {
    console.log('location can not be empty');
    return;
  }
  queryUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locationValue}?key=${weatherKey}`
}

submitBtn.addEventListener('click', getWeatherData);
async function getWeatherData() {
  try {
    let response = await fetch(queryUrl, {mode: 'cors'});
    if (response.ok) {
      response = await response.json();
      console.log(response)
      let weatherData = unpackData(response);
      displayInfo(weatherData.today);
      changeBackground(weatherData.today.icon);
    }
  }
  catch (err) {
    console.log(err)
  }
}

// Retrieve the essential weather data
function unpackData(obj) {
  let {temp, conditions, cloudcover, feelslike, humidity, icon, visibility, windspeed, precip, snow} = obj.currentConditions;
  let today = {temp, conditions, cloudcover, feelslike, humidity, icon, visibility, windspeed, precip, snow};
  today.description = obj.description;

  let forecast = {nextDays} = obj.days;
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
    }
  }
  catch (error) {
    console.log(error);
  }
  
}

function displayInfo(obj) {
  const divInfo = document.querySelector('#today');
  for (let condition in obj){
    divInfo.textContent += obj[condition] + ' ';
  }
}