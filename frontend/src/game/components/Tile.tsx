import React from "react";

interface TileProps {
    className?: string;
    value: string | null; 
    onTileClick?: () => void;
}

const Tile: React.FC<TileProps> = ({ className, value, onTileClick }) => {
    return (
        <div className={`tile ${className}`} onClick={onTileClick}>{value}</div>); 
}

export default Tile;
