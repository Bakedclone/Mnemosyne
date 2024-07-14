import HeroBanner from "./HeroBanner";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getAllBooks } from "./../../redux/actions/book.js";
import NewArrivals from "./NewArrivals";
import Trending from "./Trending";

const Home = () => {
  const { book, loading } = useSelector((state) => state.book);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Books " + book);
    dispatch(getAllBooks());
  }, [dispatch]);
  return (
    <>
      <HeroBanner />
      <div className="container flex flex-row items-center space-x-4 ">
        <NewArrivals />
        <Trending />
      </div>
    </>
  );
};

export default Home;
