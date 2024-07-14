import "./App.css";
import { Button } from "@/components/ui/button";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import LogIn from "./pages/authForm/LogIn";
import SignUp from "./pages/authForm/SignUp";
function App() {
  return (
    <>
      <BrowserRouter>
    <div className="flex flex-col h-screen justify-between ">
      <Header />
      <div className="flex-grow ">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<LogIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
        {/* <Route path="*" element={<PageNotFound />} /> */}
        {/* <Route path="/about" element={<About />} /> */}
      </Routes>
      </div>
      <Footer />
      </div>
    </BrowserRouter>
    </>
  );
}

export default App;
