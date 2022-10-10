import { useEffect, useState } from 'react';
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
import CircularProgress from '@mui/material/CircularProgress';
import dayjs from 'dayjs';

import instance from '../../services/axios';

import { Constants } from '../../context/AuthContext';
import { useCommon } from '../../context/CommonContext';


const Jobs = () => {
  const { setCommon } = useCommon();

  const [state, setState] = useState({
    rows: [],
    page: 1,
    perPage: 10,
    isLoading: false,
    payload: null,
  })

  const fetchJobs = async (params) => {
    setState(prevState => ({ ...prevState, isLoading: true }))
    try {
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
      setState(prevState => ({ ...prevState, rows: [...prevState.rows, ...response.data.data], isLoading: false }))
    } catch (error) {
      if (error?.response?.status === 500 && error?.response?.data?.message !== 'ERROR') {
        setCommon(prevState => ({ ...prevState, errorMessages: error?.response?.data?.message || 'Ooopss!', isOpen: true }))
      }
      setState(prevState => ({ ...prevState, isLoading: false }))
    }
  }

  useEffect(() => {
    fetchJobs({ page: 1, full_time: true });
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      description: data.get("job-description") || undefined,
      location: data.get("location") || undefined,
      full_time: data.get("full-time-only") ? true : false
    }
    setState(prevState => ({ ...prevState, rows: [], page: 1, payload }))
    fetchJobs({ ...payload, page: !payload.description && !payload.location ? 1 : undefined })
  };

  const handleChangePage = () => {
    fetchJobs({ ...state.payload, page: state.page + 1 });
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
          control={
            <Checkbox
              id="full-time-only"
              name="full-time-only"
              color="primary"
              value="full-time-only"
              defaultChecked
            />
          }
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
      {state.rows.length > 0 ? (
        <>
          <Typography variant="h4" sx={{ mt: 10, p: 2 }}>Job List</Typography>
          <Table>
            <TableBody>
              {state.rows.map((row) => (
                <TableRow
                  key={row?.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Box>
                      <Link href={`/jobs/${row?.id}`} variant="a" sx={{ fontSize: '20px' }}>
                        {row?.title}
                      </Link>
                      <Box sx={{ display: 'flex' }}>
                        <Typography>
                          {row?.company}
                        </Typography>
                        <Typography>
                          &nbsp;&bull;&nbsp;
                        </Typography>
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
              ))}
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
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 10 }}>
          {state.isLoading ? (
            <CircularProgress />
          ) : (
            <Typography>
              No Data
            </Typography>
          )}
        </Box>
      )}
    </>
  )
}

export default Jobs