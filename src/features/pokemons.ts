import { Versions } from "@/utils/types";
import {
  pokeApi,
  pokemonFrontImgPath,
  versionsPath,
} from "@/utils/urls/pokeAPI";
import axios from "axios";
export const fetchVersionsData = async () => {
  const versions = (await fetchVersions()) as Versions;
  const versionsWithGeneration = await Promise.all(
    versions!.map(async (version) => {
      const regionsJpName = await getRegionWithVersion(version.url);
      const generationUrl = (await axios.get(version.url)).data.generation.url;
      const generationInfo = await fetchGenerations(generationUrl);
      const generation = {
        ...generationInfo,
        generation: {
          name: generationInfo.generation.name,
          regions: regionsJpName,
        },
      };
      const updatedData = { ...version, data: generation };
      return updatedData;
    })
  );
  return versionsWithGeneration;
};

const fetchVersions = async () => {
  const { data } = await pokeApi.get(versionsPath);
  return data.results;
};

const fetchGenerations = async (generationUrl: string) => {
  const { data } = await axios.get(generationUrl);
  const generationName = data.names.slice(-1)[0].name;
  const pokemons = data.pokemon_species.slice(0, 3) as {
    name: string;
    url: string;
  }[];

  const starterPokemons = await Promise.all(
    pokemons.map(async (pokemon) => {
      const pokemonId = extractPokemonIdFromSpeciesUrl(pokemon.url);
      const image = pokemonFrontImgPath(pokemonId);
      const pokemonName = await getPokemonJpName(pokemon.url);
      return { name: pokemonName, url: pokemon.url, pokemonId, image };
    })
  );
  return { generation: { name: generationName }, pokemons: starterPokemons };
};

const extractPokemonIdFromSpeciesUrl = (url: string) => {
  const index = url.lastIndexOf("/", url.lastIndexOf("/") - 1) + 1;
  return parseInt(url.substring(index, url.length - 1));
};

const getPokemonJpName = async (pokemonUrl: string) => {
  const { data } = await axios.get(pokemonUrl);
  const jpName = data.names[0].name;
  return jpName;
};

const getRegionWithVersion = async (versionUrl: string) => {
  const data = (await axios.get(versionUrl).then((res) => res.data)) as {
    regions: { url: string }[];
  };
  const regionNameJp = await Promise.all(
    data.regions.map(async (region: { url: string }) => {
      const { data }: { data: { names: { name: string }[] } } = await axios.get(
        region.url
      );
      try {
        return { name: data.names[0].name };
      } catch {
        return null;
      }
    })
  );

  return regionNameJp;
};
