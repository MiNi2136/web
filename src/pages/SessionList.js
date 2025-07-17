import React, { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "qrcode.react";
import "./SessionList.css";


const SessionList = () => {
  const [sessions, setSessions] = useState([]);
  const [showQRFor, setShowQRFor] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        // Adjust the URL and options to match your backend API
        const res = await axios.get("http://localhost:5000/sessions/getSessions", {
          withCredentials: true,
        });
        setSessions(res.data);
      } catch (err) {
        console.error("Failed to load sessions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const toggleQR = (sessionId) => {
    setShowQRFor(showQRFor === sessionId ? null : sessionId);
  };

  return (
    <div>
      <h2>Sessions</h2>
      {loading && <p>Loading sessions...</p>}
      {!loading && sessions.length === 0 && <p>No sessions found.</p>}
      <ul>
        {sessions.map((session) => {
          // Construct QR URL from session ID if backend does not provide qrUrl directly
          const qrUrl = session.qrUrl || `http://localhost:5000/sessions/attend/${session._id}`;

          return (
            <li key={session._id} style={{ marginBottom: "20px" }}>
              <div>
                <strong>{session.name}</strong> - {new Date(session.date).toLocaleDateString()}
              </div>
              <button onClick={() => toggleQR(session._id)}>
                {showQRFor === session._id ? "Hide QR Code" : "Show QR Code"}
              </button>
              {showQRFor === session._id && (
                <div style={{ marginTop: "10px" }}>
                  <QRCode value={qrUrl} size={180} />
                  <p style={{ wordBreak: "break-all", marginTop: "10px" }}>{qrUrl}</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SessionList;
