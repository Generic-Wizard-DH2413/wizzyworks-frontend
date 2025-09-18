import { useNavigate } from 'react-router-dom';

export default function ShapePicker() {
    const navigate = useNavigate();

    return (
        <>
            <h3>Pick your firework shape</h3>

            <nav className='special-nav'>
                <button onClick={() => navigate('/innerlayer')}>Next</button>
            </nav>
        </>
    )
}