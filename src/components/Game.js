import React, {Component} from 'react'
import Board from './Board.js';
import Player from './Player.js';
import Grid from './Grid.js';
import Statistics from './Statistics.js'
import cloneDeep from 'lodash/cloneDeep';
import Back from './back.png'
import Front from './front.png'


function formatSeconds(secondsElapsed) {
    const minutes = Math.floor(secondsElapsed / 60);
    const seconds = ('0' + secondsElapsed % 60).slice(-2);
    return minutes + ':' + seconds;
  }

class Game extends Component {

    
    constructor(props) {
        super(props);
        this.isGameStated = false;
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
            currentStateIndex: 0,
            isGameStated: false
        }
        
        this.createTiles = this.createTiles.bind(this);
        this.shuffleTiles = this.shuffleTiles.bind(this);
        this.handleSelected = this.handleSelected.bind(this);
        this.tileWasPlaced = this.tileWasPlaced.bind(this);
        this.takeTileFromPot = this.takeTileFromPot.bind(this);
        this.updateLogicBoard = this.updateLogicBoard.bind(this);
        this.buildBoard = this.buildBoard.bind(this);
        this.handelUndoClcik = this.handelUndoClcik.bind(this);
        
        this.handleStartClick = this.handleStartClick.bind(this);
        this.getScoreFromTiles = this.getScoreFromTiles.bind(this);
        this.deepClone = this.deepClone.bind(this);
        this.handelPrevClick = this.handelPrevClick.bind(this);
        this.handelNextClick = this.handelNextClick.bind(this);
        this.handleOpenMenuSatrtClick = this.handleOpenMenuSatrtClick.bind(this);

        
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
    handelUndoClcik(){
        console.log("handelUndoClcik");
        this.handelPrevClick();
        this.statesArray.pop();
    }
    handleOpenMenuSatrtClick()
    {
        console.log("i was clicked! mother fuckers");
        this.setState({isGameStated : true});
    }

    updateLogicBoard(logicBoard) {
        this.setState({
            logicBoard
        })
    }


        
     deepClone(obj) {
        var visitedNodes = [];
        var clonedCopy = [];
        function clone(item) {
            if (typeof item === "object" && !Array.isArray(item)) {
                if (visitedNodes.indexOf(item) === -1) {
                    visitedNodes.push(item);
                    var cloneObject = {};
                    clonedCopy.push(cloneObject);
                    for (var i in item) {
                        if (item.hasOwnProperty(i)) {
                            cloneObject[i] = clone(item[i]);
                        }
                    }
                    return cloneObject;
                } else {
                    return clonedCopy[visitedNodes.indexOf(item)];
                }
            }
            else if (typeof item === "object" && Array.isArray(item)) {
                if (visitedNodes.indexOf(item) === -1) {
                    var cloneArray = [];
                    visitedNodes.push(item);
                    clonedCopy.push(cloneArray);
                    for (var j = 0; j < item.length; j++) {
                        cloneArray.push(clone(item[j]));
                    }
                    return cloneArray;
                } else {
                    return clonedCopy[visitedNodes.indexOf(item)];
                }
            }
    
            return item; // not object, not array, therefore primitive
        }
        return clone(obj);
    }
    



    handelPrevClick(){
        console.log("handelPrevClick was clicked!");
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

    handelNextClick(){
        console.log("next was clicked!");
        this.setState(this.statesArray[this.state.currentStateIndex + 1])

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
                // this.statesArray.push(this.deepClone(this.state));
                oldPlayerTiles.push(oldPotTiles.splice(oldPotTiles.length -1, 1)[0]);
                return{
                    potTiles: oldPotTiles,
                    playerTiles : oldPlayerTiles,
                    totalTurns: prevState.totalTurns + 1,
                    totalPot: prevState.totalPot + 1,
                    avgTimePerTurn: (prevState.secondsElapsed / (prevState.totalTurns + 1 )).toFixed(2),
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
        // this.statesArray.push(this.deepClone(this.state));
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
            <div>
            {this.state.isGameStated ? ( <div><br></br>
            <br></br>

             <h2>{formatSeconds(this.state.secondsElapsed)}</h2>
             <button className="btnStyle" onClick={this.handleStartClick}>start</button>
             <button className="btnStyle" onClick={this.takeTileFromPot}>Pot</button>
             <br></br>
             <button className="btnStyle" onClick={this.handelPrevClick}>back!</button>
             <button className="btnStyle" onClick={this.handelNextClick}>next!</button>
             <br></br>
             <button className="btnStyle" onClick={this.handelUndoClcik}>undo!</button>


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
                /></div>) : 
                ( 
                    <div>
                        <div title="flipping TAKI card" className="flipping-card-wrapper">
                            <img className="front-card" src={Back}/>
                            <img className="back-card" src={Front} />
                        </div> 
                          <div className="container-2" onClick={this.handleOpenMenuSatrtClick}>
                                <div className="btn btn-two">
                                 <span>Open Game</span>
                                 </div>
                        </div>
                    </div>
                )}
               </div>

        )
    } // render
} // Game


  

export default Game