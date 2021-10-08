import getCountry from './js/fetchCountries.js';
import refs from './js/refs.js';
const debounce = require('debounce');

import { error, defaultModules } from '../node_modules/@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from '../node_modules/@pnotify/mobile/dist/PNotifyMobile.js';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import * as PNotifyCountdown from '@pnotify/countdown';

defaultModules.set(PNotifyMobile, { swipeDismiss: false });

function hideElement() {
  refs.countryInfo.style.display = 'none';
  refs.countryList.style.display = 'none';
  removeEvent();
}

function getCountryFunc(name) {
  getCountry(name)
    .then(data => {
      if (data.length > 10) {
        error({ title: 'Too many matches found.', text: 'Please entera morespecific query!' });
      } else if (data.length > 1) {
        setCountryList(data);
      } else {
        setCountryInfo(data[0]);
      }
    })
    .catch(() => {
      hideElement();
      error({ title: 'No information' });
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
