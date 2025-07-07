const EULA = ({ onAccept }: { onAccept: () => void }) => {
  return (
    <div>
      <h1>Welcome to SecSock</h1>

      <h2>End User License Agreement</h2>
      <p>Terms go here...</p>
      <button onClick={onAccept}>I Accept</button>
    </div>
  );
};

export default EULA;
