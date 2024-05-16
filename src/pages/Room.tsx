import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Home from "./Home";
import supabase from "@/lib/supabase";

function Room() {
  const { room_id } = useParams();
  const [showOffering, setShowOffering] = useState<boolean>(false);

  async function getRoom() {
    let { data, error } = await supabase
      .from("vr-buddha-room")
      .select()
      .eq("id", room_id);
    if (error) {
      return console.error("Error");
    }
    return data;
  }

  async function addRoom() {
    let currentRoom = await getRoom();
    if (currentRoom && currentRoom.length == 0) {
      let { error } = await supabase
        .from("vr-buddha-room")
        .insert({ id: room_id })
        .select();
      if (error) {
        return console.error("Error");
      }
    }
    return console.log(`ROOM ${room_id} INSERTED`);
  }

  useEffect(() => {
    if (room_id) {
      addRoom();
      let channel = supabase.channel(`vr_${room_id}`);
      channel
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "vr-buddha-room" },
          async (payload) => {
            console.log("Change received!", payload);
            let roomState = await getRoom();
            console.log(roomState);
            if (roomState) {
              console.log(roomState[0].state);
              setShowOffering(roomState[0].state);
            }
          }
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    }
  }, []);

  async function makeRoomStop(room_id: string) {
    let { error } = await supabase
      .from("vr-buddha-room")
      .update({ state: false })
      .eq("id", room_id);
    if (error) {
      return console.error("Error", error);
    }
    return;
  }

  useEffect(() => {
    if (!showOffering && room_id) {
      makeRoomStop(room_id);
    }
  }, [showOffering]);

  return (
    <>
      <Home
        showOffering={showOffering}
        setShowOffering={setShowOffering}
        roomMode={true}
      />
    </>
  );
}

export default Room;
