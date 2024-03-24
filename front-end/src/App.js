import "./App.css";
import {Route,Routes} from "react-router-dom"
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage"
import Home from "./pages/Home";
import BlogDetails from "./pages/BlogDetails"
import NavbarC from "./components/Navbar";
import Dashboard from './pages/Dashboard';
import PrivateRoute from "./components/PrivateRoute";
import CreateBlog from "./pages/CreateBlog";
import UpdateBlog from "./components/UpdateBlog";
import FooterC from "./components/Footer";
import Search from "./components/Search";
import About from "./components/About";
function App() {
  return (
    <div className="flex flex-col flex-wrap dark bg-[rgb(16,23,42)] text-gray-200">
      <NavbarC/>
      <Routes>
      <Route path="/"  element={<Home/>}/>
        <Route path="/login"  element={<LoginPage/>}/>
        <Route path="/Register"  element={<RegisterPage/>}/>
        <Route path="/about"  element={<About/>}/>
        <Route path="/search"  element={<Search/>}/>
        <Route path="/blogs/blog/:blogId"  element={<BlogDetails/>}/>
        <Route element={<PrivateRoute/>}>
          <Route path="/dashboard" element={<Dashboard/>}/>
        </Route>
        <Route path="/createBlog"  element={<CreateBlog/>}/>
        <Route path="/updateBlog/:blogId"  element={<UpdateBlog/>}/>
      </Routes>
      <FooterC/>
    </div>
  );
}

export default App;
