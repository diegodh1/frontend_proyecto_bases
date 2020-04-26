import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

class MapContainer extends Component {
    constructor(props) {
      super(props);
      this.state = {
        markers: [
          {
            title: "The marker`s title will appear as a tooltip.",
            name: "SOMA",
            position: { lat: 37.778519, lng: -122.40564 }
          }
        ]
      };
      this.onClick = this.onClick.bind(this);
    }
  
    onClick(t, map, coord) {
      const { latLng } = coord;
      const lat = latLng.lat();
      const lng = latLng.lng();
      alert([lat, lng]);
  
      this.setState(previousState => {
        return {
          markers: [
            ...previousState.markers,
            {
              title: "",
              name: "",
              position: { lat, lng }
            }
          ]
        };
      });
    }
  
    render() {
      return (
        <div>
          <Map
            google={this.props.google}
            style={{ width: "100%" }}
            className={"map"}
            zoom={14}
            onClick={this.onClick}
          >
            {this.state.markers.map((marker, index) => (
              <Marker
                key={index}
                title={marker.title}
                name={marker.name}
                position={marker.position}
              />
            ))}
          </Map>
        </div>
      );
    }
  }
  
export default GoogleApiWrapper({
    apiKey: ("AIzaSyBnLryr9xwcxZRyJCdaqLwSf0JoRkoBxFU")
  })(MapContainer);