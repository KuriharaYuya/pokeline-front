import { fetchVersionsData } from "@/features/pokemons";
import { updateVersions } from "@/redux/reducers/versions";
import { RootState } from "@/redux/store";
import { pokeApi } from "@/utils/urls/pokeAPI";
import { Card, CardContent, Typography } from "@mui/material";
import { version } from "os";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Index = () => {
  const dispatch = useDispatch();
  const { versions } = useSelector((state: RootState) => state.versionsReducer);
  useEffect(() => {
    (async () => {
      const versions = await fetchVersionsData();
      dispatch(updateVersions(versions));
    })();
  }, []);
  return (
    <>
      {versions?.map((version, index) => {
        return (
          <Card key={index} style={{ margin: "1em" }}>
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
    </>
  );
};

export default Index;
