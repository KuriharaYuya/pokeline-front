import { fetchVersionsData } from "@/features/pokemons";
import { updateVersions } from "@/redux/reducers/versions";
import { RootState } from "@/redux/store";
import { Version } from "@/utils/types";
import { pokeApi } from "@/utils/urls/pokeAPI";
import {
  Box,
  Button,
  Card,
  CardContent,
  Modal,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
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
  };

  // debug
  useEffect(() => {
    selectedVersion?.data.pokemons.map((pokemon) => {
      const { name, url } = pokemon;
      console.log(name, url);
    });
  }, [modalOpen]);
  return (
    <>
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
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <div style={{ padding: "1em" }}>
          {selectedVersion && (
            <>
              <Typography variant="h5">{selectedVersion.name}</Typography>
              <p>{selectedVersion.data.generation.name}</p>
              {selectedVersion.data.pokemons.map((pokemon, index) => {
                return (
                  <Box key={index} style={{ marginRight: "1em" }}>
                    <Image
                      width={150}
                      height={150}
                      src={pokemon.image}
                      alt={pokemon.name}
                    />
                    <p>{pokemon.name}</p>
                  </Box>
                );
              })}
            </>
          )}
          <Button onClick={handleCloseModal}>Close</Button>
        </div>
      </Modal>
    </>
  );
};

export default Index;
