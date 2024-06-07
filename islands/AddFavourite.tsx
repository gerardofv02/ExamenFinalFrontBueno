import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";

const AddFavourite: FunctionComponent<
  { fav: boolean; idUser: string; idVideo: string }
> = ({ fav, idUser, idVideo }) => {
  const [mifav, setFav] = useState<boolean>(fav);
  const [err, setErr] = useState<string>();
  const onAddFav = async (idUser: string, idVideo: string) => {
    const res = await fetch(
      `https://videoapp-api.deno.dev/fav/${idUser}/${idVideo}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
      },
    );

    if (res.status !== 200) {
      const body = await res.json();
      if (body && body.message) {
        setErr(body.message);
      } else {
        setErr("Error inesperado");
      }
    } else {
      setFav(!mifav);
    }
  };

  return (
    <div>
      {mifav
        ? (
          <button class="fav-button" onClick={() => onAddFav(idUser, idVideo)}>
            ❤️ Remove from Favorites
          </button>
        )
        : (
          <button class="fav-button" onClick={() => onAddFav(idUser, idVideo)}>
            🤍 Add to Favorites
          </button>
        )}
      {err && err}
    </div>
  );
};

export default AddFavourite;
