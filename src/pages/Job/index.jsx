import {
    useParams,
} from "react-router-dom";
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import { useEffect, useState } from "react";
import { Constants } from "../../context/AuthContext";
import instance from "../../services/axios";

const Job = () => {
    let { id } = useParams();

    const [state, setState] = useState({
        data: null
    })

    const fetchJob = async (id) => {
        const token = localStorage.getItem(Constants.TOKEN);

        const response = await instance.get(
            '/jobs/:id',
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                urlParams: {
                    id,
                }
            }
        )
        setState(prevState => ({ ...prevState, data: response.data.data }))
    }

    useEffect(() => {
        fetchJob(id)
    }, [id]);

    if (!state.data) return null

    return (
        <>
            <Link href="/jobs" variant="body2">Back</Link>
            <Box sx={{ border: '1px solid #e4e4e4', px: 4, mt: 5 }}>
                <Box sx={{ borderBottom: '1px solid #e4e4e4', py: 4 }}>
                    <Typography>{state?.data?.type} / {state?.data?.location}</Typography>
                    <Typography variant='h4'>{state?.data?.title}</Typography>
                </Box>

                <Box sx={{ display: 'flex' }}>
                    <Box component="div" dangerouslySetInnerHTML={{ __html: state?.data?.description + state?.data?.how_to_apply }} />
                </Box>
            </Box>
        </>
    )
}

export default Job