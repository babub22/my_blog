import {FormControl, InputLabel, MenuItem, Select} from '@mui/material';
import React from 'react';

const Filter = ({value, onChange, authors}: any) => {

    return (
        <>
            <FormControl fullWidth>
                <InputLabel>Author</InputLabel>
                <Select
                    value={value}
                    label="Filter by author"
                    onChange={onChange}
                >
                    <MenuItem value=''>All authors</MenuItem>

                    {// @ts-ignore
                        authors.filter((c, index) => {
                            return authors.indexOf(c) === index;
                            // @ts-ignore
                        }).map(author =>
                            <MenuItem key={author} value={author}>{author}</MenuItem>
                        )}

                </Select>
            </FormControl>
        </>
    );
};

export default Filter;