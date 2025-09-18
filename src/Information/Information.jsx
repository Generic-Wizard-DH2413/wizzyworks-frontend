import { useNavigate } from 'react-router-dom';

export default function Information() {
    const navigate = useNavigate();

    return (
        <>
            <h1>Information</h1>
            <p>Please increase the brightness and turn up the volume for full experience</p>
            <button onClick={() => navigate('/innerlayer')}>Next</button>
        </>
    )
}