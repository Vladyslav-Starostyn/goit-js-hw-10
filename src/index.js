import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';

const inputEl = document.getElementById('search-box');
const listEl = document.querySelector('.country-list');
const countryEl = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

inputEl.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(event) {
  const inputValue = event.target.value.trim();

  clearHtml();

  if (inputValue === '') {
    return;
  }
  const dataCountry = fetchCountries(inputValue);
  dataCountry
    .then(response => {
      if (response.length > 10) {
        Notify.info(
          `Too many matches found. Please enter a more specific name.`
        );
        return;
      }
      if (response.length <= 10 && response.length >= 2) {
        renderCardList(response);
      }
      if (response.length === 1) {
        renderCardCountry(response);
        return;
      }
    })
    .catch(error => console.log(error));
}

function renderCardList(countries) {
  const markup = countries
    .map(country => {
      return `<li class = "list-js"><img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="40" >
         <span class="country-name">${country.name.official}</span></li>`;
    })
    .join('');
  listEl.innerHTML = markup;
}

function renderCardCountry(countries) {
  const markup = countries
    .map(country => {
      return `<img src="${country.flags.svg}" alt="Flag of ${
        country.name.official
      }" width="40">
         <b>${country.name.official}</b></p>
            <p><b>Capital</b>: ${country.capital}</p>
            <p><b>Population</b>: ${country.population}</p>
            <p><b>Languages</b>: ${Object.values(country.languages)} </p>`;
    })
    .join('');
  countryEl.innerHTML = markup;
}

function clearHtml() {
  listEl.innerHTML = '';
  countryEl.innerHTML = '';
}
