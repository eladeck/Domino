import React, {Component} from 'react'
import Board from './Board.js';
import Player from './Player.js';
import Grid from './Grid.js';
import Statistics from './Statistics.js'
import cloneDeep from 'lodash/cloneDeep';


function formatSeconds(secondsElapsed) {
    const minutes = Math.floor(secondsElapsed / 60);
    const seconds = ('0' + secondsElapsed % 60).slice(-2);
    return minutes + ':' + seconds;
  }

class Game extends Component {

    
    constructor(props) {
        super(props);
        
        this.statesArray = [];
        const shuffledTiles = this.shuffleTiles();
        const firstSix = shuffledTiles.slice(0, 6);
        this.boardSize = 10;

        this.state = {
            tiles: this.createTiles(), // ["00","01", ... ] 
            shuffledTiles: shuffledTiles,
            potTiles: shuffledTiles.slice(6, 28),
            playerTiles: shuffledTiles.slice(0, 6),
            selectedTile:null, // a REAL reference to the tile <div> element! (it's id is selectedTile.id)
            logicBoard: this.buildBoard(),
            //stats
            secondsElapsed: 0,
            totalTurns: 0,
            totalPot: 0,
            avgTimePerTurn: 0,
            score: this.getScoreFromTiles(firstSix),
            prevTurn: null,
            currentStateIndex: 0
        }
        
        this.createTiles = this.createTiles.bind(this);
        this.shuffleTiles = this.shuffleTiles.bind(this);
        this.handleSelected = this.handleSelected.bind(this);
        this.tileWasPlaced = this.tileWasPlaced.bind(this);
        this.takeTileFromPot = this.takeTileFromPot.bind(this);
        this.updateLogicBoard = this.updateLogicBoard.bind(this);
        this.buildBoard = this.buildBoard.bind(this);

        
        this.handleStartClick = this.handleStartClick.bind(this);
        this.getScoreFromTiles = this.getScoreFromTiles.bind(this);
        this.deepClone = this.deepClone.bind(this);
        this.goPrevTurn = this.goPrevTurn.bind(this);
        this.goNextTurn = this.goNextTurn.bind(this);


        
    }

    buildBoard() {
        const boardSize = this.boardSize;
        let board = [];
        let row = [];
        for(let i = 0; i < boardSize; i++) {
            for(let j = 0; j < boardSize; j++) {
                //row.push(`${i}${j}`);
                row.push(` `);
            }
            board.push(row);
            row = [];
        }

        return board;
    }

    updateLogicBoard(logicBoard) {
        this.setState({
            logicBoard
        })
    }


    deepClone(x){
        
            if (!item) { return item; } // null, undefined values check
        
            var types = [ Number, String, Boolean ], 
                result;
        
            // normalizing primitives if someone did new String('aaa'), or new Number('444');
            types.forEach(function(type) {
                if (item instanceof type) {
                    result = type( item );
                }
            });
        
            if (typeof result == "undefined") {
                if (Object.prototype.toString.call( item ) === "[object Array]") {
                    result = [];
                    item.forEach(function(child, index, array) { 
                        result[index] = clone( child );
                    });
                } else if (typeof item == "object") {
                    // testing that this is DOM
                    if (item.nodeType && typeof item.cloneNode == "function") {
                        result = item.cloneNode( true );    
                    } else if (!item.prototype) { // check that this is a literal
                        if (item instanceof Date) {
                            result = new Date(item);
                        } else {
                            // it is an object literal
                            result = {};
                            for (var i in item) {
                                result[i] = clone( item[i] );
                            }
                        }
                    } else {
                        // depending what you would like here,
                        // just keep the reference, or create new object
                        if (false && item.constructor) {
                            // would not advice to do that, reason? Read below
                            result = new item.constructor();
                        } else {
                            result = item;
                        }
                    }
                } else {
                    result = item;
                }
            }
        
            return result;
        
    }

    goPrevTurn(){
        console.log("goPrevTurn was clicked!");
        this.setState(this.statesArray[this.state.currentStateIndex -1])
        // if(this.state.prevTurn !== null)
        // {
        //     // this.setState(prevState => {
        //     //     return{
        //     //      //   prevTurn: prevState.prevTurn - need to fix this to be maintainability 
        //     //         potTiles: prevState.prevTurn.potTiles,
        //     //         playerTiles: prevState.prevTurn.playerTiles,
        //     //         selectedTile: prevState.prevTurn.selectedTile, // a REAL reference to the tile <div> element! (it's id is selectedTile.id)
                    
        //     //         //stats
        //     //         secondsElapsed: prevState.prevTurn.secondsElapsed,
        //     //         totalTurns: prevState.prevTurn.totalTurns,
        //     //         totalPot: prevState.prevTurn.totalPot,
        //     //         avgTimePerTurn: prevState.prevTurn.avgTimePerTurn,
        //     //         score: prevState.prevTurn.score,
        //     //         prevTurn: prevState.prevTurn.prevTurn,
        //     //         logicBoard: prevState.prevTurn.logicBoard
        //     //     }
        //     // })
        // }

    }

    goNextTurn(){
        console.log("next was clicked!");
        this.setState(this.statesArray[this.state.currentStateIndex + 1])

    }
    deepClone(x) {
        return JSON.parse(JSON.stringify(x));
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
        if(this.state.potTiles.length === 0)
            alert("Pot is empty")
        else
        {
            this.setState(prevState => {
                const oldPotTiles = prevState.potTiles;
                const oldPlayerTiles = prevState.playerTiles;
                this.statesArray.push(cloneDeep(this.state));
                oldPlayerTiles.push(oldPotTiles.splice(oldPotTiles.length -1, 1)[0]);
                return{
                    potTiles: oldPotTiles,
                    playerTiles : oldPlayerTiles,
                    totalTurns: prevState.totalTurns + 1,
                    totalPot: prevState.totalPot + 1,
                    avgTimePerTurn: prevState.secondsElapsed / (prevState.totalTurns + 1 ),
                    score : this.getScoreFromTiles(this.state.playerTiles),
                    currentStateIndex: prevState.currentStateIndex  + 1,
                  //  prevTurn : turns1
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

        this.statesArray.push(cloneDeep(this.state));
        // 1. remove this Tile from "player tyles" (once you setThis state, the props to the Player will changed)
        this.setState(prevState => {
            const playerTiles = prevState.playerTiles;
            playerTiles.splice(playerTiles.indexOf(tile.id), 1);
            return {
                selectedTile:null,
                playerTiles,
                totalTurns: prevState.totalTurns + 1,
                avgTimePerTurn: prevState.secondsElapsed / (prevState.totalTurns + 1),
                score : this.getScoreFromTiles(this.state.playerTiles),
                currentStateIndex: prevState.currentStateIndex  + 1,
             //   prevTurn : turns1
                
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
        // console.log("toatal turns: " + this.state.totalTurns)
         console.log("render" )
         console.log(this.state);
         console.log("stateArray" )
         console.log(this.statesArray);
        return (
            <>
             <h2>{formatSeconds(this.state.secondsElapsed)}</h2>
             <button type="button" onClick={this.handleStartClick}>start</button>
             <button onClick={this.takeTileFromPot}>Pot</button>
             <button onClick={this.goPrevTurn}>back!</button>
             <button onClick={this.goNextTurn}>next!</button>

                <Statistics 
                    totalTurns = {this.state.totalTurns}
                    totalPot = {this.state.totalPot}
                    avgTimePerTurn={this.state.avgTimePerTurn}
                    score = {this.state.score}
                    />
                    
                <Board 
                    selectedTile={this.state.selectedTile}
                    tileWasPlaced={this.tileWasPlaced}
                    updateLogicBoard={this.updateLogicBoard}
                    logicBoard={this.state.logicBoard}

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