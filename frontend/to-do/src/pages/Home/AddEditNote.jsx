import React, { useState } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utiles/axiosintances";

const AddEditNote = ({ todoData = {}, type, onClose, getAllTodos }) => {
  const [title, setTitle] = useState(todoData?.title || "");
  const [content, setContent] = useState(todoData?.content || "");
  const [tags, setTags] = useState(todoData?.tags || "");
  const [error, setError] = useState(null);

  //add new note
  const addNewTodo = async () => {
    try {
      const response = await axiosInstance.post("/add-todo", {
        title,
        content,
        tags,
      });
      if (response.data && response.data.todo) {
        getAllTodos();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.mesage) {
        setError(error.response.data.mesage);
      }
    }
  };
  //edit note
  const editNote = async () => {
    const todoId = todoData._id;
    try {
      const response = await axiosInstance.put("/edit-todo/" + todoId, {
        title,
        content,
        tags,
      });
      if (response.data && response.data.todo) {
        getAllTodos();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.mesage) {
        setError(error.response.data.mesage);
      }
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Please insert title");
      return;
    }
    if (!content) {
      setError("Please insert content");
      return;
    }

    setError("");

    if (type === "edit") {
      editNote();
    } else {
      addNewTodo();
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-gray-500"
        onClick={onClose}
      >
        <MdClose className="text-xl text-gray-300 hover:text-white" />
      </button>
      <div className="flex flex-col gap-2">
        <label className="input-label">Title</label>
        <input
          type="text"
          className="text-2xl text-gray-800 outline-none"
          placeholder="Go To Gym at 5"
          value={title}
          onChange={({ target }) => {
            setTitle(target.value);
          }}
        ></input>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">CONTENT</label>
        <textarea
          type="text"
          className="text-sm text-gray-800 outline-none bg-gray-300 p-2 rounded"
          placeholder="Content"
          rows={10}
          value={content}
          onChange={({ target }) => {
            setContent(target.value);
          }}
        ></textarea>
      </div>

      <div className="mt-3">
        <label className="input-label">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-xs font-bold pt-4">{error}</p>}
      <button
        className="btn-primary mt-5 font-medium p-4 "
        onClick={handleAddNote}
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNote;
