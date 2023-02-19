export type User = {
  id: string;
  name: string;
  email: string;
  picture: string;
};

export type Versions = Version[] | null;
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
  generation: {
    name: string;
    url: string;
    regions: { name: string | null }[];
  };
  pokemons: Pokemon[];
};

export type Comment = {
  id: string;
  content: string;
  user_id: string;
  user_name: string;
  user_img: string;
  created_at: string;
};
export type Post = {
  pokemon_name: string;
  version_name: string;
  generation_name: string;
  pokemon_image: string;
  title: string;
  content: string;
  user_id: string;
  user_img: string;
  user_name: string;
  id: string;
  comments: Comment[] | null;
  comments_length: number;
};
