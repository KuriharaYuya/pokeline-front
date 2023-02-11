export type User = {
  id: string;
  name: string;
  email: string;
  picture: string;
};

export type Versions = Version[] | undefined;
export type Version = {
  name: string;
  url: string;
  data: VersionObj;
};
export type Pokemon = {
  name: string;
  url: string;
  pokemonId: number;
  image: string;
};
export type VersionObj = {
  generation: { name: string; url: string };
  pokemons: Pokemon[];
};
