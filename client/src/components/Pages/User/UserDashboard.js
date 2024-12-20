import React from "react";
import { useNavigate } from "react-router-dom";
import UserMenu from "./UserMenu";
import { useAuth } from "../../../context/auth";
import Layout from "../../Layout/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  const goBack = () => {
    navigate(-1); // Navigate back
  };
  return (
    <Layout>
      <button onClick={goBack}>
        <FontAwesomeIcon
          icon={faCircleLeft}
          style={{ color: "#004480", height: "40px", margin: "4px" }}
        />
      </button>
      <div className="container mx-auto my-3 px-3">
        <div className="md:flex">
          <div className="md:w-1/4">
            <UserMenu />
          </div>

          <div className="md:w-3/4 m-4">
            <div className="bg-white shadow-md p-4 rounded-md">
              <div>
                <h1
                  className="mb-3 text-sky-800 font-bold text-4xl text-center"
                  style={{
                    fontFamily: "sans-serif",
                  }}
                >
                  Hello {auth?.user?.username}!
                </h1>
                <h5
                  className="text-sky-800 text-xl font-medium text-center"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  We're glad to have you here at BookVerse. <br />
                  Explore the features and make the most of your dashboard
                  experience.
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
