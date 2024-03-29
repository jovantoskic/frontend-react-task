import React, { Component } from 'react'
import axios from 'axios'
import {Tab, Tabs, TabList, TabPanel} from "react-tabs";

import List from './components/List'
import Grid from './components/Grid'
import OfficeMap from "./components/OfficeMap";

import { store } from "./store";
import { showOffices } from "./actions";
import { connect } from "react-redux";

// import { BrowserRouter as Router, Route, Link } from "react-router-dom"



class App extends Component {
  state = {
      loading:true,
      index:0,
  }

  render() {
      const { loading, index } = this.state
      const { offices } = this.props

      let showOffices = (
          <img className='loading' src="https://media.giphy.com/media/sSgvbe1m3n93G/giphy.gif" alt="loading"/>
      )

      if(!loading && offices !== undefined) {
          showOffices = (
              <Tabs onSelect={index => this.isActive(index)}>
                  <header className='header'>
                      <div className="headline">
                          <h2>Offices</h2>
                      </div>

                      <TabList className='navigation'>
                          <Tab style={index === 0 ? styles.active : styles.notActive}>
                            List
                          </Tab>
                          <Tab style={index === 1 ? styles.active : styles.notActive}>
                              Grid
                          </Tab>
                          <Tab style={index === 2 ? styles.active : styles.notActive}>
                              Map
                          </Tab>
                      </TabList>
                  </header>


                  <TabPanel>
                      <List offices={offices}/>
                  </TabPanel>

                  <TabPanel>
                      <Grid offices={offices}/>
                  </TabPanel>

                  <TabPanel className='map-container'>
                      <OfficeMap coordinates={offices}/>
                  </TabPanel>
              </Tabs>
          )
      }
    return (
        <div className='app'>
            { showOffices }
        </div>
    )
  }

  componentDidMount() {
      this.getData()
  }

    getData = () => {
      axios.get('https://itk-exam-api.herokuapp.com/api/offices')
          .then((response) => {
              if(response.status === 200 || response.status === 201) {
                  this.setState({loading:false})
                  store.dispatch(showOffices(response.data))
              }
          })
          .catch((error) => {
              console.log(error)
          })
  }

  isActive = (index) => {
      this.setState({index:index})
  }
}

const styles = {
    active: {
        borderBottom:'1.5px solid #ffff4d',
        color:'#fff'
    },
    notActive: {
        borderBottom:'1.5px solid transparent',
        color:'#a6dce8'
    }
}


const mapStateToProps = (state) => ({
    ...state
})



export default connect(mapStateToProps)(App);
