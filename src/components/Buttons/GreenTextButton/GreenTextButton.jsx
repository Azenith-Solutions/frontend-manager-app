import './GreenTextButton.css';

const GreenTextButton = ({ iconPath }) => {
    return (
        <button className='green-text-button'>
            <img src={iconPath} />
            Exportar
        </button>
    )
}

export default GreenTextButton;