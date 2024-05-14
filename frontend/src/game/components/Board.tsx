import React from "react";
import Tile from "./Tile";

interface BoardProps {
    className?: string; // Define className as an optional prop
}

const Board: React.FC<BoardProps> = ({ className }) => {
    return (
        <div className={`board ${className}`}>
            <Tile className='right-border bottom-border'/>
            <Tile className='right-border bottom-border'/>
            <Tile className='bottom-border'/>
            <Tile className='right-border bottom-border'/>
            <Tile className='right-border bottom-border'/>
            <Tile className='bottom-border'/>
            <Tile className='right-border'/>
            <Tile className='right-border'/>
            <Tile/>
        </div>
    );
}

export default Board;
