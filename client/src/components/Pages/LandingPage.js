import React from "react";
import { Link } from "react-router-dom";

import Layout from "../Layout/Layout";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";
import "../../assets/stylings/LandingPage.css";
import Genre from "../Genre";

// import HiringImg from "../../assets/images/Graphic Designer.png";
// import JoinBookClubImg from "../../assets/images/bookclub.png";
// import VisitUsImg from "../../assets/images/visitus.png";
import GenreImg from "../../assets/images/book-genres-1024x914.png";
import BookImg from "../../assets/images/top-10-books-every-college-student-read-e1464023124869.jpeg";
import BookShelfImg from "../../assets/images/books-bookshelf-isolated-vector.png";
import NewArrivals from "../NewArrivals";
import FaqSection from "./FaqSection";
import Feature from "../FeatureSection";

const LandingPage = () => {
 

  return (
    <Layout className="container mx-auto">
      <div className="landing-page">
        <div id="hero-section" className="hero-section items-center">
          <div className="content-container flex gap-8 lg:flex-row flex-column items-center mt-0">
            <div className="text-container mt-2">
              <h3 className="londrina text-center lg:text-left font-sans text-4xl mb-4 leading-tight">
                Welcome to BookVerse: EBook Hub 
              </h3>
              <h1 className="text-center lg:text-left font-sans font-bold text-2xl leading-tight mb-6">
                Your Favourite Bookstore, <br />
                 Available Online
              </h1>
              <p className="text-xl text-center md:text-left mb-8">
                Explore our range of books and <br />
                start your adventure today.
              </p>
            </div>

            {/* <div className="carousel-container ml-auto mt-0">
              <Carousel data={CarouselData} />
            </div> */}
          </div>
        </div>

        <div className="downloads-container">
          <div className="stats-details">
            <div className="icon-text">
              <div className="icon">
                <img src={BookImg} alt="Genre" width="100px" height="100px" />
              </div>
              <div className="text mx-2">
                <p className="font-bold text-white text-3xl">20 +</p>
                <p className="text-xl text-white">Genres</p>
              </div>
            </div>
            <div className="icon-text">
              <div className="icon">
                <img src={GenreImg} alt="Books" width="100px" height="100px" />
              </div>
              <div className="text mx-2">
                <p className="font-bold text-white text-3xl">300 +</p>
                <p className="text-xl text-white">Books</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 genres w-[80vw] mx-auto py-5 border-y border-blue-800">
          <h4 className="londrina-color md:text-5xl text-2xl"> Genres</h4>
          <h6 className="bona md:text-xl text-base mb-8">
            Browse Our Extensive Collection of Books Across Different Genres
          </h6>
          <Genre />
        </div>
      </div>

      <div className="mb-5 genres w-[80vw] mx-auto flex flex-col justify-center items-center">
        <img src={BookShelfImg} />
        <button className="text-white bg-sky-800 hover:bg-sky-900 md:text-xl text-lg md:p-5 p-1 rounded-lg font-semibold">
          <Link to={"/AllBooks"}>Browse Our Selection of Books</Link>
        </button>
      </div>
      <div className="mb-5 w-[80vw] mx-auto flex flex-col justify-center items-center border-y border-sky-800">
        <Feature />
      </div>

      <div className="my-10 w-[80vw] mx-auto py-5 border-b border-sky-800">
        <h4 className="londrina-color md:text-5xl text-2xl"> New Arrivals</h4>
        <h6 className="bona md:text-xl text-base mb-8">
          Explore Fresh Arrivals and Find Your Next Great Read
        </h6>
        <NewArrivals />
      </div>
      <div className="mt-10 genres w-[90vw] mx-auto">
        <FaqSection />
      </div>
    </Layout>
  );
};

export default LandingPage;
