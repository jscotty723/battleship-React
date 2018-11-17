import React, { Component } from 'react';

import './Board.css';

class Board extends Component {
    constructor(props) {
        super(props);
        this.state={
            gameBoard: Array(100).fill(null),
            boxColor: ['#D0D5D8', '#db0000', 'rgba(255, 255, 255, 0)', '#ffff00'],
            ships: [],
            torpedoCount: 0,
            hitCount: 0,
            statusMessage: 'Blast me if you can!'
        }
    }

// Easy Board Constructor//
    createBoardEasy = () => {
        let emptyArr = []
        emptyArr[2] = this.shipYard(2)
        emptyArr[4] = this.shipYard(3)
        emptyArr[5] = this.shipYard(4)
        emptyArr[6] = this.shipYard(5)

        let newArr = emptyArr.flat([1])

        for (let i = 0; i < newArr.length; i++) {
            for (let k = i+1; k < newArr.length; k++)
            if (newArr[i] === newArr[k]) {
                console.log(newArr[i],newArr[k]);
                return this.createBoardEasy()
            }
        }
        this.setState({
            ships: newArr,
            gameBoard: Array(100).fill(null),
            boxColor: ['#D0D5D8', '#db0000', 'rgba(255, 255, 255, 0)', '#ffff00'],
            torpedoCount: 60,
            hitCount: 0,
            statusMessage: 'Blast me if you can!'
        })
    }

    // Moderate Board Constructor//
    createBoardModerate = () => {
        let emptyArr = []
        emptyArr[2] = this.shipYard(2)
        emptyArr[3] = this.shipYard(3)
        emptyArr[4] = this.shipYard(4)
        emptyArr[5] = this.shipYard(5)

        let newArr = emptyArr.flat([1])

        for (let i = 0; i < newArr.length; i++) {
            for (let k = i+1; k < newArr.length; k++)
            if (newArr[i] === newArr[k]) {
                console.log(newArr[i],newArr[k]);
                return this.createBoardModerate()
            }
        }
        this.setState({
            ships: newArr,
            gameBoard: Array(100).fill(null),
            boxColor: ['#D0D5D8', '#db0000', 'rgba(255, 255, 255, 0)', '#ffff00'],
            torpedoCount: 40,
            hitCount: 0,
            statusMessage: 'Blast me if you can!'
        })
    }

    // Difficult Board Constructor//
    createBoardDifficult = () => {
        let emptyArr = []
        // calls ship creator function. number is length of ship//
        emptyArr[1] = this.shipYard(1)
        emptyArr[2] = this.shipYard(2)
        emptyArr[3] = this.shipYard(2)
        emptyArr[4] = this.shipYard(3)
        emptyArr[5] = this.shipYard(4)
        emptyArr[6] = this.shipYard(5)

        //takes nested arrays and makes one array without nested arrays//
        let newArr = emptyArr.flat([1])

        //nested loop checks for ships intersecting on the same array. if duplicate found, calls new board creation.//
        for (let i = 0; i < newArr.length; i++) {
            for (let k = i+1; k < newArr.length; k++)
            if (newArr[i] === newArr[k]) {
                console.log(newArr[i],newArr[k]);
                return this.createBoardDifficult()
            }
        }
        this.setState({
            ships: newArr,
            gameBoard: Array(100).fill(null),
            boxColor: ['#D0D5D8', '#db0000', 'rgba(255, 255, 255, 0)', '#ffff00'],
            torpedoCount: 40,
            hitCount: 0,
            statusMessage: 'Blast me if you can!'
        })
    }

    //creates ship//
    shipYard (num) {
        //variables for x and y axis of ships//
        let x = Math.floor(Math.random()* 10)
        let y = Math.floor(Math.random()* (11-num))
        let tempShip = []
        // choses by random math if ship will be vertical or horizontal//
        if ((Math.floor(Math.random()*2) % 2) == 0) {
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

    //function to handel player click on box//
    playerClick = (i) => {
        //deconstructs this.state for easier referencing in below function//
        let {ships, gameBoard, torpedoCount, hitCount} = this.state
        //makes sure click is on unclicked box and that hit count is not in winning state//
        if (gameBoard[i] == null && hitCount < ships.length) {
            //game over for out of torpedos//
            if (torpedoCount <= 0) {
                this.statusMessage("You're out of torpedos!")
                this.displayMissed(ships)
            //checks ships index to see if hit or miss//
            } else {
                //hit//
                if (ships.includes(i)) {
                    let hit = gameBoard
                    hit[i] = "x"
                    this.setState({
                        gameBoard: hit,
                        torpedoCount: torpedoCount -1,
                        hitCount: hitCount +1
                    })
                    //miss//
                } else {
                    let miss = gameBoard
                    miss[i] = "o"
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

    //function for seeing if all index's in ships array are "hit"//
    checkWinner =()=> {
        if(this.state.hitCount == this.state.ships.length-1) {
            this.statusMessage('You\'ve won!')
        }
    }

    //calls all ships not hit to be displayed in different color so that user can see location of unhit ships//
    displayMissed = (ships) => {
        let message = "You did not use your torpedos wisely, young padawan"
        //loops through ships to assign "m" which will tell how squares should be displayed//
        for (let i = 0; i < ships.length; i++) {
            if (this.state.gameBoard[ships[i]] === null) {
                let missed = this.state.gameBoard
                missed[ships[i]] = "m"
                this.setState({
                    gameBoard: missed,
                    statusMessage: message
                })
            }
        } return message
    }


    displayColor = (i) => {
        if (this.state.gameBoard[i]==='x') {
            return this.state.boxColor[1]
        } else if (this.state.gameBoard[i]==='o') {
            return this.state.boxColor[2]
        } else if (this.state.gameBoard[i]==='m') {
            return this.state.boxColor[3]
        } else {
            return this.state.boxColor[0]
        }
    }


  render() {
    return (
        <div className="wholePage">
            <div className="pageContent">
                <section className="headerContainer">
                    <h1 className="header">Battleship</h1>
                    <div className="selectLevel">
                        <button className="startGame" onClick={this.createBoardEasy}>
                            Easy
                        </button>
                        <button className="startGame moderate" onClick={this.createBoardModerate}>
                            Moderate
                        </button>
                        <button className="startGame difficult" onClick={this.createBoardDifficult}>
                            Difficult
                        </button>
                    </div>
                </section>
                    <section className="boardContainer">
                        <div className="board">
                            {this.state.gameBoard.map((el, i) => (
                            <div onClick={() => this.playerClick(i)} style={{backgroundColor: this.displayColor(i)}} className="box i" id={i}>
                            </div>
                        ))}
                        </div>
                    </section>
                    <section className="content">
                        < br/>
                        <div className="status">
                            <div className="torpsStatus">
                                Torpedos Remaining: {this.state.torpedoCount}
                            </div>
                            <div className="hitsStatus">
                                Hits: {this.state.hitCount} of {this.state.ships.length}
                            </div>
                        </div>
                        <div className="message">
                            Message: {(this.state.torpedoCount === 0) ? this.displayMissed(this.state.ships) : this.state.statusMessage}
                        </div>
                        < br/>
                        <footer>
                            Battleship Game by <a href="http://www.jpeters.me">Julianne Peters</a>. <a href="https://github.com/jscotty723/battleshipReact">Click here</a> to view project on <a href="http://github.com">GitHub</a>.
                        </footer>
                    </section>
            </div>
            <footer>

            </footer>
        </div>
    );
  }
}

export default Board;
