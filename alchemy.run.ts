import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";
import Web from "./apps/web/src/worker.ts";

export default Alchemy.Stack(
  "obm",
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const web = yield* Web;
    return { url: web.url };
  }),
);
