const types = {
  init(){
    types.getAllTypes();
  },
  apiEndPoint : 'https://pokeapi.co/api/v2/',
  async getAllTypes(){
    try{
      const response = await fetch(`${types.apiEndPoint}type`)
      const body = await response.json();
      if (response.ok) {
        types.addToDOM(body)
        return body;
      } else {
        throw new Error(body.message);
      }
    }catch(error){
      alert('Ne fonctionne pas');
      console.log(error)
    }
  },
  addToDOM(body){

    for (let i = 0; i < body.results.length; i++){
      const typeName = body.results[i].name;
      console.log(typeName)
      const typeTemplate = document.querySelector('#type-sticker')
      const typeClone = document.importNode(typeTemplate.content, true);
      const types  = typeClone.querySelector('.type-name');

      types.classList.add(`${typeName}`)
      console.log('types', types.className)
      const input = typeClone.querySelector('.type-id');
      input.setAttribute('type-id', `${i + 1}`);
      console.log(input)

      types.textContent = typeName;
      const addTypes = document.querySelector('.types-container');
      addTypes.appendChild(types);
    }
  },
}

document.addEventListener('DOMContentLoaded', types.init)