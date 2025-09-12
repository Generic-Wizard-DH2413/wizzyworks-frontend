export default function ArUco({ arUcoId }) {
    // Markers generated with https://chev.me/arucogen/
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px'
        }}>
            <img 
                src={`/4x4_1000-${arUcoId}.svg`} 
                style={{ width: '200px', height: 'auto' }}
            />
        </div>
    )
}