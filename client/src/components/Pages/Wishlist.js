import React from "react";
import Layout from "../Layout/Layout";
import { useWishlist } from "../../context/wishlist";
import { useCart } from "../../context/cart";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartPlus,
  faCircleLeft,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

import BookShelfImg from "../../assets/images/books-bookshelf-isolated-vector.png";

const Wishlist = () => {
  const [wishlist, setWishlist] = useWishlist();
  const [cart, saveCart] = useCart();
  const navigate = useNavigate();

  
  const handleAddToCart = (book) => {
    const updatedCart = [...cart];
    const existingProduct = updatedCart.find((item) => item._id === book._id);
    if (existingProduct) {
      existingProduct.numberOfItems += 1;
    } else {
      updatedCart.push({
        _id: book._id,
        name: book.name,
        author: book.author,
        price: book.price,
        numberOfItems: 1,
      });
    }
    saveCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Book added to cart");
  };

  const handleRemoveFromWishlist = (book) => {
    const updatedWishlist = wishlist.filter((item) => item._id !== book._id);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    toast.success("Book removed from wishlist");
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Layout>
      <button className="m-4" onClick={goBack}>
        <FontAwesomeIcon
          icon={faCircleLeft}
          style={{ color: "#004480", height: "40px", margin: "4px" }}
        />
      </button>
      <div className="container mx-auto p-4">
        {wishlist.length === 0 ? (
          <>
            <p className="londrina-color text-center text-3xl">
              Your wishlist is empty.
            </p>
            <div className="mb-5 genres w-[60vw] mx-auto flex flex-col justify-center items-center">
              <img src={BookShelfImg} />
              <button className="text-white bg-blue-800 hover:bg-blue-900 md:text-xl text-lg md:p-5 p-1 rounded-lg font-semibold">
                <Link to={"/AllBooks"}>Browse Our Selection of Books</Link>
              </button>
            </div>
          </>
        ) : (
          <div className="w-[80vw] mx-auto">
            <div className="flex justify-between items-end mb-6">
              <h2 className="londrina-color text-3xl mb-2">My wishlist </h2>
            </div>

            {wishlist.map((book) => (
              <div
                key={book._id}
                className="flex justify-between border-b border-blue-800 py-2"
              >
                <div className="flex gap-10">
                  <div className="py-4 md:px-4 px-1">
                    <img
                      src={`/api/v1/book/book-photo/${book._id}`}
                      alt={book.name}
                      className="md:w-[130px] w-[100px] h-full rounded-md shadow-lg"
                    />
                  </div>
                  <div className="flex flex-col justify-between my-2">
                    <div className="flex flex-col">
                      <span className="font-bold md:text-2xl text-lg">
                        {book.name}
                      </span>
                      <span className="text-gray-600 md:text-xl text-base">
                        {book.author}
                      </span>
                    </div>
                    <div className="flex md:flex-row flex-col gap-4 items-start">
                      <button
                        className="text-sky-800 hover:text-sky-900 font-semibold flex gap-1 items-center md:text-lg text-base"
                        onClick={() => handleRemoveFromWishlist(book)}
                      >
                        <FontAwesomeIcon icon={faTrash} className="" />
                        Remove
                      </button>
                      <button
                        className="text-sky-800 hover:text-sky-900 font-semibold flex gap-1 items-center md:text-lg text-base"
                        onClick={() => handleAddToCart(book)}
                      >
                        <FontAwesomeIcon icon={faCartPlus} className="" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Wishlist;
