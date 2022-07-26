//Variables
const formulario = document.querySelector('#form');
const list_tweets = document.querySelector('#list-tweets');

let tweets = [];

//EventListners
eventListeners();

function eventListeners(){
    formulario.addEventListener('submit', agregarTweet);

    document.addEventListener('DOMContentLoaded', () => {
        tweets = JSON.parse(localStorage.getItem('tweets')) || [];
        
        crearHtml();

    })
}

//Funciones
function agregarTweet(e){
    e.preventDefault();
    const tweet = document.querySelector('#tweet').value;
    //validadcion
   if(tweet === '') {
        mostrarError('No puede ir vacio')
        return;
   }
   //Agregar al array Tweet
   const tweetObj = {
       id: Date.now(),
       tweet
   }
   tweets = [...tweets, tweetObj];

    //Crear HTML
    crearHtml();

    formulario.reset();
}

function mostrarError(error){
    const mensaje = document.createElement('p');
    mensaje.textContent = error;
    mensaje.classList.add('error');
    formulario.insertBefore(mensaje, formulario.children[1]);

    setTimeout(() => {
        mensaje.remove();
    }, 2000);

}

//Muestra listado de tweets
function crearHtml(){
    limpiarHtml();

    if(tweets.length > 0){
        tweets.forEach(tweet => {
            const btnEliminar = document.createElement('a');
            btnEliminar.innerText = 'x';
            btnEliminar.classList.add('deletebutton');

            btnEliminar.onclick = () => {
                borrarTweet(tweet.id);
            }

            const item = document.createElement('p');
            item.innerText = tweet.tweet;
            item.appendChild(btnEliminar);
            
            item.classList.add('item');
            list_tweets.appendChild(item);
        })
    }

    //Sincronizar Storage
    sincronizarStorage();
}
//Agregar tweets a localStorage
function sincronizarStorage(){
    localStorage.setItem('tweets', JSON.stringify(tweets));
}

function borrarTweet(id) {
    tweets = tweets.filter(tweet => tweet.id !== id);

    crearHtml();
}

//Limpiar HTML
function limpiarHtml(){
    while(list_tweets.firstChild){
        list_tweets.removeChild(list_tweets.firstChild);
    }
}