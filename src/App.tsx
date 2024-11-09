import { BoardComponent } from "./components/board";
import { Description } from "./components/description";

function App() {
  return (
    <div className="App">
      <div>
        <BoardComponent />
        <Description />
      </div>
    </div>
  );
}

export default App;
