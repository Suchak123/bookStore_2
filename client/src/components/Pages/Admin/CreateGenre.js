import React, { useEffect, useState } from "react";
import AdminMenu from "./AdminMenu";
import { toast } from "react-toastify";
import axios from "axios";
import GenreForm from "../../Form/GenreForm.js";
import Layout from "../../Layout/Layout.js";

const CreateGenre = () => {
  const [genres, setGenres] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/v1/genre/create-genre", {
        name,
      });
      if (data?.success) {
        toast.success(`${name} is created`);
        setName("");
        getAllGenre();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while creating new genre");
    }
  };

  const getAllGenre = async () => {
    try {
      const { data } = await axios.get("/api/v1/genre/get-genre");
      if (data.success) {
        setGenres(data?.genre);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while getting genres");
    }
  };

  useEffect(() => {
    getAllGenre();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/v1/genre/update-genre/${selected._id}`,
        { name: updatedName }
      );
      if (data.success) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllGenre();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while updating genre");
    }
  };

  const handleDelete = async (pId) => {
    try {
      const { data } = await axios.delete(`/api/v1/genre/delete-genre/${pId}`);
      if (data.success) {
        toast.success(`Genre is deleted`);
        getAllGenre();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while deleting genre");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-3">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-3">
            <AdminMenu />
          </div>
          <div className="md:ml-10 mt-10 col-span-12 md:col-span-9">
            <h1 className="text-sky-800 text-3xl mb-5">Manage Genres</h1>
            <div className="p-3">
              <GenreForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>
            <div className="w-full">
              <table className="w-full rounded-lg">
                <thead>
                  <tr className="bg-sky-800 text-white rounded-lg">
                    <th className="p-2 text-center rounded-tl-lg">S.No.</th>
                    <th className="p-2 text-center ">Name</th>
                    <th className="p-2 text-center rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {genres.map((genre, index) => (
                    <tr key={genre._id} className="border border-gray-300 ">
                      <td className="p-2 text-center flex items-center justify-center">
                        {index + 1}
                      </td>
                      <td className="p-2 text-center">{genre.name}</td>
                      <td className="p-2 flex items-center justify-center md:gap-6">
                        <button
                          className="bg-sky-800 hover:bg-sky-900 text-white font-semibold py-1 px-3 rounded mr-2"
                          onClick={() => {
                            setVisible(true);
                            setUpdatedName(genre.name);
                            setSelected(genre);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-sky-800 hover:bg-sky-900 text-white font-semibold py-1 px-3 rounded"
                          onClick={() => handleDelete(genre._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {visible && (
              <div className="fixed inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="bg-white p-6 rounded-md z-50">
                  <GenreForm
                    value={updatedName}
                    setValue={setUpdatedName}
                    handleSubmit={handleUpdate}
                  />
                  <button
                    className="absolute top-0 right-0 m-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-1 px-3 rounded"
                    onClick={() => setVisible(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateGenre;
