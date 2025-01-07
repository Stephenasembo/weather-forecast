const locationInput = document.querySelector('input');
const submitBtn = document.querySelector('#submitBtn');

let queryUrl;
let myKey = '28SUAPEDEBK3W6FMPLKTFMRFY';
let weatherData = null;

submitBtn.addEventListener('click', getLocation)
function getLocation() {
  let locationValue = locationInput.value;
  locationInput.value = '';
  if (!locationValue) {
    console.log('location can not be empty');
    return;
  }
  queryUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locationValue}?key=${myKey}`
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