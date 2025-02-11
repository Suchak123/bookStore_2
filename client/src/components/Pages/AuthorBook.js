import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../Layout/Layout";
import BookCard from "../BookCard";

import LoadingSvg from "../../assets/loadinganimation.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";

const AuthorBook = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [books, setBooks] = useState([]);
  const [author, setAuthor] = useState({});
  const [genre, setGenre] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (params?.slug) getBooksByCat();
  }, [params?.slug]);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/book/book-list/${page}`);
      setLoading(false);
      setBooks([...books, ...data?.books]);
      setGenre(data?.genre);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getBooksByCat = async () => {
    try {
      setFetching(true);
      const { data } = await axios.get(
        `/api/v1/book/book-author/${params.slug}`
      );
      setBooks(data?.books);
      setAuthor(data?.author);
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  };
  const goBack = () => {
    navigate(-1); // Navigate back
  };

  return (
    <Layout>
      <button className="back-button" onClick={goBack}>
        <FontAwesomeIcon
          icon={faCircleLeft}
          style={{ color: "#800000", height: "40px", margin: "4px" }}
        />
      </button>
      <div className="w-[60vw] mx-auto">
        <h3 className="text-center londrina-color text-3xl font-semibold my-5">
          Author :{" "}
          {fetching ? (
            <div className="flex justify-center items-center">
              <img src={LoadingSvg} alt="Loading" className="w-16 h-16" />
            </div>
          ) : (
            <span>{author?.name}</span>
          )}
        </h3>
        <h6 className="text-center text-blue-800 font-bold text-lg">
          {books.length === 0 || books.length === 1
            ? `${books.length} book found`
            : `${books.length} books found`}
        </h6>

        <div className="flex justify-center">
          {fetching ? (
            <div className="flex justify-center items-center">
              <img src={LoadingSvg} alt="Loading" className="w-16 h-16" />
            </div>
          ) : (
            <div className="flex flex-wrap gap-10 w-[70vw] mx-auto justify-center mt-4">
              {books?.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-center mt-5">
          {books && books.length < total && (
            <button
              className="md-rounded btn btn-primary bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
              onClick={() => setPage(page + 1)}
            >
              {loading ? "Loading ..." : "Load More"}
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AuthorBook;
