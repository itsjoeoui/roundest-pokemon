import { z } from "zod";

import { router, publicProcedure } from "../trpc";

// import { PokemonClient } from "pokenode-ts";
import { prisma } from "../../db/client";

export const pokemonRouter = router({
  "get-pokemon-by-id": publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
      const pokemon = await prisma.pokemon.findFirstOrThrow({
        where: {
          pokeId: `${input.id}`,
        },
      });
      return pokemon;
    }),
  "cast-vote": publicProcedure
    .input(z.object({ forId: z.number(), againstId: z.number() }))
    .mutation(async ({ input }) => {
      const voteInDb = await prisma.vote.create({
        data: {
          againstId: `${input.againstId}`,
          forId: `${input.forId}`,
        },
      });
      return { success: true };
    }),
  // "fill-db": publicProcedure.input(z.object({})).mutation(async () => {
  //   if (process.env.NODE_ENV === "development") {
  //     const api = new PokemonClient();
  //     const pokemons = await api.listPokemons(0, 493);

  //     const formated = pokemons.results.map((poke, idx) => ({
  //       pokeId: `${idx}`,
  //       name: (poke as { name: string }).name,
  //       spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
  //         idx + 1
  //       }.png`,
  //     }));

  //     const creation = await prisma.pokemon.createMany({
  //       data: formated,
  //     });

  //     console.log("Created", creation);
  //     return { success: true };
  //   }
  //   return { success: false };
  // }),
});
