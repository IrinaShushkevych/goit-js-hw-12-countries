export class APICountry {
  constructor() {
    this.baseUrl = 'https://restcountries.com/v2';
  }

  fetchCountry = name => {
    return fetch(`${this.baseUrl}/name/${name}`).then(response => {
      if (response.status !== 404) {
        return response.json();
      }
    });
  };
}
