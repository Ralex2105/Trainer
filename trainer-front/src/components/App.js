import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/App.css";
import Login from "./auth/Login";
import Register from "./auth/Registration";
import Profile from "./auth/Profile";
import Tasks from "./tasks/Tasks";
import AddTask from "./tasks/AddTask";
import NavigateComponent from "../helpers/navigate";
import Task from "./tasks/Task";
import GeneratorTest from "./tests/GeneratorTest";
import Test from "./tests/Test";
import { ToastContainer } from "react-toastify";
import Cards from "./cards/Cards";
import AddCard from "./cards/AddCard";
import Card from "./cards/Card";
import NavBar from "./navBar";
import Users from "./admin/Users";
import Map from "./map/Map";
import Modal from "./map/Modal";

class App extends Component {
  render() {
    return (
      <BrowserRouter navigate={Navigate}>
        <NavBar />
        
        <div className="container mt-3">
          <Routes>
            <Route
              exact
              path="/"
              element={<NavigateComponent Component={Register} />}
            />
            <Route
              exact
              path="/login"
              element={<NavigateComponent Component={Login} />}
            />
            <Route
              exact
              path="/register"
              element={<NavigateComponent Component={Register} />}
            />
            <Route
              exact
              path="/profile"
              element={<NavigateComponent Component={Profile} />}
            />
            <Route
              exact
              path="/tasks"
              element={<NavigateComponent Component={Tasks} />}
            />
            <Route
              exact
              path="/tasks/add"
              element={<NavigateComponent Component={AddTask} />}
            />
            <Route
              exact
              path="/tasks/:id"
              element={<NavigateComponent Component={Task} />}
            />
            <Route
              exact
              path="/test/generate"
              element={<NavigateComponent Component={GeneratorTest} />}
            />
            <Route
              exact
              path="/test"
              element={<NavigateComponent Component={Test} />}
            />
            <Route
              exact
              path="/users"
              element={<NavigateComponent Component={Users} />}
            />
            <Route
              exact
              path="/cards"
              element={<NavigateComponent Component={Cards} />}
            />
            <Route
              exact
              path="/cards/add"
              element={<NavigateComponent Component={AddCard} />}
            />
            <Route
              exact
              path="/cards/:id"
              element={<NavigateComponent Component={Card} />}
            />
            <Route
              exact
              path="/map/"
              element={<NavigateComponent Component={Map} />}
            />
          </Routes>
        </div>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </BrowserRouter>
    );
  }
}

export default App;
