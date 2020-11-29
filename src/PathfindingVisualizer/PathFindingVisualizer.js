import React, {Component} from 'react';
import Node from './Node/Node';
import './PathFindingVisualizer.css';
import { Button } from '@material-ui/core';
import {dijkstra, getNodesInShortestPathOrder} from "../algorithms/dijkstra";

const MAX_COL = 80;
const MAX_ROW = 40;

export default class PathFindingVisualizer extends Component{

    constructor(props){
        super(props);
        this.state = {
            grid: [],
            isRunning: false,
            isFinished: false,
            startRow:0,
            startCol:0,
            endRow:0,
            endCol:0,
            status: "Ready",
        };
    }

    componentDidMount(){
        this.randomStartANDEnd();
        setTimeout(() => {
            const grid = getInitialGrid(this.state.startRow, this.state.startCol, this.state.endRow, this.state.endCol);
            this.setState({grid});
        }, 0);
    }

    randomStartANDEnd(){
        let startRow=Math.floor(Math.random()*((MAX_ROW-3))+2);
        let startCol=Math.floor(Math.random()*((MAX_COL-3))+2);
        let endRow=Math.floor(Math.random()*((MAX_ROW-3))+2);
        let endCol=Math.floor(Math.random()*((MAX_COL-3))+2);
    
        //Prevent equal Start and End Point
        while(startRow===endRow){
            startRow=Math.floor(Math.random()*((MAX_ROW-3))+2);
            endRow=Math.floor(Math.random()*((MAX_ROW-3))+2);
        }
        this.setState({startRow: startRow, startCol: startCol, endRow: endRow, endCol: endCol});
    }

    setRandomStartANDEndOnGrid(){
        this.componentDidMount();
    }

    handleMouseDown(row, col){
        //TODO
    }

    handleMouseEnter(row, col){
        //TODO
    }

    handleMouseUp(){
        //TODO
    }

    animateDijkstra(visitedNodesinOrder, nodesInShortestPathOrder){
        this.setState({isRunning: true, status: "Compute"});
        for(let i=0;i<= visitedNodesinOrder.length;i++){
            if(i===visitedNodesinOrder.length){
                if(visitedNodesinOrder[i-1].isFinish){
                    setTimeout(() => {
                        this.animateShortestPath(nodesInShortestPathOrder);
                    }, 10*i);
                    return;
                }
                setTimeout(() => {
                    this.animatePathNotFound(visitedNodesinOrder);
                }, 10*i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesinOrder[i];
                if(!node.isFinish && !node.isStart){
                    document.getElementById(`node-${node.row}-${node.col}`).className = 
                    'node node-visited';
                }
            }, 10*i);
        }
    }

    //IF a Path is Found this animation Plays
    animateShortestPath(nodesInShortestPathOrder){
        for(let i=0;i<nodesInShortestPathOrder.length;i++){
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                if(!node.isFinish && !node.isStart){
                    document.getElementById(`node-${node.row}-${node.col}`).className = 
                    'node node-shortest-path'
                }
            }, 50 * i);
        }
        setTimeout(() => {
            this.setState({isRunning: false, isFinished: true, status: "Path Found"});
        }, 50*nodesInShortestPathOrder.length+1);
    }

    //IF no Path is Found this animation Plays
    animatePathNotFound(visitedNodesinOrder){
        for(let i=0;i<visitedNodesinOrder.length;i++){
            setTimeout(() => {
                const node = visitedNodesinOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = 
                'node node-path-not-found'
            }, 25 * i);
        }
        setTimeout(() => {
            this.setState({isRunning: false, isFinished: true, status: "No Path Found"});
        }, 25*visitedNodesinOrder.length+1);
    }

    //Calls the dijkstra Algorithm and get the visited Nodes inorder for the animation
    visualizeDijkstra(){
        const {grid} = this.state;
        const startNode = grid[this.state.startRow][this.state.startCol];
        const finishNode = grid[this.state.endRow][this.state.endCol];
        const visitedNodesinOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateDijkstra(visitedNodesinOrder, nodesInShortestPathOrder);
    }

    //Generates Random Walls on the grid
    randomWall(){
        const grid = this.state.grid;
        for(let row = 0; row<MAX_ROW; row++){
            for(let col = 0; col<MAX_COL; col++){
                if(Math.random()*(MAX_COL-0)+0>MAX_COL-20){
                    if(!grid[row][col].isFinish && !grid[row][col].isStart && !grid[row][col].isWall){
                        grid[row][col].isWall=true;
                    }
                }
            }
        }
        this.setState({grid});
    }
        
    //Genereates a Maze
    randomMaze(){
        //Todo
    }

    //sets All Nodes isWall=false, except the border of the grid
    resetWall(){
        const grid = this.state.grid;
        for(let i=1;i<grid.length-1;i++){
            for(let j=1;j<grid[0].length-1;j++){
                if(!grid[i][j].isStart && !grid[i][j].isFinish)
                    grid[i][j].isWall=false;
            }
        }
        this.setState({grid: grid});
    }

    //resets every Node state to Initial state
    reset(){
        const grid = getInitialGrid(this.state.startRow, this.state.startCol, this.state.endRow, this.state.endCol);
        for(let i=0;i<grid.length;i++){
            for(let j=0;j<grid[0].length;j++){
                const node = grid[i][j];
                if(node.isStart){
                    document.getElementById(`node-${node.row}-${node.col}`).className = 
                    'node node-start'    
                } else if(node.isFinish){
                    document.getElementById(`node-${node.row}-${node.col}`).className = 
                    'node node-finish'
                } else if(node.isWall) {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 
                    'node node-wall'
                } else{
                    document.getElementById(`node-${node.row}-${node.col}`).className = 
                    'node'
                }

            }
        }
        this.setState({grid: grid, isFinished:false,  status: "Ready"});
    }

    render(){
        const {grid, isRunning, isFinished, status} = this.state;
        
        return(
            <div className="PathFindingVisualizer">
                      <h1>Pathfinding Algorithm</h1>
                {!isRunning ? 
                    <div className="PathFindingVisualizer__buttons">
                        {!isFinished ?
                             <>
                                <Button variant="contained" color="secondary" onClick={() => this.visualizeDijkstra()}>
                                    Start Dijkstra
                                </Button>
                                <Button variant="contained" color="secondary" onClick={() => this.setRandomStartANDEndOnGrid()}>
                                    Random Start & End
                                </Button>
                                <Button variant="contained" color="secondary" onClick={() => this.randomWall()}>
                                    Random Walls
                                </Button>
                                <Button variant="contained" color="secondary" onClick={() => this.resetWall()}>
                                    Reset Walls
                                </Button> 
                                <Button disabled variant="contained" color="secondary">
                                    Reset
                                </Button>
                            </>
                        :
                            <>
                                <Button disabled variant="contained" color="secondary">
                                    Start Dijkstra  
                                </Button>
                                <Button disabled variant="contained" color="secondary">
                                    Random Start & End
                                </Button>
                                <Button disabled variant="contained" color="secondary">
                                    Random Walls
                                </Button>
                                <Button disabled variant="contained" color="secondary">
                                    Reset Walls
                                </Button>
                                <Button variant="contained" color="secondary" onClick={() => this.reset()}>
                                    Reset
                                </Button>
                            </>
                        }
                    </div>
                :
                    <div className="PathFindingVisualizer__buttons">
                        <Button disabled variant="contained" color="secondary">
                            Start Dijkstra
                        </Button>
                        <Button disabled variant="contained" color="secondary">
                            Random Start & End  
                        </Button>
                        <Button disabled variant="contained" color="secondary">
                            Random Walls
                        </Button>
                        <Button disabled variant="contained" color="secondary">
                            Reset Walls
                        </Button>
                        <Button  disabled variant="contained" color="secondary">
                            Reset
                        </Button>
                    </div>             
                }
            <div className="PathFindingVisualizer__status">
            <h3>{status}</h3>
            </div>

            <div className="PathFindingVisualizer__grid">
                {grid.map((row, rowIdx) => {
                    return (
                        <div key = {rowIdx} className="row">
                            {row.map((node, nodeIdx) =>{
                                    const {row, col, isFinish, isStart, isWall} = node;
                                    return(
                                        <Node
                                            key={nodeIdx}
                                            col={col}
                                            isFinish={isFinish}
                                            isStart={isStart}
                                            isWall={isWall}
                                            onMouseDown={(row,col) => this.handleMouseDown(row,col)}
                                            onMouseEnter={(row,col)=> this.handleMouseEnter(row,col)}
                                            onMouseUp={() => this.handleMouseUp()}
                                            row={row}
                                        ></Node>
                                    ); 
                            })}
                        </div>
                    );
                })}
            </div>
            </div>
        );
    }
}

//Creates InitialGrid
const getInitialGrid = (startRow, startCol, endRow, endCol) =>{
    const grid = [];

    for(let row = 0; row<MAX_ROW; row++){
        const currentRow = [];
        for(let col = 0; col<MAX_COL; col++){
            if(row===0 || row === MAX_ROW-1 || col===0 || col===MAX_COL-1){
                currentRow.push(createNodeWall(col,row));
                continue;           
            }
            currentRow.push(createNode(col,row, startRow, startCol, endRow, endCol));
        }
        grid.push(currentRow);
    }
    return grid;
};

//Create Node as Walls
const createNodeWall = (col, row, startRow, startCol, endRow, endCol) =>{
    return {
        col,
        row,
        isStart: row === startRow && col === startCol,
        isFinish: row === endRow && col === endCol,
        distance: Infinity,
        isVisited: false,
        isWall: true,
        previousNode: null,
    };
};

//Create "normal" Nodes (NO WALLLS!)
const createNode = (col, row, startRow, startCol, endRow, endCol) =>{
    return {
        col,
        row,
        isStart: row === startRow && col === startCol,
        isFinish: row === endRow && col === endCol,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    };
};
