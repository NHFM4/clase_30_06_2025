
import {useState} from 'react';
import PokemonFetcher from './PokemonFetcher';

function App() {

  return (
    <>
      <h1>Conoce a los pokemones gen 2008</h1>
      <input placeholder='xd'></input>
      <img src='https://th.bing.com/th/id/R.4987833e24605ab43fa5c32b6e3d4db9?rik=2KKati7HvTAuDg&riu=http%3a%2f%2fmyrianjordan.weebly.com%2fuploads%2f4%2f5%2f7%2f4%2f45740779%2f1872297.jpg%3f505&ehk=i6DzzOJCQQL9MfoerrarzvP6EnuOnmh9azhbbGgSeWw%3d&risl=&pid=ImgRaw&r=0'></img>
      <PokemonFetcher/>
    </>
  )
}

export default App;
