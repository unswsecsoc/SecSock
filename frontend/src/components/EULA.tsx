const EULA = ({ onAccept }: { onAccept: () => void }) => {
  return (
    <div>
      <h1>Welcome to SecSock</h1>

      <h2>
        DISCLAIMER: this tools is intended for educational purposes. Performing
        hacking attempts on computers that you do not own (without permission)
        is illegal! Do not attempt to gain access to a device or service that
        you do not own.
      </h2>
      <button onClick={onAccept}>I Accept</button>
    </div>
  );
};

export default EULA;
