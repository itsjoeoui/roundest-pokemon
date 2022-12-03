import { type NextPage } from "next";
import { useState } from "react";
import { getOptionsForVote } from "../utils/getRandomPokemon";
import { trpc } from "../utils/trpc";
import Image from "next/image";

const Home: NextPage = () => {
  const [ids, updateIds] = useState<number[]>(getOptionsForVote());
  const [first, second]: number[] = ids;

  if (first === undefined || second === undefined) {
    return null;
  }

  const firstPokemon = trpc.example["get-pokemon-by-id"].useQuery({
    id: first,
  });
  const secondPokemon = trpc.example["get-pokemon-by-id"].useQuery({
    id: second,
  });

  if (firstPokemon.isLoading || secondPokemon.isLoading) return null;

  if (firstPokemon.data == undefined || secondPokemon.data == undefined)
    return null;

  function refreshPokemons() {
    updateIds(getOptionsForVote());
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="text-center text-2xl subpixel-antialiased">
        Which Pokémon is Rounder?
      </div>
      <div className="py-2"></div>
      <div className="flex items-center justify-between rounded-md border-2 p-16">
        <div className="flex h-64 w-64 flex-col rounded-md border-2 hover:bg-sky-500">
          <Image
            src={
              firstPokemon.data?.sprites.front_default
                ? firstPokemon.data?.sprites.front_default
                : ""
            }
            alt="first"
            width="256"
            height="256"
            priority
          />
          <div className="py-2"></div>
          <div className="text-center text-xl capitalize">
            {firstPokemon.data.name}
          </div>
        </div>
        <div className="p-8">VS</div>
        <div className="flex h-64 w-64 flex-col rounded-md border-2 hover:bg-sky-500">
          <Image
            src={
              secondPokemon.data?.sprites.front_default
                ? secondPokemon.data?.sprites.front_default
                : ""
            }
            alt="second"
            width="256"
            height="256"
            priority
          />
          <div className="py-2"></div>
          <div className="text-center text-xl capitalize">
            {secondPokemon.data.name}
          </div>
        </div>
      </div>
      <div className="py-2"></div>
      <div className="text-center" onClick={() => refreshPokemons()}>
        Refresh
      </div>
    </div>
  );
};

export default Home;
