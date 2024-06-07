import { FreshContext, Handler } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import jwt from "jsonwebtoken";

export const handler: Handler = async (req: Request, ctx: FreshContext) => {
  if (ctx.destination !== "route") {
    const res = await ctx.next();
    return res;
  }
  if (ctx.route === "/login" || ctx.route === "/register") {
    const res = await ctx.next();
    return res;
  }

  const cookies = getCookies(req.headers);

  const auth = cookies.auth;

  if (!auth) {
    return new Response("", {
      headers: {
        "location": "/login",
      },
      status: 303,
    });
  }

  const verify = jwt.verify(auth, Deno.env.get("JWT_SECRET"));
  console.log("Verify: ", verify);
  if (!verify) {
    return new Response("", {
      headers: {
        "location": "/login",
      },
      status: 303,
    });
  }

  ctx.state.id = verify.id;
  ctx.state.name = verify.name;
  ctx.state.email = verify.email;

  const res = await ctx.next();
  return res;
};
