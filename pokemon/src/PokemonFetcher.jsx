// Importamos React y algunos hooks que nos permiten manejar estado y efectos secundarios
import React, { useState, useEffect } from 'react';
// Importamos estilos CSS para que nuestro componente se vea bonito
import './PokemonFetcher.css';

const PokemonFetcher = () => {
  // Aquí definimos varios estados que usaremos:
  const [pokemones, setPokemones] = useState([]); // Lista de pokemones que se van a mostrar
  const [cargando, setCargando] = useState(true); // Muestra si estamos cargando info
  const [error, setError] = useState(null); // Si hay un error, lo guardamos aquí
  const [tipoSeleccionado, setTipoSeleccionado] = useState(''); // Tipo elegido (agua, fuego, etc.)
  const [cantidad, setCantidad] = useState(4); // Cuántos pokemones queremos mostrar
  const [tipos, setTipos] = useState([]); // Lista de todos los tipos de pokémon válidos

  // Este useEffect se ejecuta SOLO UNA VEZ al montar el componente ([]),
  // y carga la lista de tipos de Pokémon desde la API
  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const res = await fetch('https://pokeapi.co/api/v2/type'); // Pedimos los tipos
        const data = await res.json();
        // Filtramos los tipos para quitar los que no sirven (como shadow y unknown)
        const tiposValidos = data.results
          .filter(tipo => !['shadow', 'unknown'].includes(tipo.name))
          .map(tipo => tipo.name); // Solo nos interesa el nombre
        setTipos(tiposValidos); // Guardamos los tipos en el estado
      } catch (err) {
        console.error('Error al cargar tipos:', err);
      }
    };

    fetchTipos(); // Llamamos a la función para que se ejecute
  }, []);

  // Este useEffect se ejecuta cada vez que cambia el tipoSeleccionado o la cantidad
  useEffect(() => {
    const fetchPokemones = async () => {
      try {
        setCargando(true); // Activamos el mensaje de carga
        setError(null); // Reiniciamos errores anteriores
        const fetchedPokemones = []; // Creamos un array para guardar los Pokémon

        if (tipoSeleccionado) {
          // Si el usuario eligió un tipo, obtenemos los Pokémon de ese tipo
          const res = await fetch(`https://pokeapi.co/api/v2/type/${tipoSeleccionado}`);
          const data = await res.json();
          const pokemonsTipo = data.pokemon.map(p => p.pokemon); // Extraemos solo los datos del Pokémon

          // Si se seleccionó "Todos", mostramos todos los de ese tipo
          const seleccionados = cantidad === 898 ? pokemonsTipo : pokemonsTipo.slice(0, cantidad);

          // Por cada Pokémon seleccionado, pedimos sus datos detallados
          for (const poke of seleccionados) {
            const resPoke = await fetch(poke.url);
            const dataPoke = await resPoke.json();
            // Guardamos los datos que necesitamos
            fetchedPokemones.push({
              id: dataPoke.id,
              nombre: dataPoke.name,
              imagen: dataPoke.sprites.front_default,
              tipos: dataPoke.types.map(t => t.type.name),
            });
          }
        } else {
          // Si no se eligió ningún tipo, mostramos Pokémon aleatorios
          const pokemonIds = new Set();
          while (pokemonIds.size < cantidad) {
            const randomId = Math.floor(Math.random() * 898) + 1; // Número aleatorio entre 1 y 898
            pokemonIds.add(randomId); // Evitamos repetir Pokémon
          }

          // Pedimos los datos de cada Pokémon aleatorio
          for (const id of pokemonIds) {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
            const data = await response.json();
            fetchedPokemones.push({
              id: data.id,
              nombre: data.name,
              imagen: data.sprites.front_default,
              tipos: data.types.map(typeInfo => typeInfo.type.name),
            });
          }
        }

        // Guardamos los Pokémon en el estado
        setPokemones(fetchedPokemones);
      } catch (err) {
        // Si algo sale mal, mostramos el error
        setError(err.message);
      } finally {
        // Quitamos el mensaje de carga, ya haya salido bien o mal
        setCargando(false);
      }
    };

    fetchPokemones(); // Ejecutamos la función para traer los Pokémon
  }, [tipoSeleccionado, cantidad]);

  // Renderizado del componente
  return (
    <div className='pokemon-container'>
      <h2>Conoce a tus pokemones uwu!</h2>

      {/* Controles para elegir tipo y cantidad */}
      <div className="pokemon-controls">
        <label>
          Tipo:
          <select onChange={(e) => setTipoSeleccionado(e.target.value)} value={tipoSeleccionado}>
            <option value=''>Aleatorio</option>
            {tipos.map(tipo => (
              <option key={tipo} value={tipo}>
                {tipo.charAt(0).toUpperCase() + tipo.slice(1)} {/* Capitalizamos */}
              </option>
            ))}
          </select>
        </label>

        <br/>

        <label>
          Cantidad:
          <select onChange={(e) => setCantidad(parseInt(e.target.value))} value={cantidad}>
            <option value={4}>4</option>
            <option value={6}>6</option>
            <option value={10}>10</option>
            <option value={898}>Todos</option> {/* Ojo: puede tardar mucho */}
          </select>
        </label>
      </div>

      {/* Mensajes de carga y error */}
      {cargando && <div>Cargando Pokémon...</div>}
      {error && <div className="error">Error: {error}</div>}

      {/* Lista de Pokémon que se muestran */}
      <div className="pokemon-list">
        {pokemones.map(pokemon => (
          <div key={pokemon.id} className="pokemon-card">
            <h3>{pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1)}</h3>
            <img src={pokemon.imagen} alt={pokemon.nombre} />
            <p><strong>Tipos:</strong> {pokemon.tipos.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonFetcher; // Exportamos el componente para usarlo en otro lado
