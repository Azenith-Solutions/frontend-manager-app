import './SearchAndImportBar.css';
import { FormControl, OutlinedInput, InputAdornment, Button } from "@mui/material";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterIcon from '../../assets/icons/filter-icon.svg';
import ExportIcon from '../../assets/icons/export-icon.svg';
import ImportIcon from '../../assets/icons/import-icon.svg';
import AddNewObjectIcon from '../../assets/icons/add-new-object-icon.svg';
import GreenBackgroundButton from "../Buttons/GreenBackground/GreenBackgroundButton";
import GreenTextButton from '../Buttons/GreenTextButton/GreenTextButton';

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

                <Button variant="outlined" startIcon={<img src={FilterIcon} />} sx={{
                    border: "none", gap: 1,
                    marginLeft: { xs: "20px", sm: "54px", md: "54px" },
                    fontFamily: "Inter", fontSize: "18px", fontWeight: 400, textTransform: "none", color: '#000000'
                }}>
                    Filtrar
                </Button>
            </div>

            <div className="import-bar-content">
                <GreenTextButton iconPath={ExportIcon} />
                <GreenBackgroundButton iconPath={ImportIcon} />
                {/* 
                <Button variant="outlined" startIcon={<img className="export-icon" src={ExportIcon} />} sx={{
                    border: "none", gap: 1,
                    alignItems: "center",
                    fontFamily: "Inter", fontSize: "18px", fontWeight: 400, textTransform: "none", color: '#000000'
                }}>
                    Exportar
                </Button> */}

                <Button variant="outlined" startIcon={<img className="import-icon" src={ImportIcon} />} sx={{
                    border: "none", gap: 1,
                    width: "40px", height: "50px",
                    marginRight: 0,
                    backgroundColor: "#2ECC71"
                }} />

                <Button variant="outlined" startIcon={<img className="add-new-object-icon" src={AddNewObjectIcon} />} sx={{
                    border: "none", borderRadius: "5px",
                    height: "50px", gap: 2,
                    backgroundColor: "#2ECC71",
                    marginRight: 0,
                    boxShadow: "4px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                    fontFamily: "Inter", fontSize: "18px", fontWeight: 400, textTransform: "none", color: '#000000'
                }}>
                    Adicionar Produto
                </Button>
            </div>
        </div >
    );
};

export default SearchAndImportBar;