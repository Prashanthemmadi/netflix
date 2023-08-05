import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errMsg: '',
    showPass: false,
    error: false,
  }

  getUsername = event => {
    this.setState({username: event.target.value})
  }

  getPassword = event => {
    this.setState({password: event.target.value})
  }

  showPassword = () => {
    this.setState(prev => ({showPass: !prev.showPass}))
  }

  submitLogin = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const loginUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.onSuccessLogin(data.jwt_token)
    } else {
      this.onFailLogin(data.error_msg)
    }
  }

  onSuccessLogin = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onFailLogin = errMsg => {
    this.setState({error: true, errMsg})
  }

  render() {
    const {username, password, errMsg, showPass, error} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <img
          className="login-website-logo"
          alt="login website logo"
          src="https://res.cloudinary.com/dkbxi5qts/image/upload/v1660479354/Group_7399_nn7x3u.png"
        />
        <div className="login-form-container">
          <h1 className="login-heading">Login</h1>
          <form onSubmit={this.submitLogin} className="login-form">
            <label className="login-label" htmlFor="usernameInput">
              USERNAME
            </label>
            <br />
            <input
              value={username}
              onChange={this.getUsername}
              placeholder="Username"
              className="login-input1"
              type="text"
              id="usernameInput"
            />
            <br />
            <label className="login-label" htmlFor="passwordInput">
              PASSWORD
            </label>
            <br />
            {showPass ? (
              <input
                type="text"
                value={password}
                placeholder="Password"
                onChange={this.getPassword}
                className="login-input2"
                id="passwordInput"
              />
            ) : (
              <input
                type="password"
                value={password}
                placeholder="Password"
                onChange={this.getPassword}
                className="login-input2"
                id="passwordInput"
              />
            )}

            <br />

            <input
              type="checkbox"
              id="password"
              className="label"
              onChange={this.showPassword}
            />
            <label htmlFor="password" className="label">
              Show Password
            </label>
            <br />

            {error && <p className="err-msg">{errMsg}</p>}
            <button className="sign-in-btn" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
