import './TextButton.css';

const TextButton = ({ iconPath, backgroundColor, text }) => {
    return (
        <button className='green-text-button' style={{ background: backgroundColor || 'transparent' }}>
            <img src={iconPath} />
            {text}
        </button>
    )
}

export default TextButton;