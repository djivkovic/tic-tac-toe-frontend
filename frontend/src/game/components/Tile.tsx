import React from "react";

interface TileProps {
    className?: string;
    value: string | null; 
    onTileClick?: () => void;
    playerTurn?: string;
}
const Tile: React.FC<TileProps> = ({ className, value, onTileClick, playerTurn }) => {
    let hoverClass = null;

    if (value == null && playerTurn != null) {
        hoverClass = `${playerTurn.toLowerCase()}-hover`;
    }

    return (
        <div className={`tile ${className} ${hoverClass}`} onClick={onTileClick}>{value}</div>
    ); 
}

export default Tile;
