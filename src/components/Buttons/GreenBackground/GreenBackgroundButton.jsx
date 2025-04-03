import './GreenBackgroundButton.css';

const GreenBackgroundButton = ({ iconPath, text }) => {
    return (
        <button className='green-background-button'>
            <img src={iconPath} />
            {text && <p>{text}</p>}
        </button>
    );
}

export default GreenBackgroundButton;