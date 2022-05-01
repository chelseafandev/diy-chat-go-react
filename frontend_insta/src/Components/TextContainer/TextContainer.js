import React from 'react';

import onlineIcon from '../../Icons/onlineIcon.png';

import './TextContainer.css';

const TextContainer = ({ users }) => (
  <div className="textContainer">
    <div>
      <h1 style = {{background : "linear-gradient(90deg, hsla(232, 73%, 65%, 1) 0%, hsla(279, 33%, 48%, 1) 100%)", borderRadius : "5px", padding : "10px", display : "flex", alignItems : "center", justifyContent : "center" }}>InstaChat</h1>
    </div>
    {
      users
        ? (
          <div className = "mainCntnr">
            <h1>People currently chatting:</h1>
            <div className="activeContainer">
              <h2 style = {{color : "hsla(232, 73%, 65%, 1)"}}>
                {users.map((name) => (
                  <div key={name} className="activeItem">
                    {name}
                    <img alt="Online Icon" src={onlineIcon}/>
                  </div>
                ))}
              </h2>
            </div>
          </div>
        )
        : null
    }
  </div>
);

export default TextContainer;
