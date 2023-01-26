import logo from "./logo.svg";
import "./App.css";

import { useState } from "react";

import { Link, Redirect, withRouter } from "react-router-dom";

import axios from "axios";

const App = (props) => {
  const [formData, setFormData] = useState({});

  const formHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  console.log(formData);

  const getData = async () => {
    console.log("get Triggered");
    const getMethod = await axios.get("/api/get");
    console.log(getMethod.data);
  };
  const postData = async (event) => {
    event.preventDefault();
    console.log("post triggered");
    const postMethod = await axios.post("/api/post", {
      username: formData.username,
      password: formData.password,
      updateName: formData.modify,
    });
    console.log(postMethod.data);
  };

  const putData = async (event) => {
    event.preventDefault();
    console.log("put triggered");
    const putMethod = await axios.put("/api/put", {
      username: formData.username,
      updateName: formData.modify,
    });
    console.log(putMethod.data);
  };

  const change = () => {
    const { history } = props;
    history.replace("/test");
  };

  return (
    <div className="main">
      <form onSubmit={postData}>
        <label htmlFor="user-name">USERNAME</label>
        <input
          type="text"
          id="user-name"
          name="username"
          onChange={formHandler}
        />
        <label htmlFor="password">PASSWORD</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={formHandler}
        />
        <label htmlFor="modify">MODIFIED NAME</label>
        <input type="text" id="modify" name="modify" onChange={formHandler} />
        <button type="submit">SUBMIT</button>
      </form>
      <button type="button" onClick={getData}>
        GET
      </button>
      <button type="button" onClick={putData}>
        PUT
      </button>

      <button type="button" onClick={change}>
        Redirect
      </button>
    </div>
  );
};

export default withRouter(App);
