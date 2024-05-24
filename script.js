document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://restcountries.com/v3.1/all';
    const countryList = document.getElementById('country-list');
    const searchInput = document.getElementById('search');
    const regionFilter = document.getElementById('region-filter');
    const darkModeToggle = document.getElementById('dark-mode');

    let countries = [];

    // Fetch countries from API
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            countries = data;
            displayCountries(countries);
        });

    // Display countries
    function displayCountries(countries) {
        countryList.innerHTML = '';
        countries.forEach(country => {
            const countryCard = document.createElement('div');
            countryCard.classList.add('country-card');
            countryCard.innerHTML = `
                <img src="${country.flags.png}" alt="${country.name.common}">
                <h3>${country.name.common}</h3>
                <p>Population: ${country.population.toLocaleString()}</p>
                <p>Region: ${country.region}</p>
                <p>Capital: ${country.capital ? country.capital[0] : 'N/A'}</p>
            `;
            countryCard.addEventListener('click', () => showCountryDetails(country));
            countryList.appendChild(countryCard);
        });
    }

    // Search for a country
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredCountries = countries.filter(country =>
            country.name.common.toLowerCase().includes(searchTerm)
        );
        displayCountries(filteredCountries);
    });

    // Filter by region
    regionFilter.addEventListener('change', (e) => {
        const region = e.target.value;
        const filteredCountries = region ? countries.filter(country => country.region === region) : countries;
        displayCountries(filteredCountries);
    });

    // Show country details
    function showCountryDetails(country) {
        const detailsPage = window.open('', '_blank');
        detailsPage.document.write(`
            <html>
                <head>
                    <title>${country.name.common}</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            padding: 20px;
                            background-color: #f0f0f0;
                            color: #111;
                        }
                        img {
                            width: 200px;
                            height: 120px;
                            object-fit: cover;
                            border-radius: 4px;
                        }
                        .borders {
                            display: flex;
                            flex-wrap: wrap;
                        }
                        .border {
                            margin: 10px;
                            padding: 10px;
                            background-color: #fff;
                            border-radius: 4px;
                            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                            cursor: pointer;
                        }
                    </style>
                </head>
                <body>
                    <h1>${country.name.common}</h1>
                    <img src="${country.flags.png}" alt="${country.name.common}">
                    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                    <p><strong>Region:</strong> ${country.region}</p>
                    <p><strong>Subregion:</strong> ${country.subregion}</p>
                    <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
                    <h3>Border Countries:</h3>
                    <div class="borders"></div>
                    <script>
                        const borders = ${JSON.stringify(country.borders || [])};
                        const borderContainer = document.querySelector('.borders');
                        borders.forEach(border => {
                            const borderDiv = document.createElement('div');
                            borderDiv.classList.add('border');
                            borderDiv.textContent = border;
                            borderDiv.addEventListener('click', () => {
                                window.location.href = 'https://restcountries.com/v3.1/alpha/' + border;
                            });
                            borderContainer.appendChild(borderDiv);
                        });
                    </script>
                </body>
            </html>
        `);

    }

    // Dark mode 
    darkModeToggle.addEventListener('change', (e) => {
        document.body.classList.toggle('dark-mode', e.target.checked);
    });
});
