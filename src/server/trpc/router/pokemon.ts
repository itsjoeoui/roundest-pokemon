import { z } from "zod";

import { router, publicProcedure } from "../trpc";

import { PokemonClient } from "pokenode-ts";
import { prisma } from "../../db/client";

export const pokemonRouter = router({
  "get-pokemon-by-id": publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
      const api = new PokemonClient();

      const pokemon = await api.getPokemonById(input.id);
      return { name: pokemon.name, sprites: pokemon.sprites };
    }),
  "cast-vote": publicProcedure
    .input(z.object({ votedFor: z.number(), votedAgainst: z.number() }))
    .mutation(async ({ input }) => {
      const voteInDb = await prisma.vote.create({
        data: {
          ...input,
        },
      });
      return { success: true };
    }),
  "fill-db": publicProcedure.input(z.object({})).mutation(async () => {
    if (process.env.NODE_ENV === "development") {
      const api = new PokemonClient();
      const pokemons = await api.listPokemons(0, 493);

      const formated = pokemons.results.map((poke, idx) => ({
        name: (poke as { name: string }).name,
        spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
          idx + 1
        }.png`,
      }));

      const creation = await prisma.pokemon.createMany({
        data: formated,
      });

      console.log("Created", creation);
      return { success: true };
    }
    return { success: false };
  }),
});
