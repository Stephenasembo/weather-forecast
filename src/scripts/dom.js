export default (function cacheDomElements() {
  const locationInput = document.querySelector('input');
  const submitBtn = document.querySelector('#submitBtn');
  const todayDiv = document.querySelector('#today');
  const forecastDiv = document.querySelector('#forecast');
  const forecastInput = document.querySelector('#forecastLength');
  const weatherInfo = document.querySelector('#weatherInfo');
  const heading = document.querySelector('#heading');

  return {
    locationInput,
    submitBtn,
    todayDiv,
    forecastDiv,
    forecastInput,
    weatherInfo,
    heading,
  };
}());
