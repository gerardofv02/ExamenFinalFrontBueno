import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { VideoType } from "../videos.tsx";
import AddFavourite from "../../islands/AddFavourite.tsx";
export const handler: Handlers = {
  GET: async (_req: Request, ctx: FreshContext) => {
    const userId = ctx.state.id;
    const { id } = ctx.params;

    const res = await fetch(
      `https://videoapp-api.deno.dev/video/${userId}/${id}`,
    );

    if (res.status !== 200) {
      const body = await res.json();
      if (body && body.message) {
        return ctx.render({ message: body.message });
      } else {
        return ctx.render({ message: "Error inesperado" });
      }
    } else {
      const video: VideoType = await res.json();

      if (!video) {
        return ctx.render({ video: [] });
      } else {
        return ctx.render({ video: video, userId: userId });
      }
    }
  },
};

const Video = (props: PageProps) => {
  return (
    <div class="video-detail-container">
      <a href="/videos" class="back-button">← Go Back to List</a>
      <div class="video-frame">
        <iframe
          width="100%"
          height="400px"
          src={props.data &&
            `https://youtube.com/embed/${props.data.video.youtubeid}`}
          title={props.data && props.data.video.title}
          frameborder="0"
        >
        </iframe>
        <h2 class="video-detail-title">
          {props.data && props.data.video.title}
        </h2>
        <p class="video-detail-description">
          {props.data && props.data.video.description}
        </p>
        <AddFavourite
          fav={props.data && props.data.video.fav}
          idUser={props.data && props.data.userId}
          idVideo={props.data && props.data.video.id}
        >
        </AddFavourite>
      </div>
    </div>
  );
};

export default Video;
