import React, { useState, useEffect } from "react";
import './Login.css';
import './App.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Input, Alert } from 'reactstrap';
import Dashboard from "./Dashboard";


const ENDPOINT = "http://localhost:3000";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showError, setShowError] = useState("");
    const [loginStatus, setLoginStatus] = useState(false);
    const [custId, setCustId] = useState("");
    const [token, setToken] = useState("");

    const handleChange = (event) => {
        setShowError("");
        if (event.target.name == "username") {
            setUsername(event.target.value);
        } else {
            setPassword(event.target.value);
        }
    }

    const onClickLogin = () => {
        setShowError("");
        if (username && password) {
            axios
                .post(`${ENDPOINT}/action/login`, {
                    username,
                    password
                })
                .then((res) => {
                    const { status = false, customerId = "", authToken = "" } = res.data;
                    if (status) {
                        setToken(authToken);
                        setCustId(customerId);
                        setLoginStatus(true);

                    } else {
                        setShowError("Invalid username and password");
                    }
                })
                .catch((e) => {
                    setShowError("Invalid username and password");
                });

        } else {
            setShowError("Please enter proper details to login!!")
        }
    }

    return (
        <>
            <div className="App-header">
                <h1 >Stock Market</h1>
            </div>
            {!loginStatus && <div>
                {showError && <Alert color="danger">
                    {showError}
                </Alert>}
                <div className="App-login">
                    <h3>Welcome :D</h3>
                    <Input type="text" name="username" placeholder="username" onChange={handleChange} />
                    <br></br>
                    <Input type="password" name="password" placeholder="password" onChange={handleChange} />
                    <br></br>
                    <Button style={{ float: "right" }} color="primary" onClick={onClickLogin} >Login</Button>
                </div>
            </div>}
            {loginStatus && custId && <Dashboard custId={custId} token={token} />}


        </>
    );
}

export default Login;
