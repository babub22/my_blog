import React from "react"
import {Alert, Snackbar} from "@mui/material";

const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
        return;
    }
};

export function SnackBarError({ error }:{error:Error|undefined}) {
    if(error)
    return (
        <Snackbar open={true} autoHideDuration={4000} onClose={handleSnackbarClose}>
                <Alert variant="filled" severity='error' sx={{width: '100%'}}>
                    {error.message}
                </Alert>
        </Snackbar>
    )
    else return null
}

export function SnackBarSuccess({ success }:{success:boolean}) {
    if(success)
        return (
            <Snackbar open={true} autoHideDuration={4000} onClose={handleSnackbarClose}>
                <Alert variant="filled" severity='success' sx={{width: '100%'}}>
                    The article has been successfully published!
                </Alert>
            </Snackbar>
        )
    else return null
}