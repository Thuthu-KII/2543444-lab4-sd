const urlSeachAPI = "https://restcountries.com/v3.1/name/";  //ill add on the counbtry name at the end
const form = document.getElementById("Search")
const userInputForm = document.getElementById("countryIn");
const countryInfoSec = document.getElementById("country-info");
const borderInfoSec = document.getElementById("bordering-countries");
//const button = document.getElementById("button");



function getCountryInfo(url) {
    fetch(url)
    .then(response => response.json())
    .then(function(data) {
        console.log(data[0].borders)
        const country = data[0];
        
        const capital = country.capital ? country.capital[0] : 'No capital found';
        const population = country.population;
        const region = country.region;
        const flag = country.flags.svg;
        const countryName = country.name.common;

        countryInfoSec.innerHTML = `
            <h2>${countryName}</h2>
            <p><strong>Capital:</strong> ${capital}</p>
            <p><strong>Population:</strong> ${population}</p>
            <p><strong>Region:</strong> ${region}</p>
            <p><strong>Flag:</p>
            </strong> <img src="${flag}" alt="Flag of ${countryName}" width="400">
        `;

        if (country.borders && country.borders.length > 0) { //check if the country jas borders
            const borderCountryPromises = country.borders.map(borderCode => {
                return fetch(`https://restcountries.com/v3.1/alpha/${borderCode}`)
                    .then(response => response.json())
                    .then(data => ({
                        name: data[0].name.common, 
                        flag: data[0].flags.svg    
                    }));
            });

            Promise.all(borderCountryPromises)
                .then(borderCountries => {
                    const bordersHtml = borderCountries.map(borderCountry => {
                        return `
                            <div>
                                <p>${borderCountry.name}</p>
                                <img src="${borderCountry.flag}" alt="Flag of ${borderCountry.name}" width="400">
                            </div>
                        `;
                    }).join('');

                    borderInfoSec.innerHTML = `
                        <h3>Bordering Countries:</h3>
                        ${bordersHtml}
                    `;
                })
                .catch(error => {
                    console.error('Error fetching bordering country data:', error);
                    borderInfoSec.innerHTML = `<p>Unable to fetch bordering countries' flags.</p>`;
                });
        } else {
            borderInfoSec.innerHTML = `<p>Country does not have bordering countries.</p>`;
        }
    })
    .catch(error => {
        console.error('Error fetching country data:', error);
        countryInfoSec.innerHTML = `<p>Sorry, no data found for that country.</p>`;
    });
}



form.addEventListener("submit", (event) => {
    event.preventDefault();

    const countrySearch = userInputForm.value;

    if (countrySearch){ //checks if the input is empty or not 
        getCountryInfo(urlSeachAPI + countrySearch);
        //userInputForm.value = "";
    }

  });
