const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2302-ACC-PT-WEB-PT-A';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;


// helper function to toggle player visibility
function togglePlayerListVisibility(displayVal,) {
    const playerElements = document.getElementsByClassName('player');
    for (const playerElement of playerElements) {
        playerElement.style.display = displayVal;
    }

    //also toggle the form
    newPlayerFormContainer.style.display = displayVal;
}

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(`${APIURL}players/`);
        const players = await response.json(); //a promise, not the actual data. The data needs to be extracted
        return players.data.players; //the actual player array in the promise object
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}players/${playerId}/`);
        const player = await response.json();
        return player.data.player; //the actual player in the promise object
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(`${APIURL}players/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(playerObj)
            });
        const newPlayer = await response.json();
        console.log(typeof (newPlayer))
        return newPlayer;
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

// the API does not allow patch requests
const updatePlayer = async (playerObj) => {
    try {
        const playerId = await playerObj.id;
        const response = await fetch(`${APIURL}players/${playerId}/`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(playerObj)
            });
        const updatedPlayer = await response.json();
        console.log(updatedPlayer);
        return updatedPlayer;
    } catch (err) {
        console.error('Oops, something went wrong with updating that player!', err);
    }
}

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}players/${playerId}/`,
            {
                method: 'DELETE'
            });
        const player = await response.json();
        //not supposed to return anything
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

//optional. get an array of all the players on a specific team
const fetchAllTeams = async () => {
    try {
        const response = await fetch(`${APIURL}teams/`);
        const teams = await response.json();
        return teams;
    } catch (err) {
        console.error(`'Oh no, trouble fetching teams!`, err);
    }
}

// render a single player by id
const renderSinglePlayerById = async (id) => {
    try {
        //fetch player details from server
        const player = await fetchSinglePlayer(id);

        //create a new HTML element to display player details
        const playerDetailsElememt = document.createElement('div');
        playerDetailsElememt.classList.add('player-details'); //for styling purposes
        playerDetailsElememt.innerHTML = `
            <h1>${player.name}</h1>
            <p><img src = ${player.imageUrl}></p>
            <p><strong>ID:</strong> ${player.id}</p>
            <p><strong>BREED:</strong> ${player.breed}</p>
            <p><strong>STATUS:</strong> ${player.status}</p>
            <p><strong>Created at:</strong> ${player.createdAt}</p>
            <p><strong>Updated at:</strong> ${player.updatedAt}</p>
            <p><strong>Team ID:</strong> ${player.teamId}</p>
            <p><strong>Cohort ID:</strong> ${player.cohortId}</p>
            <button class="close-button">Close</button>
        `;

        playerContainer.appendChild(playerDetailsElememt);

        // add event listener to close button
        const closeButton = playerDetailsElememt.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            playerDetailsElememt.remove();
            togglePlayerListVisibility('flex');
        });
    } catch (err) {
        console.error(`Uh oh, trouble rendering player #${playerId}!`, err);
    }
}

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = async (playerList) => {
    try {
        //   console.log(playerList);
        playerContainer.innerHTML = '';
        playerList.forEach((player) => {
            const playerElement = document.createElement('div');
            playerElement.classList.add('player'); //class for styling purposes
            playerElement.innerHTML = `
            <h1>${player.name}</h1>
            <p><img src = ${player.imageUrl}></p>
            <p><strong>ID:</strong> ${player.id}</p>
            <p><strong>Breed:</strong> ${player.breed}</p>
            <p><strong>Status:</strong> ${player.status}</p>
            <p><strong>Created at:</strong> ${player.createdAt}</p>
            <p><strong>Updated at:</strong> ${player.updatedAt}</p>
            <p><strong>Team ID:</strong> ${player.teamId}</p>
            <p><strong>Cohort ID:</strong> ${player.cohortId}</p>
            <button class="details-button" data-id="${player.id}">See details</button>
            <button class="edit-button" data-id="${player.id}">Edit player</button>
            <button class="delete-button" data-id="${player.id}">Remove from roster</button>
            `;

            playerContainer.appendChild(playerElement);

            //see details
            const detailsButton = playerElement.querySelector('.details-button');
            detailsButton.addEventListener('click', async (event) => {
                //hide the list of players (to create a clean slate for a detailed player to show)
                togglePlayerListVisibility('none');

                //show the details of the player clicked
                renderSinglePlayerById(event.target.dataset.id);
            });

            //edit player
            const editButton = playerElement.querySelector('.edit-button');
            editButton.addEventListener('click', async (event) => {
                togglePlayerListVisibility('none');
                renderUpdatedPlayerForm(event.target.dataset.id);
            })

            //delete player
            const deleteButton = playerElement.querySelector('.delete-button');
            deleteButton.addEventListener('click', async (event) => {
                //refresh the page to show the remaining players after the deletion event
                await removePlayer(event.target.dataset.id);
                await window.location.reload();
            });
        });
        return playerContainer;
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = async () => {
    try {
        //createdAt and updatedAt should be created by the app, not the user. exclude them from the form
        let form = `
        <form>
            <label>Name: </label><input type="text" name="name" placeholder="required" required><br><br>
            <label>Breed: </label><input type="text" name="breed" placeholder="required" required><br><br>
            <label>Status: </label><select name="status">
                <option value="bench">bench</option>
                <option value="field">field</option>
            </select><br><br>
            <label>ImageUrl: </label><input type="url" name="imageUrl" placeholder="optional"><br><br>
            <label>TeamId: </label><input type="number" name="teamId" placeholder="optional"><br><br>
            <input type="submit" value="Add new Player">
        </form>
        `
        newPlayerFormContainer.innerHTML = form;

        //https://betterprogramming.pub/click-vs-submit-eventlisteners-536b62be9359
        //for submit events add the eventlistener to the entire form
        newPlayerFormContainer.addEventListener('submit', async (event) => {
            event.preventDefault();
            const name = document.getElementsByName('name')[0].value;
            const breed = document.getElementsByName('breed')[0].value;
            const status = document.getElementsByName('status')[0].value;
            const imageUrl = document.getElementsByName('imageUrl')[0].value;
            const teamId = document.getElementsByName('teamId')[0].value;

            const newPlayer = {
                name,
                breed,
                status,
                imageUrl,
                teamId,
            }

            //don't pass in unacceptable/empty values for optional inputs or the post will fail
            if (imageUrl === '')
                delete newPlayer.imageUrl;
            if (teamId === '')
                delete newPlayer.teamId;

            debugger;
            await addNewPlayer(newPlayer);
            console.log(newPlayer);
            await window.location.reload();
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}

//show a form that looks like player details that allows the user to update existing data if the edit button is pressed
const renderUpdatedPlayerForm = async (id) => {
    try {
        //fetch player details from server
        const player = await fetchSinglePlayer(id);

        //create a form that contains all of the player's current data
        const playerEditElement = document.createElement('div');
        playerEditElement.classList.add('player-edit');
        playerEditElement.innerHTML = `
        <form>
            <label>Name: </label><input type="text" name="name" value="${player.name}" required><br><br>
            <label>Breed: </label><input type="text" name="breed" value="${player.breed}" required><br><br>
            <label>Status: </label><select name="status">
                <option selected="${player.status}">${player.status}</option>
                <option value="bench">bench</option>
                <option value="field">field</option>
            </select><br><br>
            <label>ImageUrl: </label><input type="url" name="imageUrl" value="${player.imageUrl}"><br><br>
            <label>TeamId: </label><input type="number" name="teamId" value="${player.teamId}"><br><br>
            <input type="submit" value="Save">
        </form>
        <button class="cancel-button">Cancel</button>
        `;

        playerContainer.appendChild(playerEditElement);

        playerEditElement.addEventListener('submit', async (event) => {
            event.preventDefault();
            const name = document.getElementsByName('name')[0].value;
            const id = document.getElementsByName('id')[0].value;
            const breed = document.getElementsByName('breed')[0].value;
            const status = document.getElementsByName('status')[0].value;
            const imageUrl = document.getElementsByName('imageUrl')[0].value;
            const createdAt = document.getElementsByName('name')[0].value;

            //updatedAt should be created by the app
            const updatedAt = new Date().getTime();

            const teamId = document.getElementsByName('teamId')[0].value;
            const cohortId = document.getElementsByName('cohortId')[0].value;

            const updatedPlayer = {
                name,
                breed,
                status,
                imageUrl,
                teamId,
            }

            //don't pass in unacceptable/empty values for optional inputs or the post will fail
            if (imageUrl === '')
                delete upadtedPlayer.imageUrl;
            if (teamId === '')
                delete updatedPlayer.teamId;

            await updatePlayer(updatedPlayer);
            await window.location.reload();
        });

        // add event listener to cancel button
        const cancelButton = playerEditElement.querySelector('.cancel-button');
        cancelButton.addEventListener('click', () => {
            playerEditElement.remove();
            togglePlayerListVisibility('flex');
        });
    } catch (err) {
        console.error(`Uh oh, trouble editing player #${playerId}!`, err);
    }
}

const init = async () => {
    const players = await fetchAllPlayers();
    //console.log(players);
    //console.log(typeof(players));
    //console.log(Array.isArray(players));
    renderAllPlayers(players);

    renderNewPlayerForm();
}

init();

module.exports = {
    /*   togglePlayerListVisibility,
       fetchAllPlayers,
       fetchSinglePlayer,
       addNewPlayer,
       updatePlayer,
       removePlayer,
       fetchAllTeams,
       renderSinglePlayerById,
       renderAllPlayers,
       renderNewPlayerForm,
       renderUpdatedPlayerForm,
       init,
       playerContainer,
       newPlayerFormContainer,*/
    cohortName,
    APIURL
};