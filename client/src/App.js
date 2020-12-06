import React, { useState, useEffect } from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Table, Modal, ModalBody, ModalFooter, ModalHeader, Alert } from 'reactstrap';
import axios from 'axios'
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:3000";

function App() {

  const [response, setResponse] = useState([]);
  const [showBuyModel, setShowBuyModel] = useState(false);
  const [showSellModel, setShowSellModel] = useState(false);
  const [selectedStock, setSelectedStock] = useState({});
  const [customerId, setCustomerId] = useState("CX-1020"); // hardcoding 1 sample user present in customer db
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [formvalues, setFormValue] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (paymentHistory.length == 0) {
      getPaymentHistory();
    }
    const socket = socketIOClient.connect(ENDPOINT);
    socket.on("response", data => {
      setResponse(data);
    });
  }, []);

  const getPaymentHistory = async () => {

    try {
      axios
        .get(`${ENDPOINT}/action/customer-info/${customerId}`, {})
        .then((res) => {
          const { status = false, customerData = {} } = res.data;
          if (status) {
            const { holdings = [] } = customerData;
            setPaymentHistory(holdings);

          }
        });
    } catch (e) {
      console.log(e.message);
    }
  }

  const onClickBuy = (data) => {
    setSelectedStock(data);
    setShowBuyModel(true);
    setShowAlert(false);
    setShowError(false);
  }


  const onClickSell = (data) => {
    setSelectedStock(data);
    setShowSellModel(true)
    setShowAlert(false);
    setShowError(false);
  }

  const onClickCloseModal = () => {
    setShowBuyModel(false);
    setShowSellModel(false);

  }

  const handleChange = (event) => {
    setFormValue({ shareNo: event.target.value });
  }

  const onClickExecuteBuy = async () => {
    const { stockId, currentVal, stockName } = selectedStock;
    const { shareNo } = formvalues;

    try {

      axios
        .post(`${ENDPOINT}/action/buy`, {
          stockId,
          currentVal,
          stockName,
          customerId,
          requestedShare: shareNo
        })
        .then((res) => {

          const { status = false, customerData = {} } = res.data;
          if (status) {
            const { holdings = [] } = customerData;
            setPaymentHistory(holdings);
            setShowAlert(true)
            onClickCloseModal();
          } else {
            setShowError(true)
            onClickCloseModal();
          }
        });

    } catch (e) {
      setShowError(true)
      onClickCloseModal();
    }

  }

  const onClickExecuteSell = async () => {
    const { stockId, currentVal, stockName } = selectedStock;
    const { shareNo } = formvalues;
    try {

      axios
        .post(`${ENDPOINT}/action/sell`, {
          stockId,
          currentVal,
          stockName,
          customerId,
          requestedShare: shareNo
        })
        .then((res) => {
          const { status = false, customerData = {} } = res.data;

          if (status) {
            const { holdings = [] } = customerData;
            setPaymentHistory(holdings);
            setShowAlert(true)
            onClickCloseModal();
          } else {
            setShowError(true)
            onClickCloseModal();
          }
        });

    } catch (e) {
      setShowError(true)
      onClickCloseModal();
    }
  }

  const showBuyModal = () => {
    const { stockId, currentVal, stockName } = selectedStock;
    return (
      <>
        <Modal isOpen={showBuyModel} >
          <ModalHeader>{`Action Buy - ${stockName}`}</ModalHeader>
          <ModalBody>
            {`Stock Id - ${stockId} --> `}
            {`stockvalue - ${currentVal}`}
            <input type="number" placeholder="numberOfShares" onChange={handleChange} ></input>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={onClickExecuteBuy} >Buy</Button>{' '}
            <Button color="danger" onClick={onClickCloseModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }

  const showSellModal = () => {
    const { stockId, currentVal, stockName } = selectedStock;
    return (
      <>
        <Modal isOpen={showSellModel} >
          <ModalHeader>{`Action Sell - ${stockName}`}</ModalHeader>
          <ModalBody>
            {`Stock Id - ${stockId} --> `}
            {`stockvalue - ${currentVal}`}
            <input type="number" name="shareNo" placeholder="numberOfShares" onChange={handleChange} ></input>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={onClickExecuteSell}>Sell</Button>{' '}
            <Button color="danger" onClick={onClickCloseModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }

  return (
    <>
      <div className="App">
        <header className="App-header">
          <h1 >Stock Market</h1>
        </header>
        <div className="App-body">
          <div className="App-listing">
            {showAlert && <Alert color="success">
              Success - Transaction was success
           </Alert>}
            {showError && <Alert color="danger">
              Error - Please try after sometime :[
           </Alert>}
            <Table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Value</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {response.map(id => (
                  <tr key={id.stockId}>
                    <td>
                      {`${id.stockName}`}
                    </td>
                    <td>
                      {`${id.currentVal}`}
                    </td>
                    <td>
                      <Button color="success" onClick={() => onClickBuy(id)} >Buy</Button> {' '}
                      <Button color="danger" onClick={() => onClickSell(id)} >Sell</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="App-history">
            <h3>Purchase - History</h3>
            <Table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Value</th>
                  <th>Execution</th>
                  <th>Shares</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map(id => (
                  <tr key={id.stockId}>
                    <td>
                      {`${id.stockName}`}
                    </td>
                    <td>
                      {`${id.value}`}
                    </td>
                    <td>
                      {`${id.action}`}
                    </td>
                    <td>
                      {`${id.shares}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      {showBuyModel && showBuyModal()}
      {showSellModel && showSellModal()}
      <div className="App-footer">@2020 stock pvt lt.</div>
    </>
  );
}



export default App;
