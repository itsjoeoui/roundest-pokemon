import { type NextPage } from "next";
import { getOptionsForVote } from "../utils/getRandomPokemon";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const data = trpc.example.addTwoNumbers.useQuery({
    num1: 1,
    num2: 2,
  });

  const [first, second] = getOptionsForVote();

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="text-center text-2xl subpixel-antialiased">
        Which Pokémon is Rounder?
      </div>
      <div className="py-2"></div>
      <div className="flex items-center justify-between rounded-md border-2 p-8">
        <div className="h-16 w-16 rounded-md border-2 hover:bg-sky-500">
          {first}
        </div>
        <div className="p-8">VS</div>
        <div className="h-16 w-16 rounded-md border-2 hover:bg-sky-500">
          {second}
        </div>
      </div>
      <div>tRPC: 1 + 2 = {data.data}</div>
    </div>
  );
};

export default Home;
