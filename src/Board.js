import React, { Component } from 'react';

import './Board.css';

class Board extends Component {
    constructor(props) {
        super(props);
        this.state={
            gameBoard: Array(100).fill(null),
            boxColor: ['#D0D5D8', '#db0000', 'rgba(255, 255, 255, 0)', '#ffff00'],
            ships: [],
            torpedoCount: 40,
            hitCount: 0,
            statusMessage: 'Blast me if you can!'
        }
    }

    createBoard = () => {
        let emptyArr = []
        for (let i = 5; i > 0; i--) {
            emptyArr[i] = this.shipYard(i)
        }
        let newArr = emptyArr.flat([1])

        for (let i = 0; i < newArr.length; i++) {
            for (let k = i+1; k < newArr.length; k++)
            if (newArr[i] === newArr[k]) {
                console.log(newArr[i],newArr[k]);
                return this.createBoard()
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

    shipYard (num) {
        let x = Math.floor(Math.random()* 10)
        let y = Math.floor(Math.random()* (11-num))
        let tempShip = []

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

    playerClick = (i) => {
        let {ships, gameBoard, torpedoCount, hitCount} = this.state
        if (gameBoard[i] == null && hitCount < ships.length) {
            if (torpedoCount <= 0) {
                this.statusMessage("You're out of torpedos!")
                this.displayMissed(ships)

            } else {
                if (ships.includes(i)) {
                    let hit = gameBoard
                    hit[i] = "x"
                    this.setState({
                        gameBoard: hit,
                        torpedoCount: torpedoCount -1,
                        hitCount: hitCount +1
                    })
                } else {
                    let miss = gameBoard
                    miss[i] = "o"
                    this.setState({
                        gameBoard: miss,
                        torpedoCount: torpedoCount -1
                    })
                }
            }
            console.log(hitCount);
            this.checkWinner()
        }
    }

    checkWinner =()=> {
        if(this.state.hitCount == this.state.ships.length-1) {
            this.statusMessage('You\'ve won!')
        }
    }

    displayMissed = (ships) => {
        let message = "You did not use your torpedos wisely, young padawan"
        for (let i = 0; i < ships.length; i++) {
            if (this.state.gameBoard[ships[i]] === null) {
                let missed = this.state.gameBoard
                missed[ships[i]] = "m"
                this.setState({
                    gameBoard: missed,
                    statusMessage: message
                })
            }
        }return message
    }

    statusMessage = (message) => {
        this.setState({statusMessage: message})
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
                    <button className="startGame" onClick={this.createBoard}>
                        Start Game
                    </button>
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
                                Hits: {this.state.hitCount} of 15
                            </div>
                        </div>
                        <div className="message">
                            Message: {(this.state.torpedoCount === 0) ? this.displayMissed(this.state.ships) : this.state.statusMessage}
                        </div>
                    </section>
            </div>
        </div>
    );
  }
}

export default Board;
