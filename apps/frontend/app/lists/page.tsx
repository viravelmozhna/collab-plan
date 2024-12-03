"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import api from "@/utils/api";
import { List } from "@/utils/types";
import ItemCard from "@/components/itemCard";
import itemCard from "@/components/itemCard.module.css";

const ListsPage = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [listName, setListName] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await api.get("/lists/");
        setLists(response.data);
      } catch (error: any) {
        console.log(error.message);
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
      const response = await api.post("/lists/", { name: listName });
      response.data.isOwner = true;
      setLists([...lists, response.data]);
      setListName("");
    } catch (error) {
      console.log("Failed to create list");
    }
  };

  return (
    <div>
      <h1>Your Lists</h1>

      {!!lists.length ? (
        <ul className="list-grid">
          {lists.map((list: List) => (
            <ItemCard
              key={`list_${list._id}`}
              id={list._id}
              classNames={itemCard["list-item"]}
              onClick={handleClickOnItem}
            >
              <p>
                {list.name}
                {list.isOwner ? " (Owned)" : " (Shared with you)"}
              </p>
            </ItemCard>
          ))}
        </ul>
      ) : (
        <p>There is no lists yet...</p>
      )}

      <form onSubmit={handleCreateList}>
        <input
          type="text"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          placeholder="New list name"
          required
        />
        <button type="submit">Add new list</button>
      </form>
    </div>
  );
};

export default ListsPage;
