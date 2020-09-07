import React from 'react';
import BackgroundHeader from "./images/pattern-bg.png"
import './App.css';
import { Map, Marker, TileLayer } from "react-leaflet";
import ApiKey from "./ApiKeys.js"

//Gotten from https://github.com/PaulLeCam/react-leaflet/issues/453 to fix marker not rendering
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});
//*************************************//

class DisplayMap extends React.Component {
  render() {
    const position = [this.props.items.location.lat, this.props.items.location.lng]

    return (
      <Map center={position} zoom={12}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        <Marker position={position} />
      </Map>
    );
  }
}

class Form extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: "" }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    this.setState({ value: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault()

    this.props.search(this.state.value)
    this.setState({ value: "" })
  }

  render() {
    return (
      <form id="input-wrap" onSubmit={this.handleSubmit}>
        <input
          id="send-text"
          type="text"
          placeholder="Search for any IP address or domain"
          value={this.state.value}
          onChange={this.handleChange} />
      </form>
    )
  }
}

class Display extends React.Component {
  render() {
    return (
      <div className="container">
        <div id="top-half">
          <img src={BackgroundHeader} alt="Background Header" style={{ width: "100%" }} />
          <div id="centered">
            <div style={{ font: "Rubik", fontWeight: 500 }}>IP Address Tracker</div>
            <Form search={this.search} />
          </div>
        </div>
        <table id="banner">
          <thead>
            <tr>
              <th>IP ADDRESS</th>
              <th>LOCATION</th>
              <th>TIMEZONE</th>
              <th style={{ borderRight: "none" }}>ISP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {this.props.items.ip}
              </td>
              <td>
                {`${this.props.items.location.region}, ${this.props.items.location.country}`}<br />{`${this.props.items.location.postalCode}`}
              </td>
              <td>
                {`UTC ${this.props.items.location.timezone}`}{/*<!-- add offset value dynamically using the API -->*/}
              </td>
              <td style={{ borderRight: "none" }}>
                {`${this.props.items.isp}`}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      items: {
        "ip": "0.0.0.0",
          "location": {
          "country": "",
          "region": "",
          "city": "",
          "lat": 0,
          "lng": 0,
          "postalCode": "",
          "timezone": "",
          "geonameId": 0
        },
        "domains": [""],
        "as": {
          "asn": 0,
          "name": "",
          "route": "",
          "domain": "",
          "type": ""
        },
        "isp": "",
        "proxy": {
          "proxy": false,
          "vpn": false,
          "tor": false
        }
      },
      ipSearch: "",
    }

    this.search = this.search.bind(this)
    this.IpApiSetUp = this.IpApiSetUp.bind(this)
  }

  componentDidMount() {
    this.IpApiSetUp(this.state.ipSearch)
  }

  search(value) {
    this.setState({ ipSearch: value })
    this.IpApiSetUp(value)
  }

  IpApiSetUp(ipAddress) {
    fetch(`https://geo.ipify.org/api/v1?apiKey=${ApiKey}&ipAddress=${ipAddress}`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            items: result
          })
        },

        (error) => {
          this.setState({
            error
          })
        }
      )
  }

  render() {
    return (
      <main>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.6.0/leaflet.css" integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==" crossorigin="anonymous" />

        <Display items={this.state.items} />
        <DisplayMap items={this.state.items} />

        <div className="attribution" style={{ zIndex: 2 }} >
          Challenge by <a href="https://www.frontendmentor.io/challenges/ip-address-tracker-I8-0yYAH0" target="_blank" rel="noopener noreferrer">Frontend Mentor</a>.
          Coded by <a href="https://github.com/TAsif" target="_blank" rel="noopener noreferrer">Talha Asif</a>.
        </div>
      </main>
    )
  }
}