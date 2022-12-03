import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const exampleRouter = router({
  addTwoNumbers: publicProcedure
    .input(
      z.object({
        num1: z.number(),
        num2: z.number(),
      })
    )
    .query(({ input }) => {
      return input.num1 + input.num2;
    }),
});
