import React from "react";

export const Description: React.FC = () => {
  return (
    <div className="description">
      <h2>Strategy Overview</h2>
      <p>
        This 2048 solver applies the <strong>Expectimax algorithm</strong> with
        a custom <strong>priority-based scoring strategy</strong> to automate
        decision-making for achieving high scores. The approach involves two
        main components:
      </p>
      <ul>
        <li>
          <strong>Expectimax Algorithm:</strong> Expectimax is used to explore
          possible moves (for the player) and random tile placements (for the
          AI) up to a certain depth, simulating various board states. The
          algorithm alternates between maximizing the player's score and
          averaging scores from possible AI tile placements, ultimately
          selecting moves that maximize future potential.
        </li>
        <li>
          <strong>Custom Priority Matrix:</strong> A custom priority matrix
          guides tile placements towards more optimal board configurations,
          favoring positions where high-value tiles are most effective, like
          corners or edges. This matrix influences tile merging patterns,
          helping to create sequences that maximize score and efficiently
          cluster high-value tiles.
        </li>
      </ul>
    </div>
  );
};
