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
    let { data, error } = await supabase
      .from("vr-buddha-room")
      .select()
      .order("id", { ascending: true });
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
    <div className="mx-auto max-w-3xl grid p-4 gap-4 items-center h-fit">
      {rooms?.map((e, id) => {
        return (
          <div
            className="h-30 p-3 border-2 rounded-lg h-fit flex flex-col gap-2"
            key={"room" + id}
          >
            <div className="flex justify-between items-center">
              <span>
                Room: <span className="font-bold">{e.id}</span>
              </span>
              <Button
                variant={"destructive"}
                size={"sm"}
                onClick={() => deleteRoom(e.id)}
              >
                <FaTrash />
              </Button>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-5xl">
                {e.state ? <FaCheck color="green" /> : <FaXmark color="red" />}
              </span>
              <div className="flex flex-col gap-4 p-2">
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
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Admin;
