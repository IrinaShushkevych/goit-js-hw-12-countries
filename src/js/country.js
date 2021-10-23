import { APICountry } from './fetchCountries';
const debounce = require('debounce');
import { error, defaultModules } from '../../node_modules/@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from '../../node_modules/@pnotify/mobile/dist/PNotifyMobile.js';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import * as PNotifyCountdown from '@pnotify/countdown';

defaultModules.set(PNotifyMobile, { swipeDismiss: false });

export class Country {
  constructor(refs) {
    this.refs = refs;
    this.apiCountry = new APICountry();
  }

  init = () => {
    this.refs.formEl.elements.countryName.addEventListener(
      'input',
      debounce(this.onInputCountry, 500),
    );
  };

  getCountryFunc = name => {
    this.apiCountry
      .fetchCountry(name)
      .then(data => {
        if (data.length > 10) {
          error({ title: 'Too many matches found.', text: 'Please entera morespecific query!' });
        } else if (data.length > 1) {
          this.setCountryList(data);
          console.log(data);
        } else {
          this.setCountryInfo(data[0]);
        }
      })
      .catch(() => {
        this.hideElement();
        error({ title: 'No information' });
      });
  };

  hideElement = () => {
    this.refs.countryInfo.style.display = 'none';
    this.refs.countryList.style.display = 'none';
    this.removeEvent();
  };

  setCountryList = data => {
    this.refs.countryList.style.display = 'block';
    const list = data.map(
      el => `<li><img src="${el.flag}" width="40px" class="img-small" >${el.name}</li>`,
    );
    this.refs.countryList.innerHTML = list.join('');
    this.setEventCountry();
  };

  setCountryInfo = data => {
    this.refs.countryInfo.style.display = 'block';
    this.refs.countryName.textContent = data.name;
    this.refs.countryCapital.textContent = data.capital;
    this.refs.countryPopulation.textContent = data.population;
    this.refs.countryLangList.innerHTML = data.languages.map(el => `<li>${el.name}</li>`).join('');
    this.refs.countryFlag.src = data.flag;
  };

  onClickCountryItem = e => {
    this.refs.formEl.elements.countryName.value = e.target.textContent;
    this.getCountryFunc(e.target.textContent);
    this.hideElement();
  };

  setEventCountry = () => {
    this.refs.countryList.addEventListener('click', this.onClickCountryItem);
  };

  removeEvent = () => {
    this.refs.countryList.removeEventListener('click', this.onClickCountryItem);
  };

  onInputCountry = e => {
    this.hideElement();
    if (e.target.value) this.getCountryFunc(e.target.value);
  };
}
