import { useNavigate } from 'react-router-dom';

export default function Information() {
    const navigate = useNavigate();

    return (
        <>
            <h1>Information</h1>
            <p>Please increase the brightness and turn up the volume for full experience</p>
            <nav className='special-nav'>
                <button onClick={() => navigate('/innerlayer')}>Next</button>
            </nav>
        </>
    )
}