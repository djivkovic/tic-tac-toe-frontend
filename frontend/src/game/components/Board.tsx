import React from "react";
import Tile from "./Tile";

interface BoardProps {
    tiles: Array<string | null>;
    onTileClick: (index: number) => void; 
    className?: string; 
}

const Board: React.FC<BoardProps> = ({ tiles, onTileClick }) => {
    return (
        <div className={`board`}>
            <Tile onTileClick={()=> onTileClick(0)} className={`right-border bottom-border`} value={tiles[0]} />
            <Tile onTileClick={()=> onTileClick(1)} className={`right-border bottom-border`} value={tiles[1]} />
            <Tile onTileClick={()=> onTileClick(2)} className={`bottom-border`} value={tiles[2]} />
            <Tile onTileClick={()=> onTileClick(3)} className={`right-border bottom-border`} value={tiles[3]} />
            <Tile onTileClick={()=> onTileClick(4)} className={`right-border bottom-border`} value={tiles[4]} />
            <Tile onTileClick={()=> onTileClick(5)} className={`bottom-border`} value={tiles[5]} />
            <Tile onTileClick={()=> onTileClick(6)} className={`right-border`} value={tiles[6]} />
            <Tile onTileClick={()=> onTileClick(7)} className={`right-border`} value={tiles[7]} />
            <Tile onTileClick={()=> onTileClick(8)} value={tiles[8]} />
        </div>
    );
}

export default Board;
