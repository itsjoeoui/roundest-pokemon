import { type NextPage } from "next";
import { useState } from "react";
import { getOptionsForVote } from "../utils/getRandomPokemon";
import type { RouterOutputs } from "../utils/trpc";
import { trpc } from "../utils/trpc";
import Image from "next/image";

const btn =
  "flex flex-col items-center text-center inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out";

const Home: NextPage = () => {
  const [ids, updateIds] = useState<number[]>(getOptionsForVote());
  const [first, second]: number[] = ids;

  if (first === undefined || second === undefined) {
    return null;
  }

  const firstPokemon = trpc.pokemon["get-pokemon-by-id"].useQuery({
    id: first,
  });
  const secondPokemon = trpc.pokemon["get-pokemon-by-id"].useQuery({
    id: second,
  });

  const voteMutation = trpc.pokemon["cast-vote"].useMutation();

  // const backFill = trpc.pokemon["fill-db"].useMutation();

  const voteForRoundest = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({ votedFor: first, votedAgainst: second });
    } else {
      voteMutation.mutate({ votedFor: second, votedAgainst: first });
    }
    updateIds(getOptionsForVote());
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="text-center text-2xl">Which Pokémon is Rounder?</div>
      <div className="py-2"></div>
      <div className="flex items-center justify-between rounded-md border-2 p-16">
        {!firstPokemon.isLoading &&
          firstPokemon.data &&
          !secondPokemon.isLoading &&
          secondPokemon.data && (
            <>
              <PokemonListening
                pokemon={firstPokemon.data}
                vote={() => voteForRoundest(first)}
              />
              <div className="p-8">VS</div>
              <PokemonListening
                pokemon={secondPokemon.data}
                vote={() => voteForRoundest(second)}
              />
            </>
          )}
      </div>
      <div className="py-2"></div>
      {/* <div className={btn} onClick={() => backFill.mutate({})}>
        Fill DB
      </div> */}
    </div>
  );
};

type PokemonFromServer = RouterOutputs["pokemon"]["get-pokemon-by-id"];

const PokemonListening: React.FC<{
  pokemon: PokemonFromServer;
  vote: () => void;
}> = (props) => {
  return (
    <div className="flex flex-col rounded-md border-2 p-8 hover:bg-sky-500">
      <Image
        src={
          props.pokemon.sprites.front_default
            ? props.pokemon.sprites.front_default
            : ""
        }
        alt={props.pokemon.name}
        width="256"
        height="256"
        priority
      />
      <div className="py-2"></div>
      <div className="text-center text-xl capitalize">{props.pokemon.name}</div>
      <div className="py-2"></div>
      <div className={btn} onClick={() => props.vote()}>
        Rounder
      </div>
    </div>
  );
};

export default Home;
