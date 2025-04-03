import './SearchAndImportBar.css';
import { FormControl, OutlinedInput, InputAdornment, Button } from "@mui/material";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterIcon from '../../assets/icons/filter-icon.svg';
import AddNewObjectIcon from '../../assets/icons/add-new-object-icon.svg';
import GreenBackgroundButton from "../Buttons/GreenBackground/GreenBackgroundButton";
import TextButton from '../Buttons/TextButton/TextButton';
import ExportIcon from '../../assets/icons/export-icon.svg';
import ImportIcon from '../../assets/icons/import-icon.svg';

export function Search() {
    return (
        <FormControl sx={{ width: { xs: '100%', md: '384px' }, backgroundColor: "#D9D9D9", borderRadius: "8px" }}>
            <OutlinedInput
                size="small"
                id="search"
                placeholder="Item, valor, código…"
                sx={{ flexGrow: 1, borderRadius: "8px", backgroundColor: "#D9D9D9", paddingRight: "10px" }}
                endAdornment={
                    <InputAdornment position="start" sx={{ color: 'text.primary', marginRight: 0 }}>
                        <SearchRoundedIcon fontSize="medium" />
                    </InputAdornment>
                }
                inputProps={{
                    'aria-label': 'Item, valor, código',
                }}
            />
        </FormControl>
    );
}

const SearchAndImportBar = () => {
    return (
        <div className="container-search-bar">
            <div className="search-bar-content">
                <Search />
                <TextButton iconPath={FilterIcon} text="Filtrar" />
            </div>

            <div className="import-bar-content">
                <TextButton iconPath={ExportIcon} text="Exportar" />
                <GreenBackgroundButton iconPath={ImportIcon} />
                <GreenBackgroundButton iconPath={AddNewObjectIcon} text="Adicionar Produto" />
            </div>
        </div >
    );
};

export default SearchAndImportBar;