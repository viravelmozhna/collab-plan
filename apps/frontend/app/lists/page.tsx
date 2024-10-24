"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import api from "@/components/utils/api";
import { List } from "@/components/utils/types";
import listPage from "./listPage.module.css";

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

      <ul className={listPage["list-page"]}>
        {lists.map((list: List) => (
          <li
            key={list._id}
            className={listPage["list-item"]}
            onClick={() => handleClickOnItem(list._id)}
          >
            <p className={listPage["list-item-text"]}>
              {list.name}
              {list.isOwner ? " (Owned)" : " (Shared with you)"}
            </p>
          </li>
        ))}
      </ul>

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
