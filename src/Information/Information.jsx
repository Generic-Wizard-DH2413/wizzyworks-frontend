import './Information.css';
import { useAppNavigation } from '../hooks/useAppNavigation';

export default function Information() {
    const { navigateTo } = useAppNavigation();

    return (
        <>
            <h1>Build your own firework &#127878;</h1>
            <h3>Please increase the <b>brightness</b> and turn up the <b>volume</b> for full experience</h3>
            <nav className='special-nav'>
                <button onClick={() => navigateTo('/shapePicker')}>Next</button>
            </nav>
        </>
    )
}