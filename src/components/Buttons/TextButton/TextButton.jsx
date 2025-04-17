import './TextButton.css';

const TextButton = ({ iconPath, backgroundColor, text }) => {
    return (
        <button className='text-button' style={ backgroundColor ? { background: backgroundColor, filter: "drop-shadow(0.35px 4px 2.5px rgba(0, 0, 0, 0.3)" } : { background: 'transparent' }}>
            <img src={iconPath} alt="icon" />
            {text && <>{text}</>}
        </button>
    )
}

export default TextButton;