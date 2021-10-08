import getCountry from './js/fetchCountries.js';
import refs from './js/refs.js';
const debounce = require('debounce');
import PNotify from '../node_modules/pnotify/dist/es/PNotify.js';
// import PNotify from 'node_modules/pnotify/dist/es/PNotify.js';

function hideElement() {
  refs.countryInfo.style.display = 'none';
  refs.countryList.style.display = 'none';
  removeEvent();
}

function getCountryFunc(name) {
  getCountry(name)
    .then(data => {
      if (data.length > 1) {
        setCountryList(data);
      } else {
        setCountryInfo(data[0]);
      }
    })
    .catch(error => {
      hideElement();
      setCountryNoneMes();
    });
}

function setCountryNoneMes() {
  PNotify.error({
    title: 'No information',
    text: 'Something terrible happened.',
  });
}

function setCountryList(data) {
  refs.countryList.style.display = 'block';
  const list = data.map(el => `<li>${el.name}</li>`);
  refs.countryList.innerHTML = list.join('');
  setEventCountry();
}

function setCountryInfo(data) {
  refs.countryInfo.style.display = 'block';
  refs.countryName.textContent = data.name;
  refs.countryCapital.textContent = data.capital;
  refs.countryPopulation.textContent = data.population;
  refs.countryLangList.innerHTML = data.languages.map(el => `<li>${el.name}</li>`).join('');
  refs.countryFlag.src = data.flag;
}

function onClickCountryItem(e) {
  refs.formEl.elements.countryName.value = e.target.textContent;
  getCountryFunc(e.target.textContent);
  hideElement();
}

function setEventCountry() {
  refs.countryList.addEventListener('click', onClickCountryItem);
}

function removeEvent() {
  refs.countryList.removeEventListener('click', onClickCountryItem);
}

function onInputCountry(e) {
  hideElement();
  if (e.target.value) getCountryFunc(e.target.value);
}

refs.formEl.elements.countryName.addEventListener('input', debounce(onInputCountry, 500));
