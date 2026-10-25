import * as Cloudflare from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";
import * as HttpServerResponse from "effect/http/HttpServerResponse";

export default Cloudflare.Worker(
  "Web",
  { main: import.meta.url },
  Effect.succeed({
    fetch: Effect.succeed(HttpServerResponse.text("Hello from OBM")),
  }),
);
