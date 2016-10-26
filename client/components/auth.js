import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadAnalysis, login, logout } from '../actions'
import Auth0Lock from 'auth0-lock';
let AUTH0_CLIENT_ID='iIkWEtI63PrpAYxSrOZJcO3Y7o3yIiuw';
let AUTH0_DOMAIN='camelliatree.auth0.com';

export default class Auth extends Component {
  constructor(props) {
    super(props)

    const lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN,{})
    const url = window.location.hash
    const start = url.indexOf('&id_token')+10;
    const end=url.indexOf('&token_type');
    const token=url.substring(start,end);
    const that=this;
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.handleGetAnalysisClick = this.handleGetAnalysisClick.bind(this);

    lock.getProfile(token, function(error, profile) {
        if (error) {
          console.log(error);
        }
        console.log('profile:',profile)
        if(profile) {
          localStorage.setItem('id_token', token);
          localStorage.setItem('profile', JSON.stringify(profile));
          that.checkAuthentication();
        }
    })

  }

  checkAuthentication() {
    if(localStorage.getItem('id_token')) {
      this.setState({
        isAuthenticated: true,
        profile: JSON.parse(localStorage.getItem('profile'))
      })
    }
  }

  componentWillMount() {
    this.checkAuthentication()
  }


  handleGetAnalysisClick() {
    this.props.loadAnalysis(this.state.profile.identities.user_id)
    console.log(this.state.analysisResult)
  }



  handleLogoutClick() {
    this.props.logout()
  }

  render() {
    const { onLoginClick, onLogoutClick, isAuthenticated, profile } = this.props

    return (
      <div style={{ marginTop: '10px' }}>
        { !isAuthenticated ? (
          <div></div>
        ) : (
          <ul className="list-inline">
            <li><img src={profile.picture} height="40px" /></li>
            <li><span>Hello, {profile.nickname}!</span></li>
            <li><button className="btn btn-primary" onClick={this.handleLogoutClick}>Logout</button></li>
            <li><button className="btn btn-success" onClick={this.handleGetAnalysisClick}>Analyze your personality</button></li>
          </ul>
        )}
      </div>
    )
  }
}