import { PageProps } from "$fresh/server.ts";
import Logout from "../islands/Logout.tsx";

export default function Layout({ Component, state }: PageProps) {
  // do something with state here
  return (
    <div class="page-container">
      <header class="header-container">
        <div class="header-content">
          <span class="user-name">{`${state.name || "unknown"}`}</span>
          <Logout></Logout>
        </div>
      </header>
      <Component />
    </div>
  );
}
