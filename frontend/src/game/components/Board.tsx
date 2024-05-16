import React from "react";
import Tile from "./Tile";
import Strike from "./Strike";

interface BoardProps {
    tiles: Array<string | null>;
    onTileClick: (index: number) => void; 
    className?: string; 
    playerTurn: string;
    strikeClass: string;
}
const getClassNames = (index:number) => {
    let classNames = "";
    if (index % 3 !== 2) classNames += "right-border ";
    if (index < 6) classNames += "bottom-border ";
    return classNames.trim();
}

const Board: React.FC<BoardProps> = ({ tiles, onTileClick, playerTurn, strikeClass }) => {
    return (
        <div className="board">
            {tiles.map((value, index) => (
                <Tile
                    key={index}
                    playerTurn={playerTurn}
                    onTileClick={() => onTileClick(index)}
                    className={getClassNames(index)}
                    value={value}
                />
            ))}
            <Strike strikeClass={strikeClass}/>
        </div>
    );
}

export default Board;
