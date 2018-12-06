import React, {Component} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import {ApolloProvider, Query} from "react-apollo";

import './App.css';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Summoners from './components/Summoners';
import Footer from './components/Footer';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import Error from './components/Error';
import gql from "graphql-tag";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql"
})


const ExchangeRates = () => (
    <Query
        query={gql`
      query {
  getAllUsers {
    summoner
    server
    languages {
      lang
    }
  }
}
    `}
        errorPolicy="all"
    >
      {({ loading, error, data }) => {
        if (loading) return <p>Loading...</p>;

        return (
            <div style={{backgroundColor: 'yellow'}}>

              {
                data.getAllUsers.forEach(d => {
                  return <h1 style={{backgroundColor: 'yellow'}} >{d.summoner }</h1>
                })
              }
            </div>
        );
      }}
    </Query>
);

// TODO: override ant-design font-family
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <ApolloProvider client={client}>
          <div>
            <Navigation />
            <Switch>
              <Route path="/" component={Home} exact />
              <Route path="/summoners" component={Summoners} />
              <Route path="/login" component={LogIn}/>
              <Route path="/signup" component={SignUp}/>
              <Route component={Error} />
            </Switch>
            <Footer />
          </div>
        </ApolloProvider>
      </BrowserRouter>
    );
  }
}

export default App;
