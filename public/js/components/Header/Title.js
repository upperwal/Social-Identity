import React from "react";
import {Link} from 'react-router-dom';

export default class Title extends React.Component {
  render() {
    return (
    	<div class="container">
    		<h1>Identity Chain by Team <b>Merkle</b></h1>
    		<p>Now own your Identity and keep it safe on the <b>Blockchain</b>.</p>
    		<br/>
    		<Link to={`/`} class="home-link">HOME</Link>
    	</div>
      
    );
  }
}
