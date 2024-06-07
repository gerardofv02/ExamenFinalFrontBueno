import {
  FreshContext,
  Handlers,
  PageProps,
  RouteConfig,
} from "$fresh/server.ts";
import jwt from "jsonwebtoken";
import { setCookie } from "$std/http/cookie.ts";

export const config: RouteConfig = {
  skipInheritedLayouts: true, // Skip already inherited layouts
};

export const handler: Handlers = {
  POST: async (req: Request, ctx: FreshContext) => {
    const form = await req.formData();
    const url = new URL(req.url);
    const email = form.get("email");
    const password = form.get("password");
    if (!email || !password) {
      return ctx.render({ message: "Faltan algunas variables" });
    }
    const user = {
      email: email,
      password: password,
    };

    const res = await fetch("https://videoapp-api.deno.dev/checkuser", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(user),
    });
    //console.log(res);

    if (res.status !== 200) {
      const body = await res.json();
      if (body && body.message) {
        return ctx.render({ message: body.message });
      } else {
        return ctx.render({ message: "Algo ha salido mal" });
      }
    } else {
      const body = await res.json();
      const user = {
        id: body.id,
        email: body.email,
        name: body.name,
      };
      const token = await jwt.sign(user, Deno.env.get("JWT_SECRET"));

      const headers = new Headers();
      setCookie(headers, {
        name: "auth",
        value: token,
        sameSite: "Lax",
        path: "/",
        secure: true,
        domain: url.hostname,
        expires: Date.now() + 10000000, //1000000 segundos
      });

      headers.set("location", "/videos");

      return new Response("", {
        headers: headers,
        status: 303,
      });
    }
  },
};

const Login = (props: PageProps<{ message: string }>) => {
  return (
    <div class="login-container">
      <h2>Login</h2>
      {props && props.data && (
        <div class="error-message">{props.data.message}</div>
      )}
      <form method="POST">
        <label for="email">Email</label>
        <input name="email" type="email" required>
        </input>
        <br />
        <label for="password">Password</label>
        <input name="password" type="password" required>
        </input>
        <br />
        <button type="submit">Login</button>
        <p class="register-link">
          Don't have account?
          <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
