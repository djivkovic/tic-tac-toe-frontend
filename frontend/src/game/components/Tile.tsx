import React from "react";

const Tile = ({ className }: { className?: string }) => {
    return (
        <div className={`tile ${className}`}>X</div>
    );
}
 
export default Tile;
