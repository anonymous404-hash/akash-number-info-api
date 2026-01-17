import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [number, setNumber] = useState('');
  const [key, setKey] = useState('');

  // PRICE SYSTEM
  const [days, setDays] = useState(1);
  const prices = {
    1: 10,
    7: 50,
    30: 200
  };

  const apiUrl = `/api/number?num=${number}&key=${key}`;

  return (
    <div style={{
      backgroundColor: '#050505',
      color: '#00d4ff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Orbitron, sans-serif',
      padding: '20px'
    }}>
      <Head>
        <title>AKASHHACKER | NUMBER INFO API</title>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      <main style={{
        border: '1px solid #00d4ff',
        padding: '50px',
        borderRadius: '20px',
        boxShadow: '0 0 30px rgba(0, 212, 255, 0.3)',
        backgroundColor: 'rgba(0, 212, 255, 0.02)',
        maxWidth: '750px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.2rem', letterSpacing: '3px' }}>
          ⚡ NUMBER INFO SYSTEM
        </h1>

        <p style={{ color: '#aaa', marginBottom: '30px' }}>
          ADVANCED TELECOM DATA EXTRACTOR BY <b>AKASHHACKER</b>
        </p>

        {/* INPUTS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
          <input
            placeholder="ENTER PHONE NUMBER"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="ENTER ACCESS KEY"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* API STATUS */}
        <div style={{
          backgroundColor: '#111',
          padding: '20px',
          borderRadius: '10px',
          borderLeft: '4px solid #00d4ff',
          textAlign: 'left'
        }}>
          <p>📡 <b>API STATUS:</b> <span style={{ color: '#00ff41' }}>OPERATIONAL</span></p>
          <p>
            🔗 <b>YOUR ENDPOINT:</b><br />
            <code style={{ color: '#00d4ff' }}>
              {number && key ? apiUrl : '/api/number?num=...&key=...'}
            </code>
          </p>
        </div>

        {/* EXECUTE */}
        <div style={{ marginTop: '35px' }}>
          <a
            href={number && key ? apiUrl : "#"}
            onClick={(e) => {
              if (!number || !key) {
                e.preventDefault();
                alert("Bhai, Number aur Key dono daalo!");
              }
            }}
            style={buttonStyle(number && key)}
          >
            EXECUTE DATA QUERY
          </a>
        </div>

        {/* PRICE + TELEGRAM ACCOUNT */}
        <div style={{
          marginTop: '45px',
          padding: '30px',
          border: '1px dashed #00d4ff',
          borderRadius: '18px',
          backgroundColor: '#0b0b0b'
        }}>
          <h2>🔑 GET API ACCESS</h2>

          <select
            value={days}
            onChange={(e) => setDays(e.target.value)}
            style={selectStyle}
          >
            <option value="1">1 Day Access</option>
            <option value="7">7 Days Access</option>
            <option value="30">30 Days Access</option>
          </select>

          <p style={{ marginTop: '15px', color: '#fff' }}>
            💰 Price: <b>₹{prices[days]}</b>
          </p>

          <a
            href={`https://t.me/AkashExploits1?text=Hi%20I%20want%20API%20Key%20for%20${days}%20days.%20Price:%20₹${prices[days]}`}
            target="_blank"
            style={{
              display: 'inline-block',
              marginTop: '20px',
              padding: '14px 40px',
              borderRadius: '50px',
              backgroundColor: '#00d4ff',
              color: '#000',
              fontWeight: 'bold',
              textDecoration: 'none'
            }}
          >
            🚀 GENERATE API KEY
          </a>
        </div>
      </main>

      <footer style={{ marginTop: '30px', fontSize: '0.7rem', color: '#555' }}>
        &copy; 2026 AKASHHACKER // SECURE TERMINAL ACCESS
      </footer>
    </div>
  );
}

/* ===== STYLES ===== */
const inputStyle = {
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #00d4ff',
  backgroundColor: '#111',
  color: '#00d4ff',
  textAlign: 'center',
  outline: 'none'
};

const selectStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#111',
  color: '#00d4ff',
  border: '1px solid #00d4ff',
  borderRadius: '8px',
  textAlign: 'center'
};

const buttonStyle = (active) => ({
  textDecoration: 'none',
  color: '#000',
  backgroundColor: active ? '#00d4ff' : '#555',
  padding: '12px 30px',
  borderRadius: '50px',
  fontWeight: 'bold',
  cursor: active ? 'pointer' : 'not-allowed'
});
