import React, { Component } from "react";
import Tile from './Tile.js'

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //tiles: this.props.tiles // FOR NEW WE USED ONLY THE props.tiles
    };

    this.handleClick = this.handleClick.bind(this);
  } 
  


  
  handleClick(event) {
    const tile = event.target.closest('div');
    if(tile) {
      this.props.handleSelected(tile);
    }
  } // handleClick

  render() {
    return (
        <div onClick={this.handleClick} >
            {this.props.tiles.map(indices =>
               <Tile
                 key={indices}
                 top={indices[0]}
                 bottom={indices[1]}
                 isSelected={this.props.selectedTile && this.props.selectedTile.id === indices}
              /> 
              )}
        </div>
    );
  } // render
} // Player Component

export default Player;