import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import AddFavourite from "../islands/AddFavourite.tsx";
export type VideoType = {
  title: string;
  description: string;
  thumbnail: string;
  id: string;
  youtubeid: string;
  duration: number;
  fav: boolean;
  date: string;
};

export const handler: Handlers = {
  GET: async (_req: Request, ctx: FreshContext) => {
    console.log("Aqui lleog");
    const id = ctx.state.id;
    console.log("Aqui sigo  ");
    console.log(`https://videoapp-api.deno.dev/videos/${id}`);
    const res = await fetch(`https://videoapp-api.deno.dev/videos/${id}`);
    console.log(res);

    if (res.status !== 200) {
      const body = await res.json();
      if (body && body.message) {
        return ctx.render({ message: body.message });
      } else {
        return ctx.render({ message: "Error inesperado" });
      }
    } else {
      const videos: VideoType[] = await res.json();

      if (!videos) {
        return ctx.render({ videos: [] });
      } else {
        return ctx.render({ videos: videos, userId: id });
      }
    }
  },
};

const Videos = (props: PageProps) => {
  return (
    <div class="video-page-container">
      <h1 class="video-list-title">Curso Deno Fresh</h1>
      <div class="video-list-container">
        {props.data && props.data.videos.map((v: VideoType) => {
          return (
            <div class="video-item">
              <a href={`/video/${v.id}`} class="video-link">
                <img class="video-thumbnail" src={v.thumbnail}></img>
                <div class="video-info">
                  <h3 class="video-title">{v.title}</h3>
                  <p class="video-description">{v.description}</p>
                  <p class="video-release-date">{v.date}</p>
                </div>
              </a>
              <AddFavourite
                fav={v.fav}
                idUser={props.data && props.data.userId}
                idVideo={v.id}
              >
              </AddFavourite>
            </div>
          );
        })}
      </div>
      {props && props.data && (
        <div class="error-message">{props.data.message}</div>
      )}
    </div>
  );
};

export default Videos;
