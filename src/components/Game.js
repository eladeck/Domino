import React, {Component} from 'react'
import Board from './Board.js';
import Player from './Player.js';
import Grid from './Grid.js';


class Game extends Component {
    constructor(props) {
        super(props);

        const shuffledTiles = this.shuffleTiles();

        this.state = {
            tiles: this.createTiles(), // ["00","01", ... ] 
            shuffledTiles: shuffledTiles,
            potTiles: shuffledTiles.slice(6, 28),
            playerTiles: shuffledTiles.slice(0, 6),
            selectedTile:null, // a REAL reference to the tile <div> element! (it's id is selectedTile.id)
        }

        this.createTiles = this.createTiles.bind(this);
        this.shuffleTiles = this.shuffleTiles.bind(this);
        this.handleSelected = this.handleSelected.bind(this);
        this.tileWasPlaced = this.tileWasPlaced.bind(this);
        this.takeTileFromPot = this.takeTileFromPot.bind(this);

        
    }

    handleSelected(theTileItself) {
        const i_Id = theTileItself.id;

        // setState => selectedTile gets updated => Game gets rendered => Player props.selectedTile is having className='selected'
        this.setState(prevState => {
            return {
                selectedTile: prevState.selectedTile === theTileItself ? null : theTileItself
            }
        });
    } // handleSelected

    takeTileFromPot()
    {
        console.log("takeTileFromPot was ckicked");
        console.log("pot" + this.state.potTiles);
        console.log("player tiles" + this.state.playerTiles);


        this.setState(prevState => {
            const oldPotTiles = prevState.potTiles;
            const oldPlayerTiles = prevState.playerTiles;

            oldPlayerTiles.push(oldPotTiles.splice(oldPotTiles.length -1, 1)[0]);
           // console.log("new pot" + oldPotTiles);
         //   console.log("new player tiles" + oldPlayerTiles);
            return{
                potTiles: oldPotTiles,
                playerTiles : oldPlayerTiles
            }
        })

    }

    shuffleTiles() {
        let organized = this.createTiles();
        let shuffled = [];

        var a = [];
        var b = [];

        for (var i = 0; i < 28; i++)
          a.push(i);
        
        for (a, i = a.length; i--; ) {
          var random = a.splice(Math.floor(Math.random() * (i + 1)), 1)[0];
          b.push(random)
        }

        for(let i = 0; i <=27; i++) {
            shuffled[b[i]] = organized[i];
        }

        return shuffled;
    } // shuffleTiles

    tileWasPlaced(tile) {

        // 1. remove this Tile from "player tyles" (once you setThis state, the props to the Player will changed)
        this.setState(prevState => {
            const playerTiles = prevState.playerTiles;
            playerTiles.splice(playerTiles.indexOf(tile.id), 1);
            return {
                selectedTile:null,
                playerTiles
            }
        });
    } // tileWasPlaced

    createTiles() {
        let res = [];
        for(let i = 0; i <= 6; i++) 
            for(let j = 0; j <= 6; j++) 
                if(j >= i) 
                    res.push(`${i}${j}`);
                
        return res;
    }
    
    render() {
        console.log("render pot" + this.state.potTiles);
        console.log("render player tiles" + this.state.playerTiles);
        return (
            <>
                <Board 
                    selectedTile={this.state.selectedTile}
                    tileWasPlaced={this.tileWasPlaced}
                />
                <button onClick={this.takeTileFromPot}>Pot</button>
                <Player 
                    tiles={this.state.playerTiles}
                    tileSelected={this.tileSelected}
                    handleSelected={this.handleSelected}
                    selectedTile={this.state.selectedTile}
                />
            </>
        )
    } // render
} // Game


export default Game