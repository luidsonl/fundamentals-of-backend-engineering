import Chat from "./components/Chat";

export default function App() {
  return (
    <div style={{ padding: 40, fontSize: 24 }}>
      <h1>React is running</h1>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <Chat /> 
      </div>
    </div>
  );
}
