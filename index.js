// const API_URL = 'www.thecocktaildb.com/api/json/v1/1/search.php';
const API_URL = 'https://swapi.dev/api/people';

// В данном случае ключи написаны не в camelCase т.к. далее они будут использованы как ключи json полей ответа api
const featuresToLoad = {
    name: 'Name:',
    gender: 'Gender',
    // eslint-disable-next-line camelcase
    birth_year: 'Birth year:',
    height: 'Height:',
    mass: 'Mass:',
    // eslint-disable-next-line camelcase
    hair_color: 'Hair color:',
    // eslint-disable-next-line camelcase
    skin_color: 'Skin color:',
    // eslint-disable-next-line camelcase
    eye_color: 'Eye color:',
};
const input = document.getElementById('input');
const resultBox = document.getElementById('resultBox');
const character = document.getElementById('character');
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
    link.addEventListener('click', suggestionClickHandler);
    return link;
}

async function suggestionClickHandler(e) {
    e.preventDefault();
    input.value = null;
    resultBox.innerHTML = null;
    resultBox.classList.remove('active');
    createChracterInnerHTML(await loadPersonData(e.target.href));
}

async function loadPersonData(url) {
    const data = await loadData(url);
    const features = [];
    for (const feature of Object.keys(featuresToLoad)) {
        if (data[feature] !== 'n/a') {
            features.push([featuresToLoad[feature], data[feature]]);
        }
    }
    return features;
}

function createChracterInnerHTML(characterFeatures) {
    character.innerHTML = null;

    const heading = document.createElement('h2');
    heading.classList.add('heading');
    heading.textContent = 'Result';

    const divider = document.createElement('hr');
    divider.classList.add('divider');

    character.appendChild(heading);
    character.appendChild(divider);

    for (const feature of characterFeatures) {
        const featureContainer = document.createElement('div');
        featureContainer.classList.add('character__feature');

        const featureName = document.createElement('h4');
        featureName.classList.add('character__feature-name');
        featureName.textContent = feature[0];

        const featureValue = document.createElement('p');
        featureValue.classList.add('character__feature-value');
        featureValue.textContent = feature[1];

        featureContainer.appendChild(featureName);
        featureContainer.appendChild(featureValue);

        character.appendChild(featureContainer);
    }
}
