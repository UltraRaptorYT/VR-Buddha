import { useState, useEffect } from "react";
import supabase from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FaTrash, FaXmark, FaCheck } from "react-icons/fa6";
import { RoomType } from "@/types";

function Admin() {
  const [rooms, setRooms] = useState<RoomType[]>();

  useEffect(() => {
    let channel = supabase.channel(`admin`);
    channel
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vr-buddha-room" },
        async (payload) => {
          console.log("Change received!", payload);
          await getRooms();
        }
      )
      .subscribe();

    getRooms();
    return () => {
      channel.unsubscribe();
    };
  }, []);

  async function deleteRoom(room_id: string) {
    let { error } = await supabase
      .from("vr-buddha-room")
      .delete()
      .eq("id", room_id);
    if (error) {
      return console.error("Error", error);
    }
    console.log(`ROOM ${room_id} DELETED`);
    return getRooms();
  }

  async function getRooms() {
    let { data, error } = await supabase.from("vr-buddha-room").select();
    if (error) {
      return console.error("Error", error);
    }
    if (data) {
      setRooms(data);
    }
    console.log(data);
    return data;
  }

  async function makeRoomManual(room_id: string, checked: boolean) {
    let { error } = await supabase
      .from("vr-buddha-room")
      .update({ manual: checked })
      .eq("id", room_id);
    if (error) {
      return console.error("Error", error);
    }
    return;
  }
  async function makeRoomPlay(room_id: string, checked: boolean) {
    let { error } = await supabase
      .from("vr-buddha-room")
      .update({ state: checked })
      .eq("id", room_id);
    if (error) {
      return console.error("Error", error);
    }
    return;
  }

  return (
    <div className="mx-auto max-w-xl h-full grid grid-cols-2">
      {rooms?.map((e, id) => {
        return (
          <div className="h-30 p-3 border-2 rounded-lg" key={"room" + id}>
            Room: {e.id}
            <Button
              variant={"secondary"}
              size={"sm"}
              onClick={() => deleteRoom(e.id)}
            >
              <FaTrash />
            </Button>
            <span className="text-2xl">
              {e.state ? <FaCheck color="green" /> : <FaXmark color="red" />}
            </span>
            <div className="flex items-center space-x-2">
              <Switch
                id="manual-mode"
                onCheckedChange={(checked) => {
                  makeRoomPlay(e.id, checked);
                }}
                checked={e.state}
              />
              <Label htmlFor="manual-mode">Update State</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="manual-mode"
                onCheckedChange={(checked) => {
                  makeRoomManual(e.id, checked);
                }}
                checked={e.manual}
              />
              <Label htmlFor="manual-mode">Manual Mode</Label>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Admin;
