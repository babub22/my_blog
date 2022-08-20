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

                    {
                        authors.filter((c:any, index:any)=> {
                            return authors.indexOf(c) === index;
                        }).map((author: string) =>
                            <MenuItem key={author} value={author}>{author}</MenuItem>
                        )}
                </Select>
            </FormControl>
        </>
    );
};

export default Filter;