import * as React from 'react';
import Switch from '@mui/material/Switch';

// Regra de negocio: armazenar o estado do toggle no localStorage para persistir entre recarregamentos de página - posteriormente, verificar onde aplicar essa lógica
export default function ControlledSwitches() {
    const storedValue = localStorage.getItem('exibir');

    const [checked, setChecked] = React.useState(storedValue ? JSON.parse(storedValue) : false);
    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    // window.addEventListener('beforeunload', () => {
    //     localStorage.setItem('exibir', JSON.stringify(checked));
    // });

    return (
        <Switch
            checked={checked}
            onChange={handleChange}
        />
    );
}
