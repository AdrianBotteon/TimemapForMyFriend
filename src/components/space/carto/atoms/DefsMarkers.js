import React from "react";

const MapDefsMarkers = ({ markers, projectPoint, narrative }) => {
  if (markers === undefined)
    return null;
  return (
    <>
      {
        markers.map(marker => {
          const { x, y } = projectPoint([marker.latitude, marker.longitude])
          return (
            <svg>
              <g
                className={`location-event ${narrative ? "no-hover" : ""}`}
                transform={`translate(${x}, ${y})`}
              >
                <circle cx="0" cy="0" r="10" stroke="black" stroke-width="3" fill="yellow" />
              </g>
            </svg>
          )
        })
      }
    </>
  )
}

export default MapDefsMarkers;
