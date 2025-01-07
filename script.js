const locationInput = document.querySelector('input');
const submitBtn = document.querySelector('#submitBtn');
const image = document.querySelector('img');

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
  console.log(queryUrl);
}

submitBtn.addEventListener('click', getWeatherData);
async function getWeatherData() {
  try {
    let response = await fetch(queryUrl, {mode: 'cors'});
    if (response.ok) {
      response = await response.json();
      console.log(response)
      let weatherData = unpackData(response);
      console.log(weatherData);
      changeBackground(weatherData.today.icon);
    }
  }
  catch (err) {
    console.log(err)
  }
}

function unpackData(obj) {
  let today = {currentConditions} = obj.currentConditions;
  today.description = obj.description;
  let forecast = {nextDays} = obj.days;
  return {today, forecast};
}

async function changeBackground(summary) {
  let backgroundImg = summary;
  let gifQuery = `https://api.giphy.com/v1/gifs/translate?api_key=${gifyKey}&s=${backgroundImg}`;
  try {
    let response = await fetch(gifQuery, {mode: 'cors'});
    if (response.ok) {
      response = await response.json();
      console.log(response);  
      image.src = response.data.images.original.url;
      console.log(image.src);
    }
  }
  catch (error) {
    console.log(error);
  }
  
}