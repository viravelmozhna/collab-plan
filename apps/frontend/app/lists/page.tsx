"use client";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import ItemCard from "@/components/itemCard";
import Loader from "@/components/loader";
import api from "@/utils/api";
import { List } from "@/utils/types";
import { NotificationContext } from "@/context/notification-context";

const ListsPage = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [listName, setListName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const notification = useContext(NotificationContext);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/lists/");
        setLists(response.data);
      } catch (error) {
        notification?.updateNotification("Failed to fetch projects", "error");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLists();
  }, []);

  const handleClickOnItem = (id: string) => {
    router.push(`/lists/${id}`);
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await api.post("/lists/", { name: listName });
      response.data.isOwner = true;
      setLists([...lists, response.data]);
      setListName("");
      notification?.updateNotification(
        "Project created successfully",
        "success"
      );
    } catch (error) {
      notification?.updateNotification("Failed to create a project", "error");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <ul className="grid grid-cols-4 gap-12">
          {lists.map((list: List) => (
            <ItemCard
              key={`list_${list._id}`}
              id={list._id}
              classNames="flex h-100 p-12 cursor-pointer bg-white shadow-md"
              onClick={handleClickOnItem}
            >
              {!list.isOwner && (
                <span className="w-60 h-40 p-4 mr-8 rounded-lg -rotate-12 bg-yellowish text-xs text-white text-center">
                  Shared with you
                </span>
              )}
              <span className="h-76 break-words text-ellipsis overflow-hidden multi-line-ellipsis">
                {list.name}
              </span>
            </ItemCard>
          ))}
        </ul>
      )}

      {!lists.length && !isLoading && <p>There is no lists yet...</p>}

      <form onSubmit={handleCreateList}>
        <input
          type="text"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          placeholder="New project name"
          required
        />
        <button type="submit">Add new project</button>
      </form>
    </>
  );
};

export default ListsPage;
