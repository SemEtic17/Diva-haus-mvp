import { useEffect, useState } from "react";
import { checkHealth } from "./api";

function App() {
  const [status, setStatus] = useState("Checking server...");

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await checkHealth();
        setStatus(res);
      } catch (err) {
        setStatus("Server unreachable");
      }
    };

    fetchHealth();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Diva Haus MVP</h1>
      <p>Backend Status: {status}</p>
    </div>
  );
}

export default App;
