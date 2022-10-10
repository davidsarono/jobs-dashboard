import { useEffect, useState } from 'react';
import {
    useParams,
} from 'react-router-dom';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { Constants } from '../../context/AuthContext';
import instance from '../../services/axios';
import { useCommon } from '../../context/CommonContext';

const Job = () => {
    const { setCommon } = useCommon();

    let { id } = useParams();

    const [state, setState] = useState({
        data: null,
        isLoading: false
    })

    const fetchJob = async (id) => {
        setState(prevState => ({ ...prevState, isLoading: true }))
        try {
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
            setState(prevState => ({ ...prevState, data: response.data.data, isLoading: false }))
        } catch (error) {
            setCommon(prevState => ({ ...prevState, errorMessages: error?.response?.data?.message || 'Ooopss!', isOpen: true }))
            setState(prevState => ({ ...prevState, isLoading: false }))
        }
    }

    useEffect(() => {
        fetchJob(id)
    }, [id]);

    return (
        <>
            <Link href="/jobs" variant="body2">Back</Link>
            {state?.data?.title ? (
                <Box sx={{ border: '1px solid #e4e4e4', px: 4, my: 5 }}>
                    <Box sx={{ borderBottom: '1px solid #e4e4e4', py: 4 }}>
                        <Typography>{state?.data?.type} / {state?.data?.location}</Typography>
                        <Typography variant='h4'>{state?.data?.title}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex' }}>
                        <Box component="div" dangerouslySetInnerHTML={{ __html: state?.data?.description + state?.data?.how_to_apply }} />
                    </Box>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 10 }}>
                    {state?.isLoading ? <CircularProgress /> : <Typography variant='body1'>Oopps!</Typography>}
                </Box>
            )}
        </>
    )
}

export default Job