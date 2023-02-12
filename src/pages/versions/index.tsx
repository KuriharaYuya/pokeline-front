import { fetchVersionsData } from "@/features/pokemons";
import { updateVersions } from "@/redux/reducers/versions";
import { RootState } from "@/redux/store";
import { Pokemon, Version } from "@/utils/types";
import { timelinePath } from "@/utils/urls/client";
import { apiLocalhost } from "@/utils/urls/server";
import {
  Box,
  Button,
  Card,
  CardContent,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const Index = () => {
  const dispatch = useDispatch();
  const { versions } = useSelector((state: RootState) => state.versionsReducer);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<Version | undefined>(
    undefined
  );
  useEffect(() => {
    (async () => {
      const versions = await fetchVersionsData();
      dispatch(updateVersions(versions));
    })();
  }, []);
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
      },
    });
    if (status === 200) {
      reset();
      Router.push(timelinePath);
    }
  };

  return (
    <div>
      <div>
        {versions?.map((version, index) => {
          return (
            <Card
              key={index}
              style={{ margin: "1em" }}
              onClick={() => handleOpenModal(version)}
            >
              <CardContent>
                <Typography variant="h5">{version.name}</Typography>
                <p>{version.data.generation.name}</p>
                {version.data.pokemons.map((pokemon, index) => {
                  return <p key={index}>{pokemon.name}</p>;
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        style={{
          width: "500px",
          height: "500px",
          backgroundColor: "red",
          border: "3px solid blue",
          margin: "auto",
        }}
      >
        <div style={{ padding: "auto" }}>
          <Button onClick={handleCloseModal}>Close</Button>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              placeholder="Title"
              {...register("title", { required: true })}
            />
            <TextField
              placeholder="Description"
              {...register("content", { required: true })}
            />
            {selectedPokemon && <Button type="submit">Submit</Button>}
          </form>
          {selectedVersion && (
            <>
              <Typography variant="h5">{selectedVersion.name}</Typography>
              <p>{selectedVersion.data.generation.name}</p>
              {selectedVersion.data.pokemons.map((pokemon, index) => {
                return (
                  <Box
                    key={index}
                    style={{ marginRight: "1em" }}
                    onClick={() => handleSelectPokemon(pokemon)}
                  >
                    <Image
                      width={80}
                      height={80}
                      src={pokemon.image}
                      alt={pokemon.name}
                      style={
                        pokemon === selectedPokemon
                          ? {
                              border: "3px solid blue",
                              backgroundColor: "black",
                            }
                          : { backgroundColor: "black" }
                      }
                    />
                    <p>{pokemon.name}</p>
                  </Box>
                );
              })}
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Index;
