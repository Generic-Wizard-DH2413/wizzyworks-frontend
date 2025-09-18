import { useNavigate } from 'react-router-dom';

export default function Information() {
    const navigate = useNavigate();

    return (
        <>
            <h1>Build your own firework</h1>
            <p>Please increase the <i>brightness</i> and turn up the <i>volume</i> for full experience</p>
            <nav className='special-nav'>
                <button onClick={() => navigate('/shapePicker')}>Next</button>
            </nav>
        </>
    )
}