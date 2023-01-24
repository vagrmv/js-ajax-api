// const API_URL = 'www.thecocktaildb.com/api/json/v1/1/search.php';
const API_URL = 'https://swapi.dev/api/people';
const input = document.getElementById('input');
const resultBox = document.getElementById('resultBox');
let peopleNamesAndURLs = [];

window.addEventListener('load', async () => {
    peopleNamesAndURLs = await loadNamesAndURLs();
});

input.addEventListener('input', (e) => {
    resultBox.innerHTML = null;
    const value = input.value;
    if (!value) {
        resultBox.classList.remove('active');
    } else {
        for (const person of peopleNamesAndURLs) {
            if (person.name.substr(0, value.length).toUpperCase() === value.toUpperCase()) {
                // TODO: добавить разделение на посещенные и нет
                resultBox.appendChild(createLinkElement(person));
            }
        }
        if (!resultBox.innerHTML) {
            resultBox.textContent = 'No matches found';
        }
        resultBox.classList.add('active');
    }
});

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
    return people;
}

function createLinkElement(person, isVisited = false) {
    const link = document.createElement('a');
    link.href = person.url;
    link.classList.add('search__link');
    if (isVisited) {
        link.classList.add('search__link_visited');
    }
    link.textContent = person.name;
    return link;
}
