import React, { Component } from 'react';
import './Board.css';

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameBoard: Array(100).fill(null),
            ships: [],
            torpedoCount: 0,
            hitCount: 0,
            statusMessage: 'Choose a difficulty level to start game!'
        }
    }

    //function to create gameboard. OnClick fires function and passes difficulty argument and assigns different arrays accordingly. arrays represent lengths of ships to be made//
    createBoard = (difficulty) => {
        if (difficulty === 'easy') {
            this.preShipYard([2, 3, 4, 5], 'easy')
        } else if (difficulty === 'moderate') {
            this.preShipYard([2, 2, 3, 4, 5], 'moderate')
        } else if (difficulty === 'difficult') {
            this.preShipYard([2, 3, 3, 4, 5], 'difficult')
        }
    }

    // function that iterates through array passed by createBoard(), calling shipyard() on each index and then pushes returned array into emptyArr//
    preShipYard = (arr, difficulty) => {
        let emptyArr = []
        for (let i = 0; i < arr.length; i++) {
            emptyArr[i] = this.shipYard(arr[i])
        }
        this.validateShips(emptyArr, difficulty)
    }

    //called by preShipYard() and creates ship with random location. RandomMath is used to determine if vertical or horizontal. ship is then pushed into array and returned//
    shipYard (num) {
        //variables for x and y axis of ships//
        let x = Math.floor(Math.random()* 10)
        let y = Math.floor(Math.random()* (11-num))
        let tempShip = []
        if ((Math.floor(Math.random()*2) % 2) === 0) {
            for (let i = 0; i < num; i++) {
                tempShip.push(parseInt('' + (y+i) + x))
            }
        } else {
            for (let i = 0; i < num; i++) {
                tempShip.push(parseInt('' + x + (y+i)))
            }
        }
        return tempShip
    }

    // function is called at the end of preShipYard() to ensure that ships do not share the same square. takes arguments of difficulty and array of ship locations. if no conflict found, state is set for game to start. If not, new board is called with same difficulty level.//
    validateShips = (arr, difficulty) => {
        let newArr = arr.flat([1])
        let torpCount = null
        for (let i = 0; i < newArr.length; i++)
            for (let k = i+1; k < newArr.length; k++)
            if (newArr[i] === newArr[k]) {
                return this.createBoard(difficulty)
            } else {
                if (difficulty === 'easy') {
                    torpCount = 60
                } else if (difficulty === 'moderate') {
                    torpCount = 50
                } else if (difficulty === 'difficult') {
                    torpCount = 45
                }
            this.setState({
                torpedoCount: torpCount,
                ships: newArr,
                gameBoard: Array(100).fill(null),
                hitCount: 0,
                statusMessage: 'Blast me if you can!'
            })
            }
        }
    }

    //function to handel player click on box. checks to see that box hasn't been clicked, then evaluates if index has a value in ships array. then calls function to see if winning state has been achieved//
    playerClick = (i) => {
        let {ships, gameBoard, torpedoCount, hitCount} = this.state
        if (gameBoard[i] == null && hitCount < ships.length) {
            let move = gameBoard
            let newHitCount = hitCount
            let newTorpedoCount = torpedoCount -1
            if (torpedoCount <= 0) {
                this.statusMessage('You\'re out of torpedos!')
                this.displayMissed(ships)
            } else {
                if (ships.includes(i)) {
                    move[i] = 'x'
                    newHitCount = newHitCount -1
                } else {
                    move[i] = 'o'
                }
                this.setState({
                    gameBoard: move,
                    torpedoCount: newTorpedoCount,
                    hitCount: newHitCount
                })
            }
            this.checkWinner()
        }
    }

    //function for seeing if all index's in ships array are 'hit'//
    checkWinner = () => {
        if(this.state.hitCount == this.state.ships.length-1) {
            this.statusMessage('You\'ve won!')
        }
    }

    //calls all ships not hit to be displayed in different color so that user can see location of unhit ships//
    displayMissed = (ships) => {
        //new message to be assigned to state//
        let message = 'You did not use your torpedos wisely, young padawan'
        //iterates through ships array//
        for (let i = 0; i < ships.length; i++) {
            //if ships index is unhit (null)//
            if (this.state.gameBoard[ships[i]] === null) {
                //creating variable for easier referencing
                let missed = this.state.gameBoard
                //assigning square on gameboard with a 'm' instead of null//
                missed[ships[i]] = 'm'
                //setting state for gameboard to include missed values and also message//
                this.setState({
                    gameBoard: missed,
                    statusMessage: message
                })
            }
        } return message
    }

    //function called on board rendering to assign color to squares based on square status//
    displayColor = (i) => {
        //array of colors//
        let colors = ['#D0D5D8', '#db0000', 'rgba(255, 255, 255, 0)', '#ffff00']
        //for hit choose index 1 value//
        if (this.state.gameBoard[i]==='x') {
            return colors[1]
        //for miss choose index 2 value//
        } else if (this.state.gameBoard[i]==='o') {
            return colors[2]
        //for ships not hit at end of game choose index 3 value//
        } else if (this.state.gameBoard[i]==='m') {
            return colors[3]
        //for untouched squares choose index 0 value//
        } else {
            return colors[0]
        }
    }

    //function to allow status message to be reassigned. takes argument of string//
    statusMessage = (string) => {
        this.setState({
            statusMessage: string
        })
    }

  render() {
    return (
        <div className='wholePage'>
            <div className='pageContent'>
                <section className='headerContainer'>
                    <h1 className='header'>Battleship</h1>
                    <div className='selectLevel'>
                        <button className='startGame' onClick={() => this.createBoard('easy')}>
                            Easy
                        </button>
                        <button className='startGame moderate' onClick={() => this.createBoard('moderate')}>
                            Moderate
                        </button>
                        <button className='startGame difficult' onClick={() => this.createBoard('difficult')}>
                            Difficult
                        </button>
                    </div>
                </section>
                <section className='boardContainer'>
                    <div className='board'>
                        {this.state.gameBoard.map((el, i) => (
                        <div onClick={() => this.playerClick(i)} style={{backgroundColor: this.displayColor(i)}} className='box i' id={i}>
                        </div>
                    ))}
                    </div>
                </section>
                <section className='content'>
                    < br/>
                    <div className='status'>
                        <div className='torpsStatus'>
                            Torpedos Remaining: {this.state.torpedoCount}
                        </div>
                        <div className='hitsStatus'>
                            Hits: {this.state.hitCount} of {this.state.ships.length}
                        </div>
                    </div>
                    <div className='message'>
                        Message: {(this.state.torpedoCount === 0) ? this.displayMissed(this.state.ships) : this.state.statusMessage}
                    </div>
                    < br/>
                    <footer>
                        Battleship Game by <a href='http://www.jpeters.me'>Julianne Peters</a>. <a href='https://github.com/jscotty723/battleshipReact'>Click here</a> to view project on <a href='http://github.com'>GitHub</a>.
                    </footer>
                </section>
            </div>
        </div>
    );
  }
}

export default Board;
