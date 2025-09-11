export default function ArUco({ arUcoId }) {
    // Markers generated with https://chev.me/arucogen/
    return (
        <img src={`/4x4_1000-${arUcoId}.svg`} />
    )
}