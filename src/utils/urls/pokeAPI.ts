import axios from "axios";

export const pokeApi = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
});

export const versionsPath = "/version-group?limit=30";

export const pokemonFrontImgPath = (pokemonId: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
