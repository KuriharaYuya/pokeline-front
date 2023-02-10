export type User = {
  id: string;
  name: string;
  email: string;
  picture: string;
};

export type Versions =
  | {
      name: string;
      url: string;
      data: VersionObj;
    }[]
  | undefined;

export type VersionObj = {
  generation: { name: string; url: string };
  pokemons: { name: string; url: string }[];
};
