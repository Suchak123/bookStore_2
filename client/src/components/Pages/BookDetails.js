import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../Layout/Layout";
import BookCard from "../BookCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartPlus,
  faCircleLeft,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../context/cart";
import { useWishlist } from "../../context/wishlist";

const BookDetails = () => {
  const params = useParams();
  const [book, setBook] = useState({});
  const [relatedBooks, setRelatedBooks] = useState([]);
  const navigate = useNavigate();
  const [cart, saveCart] = useCart();
  const [wishlist, setWishlist] = useWishlist();

  useEffect(() => {
    if (params?.slug) {
      getBook();
    }
  }, [params?.slug]);

  const getBook = async () => {
    try {
      const { data } = await axios.get(`/api/v1/book/get-book/${params.slug}`);
      setBook(data?.book);
      getSimilarBooks(data?.book._id, data?.book.genre?._id);
    } catch (error) {
      console.error("Error fetching book:", error);
    }
  };

  const getSimilarBooks = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/book/related-book/${pid}/${cid}`
      );
      setRelatedBooks(data?.books);
    } catch (error) {
      console.log(error);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleAddToCart = () => {
    const updatedCart = [...cart];
    const existingProduct = updatedCart.find((item) => item._id === book._id);
    if (existingProduct) {
      existingProduct.numberOfItems += 1;
    } else {
      updatedCart.push({
        _id: book._id,
        name: book.name,
        slug: book.slug,
        author: book.author?.name,
        price: book.price,
        numberOfItems: 1,
      });
    }
    saveCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Book added to cart");
  };

  const handleAddToWishlist = () => {
    const updatedWishlist = [...wishlist];
    const existingProduct = updatedWishlist.find(
      (item) => item._id === book._id
    );
    if (existingProduct) {
      existingProduct.numberOfItems += 1;
    } else {
      updatedWishlist.push({
        _id: book._id,
        name: book.name,
        author: book.author?.name,
        price: book.price,
        numberOfItems: 1,
      });
    }
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    toast.success("Book added to wishlist");
  };

  return (
    <Layout>
      <button className="back-button" onClick={goBack}>
        <FontAwesomeIcon
          icon={faCircleLeft}
          style={{ color: "#004480", height: "40px", margin: "4px" }}
        />
      </button>
      <div className="container my-10 w-[70vw] mx-auto border-b border-sky-900 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <img
              src={`/api/v1/book/book-photo/${book._id}`}
              alt={book.name}
              className=" h-[70vh] "
            />
          </div>
          <div className="card">
            <div className="card-body">
              <h2 className="bona md:text-5xl text-3xl card-title text-center mb-10  text-blue-800">
                {book.name}
              </h2>
              <div className="title-price flex justify-around border-b border-blue-900 pb-3">
                <div className="author-genre">
                  {book.author && (
                    <p className="md:text-2xl text-xl bona text-blue-900 mb-5 hover:text-sky-600">
                      <span className="londrina-color">Author:</span>{" "}
                      <Link to={`/author/${book.author.slug}`}>
                        {book.author.name}
                      </Link>
                    </p>
                  )}
                  {book.genre && (
                    <p className="md:text-2xl text-xl bona text-blue-900 hover:text-sky-600">
                      <span className="londrina-color">Genre:</span>{" "}
                      <Link to={`/genre/${book.genre.slug}`}>
                        {book.genre.name}
                      </Link>
                    </p>
                  )}
                </div>
                <div className="price">
                  <p className="font-bold md:text-2xl text-xl text-blue-950 ">
                    <span className="londrina-color">Price:</span> NRs. {" "}
                    {book.price}/-
                  </p>
                </div>
              </div>

              <p className="md:pl-10 card-text text-black pt-3 bona md:text-xl text-lg">
                {book.description}
              </p>
              <div className="buttons flex md:flex-row flex-col justify-end md:gap-4 gap-1 px-4 text-lg my-4">
                <button
                  className="bg-blue-800 text-white px-4 py-2 mb-2 rounded-md"
                  onClick={handleAddToCart}
                >
                  <FontAwesomeIcon icon={faCartPlus} />
                  &nbsp; Add to Cart
                </button>
                <button
                  className="bg-blue-800 text-white px-4 py-2 mb-2 rounded-md"
                  onClick={handleAddToWishlist}
                >
                  <FontAwesomeIcon icon={faHeart} /> &nbsp;Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-4 my-10 w-[70vw] mx-auto">
        <h1 className="londrina-color text-3xl text-center">Similar Books</h1>
        {relatedBooks.length < 1 && (
          <h3 className="text-xl font-serif text-center text-blue-600">
            No Similar Books Found
          </h3>
        )}
        <div className="flex flex-wrap gap-10 w-[70vw] mx-auto justify-center mt-4">
          {relatedBooks?.map((p) => (
            <BookCard key={p._id} book={p} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default BookDetails;
