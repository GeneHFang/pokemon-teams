/*URLs for Rails requests*/
const BASE_URL = "http://localhost:3000";
const TRAINERS_URL = `${BASE_URL}/trainers`;
const POKEMONS_URL = `${BASE_URL}/pokemons`;

/*Reference to main element*/
let mainBody = document.querySelector('main');

/*Initial population of trainer/pokemon data*/ 
fetch(TRAINERS_URL)
      .then(resp => resp.json())
      .then(data => {
        // console.log(data);
        data.forEach(function(dat){
            //append each pokemon as list element 
            let pokemon = "";
            dat.pokemons.forEach(function(poke){
                pokemon += `<li>${poke.nickname} (${poke.species}) <button class="release" data-pokemon-id="${poke.id}">Release</button></li>\n`;
            }); 
            
            //innerHTML to be added to div element
            let inner = `<p>${dat.name}</p>
                <button class="addPoke" data-trainer-id="${dat.id}">Add Pokemon</button>
                <ul>${pokemon}</ul>`;

            //Div element that holds individual trainer and their pokemon info
            let x = document.createElement('DIV');
            x.setAttribute('class', 'card');
            x.setAttribute('data-id',`${dat.id}`);
            x.innerHTML = inner;

            //Append each div to main element
            mainBody.appendChild(x);
        })
    });

/*Helper method for updating DOM to reflect adding of new pokemon*/
function addPokemon(jsonData){
    // console.log(jsonData.trainer_id)
    let div = document.querySelector(`[data-id="${jsonData.trainer_id}"]`);
    // console.log(div);
    if (div.querySelectorAll('li').length >= 6){
        return;
    }
    else{
        div.querySelector('ul').innerHTML += `<li>${jsonData.nickname} (${jsonData.species}) <button class="release" data-pokemon-id="${jsonData.id}">Release</button></li>\n`
    }
}

/*Helper method for updating DOM to reflect removal of a pokemon */
function removePokemon(jsonData){
    // console.log(jsonData);
    document.querySelector(`[data-pokemon-id="${jsonData.id}"]`).parentElement.remove();
}

/*Event delegation for adding/removing pokemon */
document.addEventListener('click', (e) => {
    //Adding a pokemon
    if (e.target.className === "addPoke")
    {
        //Fetch configuration
        let ID = parseInt(e.target.parentElement.dataset.id);
        let addConfig = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              'trainer_id': ID
            })
        }

        //POST request to backend
        fetch(POKEMONS_URL, addConfig)
            .then(resp => resp.json())
            .then(json => {
                //console.log(json)
                addPokemon(json);
            }).catch(error =>{
                alert("Release a pokemon before adding more!");
            });
        // console.log("add");
    }
    //Remove (release) pokemon
    else if (e.target.className === "release")
    {
        //Fetch configuration
        let ID  = parseInt(e.target.dataset.pokemonId);
        let delConfig = {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            }
        }

        //DELETE request to backend
        fetch(`${POKEMONS_URL}/${ID}`, delConfig)
            .then(resp => resp.json())
            .then(json => {
                //console.log(json);
                removePokemon(json);
            })
        // console.log("release");
    }
})
