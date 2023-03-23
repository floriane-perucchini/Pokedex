const pokemons = {
  async init(){
    const randomPok = pokemons.getRandomPokemon();
  },
  apiEndPoint : 'https://pokeapi.co/api/v2/',
  addListener(){
    const openModalButtons = document.querySelectorAll('.open-modal');
    for(const button of openModalButtons){
      button.addEventListener('click', pokemons.openModal)
    };

    const modal = document.querySelector('.modal-container')
    const closeButtons = modal.querySelectorAll('.close-modal');
    for(const close of closeButtons){
      close.addEventListener('click', pokemons.closeModal);
    }
  },
  async getAllPokemon(){
    try{
      const response = await fetch(`${pokemons.apiEndPoint}pokemon?limit=150`)
      const body = await response.json();
      if (response.ok) {
        return body;
      } else {
        throw new Error(body.message);
      }
    }catch(error){
      alert('Ne fonctionne pas');
      console.log(error)
    }
  },
  async getOnePokemon(id){
    try {
      const response = await fetch(`${pokemons.apiEndPoint}pokemon-form/${id}`);
      const body = await response.json();
      if (response.ok) {
        pokemons.addToDOMPokemon(body);
        pokemons.addToDOMTypes(body)
        return body;
      } else {
        throw new Error(body.message);
      }
    } catch (error) {
      alert('Ne fonctionne pas');
      console.log(error)
    }
    
  },
  getRandomNumber(nbOfPokemon){
    const randomNumber = Math.floor(Math.random() * (nbOfPokemon - 1 +1)) + 1;
    return randomNumber;
  },
  getRandomPokemon(){
    for (let i = 0; i < 5; i++){
      const pokemonId = pokemons.getRandomNumber(150);
        pokemons.getOnePokemon(pokemonId);
    }
  },
  addToDOMPokemon(body){
    const cardTemplate = document.querySelector('#pokemon-card');
    const cardClone = document.importNode(cardTemplate.content, true);
    const name = cardClone.querySelector('h3');
    name.textContent = body.name;
    const imageFront = cardClone.querySelector('.visible');
    imageFront.src = body.sprites.front_default;
    const imageBack = cardClone.querySelector('.invisible');
    imageBack.src = body.sprites.back_default;
    imageFront.setAttribute('alt', `${body.name}`)
    imageBack.setAttribute('alt', `${body.name}`)
    const id = cardClone.querySelector('.pokemon-card-id');
    id.setAttribute('data-pokemon-id', body.id);
    console.log('card', body.id)

    const addCard = document.querySelector('.discover-pokemon-container');
    addCard.appendChild(cardClone);
    pokemons.addListener();
    imageFront.addEventListener("mouseover", pokemons.seeBackImage)
    imageBack.addEventListener("mouseleave", pokemons.seeFrontImage)
    
    
  },
  addToDOMTypes(body){
    for (let i = 0; i < body.types.length; i++){
      const typeTemplate = document.querySelector('#type-sticker')
      const typeClone = document.importNode(typeTemplate.content, true);
      const types  = typeClone.querySelector('.type-name-card');
      const input = typeClone.querySelector('.pokemon-type-id');
      input.setAttribute('data-pokemon-id', body.id);

      types.textContent = body.types[i].type.name;
      types.classList.add(`${body.types[i].type.name}`)
      console.log(body.types[i].type.name)
      const addTypes = document.querySelector(`.pokemon-card-id[data-pokemon-id="${body.id}"]`);
      const container = addTypes.nextElementSibling
      container.appendChild(types);
    }
    
  },
  seeBackImage(event){

    const imgToHide = event.target
    imgToHide.classList.remove('visible')
    imgToHide.classList.add('invisible')
    const imgToSee = imgToHide.nextElementSibling;
    imgToSee.classList.remove('invisible')
    imgToSee.classList.add('visible')
    const container = imgToSee.closest('.pokemon-container')
    const name = container.querySelector('h3');
    name.classList.add('shadow-name')
  },
  seeFrontImage(event){
    const imgToHide = event.target
    imgToHide.classList.remove('visible')
    imgToHide.classList.add('invisible')
    const imgToSee = imgToHide.previousElementSibling;
    imgToSee.classList.remove('invisible')
    imgToSee.classList.add('visible')
    const container = imgToSee.closest('.pokemon-container')
    const name = container.querySelector('h3');
    name.classList.remove('shadow-name')
  },
  async openModal(event){
    console.log(event.target.closest('div').querySelector('.pokemon-card-id'))
    const modal = document.querySelector('.modal-container')
    modal.classList.add('is-active');

    const inputId = event.target.closest('div').querySelector('.pokemon-card-id');
    const pokemonId = inputId.getAttribute('data-pokemon-id');

    try {
      const response = await fetch(`${pokemons.apiEndPoint}pokemon/${pokemonId}`);
      const body = await response.json();
      if (response.ok) {
        const name = body.name;
        const img = body.sprites.other.dream_world.front_default;
        const types = body.types;
        for(let i = 0; i < types.length; i++){
          const typeTemplate = document.querySelector('#type-sticker')
          const typeClone = document.importNode(typeTemplate.content, true);
          const types  = typeClone.querySelector('.type-name-card');
          types.textContent = body.types[i].type.name;
          types.classList.add(`${body.types[i].type.name}`)
          const addTypes = document.querySelector('.modal-type');
          addTypes.appendChild(types);
        }

        modal.querySelector('img').src = img;
        modal.querySelector('img').alt = name;
        modal.querySelector('.modal-id').textContent = pokemonId;
        modal.querySelector('h2').textContent = name;
        console.log(body)

        return body;
      } else {
        throw new Error(body.message);
      }
    } catch (error) {
      alert('Ne fonctionne pas');
      console.log(error)
    }

  },
  closeModal(event){
    const modal = document.querySelector('.modal-container');
    const types = document.querySelector('.modal-type');
    types.textContent = '';
    modal.classList.remove('is-active');
  },
};

document.addEventListener('DOMContentLoaded', pokemons.init)
