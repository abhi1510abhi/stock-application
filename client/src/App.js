import React from "react";
import Login from "./Login";
import { BrowserRouter as Router, Route } from 'react-router-dom';
function App() {

  return (
    <Router>
      <Route path="/" component={Login} />
    </Router>
  );
}


export default App;
