import React, {Component} from 'react'
import Tile from './Tile.js';
import allTiles from './allTiles.js';


class Board extends Component {
    constructor(props) {
        super(props);
        this.wrapperRef = React.createRef();
       // this.boardSize = 10; // it's not part of the state! it's a property...

        this.state = {
            jsx:null,
            //logicBoard:this.buildBoard(),
           // boardSize:26,
            tiles: allTiles,
            oldLogicBoard:[
                        ['66,2', ' ','56'],
                        [' ', '66',' '],
                        [' ', ' ',' ']
            ]
        }


        this.manageBoard = this.manageBoard.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        const target = event.target.closest('td');
        
        const id = target.id.split(',');
        const i = id[0];
        const j = id[1];

        // only if there is not already tile in this <td>, and if there's a selected tile
        if(this.props.selectedTile && this.props.logicBoard[i][j] === ' ') {
            const values = this.props.selectedTile.id;
            
            // only if the selecctedId is not empty string
            if(values) {
                if(this.props.isMoveValid(i, j)) {
                    this.props.tileWasPlaced(this.props.selectedTile);
                    let newLogicBoard = this.props.logicBoard; // this.props.logicBoard equals "prevState.logicBoard"
                    newLogicBoard[i][j] = `${values},${this.props.selectedTile.parentNode.id[11]}`; // {values,verticality} 
                    this.props.updateLogicBoard(newLogicBoard)
                } else {
                    alert('NOT A LEGAL MOVE');
                }
                // this.setState(prevState => {
                //     let newLogicBoard = prevState.logicBoard; // deep or shallow copy? to think about whats better
                //     newLogicBoard[i][j] = `${values},${this.props.selectedTile.parentNode.id[11]}`; // {values,verticality}
                //     console.log(newLogicBoard[i][j])
        
                //     return {
                //         logicBoard:newLogicBoard
                //     }
                // })
                
            } // if value
    
            //this.manageBoard();
            
        } // if the board is empty in this cell, and there is a cell you wanna add!
    } // handleClick


    // buildBoard() {
    //     const boardSize = this.boardSize;

    //     let board = [];
    //     let row = [];
    //     for(let i = 0; i < boardSize; i++) {
    //         for(let j = 0; j < boardSize; j++) {
    //             //row.push(`${i}${j}`);
    //             row.push(` `);
    //         }
    //         board.push(row);
    //         row = [];
    //     }

    //     return board;
    // }

    componentDidMount() {

    }

    manageBoard() { // tahles: build the jsx array
        const boardSize = this.props.logicBoard.length;

        let innerJSX = [];
        let jsx = [
            <div className='table-wrapper' ref={this.wrapperRef} key={'wrapper'}>
                <table key={`table`} className="game-table">
                   <tbody key={`tbody`}>
                       {innerJSX}
                    </tbody>
                </table>
           </div>
            ];

            

        for(let i = 0; i < boardSize; i++) {
            let tds=[];
            innerJSX.push(<tr key={`${i}`}>{tds}</tr>);
            for(let j = 0; j < boardSize; j++) {
                tds.push(
                    <td key={`${i},${j}`} id={`${i},${j}`} align="center" onClick={this.handleClick}>
                        {this.props.logicBoard[i][j] === ' ' ? /*`${i},${j}`*/ null : 
                        <Tile
                            key={`${i}${j}`}
                            top={this.props.logicBoard[i][j][0]}
                            bottom={this.props.logicBoard[i][j][1]}
                            verticality={this.props.logicBoard[i][j][3]}
                        />
                        }
                    </td>);
            }
        }

        // this.setState({
        //     jsx
        // })

        return jsx;


    }

    componentDidMount() {
        console.log(`this.wrapperRef is`);
        console.log(this.wrapperRef);
        this.wrapperRef.current.scrollTop = 2152; // middle of screen
        this.wrapperRef.current.scrollLeft =  2143; // middle of screen
        window.ref = this.wrapperRef.current;
    }

    render() {
        const jsx = this.manageBoard();

        return (
            <>
                {/*that's should create a "logic" array that should be mapped here & build JSX here */}
                {jsx} 
            </>
        );
    } // render 
} // component


export default Board