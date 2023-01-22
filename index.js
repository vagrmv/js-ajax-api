// const API_URL = 'www.thecocktaildb.com/api/json/v1/1/search.php';
const API_URL = 'https://swapi.dev/api/people';

async function loadData(url) {
    const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
    });

    if (response.ok) {
        return response.json();
    }

    const error = {
        status: response.status,
        customError: 'something went wrong in loadData()',
    };
    throw error;
}

async function loadNamesAndURLs() {
    const people = [];
    const loadPromises = [];
    try {
        for (let i = 1; i < 10; i++) {
            const url = `${API_URL}/?page=${i}`;
            loadPromises.push(loadData(url));
        }
        await Promise.all(loadPromises).then((values) => {
            values.forEach((value) => {
                value.results.forEach((person) => {
                    people.push({
                        name: person.name,
                        url: person.url,
                    });
                });
            });
        });
    } catch (error) {
        throw error;
    }
    return people
}
