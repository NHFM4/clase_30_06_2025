
import './App.css'
import PokemonFetcher from './PokemonFetcher'

let PLAYED = false;

async function play() {
  let music = await new Audio("https://us-tuna-sounds-files.voicemod.net/57b792a1-5d59-412a-8344-383f945f450c-1669658209316.mp3")
  music.loop = true;

  if (PLAYED) {
    alert("Ya esta sonando beibi sana mi dolor uwu apagando ...")
    window.location.href = "/"
    return
  }

  PLAYED = true;
  music.play();
}

function App() {

  return (
    <>
      <h1>Conoce a tus Pokémones, edicion 2008</h1>
      <img src="https://s.13.cl/sites/default/files/inline-images/2021-04/pokemones.png" class="carol" onClick={play}></img>
      <PokemonFetcher /> 
    </>
  )
}

export default App;
