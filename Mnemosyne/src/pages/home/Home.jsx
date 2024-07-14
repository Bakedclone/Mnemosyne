import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getAllBooks } from "./../../redux/actions/book.js";

const Home = () => {
  const { book, loading } = useSelector(state => state.book);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Books " + book);
    dispatch(getAllBooks())
  }, [dispatch]);
  return <div className="container">Home</div>;
};

export default Home;
