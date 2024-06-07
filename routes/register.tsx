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
    const name = form.get("name");
    const password = form.get("password");
    const email = form.get("email");
    if (!name || !password) {
      return ctx.render({ message: "Faltan algunas variables" });
    }
    const user = {
      name: name,
      password: password,
      email: email,
    };

    const res = await fetch("https://videoapp-api.deno.dev/register", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(user),
    });

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
        name: body.name,
        email: body.email,
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

const Register = (props: PageProps<{ message: string }>) => {
  return (
    <div class="register-container">
      <h2>Register</h2>
      {props && props.data && (
        <div class="error-message">{props.data.message}</div>
      )}
      <form method="POST">
        <label for="name">Full Name</label>
        <input name="name" type="text" required>
        </input>

        <label for="email">Email</label>
        <input name="email" type="email" required>
        </input>

        <label for="password">Password</label>
        <input name="password" type="password" required>
        </input>
        <button type="submit">Register</button>
        <p class="register-link">
          Already have an account?
          <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
