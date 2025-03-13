const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2502-FTB-ET-WEB-FT';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

const state = {
    players: [],
};

const playerList = document.querySelector("#playersList");
const addPlayerForm = document.querySelector("#playerForm");

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(`${APIURL}/players`);
        const json = await response.json();
        state.players = json.data.players;
        console.log(json.data.players);      
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
    return state.players;
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/players/${playerId}`);
        const json = await response.json();
        const player = json.data.player;

        playerList.innerHTML = `
            <div id="single-form">
            <h2>${player.name}</h2>
            <p>#${player.id}</p>
            <p>Breed: ${player.breed}</p>
            <img id="singleImg" src="${player.imageUrl}" alt="${player.name}">
            </div>
        `;

        const singleForm = document.getElementById("single-form");

        const backToPlayers = document.createElement("button");
        backToPlayers.textContent = "Back to all players";
        backToPlayers.addEventListener("click", async () => {
            await fetchAllPlayers();
            renderAllPlayers(playerList);
        });
        playerList.appendChild(backToPlayers);
        singleForm.appendChild(backToPlayers);

    } catch (err) {
        console.error(`Error fetching player details for ID #${playerId}`, err);
    }
};

const addNewPlayer = async (event, playerObj) => {
    event.preventDefault();
    
   const name = addPlayerForm.name.value;
   const breed = addPlayerForm.breed.value;
   const image = addPlayerForm.image.value;

    try {
        const response = await fetch(`${APIURL}/players`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({name, breed, imageUrl: image}),
          });
          const json = await response.json();
    
          if (json.error) {
            throw new Error(json.error.message);
          }
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
    addPlayerForm.reset();
};

addPlayerForm.addEventListener("submit", addNewPlayer);

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/players/${playerId}`, {
            method: "DELETE",
        });
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. √√
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player.  √√
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster.  √√
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {

        const playerCards = state.players.map((player) => {
            const playerCard = document.createElement("li");
            playerCard.innerHTML = `
                <h2 class="players">${player.name}</h2>
                <p class="players">#${player.id}</p>
                <img src="${player.imageUrl} " alt="${player.name}">    
            `;
            
            const seeDetailsButton = document.createElement("button");
                seeDetailsButton.textContent = "See Details";
                playerCard.append(seeDetailsButton);
                seeDetailsButton.addEventListener("click", () => fetchSinglePlayer(player.id));

            const removeButton = document.createElement("button");
                removeButton.textContent = "Remove from roster";
                playerCard.append(removeButton);
                removeButton.addEventListener("click", () => removePlayer(player.id));

            return playerCard;
            
        });
        playerList.replaceChildren(...playerCards);
}

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {
        const playerCards = state.players.map((player) => {
            const playerCard = document.createElement("li");
            playerCard.classList.add("player");
            playerCard.innerHTML = `
                <h2>${player.name}</h2>
                <p>${player.id}</p>
                <img src="${player.imageUrl}" alt"">
            `;

            const seeDetailsButton = document.createElement("button");
                seeDetailsButton.textContent = "See Details";
                playerCard.append(seeDetailsButton);
                seeDetailsButton.addEventListener("click", () => fetchSinglePlayer(player.id));

            const removeButton = document.createElement("button");
                removeButton.textContent = "Remove from roster";
                playerCard.append(removeButton);
                removeButton.addEventListener("click", () => removePlayer(player.id));

            return playerCard;
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
};

const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(playerList);

    renderNewPlayerForm();
}

init();