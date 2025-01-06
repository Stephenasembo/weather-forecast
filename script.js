const locationInput = document.querySelector('input');
const submitBtn = document.querySelector('#submitBtn');

let locationValue = null;

submitBtn.addEventListener('click', getLocation)
function getLocation() {
  locationValue = locationInput.value;
  locationInput.value = '';
  if (!locationValue) {
    console.log('location can not be empty');
    return;
  }
}