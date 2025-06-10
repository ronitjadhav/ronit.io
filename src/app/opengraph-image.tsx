import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const alt = 'Ronit Jadhav - Geospatial Developer'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          fontFamily: 'system-ui',
        }}
      >
        <div
          style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '900px',
          }}
        >
          <h1
            style={{
              fontSize: '60px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              margin: '0 0 20px 0',
            }}
          >
            Ronit Jadhav
          </h1>
          <h2
            style={{
              fontSize: '36px',
              color: '#333',
              margin: '0 0 20px 0',
              fontWeight: '400',
            }}
          >
            Geospatial Developer & Software Engineer
          </h2>
          <p
            style={{
              fontSize: '24px',
              color: '#666',
              margin: '0',
              lineHeight: 1.4,
            }}
          >
            Specializing in maps, data visualization, and web technologies
          </p>
          <div
            style={{
              display: 'flex',
              gap: '20px',
              marginTop: '30px',
              fontSize: '18px',
              color: '#888',
            }}
          >
            <span>🗺️ GIS</span>
            <span>🐍 Python</span>
            <span>⚛️ React</span>
            <span>🌍 OpenLayers</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
