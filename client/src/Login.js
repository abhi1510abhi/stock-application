import React, { useState, useEffect } from "react";
import './Login.css';
import './App.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Input, Alert, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Dashboard from "./Dashboard";


const ENDPOINT = "http://localhost:3000";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [showRegisterModel, setShowRegisterModel] = useState(false);
    const [showError, setShowError] = useState("");
    const [loginStatus, setLoginStatus] = useState(false);
    const [custId, setCustId] = useState("");
    const [token, setToken] = useState("");
    const [showMessage, setShowMessage] = useState("");

    const handleChange = (event) => {
        setShowError("");
        if (event.target.name == "username") {
            setUsername(event.target.value);
        } else if (event.target.name == "name") {
            setName(event.target.value);
        } else {
            setPassword(event.target.value);
        }
    }

    const onClickCloseModal = () => {
        setShowRegisterModel(false)
        setName("");
        setPassword("");
        setUsername("");
        setShowError("");
    }

    const showModal = () => {
        setShowRegisterModel(true);
    }

    const showRegistrationContent = () => {
        return (
            <>
                <Modal isOpen={showRegisterModel} >
                    <ModalHeader>{`Welcome!! Please enter below details to register.`}</ModalHeader>
                    <ModalBody>
                        <Input type="text" name="name" placeholder="name" onChange={handleChange} /> <br></br>
                        <Input type="text" name="username" placeholder="username" onChange={handleChange} /><br></br>
                        <Input type="password" name="password" placeholder="password" onChange={handleChange} /><br></br>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={registerCustomer} >Register</Button>{' '}
                        <Button color="danger" onClick={onClickCloseModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </>
        );
    }

    const registerCustomer = async () => {
        debugger
        if (username && password && name) {
            axios
                .post(`${ENDPOINT}/action/register`, {
                    username,
                    password,
                    name
                })
                .then((res) => {
                    const { status = false } = res.data;
                    if (status) {
                        setShowMessage("Customer registered successfully. Please login now!")
                        onClickCloseModal();
                    } else {
                        setShowError("Invalid username and password");
                    }
                })
        }
        setShowError("Please enter proper details to register!!")
    }

    const onClickLogin = () => {
        setShowError("");
        setShowMessage("");
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
                {showMessage && <Alert color="success">
                    {showMessage}
                </Alert>}
                {showError && <Alert color="danger">
                    {showError}
                </Alert>}
                <div className="App-login">
                    <h3>Welcome :D</h3>
                    <Input type="text" name="username" placeholder="username" onChange={handleChange} />
                    <br></br>
                    <Input type="password" name="password" placeholder="password" onChange={handleChange} />
                    <br></br>
                    <Button onClick={showModal} style={{ float: "left" }}>New User?</Button>
                    <Button style={{ float: "right" }} color="primary" onClick={onClickLogin} >Login</Button>
                </div>
                {showRegisterModel && showRegistrationContent()}
            </div>}
            {loginStatus && custId && <Dashboard custId={custId} token={token} />}


        </>
    );
}

export default Login;
