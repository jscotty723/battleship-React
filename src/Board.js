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

    //calls to create ganeboard function. is passed difficulty argument from onClick.//
    createBoard = (difficulty) => {
        // calls preShipYard function with different array's depending on difficulty chosen. //
        if (difficulty === 'easy') {
            this.preShipYard([2, 3, 4, 5], 'easy')
        } else if (difficulty === 'moderate') {
            this.preShipYard([2, 2, 3, 4, 5], 'moderate')
        } else if (difficulty === 'difficult') {
            this.preShipYard([2, 3, 3, 4, 5], 'difficult')
        }
    }

    // function that iterates through array passed by createBoard//
    preShipYard = (arr, difficulty) => {
        // array to push ships created by shipYard into//
        let emptyArr = []
        // loop to call shipYard on each array index. gets indexes back from shipYard and assigns them to that index in emptyArr//
        for (let i = 0; i < arr.length; i++) {
            emptyArr[i] = this.shipYard(arr[i])
        }
        // calls validateShips function on array of ship indexes. arguments of emptyarr and difficulty passed to function//
        this.validateShips(emptyArr, difficulty)
    }

    //creates ship. called by preShipYard.//
    shipYard (num) {
        //variables for x and y axis of ships//
        let x = Math.floor(Math.random()* 10)
        let y = Math.floor(Math.random()* (11-num))
        let tempShip = []
        // choses by random math if ship will be vertical or horizontal//
        if ((Math.floor(Math.random()*2) % 2) === 0) {
            // vertical
            for (let i = 0; i < num; i++) {
                tempShip.push(parseInt('' + (y+i) + x))
            }
        } else {
            // horizontal
            for (let i = 0; i < num; i++) {
                tempShip.push(parseInt('' + x + (y+i)))
            }
        }
        return tempShip
    }

    validateShips = (arr, difficulty) => {
        let newArr = arr.flat([1])
        let torpCount = null

        for (let i = 0; i < newArr.length; i++) {
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

    //function to handel player click on box//
    playerClick = (i) => {
        //deconstructs this.state for easier referencing in below function//
        let {ships, gameBoard, torpedoCount, hitCount} = this.state
        //makes sure click is on unclicked box and that hit count is not in winning state//
        if (gameBoard[i] == null && hitCount < ships.length) {
            //game over for out of torpedos//
            if (torpedoCount <= 0) {
                this.statusMessage('You\'re out of torpedos!')
                this.displayMissed(ships)
            //checks ships index to see if hit or miss//
            } else {
                //hit//
                if (ships.includes(i)) {
                    let hit = gameBoard
                    hit[i] = 'x'
                    this.setState({
                        gameBoard: hit,
                        torpedoCount: torpedoCount -1,
                        hitCount: hitCount +1
                    })
                    //miss//
                } else {
                    let miss = gameBoard
                    miss[i] = 'o'
                    this.setState({
                        gameBoard: miss,
                        torpedoCount: torpedoCount -1
                    })
                }
            }
            //calls check for winner function after hit or miss determined//
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
        //loops through ships to assign 'm' which will tell how squares should be displayed//
        let message = 'You did not use your torpedos wisely, young padawan'
        for (let i = 0; i < ships.length; i++) {
            if (this.state.gameBoard[ships[i]] === null) {
                let missed = this.state.gameBoard
                missed[ships[i]] = 'm'
                this.setState({
                    gameBoard: missed,
                    statusMessage: message
                })
            }
        } return message
    }

    displayColor = (i) => {
        let colors = ['#D0D5D8', '#db0000', 'rgba(255, 255, 255, 0)', '#ffff00']
        if (this.state.gameBoard[i]==='x') {
            return colors[1]
        } else if (this.state.gameBoard[i]==='o') {
            return colors[2]
        } else if (this.state.gameBoard[i]==='m') {
            return colors[3]
        } else {
            return colors[0]
        }
    }

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
