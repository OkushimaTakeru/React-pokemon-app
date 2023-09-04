import { useEffect, useState } from "react";
import "./App.css";
import { getAllPokeomn, getPokemon } from "./utils/pokemon.js";
import Card from "./componets/Card/Card";
import Navber from "./componets/Navber/Navber";

function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon";
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);

  //次の20匹のポケモン情報
  const [nextURl, setNextURl] = useState("");
  const [prevURl, setPrevURl] = useState("");

  useEffect(() => {
    const fetchPokemonData = async () => {
      //全てのポケモンデータを取得
      let res = await getAllPokeomn(initialURL);
      // console.log(res);
      loadPokemon(res.results);
      //格ポケモンの詳細なデータを取得
      // console.log(res.results);
      setNextURl(res.next);
      setPrevURl(res.privious); //null
      setLoading(false);
    };
    fetchPokemonData();
  }, []);

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        // console.log(pokemon);
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };
  //格ポケモンの詳細なデータを取得
  console.log(pokemonData);

  //次の20匹のポケモンの取得
  const handleNextPage = async () => {
    setLoading(true);
    let data = await getAllPokeomn(nextURl);
    // console.log(data);
    await loadPokemon(data.results);
    setNextURl(data.next);
    setPrevURl(data.previous);
    setLoading(false);
  };

  const handlePrevPage = async () => {
    if (!prevURl) return;
    setLoading(true);
    let data = await getAllPokeomn(prevURl);
    await loadPokemon(data.results);
    setNextURl(data.next);
    setPrevURl(data.previous);
    setLoading(false);
  };

  return (
    <>
      <Navber></Navber>
      <div className="App">
        {loading ? (
          <h1>ロード中・・・・</h1>
        ) : (
          <>
            <div className="pokemonCardContainer">
              {pokemonData.map((pokemon, i) => {
                return <Card key={i} pokemon={pokemon}></Card>;
              })}
            </div>
            <div className="bth">
              <button onClick={handlePrevPage}>前へ</button>
              <button onClick={handleNextPage}>次へ</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
