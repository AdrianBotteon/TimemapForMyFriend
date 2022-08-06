import React from "react";

var date = new Date();
var day = date.getDate();
day = day < 10 ? "0" + day : day
var month = date.getMonth() + 1;
month = month < 10 ? "0" + month : month
var year = date.getFullYear();
var today = day + "/" + month + "/" + year;


const MapDefsMarkers = ({ markers, projectPoint, narrative }) => {
  if (markers === undefined)
    return null;
  return (
    <>
      {
        markers.map(marker => {
          const { x, y } = projectPoint([marker.latitude, marker.longitude])
          if (marker.startdate <= today) {
            return (
              <svg>
                <g
                  className={`location-event ${narrative ? "no-hover" : ""}`}
                  transform={`translate(${x}, ${y})`}
                >
                  <circle cx="0" cy="0" r="10" stroke="black" stroke-width="2" 
                  fill= {marker.enddate>=today?"yellow":"none"} stroke-opacity="0.8" fill-opacity="0.8"/>
                </g>
              </svg>
            )
          }
          else return null
        })
      }
    </>
  )
}

export default MapDefsMarkers;
