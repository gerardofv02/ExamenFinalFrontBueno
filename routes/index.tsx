import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET: () => {
    return new Response("", {
      headers: {
        "location": "/videos",
      },
      status: 303,
    });
  },
};

export default function Home() {
  return (
    <div>
    </div>
  );
}
