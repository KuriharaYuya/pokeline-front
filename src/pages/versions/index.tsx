import { fetchVersionsData } from "@/features/pokemons";
import { Pokemon, Version } from "@/utils/types";
import { timelinePath } from "@/utils/urls/client";
import { apiLocalhost } from "@/utils/urls/server";
import {
  Box,
  Button,
  Card,
  CardContent,
  Modal,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { spawn } from "child_process";
import { GetStaticProps } from "next";
import Image from "next/image";
import Router from "next/router";
import React, { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import styles from "../../components/versions.module.scss";

export const getStaticProps: GetStaticProps = async () => {
  const versions = await fetchVersionsData();
  console.log(versions.map((version) => version.data.generation));
  return {
    props: {
      versions,
    },
  };
};
type Props = {
  versions: Version[];
};
const Index = ({ versions }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<Version | undefined>(
    undefined
  );
  const handleOpenModal = (version: Version) => {
    setModalOpen(true);
    setSelectedVersion(version);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedVersion(undefined);
    setSelectedPokemon(undefined);
  };

  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | undefined>(
    undefined
  );
  const handleSelectPokemon = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const { register, handleSubmit, reset } = useForm<FieldValues>();
  const onSubmit = async (formData: any) => {
    const { title, content } = formData as { title: string; content: string };
    const { status } = await apiLocalhost.post("/posts", {
      posts: {
        title,
        content,
        pokemon_name: selectedPokemon!.name,
        pokemon_image: selectedPokemon!.image,
        version_name: selectedVersion!.name,
        generation_name: selectedVersion!.data.generation.name,
      },
    });
    if (status === 200) {
      reset();
      Router.push(timelinePath);
    }
  };

  return (
    <div style={{ width: "90%", margin: "0 auto" }}>
      <div>
        {versions?.map((version, index) => {
          return (
            <Card
              key={index}
              style={{ margin: "1em" }}
              className={styles.versionCard}
              onClick={() => handleOpenModal(version)}
            >
              <CardContent>
                <Typography variant="h5" className={styles.versionName}>
                  {version.name}
                </Typography>
                <p className={styles.generationName}>
                  {version.data.generation.name}
                </p>
                <div className={styles.pokemonsWrapper}>
                  {version.data.pokemons.map((pokemon, index) => {
                    return (
                      <div key={index} className={styles.pokemonWrapper}>
                        <Image
                          height={40}
                          width={40}
                          src={pokemon.image}
                          alt={pokemon.name}
                        />
                        <p>{pokemon.name}</p>
                      </div>
                    );
                  })}
                </div>
                <p>
                  {version.data.generation?.regions.map((region, index) => {
                    return (
                      <>
                        {version.data.generation?.regions.length > 1 &&
                          index !== 0 && <span>&nbsp;&nbsp;</span>}
                        <span key={index} className={styles.versionName}>
                          {region?.name}
                        </span>
                      </>
                    );
                  })}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        className={styles.createPostModal}
      >
        <>
          <Button onClick={handleCloseModal}>Close</Button>
          {selectedVersion && (
            <>
              <Typography variant="h5">{selectedVersion.name}</Typography>
              <p>{selectedVersion.data.generation.name}</p>
              <div className={styles.starterPokemonsWrapper}>
                {selectedVersion.data.pokemons.map((pokemon, index) => {
                  return (
                    <Box
                      key={index}
                      onClick={() => handleSelectPokemon(pokemon)}
                      className={styles.starterPokemon}
                    >
                      <Image
                        width={120}
                        height={120}
                        src={pokemon.image}
                        alt={pokemon.name}
                        className={
                          pokemon === selectedPokemon
                            ? styles.starterPokemonImg
                            : styles.starterPokemonImgSelected
                        }
                      />
                      <p>{pokemon.name}</p>
                    </Box>
                  );
                })}
              </div>
            </>
          )}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles.createPostForm}
          >
            <input
              placeholder="Title"
              {...register("title", { required: true })}
              className={styles.createPostFormTitle}
            />
            <TextareaAutosize
              placeholder="Description"
              {...register("content", { required: true })}
              className={styles.createPostFormContent}
            />
            {selectedPokemon && (
              <Button type="submit" className={styles.createPostFormSubmitBtn}>
                Submit
              </Button>
            )}
          </form>
        </>
      </Modal>
    </div>
  );
};

export default Index;
