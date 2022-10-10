import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import dayjs from 'dayjs';

import instance from '../../services/axios';

import { useEffect, useState } from 'react';
import { Constants } from '../../context/AuthContext';


const Jobs = () => {

  const [state, setState] = useState({
    rows: [],
    page: 1,
    perPage: 5,
  })

  const fetchJobs = async (params) => {
    const token = localStorage.getItem(Constants.TOKEN);

    const response = await instance.get(
      '/jobs',
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          page: params?.page,
          description: params?.description,
          location: params?.location,
          full_time: params?.full_time,
        }
      }
    )
    setState(prevState => ({ ...prevState, rows: [...prevState.rows, ...response.data.data] }))
  }

  useEffect(() => {
    fetchJobs({ page: 1 });
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      description: data.get("job-description") || undefined,
      location: data.get("location") || undefined,
      isFullTime: data.get("full-time-only") || undefined
    }
    setState(prevState => ({ ...prevState, rows: [] }))
    fetchJobs(payload)
  };

  const handleChangePage = () => {
    fetchJobs({ page: state.page + 1 });
    setState(prevState => ({ ...prevState, page: prevState.page + 1 }));
  }

  return (
    <>
      {/* Search */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="job-description"
          label="Job Description"
          name="job-description"
          sx={{
            width: '30%'
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="location"
          label="Location"
          type="location"
          id="location"
          sx={{
            width: '30%'
          }}
        />
        <FormControlLabel
          control={<Checkbox value="full-time-only" color="primary" />}
          label="Full Time Only"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            width: '10%'
          }}
        >
          Search
        </Button>
      </Box>

      {/* Table */}
      <Typography variant="h4" sx={{ mt: 10, p: 2 }}>Job List</Typography>
      <Table>
        <TableBody>
          {state.rows.length ? state.rows.map((row) => (
            <TableRow
              key={row?.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Box>
                  <Link href={`/jobs/${row?.id}`} variant="body2">
                    {row?.title}
                  </Link>
                  <Box sx={{ display: 'flex' }}>
                    <Typography>
                      {row?.company}
                    </Typography>{' - '}
                    <Typography>
                      {row?.type}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box>
                  <Typography>
                    {row?.location}
                  </Typography>
                  <Typography>
                    {dayjs(row?.created_at).from(dayjs())}
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )) : null}
        </TableBody>
      </Table>
      <Button
        sx={{
          mb: 2
        }}
        onClick={handleChangePage}
      >
        More Jobs
      </Button>
    </>
  )
}

export default Jobs