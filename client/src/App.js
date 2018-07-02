import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import { api, setJwt } from './api/init'
import Bookmark from './components/Bookmark'
import SignIn from './components/SignIn'

class App extends Component {
  state = {
    bookmarks: [],
    token: null,
    loginError: null
  }

  handleSignIn = async (event) => {
    try {
      event.preventDefault()
      const form = event.target
      const response = await api.post('/auth/login', {
        email: form.elements.email.value,
        password: form.elements.password.value
      })
      this.setState({ token: response.data.token })
      setJwt(response.data.token)
    } catch (error) {
      this.setState({ loginError: error.message })
    }
  }

  remove = (id) => { // id = Mongo _id of the bookmark
      const index = this.state.bookmarks.findIndex(bookmark => bookmark._id === id)
      if (index >= 0) {
        const bookmarks = [...this.state.bookmarks]
        bookmarks.splice(index, 1)
        this.setState({ bookmarks })
      }
  }

  render() {
    const { bookmarks } = this.state
    return (
      <div className="App">
        {
          this.state.token ? (
            <p>You are logged in with token: { this.state.token }</p>
          ) : (
            <SignIn loginError={this.state.loginError} handleSignIn={this.handleSignIn} />
          )
        }
        <h1>Bookmarks</h1>
        <ul>
        {
          bookmarks.map(
            bookmark => <Bookmark key={bookmark._id} {...bookmark} remove={this.remove} />
          )
        }
        </ul>
      </div>
    );
  }

  async componentDidMount() {
    try {
      const bookmarks = await axios.get(
        'http://localhost:3000/bookmarks'
      )
      this.setState({ bookmarks: bookmarks.data })
    }
    catch(error) {
      alert('Can\'t get bookmarks!')
    }
  }
}


export default App;
