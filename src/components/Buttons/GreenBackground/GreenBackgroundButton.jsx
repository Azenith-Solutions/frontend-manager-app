import './GreenBackgroundButton.css';

const GreenBackgroundButton = ({ iconPath }) => {
    return (
        <button className='green-background-button'>
            <img src={iconPath} />
        </button>
    );
}

export default GreenBackgroundButton;