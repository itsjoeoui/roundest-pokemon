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

  const pokemonRanking = trpc.pokemon["get-ranking"].useQuery();

  // const backFill = trpc.pokemon["fill-db"].useMutation();

  const voteForRoundest = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({ forId: first, againstId: second });
    } else {
      voteMutation.mutate({ forId: second, againstId: first });
    }
    updateIds(getOptionsForVote());
    pokemonRanking.refetch();
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
      {/* <div className="py-2"></div>
      <div className={btn} onClick={() => backFill.mutate({})}>
        Fill DB
      </div> */}
      <div className="py-2"></div>
      <div className="text-center text-2xl">Top 10 Roundest</div>
      {pokemonRanking.data?.map((poke, idx) => {
        if (poke._count.votedFor !== 0) {
          return <PokemonRanking poke={poke} key={idx} />;
        }
      })}
    </div>
  );
};

const PokemonRanking: React.FC<{
  poke: {
    _count: {
      votedFor: number;
      votedAgainst: number;
    };
    id: bigint;
    name: string;
    spriteUrl: string;
  };
}> = (props) => {
  return (
    <div className="">
      {props.poke.name}: {props.poke._count.votedFor}
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
        src={props.pokemon.spriteUrl}
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
