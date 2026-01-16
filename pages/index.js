import Head from 'next/head';

export default function Home() {
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
      margin: 0,
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
        maxWidth: '700px',
        textAlign: 'center',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{ fontSize: '2.2rem', letterSpacing: '3px', marginBottom: '10px' }}>
          ⚡ NUMBER INFO SYSTEM
        </h1>
        <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '30px' }}>
          ADVANCED TELECOM DATA EXTRACTOR BY <b>{ "AKASHHACKER" }</b>
        </p>
        
        <div style={{ 
          backgroundColor: '#111', 
          padding: '20px', 
          borderRadius: '10px', 
          textAlign: 'left',
          borderLeft: '4px solid #00d4ff' 
        }}>
          <p style={{ margin: '10px 0', color: '#fff' }}>📡 <b>API STATUS:</b> <span style={{color: '#00ff41'}}>OPERATIONAL</span></p>
          <p style={{ margin: '10px 0', color: '#fff' }}>🔗 <b>ENDPOINT:</b> 
            <code style={{ color: '#00d4ff', marginLeft: '10px' }}>/api/number?num=0987654321</code>
          </p>
        </div>

        <div style={{ marginTop: '40px' }}>
          <a 
            href="/api/number?num=0987654321" 
            style={{
              textDecoration: 'none',
              color: '#000',
              backgroundColor: '#00d4ff',
              padding: '12px 30px',
              borderRadius: '50px',
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: '0 5px 15px rgba(0, 212, 255, 0.4)',
              transition: '0.4s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            EXECUTE SAMPLE QUERY
          </a>
        </div>
      </main>

      <footer style={{ marginTop: '30px', fontSize: '0.7rem', color: '#555', letterSpacing: '1px' }}>
        &copy; 2026 AKASHHACKER // SECURE TERMINAL ACCESS
      </footer>
    </div>
  );
}
