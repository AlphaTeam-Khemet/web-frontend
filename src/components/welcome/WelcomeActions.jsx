export default function WelcomeActions({ onSignIn, onGuest }) {
  return (
    <div className="welcome-actions">
      <button className="welcome-btn primary" onClick={onSignIn}>
        SIGN IN
      </button>

      <button className="welcome-btn secondary" onClick={onGuest}>
        CONTINUE AS GUEST
      </button>
    </div>
  );
}