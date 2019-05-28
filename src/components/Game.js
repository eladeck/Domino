import React, {Component} from 'react'
import Board from './Board.js';
import Player from './Player.js';
import Grid from './Grid.js';
import Statistics from './Statistics.js'

function formatSeconds(secondsElapsed) {
    const minutes = Math.floor(secondsElapsed / 60);
    const seconds = ('0' + secondsElapsed % 60).slice(-2);
    return minutes + ':' + seconds;
  }

class Game extends Component {
    constructor(props) {
        super(props);

        const shuffledTiles = this.shuffleTiles();
        const firstSix = shuffledTiles.slice(0, 6);
        this.state = {
            tiles: this.createTiles(), // ["00","01", ... ] 
            shuffledTiles: shuffledTiles,
            potTiles: shuffledTiles.slice(6, 28),
            playerTiles: shuffledTiles.slice(0, 6),
            selectedTile:null, // a REAL reference to the tile <div> element! (it's id is selectedTile.id)
           
            //stats
            secondsElapsed: 0,
            totalTurns: 0,
            totalPot: 0,
            avgTimePerTurn: 0,
            score: this.getScoreFromTiles(firstSix)
        }
        
        this.createTiles = this.createTiles.bind(this);
        this.shuffleTiles = this.shuffleTiles.bind(this);
        this.handleSelected = this.handleSelected.bind(this);
        this.tileWasPlaced = this.tileWasPlaced.bind(this);
        this.takeTileFromPot = this.takeTileFromPot.bind(this);
        
        this.handleStartClick = this.handleStartClick.bind(this);
        this.getScoreFromTiles = this.getScoreFromTiles.bind(this);
        
    }
    getScoreFromTiles(playerTiles){
     
        let res = 0;
        for(let i = 0 ; i < playerTiles.length; i++)
            res += parseInt((playerTiles[i])[0]) + parseInt((playerTiles[i])[1]);

        return res;
    }

    handleStartClick() {
        this.incrementer = setInterval(() => {
          this.setState({
            secondsElapsed: (this.state.secondsElapsed + 1)
          });
        }, 1000);
        this.setState({incrementer: this.incrementer});
      }

    handleSelected(selectedTile) {
        // setState => selectedTile gets updated => Game gets rendered => Player props.selectedTile is having className='selected'
        this.setState({
            selectedTile
        })
    } // handleSelected

    takeTileFromPot()
    {
        // console.log("takeTileFromPot was ckicked");
        // console.log("pot" + this.state.potTiles);
        // console.log("player tiles" + this.state.playerTiles);
        console.log("total Seconds" + this.state.secondsElapsed)
        console.log("totalTurns" + this.state.totalTurns);   
        if(this.state.potTiles.length === 0)
            alert("Pot is empty")
        else
        {
            this.setState(prevState => {
                const oldPotTiles = prevState.potTiles;
                const oldPlayerTiles = prevState.playerTiles;
    
                oldPlayerTiles.push(oldPotTiles.splice(oldPotTiles.length -1, 1)[0]);
                return{
                    potTiles: oldPotTiles,
                    playerTiles : oldPlayerTiles,
                    totalTurns: prevState.totalTurns + 1,
                    totalPot: prevState.totalPot + 1,
                    avgTimePerTurn: prevState.secondsElapsed / (prevState.totalTurns + 1 ),
                    score : this.getScoreFromTiles(this.state.playerTiles)
                }
            })
        }

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
                playerTiles,
                totalTurns: prevState.totalTurns + 1,
                avgTimePerTurn: prevState.secondsElapsed / (prevState.totalTurns + 1),
                score : this.getScoreFromTiles(this.state.playerTiles)
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
        console.log("toatal turns: " + this.state.totalTurns)
        return (
            <>
             <h2>{formatSeconds(this.state.secondsElapsed)}</h2>
             <button type="button" onClick={this.handleStartClick}>start</button>
             <button onClick={this.takeTileFromPot}>Pot</button>
                <Statistics 
                    totalTurns = {this.state.totalTurns}
                    totalPot = {this.state.totalPot}
                    avgTimePerTurn={this.state.avgTimePerTurn}
                    score = {this.state.score}
                    />
                    
                <Board 
                    selectedTile={this.state.selectedTile}
                    tileWasPlaced={this.tileWasPlaced}
                />
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