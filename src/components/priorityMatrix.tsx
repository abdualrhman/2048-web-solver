import React from "react";

type PriorityMatrixProps = {
  priority: number[][];
  onPriorityChange: (row: number, col: number, value: string) => void;
};

const PriorityMatrix: React.FC<PriorityMatrixProps> = ({
  priority,
  onPriorityChange,
}) => {
  return (
    <div className="priority-matrix">
      <h3>Set Priority Matrix</h3>
      <p>
        Adjust priority values to represent each cell on the 2048 board. Higher
        values mean the solver will prioritize moving tiles to that cell. Lower
        values reduce priority for that cell.
      </p>
      {priority.map((row, rowIndex) => (
        <div key={rowIndex} className="priority-row">
          {row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="number"
              value={cell}
              onChange={(e) =>
                onPriorityChange(rowIndex, colIndex, e.target.value)
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default PriorityMatrix;
