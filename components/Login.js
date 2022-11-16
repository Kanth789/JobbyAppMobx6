import {Component} from 'react'
import Cookies from 'js-cookie'
import './Login.css';
import { Redirect } from 'react-router-dom';
import {observer} from 'mobx-react';
import LoginFormStore from '../Stores/LoginFormStore';
class Login extends Component {
  constructor(props){
    super(props);
    this.loginFormStore = LoginFormStore
  }
  onChangeUsername = event => {
    this.loginFormStore.setUserName(event.target.value)
  }

  onChangePassword = event => {
    this.loginFormStore.setPassword (event.target.value)
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.loginFormStore.setErrorMsg( errorMsg)
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.loginFormStore
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderPasswordField = () => {
  const{password} = this.loginFormStore
    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-filed"
          value={password}
          onChange={this.onChangePassword}
        />
      </>
    )
  }

  renderUsernameField = () => {
    const{username} = this.loginFormStore
    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-input-filed"
          value={username}
          onChange={this.onChangeUsername}
        />
      </>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.loginFormStore
    const jwtToken = Cookies.get('jwt_token')
      if(jwtToken !== undefined)
      {
        return <Redirect to = "/"/>
      }
    return (
      <div className="login-form-container">
        
        
        <form className="form-container" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            className="login-website-logo-desktop-image"
            alt="website logo"
          />
          <div className="input-container">{this.renderUsernameField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>
          <button type="submit" className="login-button">
            Login
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default observer(Login)