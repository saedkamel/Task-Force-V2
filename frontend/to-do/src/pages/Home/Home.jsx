import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar.jsx";
import moment from "moment";
import NoteCard from "../../components/Cards/NoteCard.jsx";
import { MdAdd } from "react-icons/md";
import AddEditNote from "./AddEditNote.jsx";
import Modal from "react-modal";
import axiosInstance from "../../utiles/axiosintances.js";

<md></md>;
const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [allTodos, setAllTodos] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  //Get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if ((error.response, error.response.status === 401)) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  //edit
  const handleEdit = (todoDetails) => {
    setOpenAddEditModal({ isShown: true, data: todoDetails, type: "edit" });
  };
  // Get All Notes
  const getAllTodos = async () => {
    try {
      const response = await axiosInstance.get("/get-all-todo");
      if (response.data && response.data.todos) {
        setAllTodos(response.data.todos);
      }
    } catch (error) {
      console.error("un anexpected error occured, please try again", error);
    }
  };

  // delete todo
  const onDelete = async (todoId) => {
    try {
      const response = await axiosInstance.delete(`/delete-todo/${todoId}`);
      if (response.data && !response.data.error) {
        getAllTodos(); // Refresh the list after deletion
        console.log("Todo deleted successfully");
      } else {
        console.log(
          response.data.message || "An error occurred while deleting the todo"
        );
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  useEffect(() => {
    getAllTodos();
    getUserInfo();
    return () => {};
  }, []);

  return (
    <div>
      <NavBar userInfo={userInfo} />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-3 gap-4 mt-8">
          {allTodos.map((item, index) => (
            <NoteCard
              key={item._id}
              title={item.title}
              date={moment(item.createdOn).format("Do MMM YYYY")}
              content={item.content}
              tags={item.tags}
              isPinned={item.isPinned}
              onEdit={() => handleEdit(item)}
              onDelete={() => onDelete(item._id)}
              onPinNote={() => {}}
            />
          ))}
        </div>
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-400 hover:bg-blue-700 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        ariaHideApp={false}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0,2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNote
          type={openAddEditModal.type}
          todoData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add, data:null" });
          }}
          getAllTodos={getAllTodos}
        />
      </Modal>
    </div>
  );
};

export default Home;
