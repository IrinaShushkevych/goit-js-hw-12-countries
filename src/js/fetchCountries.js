export default function fetchCountries(name) {
  return fetch(`https://restcountries.com/v2/name/${name}`)
    .then(response => {
      if (response.status !== 404) {
        return response.json();
      }
    })
    .catch(error => alert(error));
}
