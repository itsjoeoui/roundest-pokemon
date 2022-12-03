const MAX_POKE_IDX = 493;

export const getRandomPokemon: (notThisOne?: number) => number = (
  notThisOne?: number
) => {
  const pokeIdx = Math.floor(Math.random() * (MAX_POKE_IDX) + 1);

  if (pokeIdx !== notThisOne) return pokeIdx;
  return getRandomPokemon(notThisOne);
};

export const getOptionsForVote: () => number[] = () => {
  const firstIdx = getRandomPokemon();
  const secondIdx = getRandomPokemon(firstIdx);

  return [firstIdx, secondIdx];
};
