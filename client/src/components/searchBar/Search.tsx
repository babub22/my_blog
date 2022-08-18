import React from 'react';
import {TextField} from "@mui/material";

const Search = (props: any) => {
    const {onChange, value} = props;

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