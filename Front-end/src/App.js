import React from "react";
import "./App.css";
import Header from "./components/Header";
import MyForm from "./components/MyForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import { Route, BrowserRouter } from 'react-router-dom'
import Displaying from './components/Displaying'



class App extends React.Component {
  state = {
    data: []
  };
  render() {
    //console.log(this.state.data)
    return (
      <BrowserRouter>
        <div className="container">
          <div className="col-md-6 offset-md-3">
            <Header />
            <MyForm onResult={data => {
            this.setState({ data });
          }} />
            <Displaying data={this.state.data} />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
