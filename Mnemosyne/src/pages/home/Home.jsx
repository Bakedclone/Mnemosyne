import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getAllBooks } from "./../../redux/actions/book.js";

const Home = () => {
  const { books, loading } = useSelector(state => state.allbooks);
  const dispatch = useDispatch();

  console.log("Books" + books);
  useEffect(() => {
    dispatch(getAllBooks())
  }, [dispatch]);
  return <div>Home</div>;
};

export default Home;
