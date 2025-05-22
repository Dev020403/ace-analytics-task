import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => (
  <TextField
    fullWidth
    variant="outlined"
    placeholder="Search dishes by name or description..."
    value={value}
    onChange={onChange}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      ),
    }}
    sx={{
      "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        "&.Mui-focused fieldset": {
          borderColor: "primary.main",
        },
      },
    }}
  />
);

export default SearchBar;
