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
              // onClick={(e) => handleEventSelect(e, location)}
              >
                {/* <path d="M150 0 L75 200 L225 200 Z" /> */}
                <circle cx="0" cy="0" r="10" stroke="black" stroke-width="3" fill="yellow" />
              </g>
            </svg>
          )
        })
      }
    </>
  )
}
// const { x, y } = projectPoint([31.3424027, 34.7135396])



// <svg>
//   <defs>
//     <marker
//       id="arrow"
//       viewBox="0 0 6 6"
//       refX="3"
//       refY="3"
//       markerWidth="6"
//       markerHeight="6"
//       orient="auto"
//     >
//       <path d="M0,3v-3l6,3l-6,3z" style={{ fill: "blue" }} />
//     </marker>
//     <marker
//       id="arrow-off"
//       viewBox="0 0 6 6"
//       refX="3"
//       refY="3"
//       markerWidth="6"
//       markerHeight="6"
//       orient="auto"
//     >
//       <path
//         d="M0,3v-3l6,3l-6,3z"
//         style={{ fill: "black", fillOpacity: 0.2 }}
//       />
//     </marker>
//   </defs>
// </svg>



export default MapDefsMarkers;
