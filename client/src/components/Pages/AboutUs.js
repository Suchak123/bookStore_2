import React from "react";
import Layout from "../Layout/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import StarsHollowImg from "../../assets/images/bookstore.png";

const AboutUs = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <Layout className="container mx-auto">
      <button className="back-button" onClick={goBack}>
        <FontAwesomeIcon
          icon={faCircleLeft}
          style={{ color: "#004480", height: "40px", margin: "4px" }}
        />
      </button>
      <div className="container mx-auto">
        <h1 className="londrina-color text-4xl font-bold text-center mb-6">
          About Us
        </h1>
        <div className="mb-4 pb-10">
          <div className="flex md:flex-row flex-col md:justify-center gap-10  items-center">
            <div>
              <h2 className="bona text-2xl font-bold text-blue-800 mb-4">
                Our Story
              </h2>
              <p className="text-lg leading-7 md:w-3/5 w-full">
                Nestled in the heart of the charming Kathmandu valley,
                our Bookstore has been a
                beloved online hub. Since our website first
                opened, we've been dedicated to fostering a love for reading and
                providing a warm, welcoming space for book lovers of all ages.
                
              </p>
            </div>

            <div className=" rounded-lg">
              {/* <img src={StarsHollowImg} className="rounded-lg shadow-lg" /> */}
            </div>
          </div>
        </div>
        <div className="flex  md:flex-row flex-col gap-10 justify-between border-y border-blue-800 py-10">
          <div className="md:w-2/5 w-full">
            <h2 className="bona text-2xl font-bold text-blue-800 mb-4">
              A Beloved Community Hub
            </h2>
            <p className="text-lg leading-7">
              For generations, we've been more than just a bookstore. We've
              hosted countless book clubs, author readings, and community
              events, becoming a cornerstone of Stars Hollow's cultural and
              social life. Our friendly staff, always ready with a book
              recommendation or a warm cup of coffee, have helped create a place
              where everyone feels at home.
            </p>
          </div>
          <div className="md:w-2/5 w-full">
            <h2 className="bona text-2xl font-bold text-blue-800 mb-4">
              Going Online
            </h2>
            <p className="text-lg leading-7">
              <p>Contact Us</p>
            </p>
          </div>
        </div>
        <div className="mb-8 pt-10">
          <h2 className="bona text-2xl font-bold text-blue-800 mb-4 text-center">
            Join Us
          </h2>
         
           
          </div>
        </div>
    </Layout>
  );
};

export default AboutUs;
