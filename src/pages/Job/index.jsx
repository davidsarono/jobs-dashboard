import {
    useParams,
} from "react-router-dom";
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import dummy from '../../dummy.json'

const Job = () => {
    let { id } = useParams();

    const data = dummy.find(job => job.id === id)

    return (
        <>
            <Link href="/jobs" variant="body2">Back</Link>
            <Box sx={{ border: '1px solid #e4e4e4', px: 4, mt: 5 }}>
                <Box sx={{ borderBottom: '1px solid #e4e4e4', py: 4 }}>
                    <Typography>{data.type} / {data.location}</Typography>
                    <Typography variant='h4'>{data.title}</Typography>
                </Box>

                <Box sx={{ display: 'flex' }}>
                    <Box component="div" dangerouslySetInnerHTML={{ __html: data.description + data.how_to_apply }} />
                </Box>
            </Box>
        </>
    )
}

export default Job