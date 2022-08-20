import React from 'react';
import {TextField} from "@mui/material";

const Search = ({onChange, value}:{value:string,onChange:any}) => {
    return (
        <>
            <TextField
                label="Atricle title"
                variant="standard"
                fullWidth
                value={value}
                onChange={onChange}
                sx={{
                    mt: "1.5rem",
                    mb: "1.5rem"
                }}
            />
        </>
    );
};

export default Search;