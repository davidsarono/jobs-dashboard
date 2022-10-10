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
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

import dummy from '../../dummy.json'

const rows = dummy

const Jobs = () => {

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      description: data.get("job-description"),
      location: data.get("location"),
      isFullTime: data.get("full-time-only")
    })
  };

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
      <Table sx={{ mt: 10 }}>
        <Typography variant="h4" sx={{ p: 2 }}>Job List</Typography>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Box>
                  <Link href={`/jobs/${row.id}`} variant="body2">
                    {row.title}
                  </Link>
                  <Box sx={{ display: 'flex' }}>
                    <Typography>
                      {row.company}
                    </Typography>{' - '}
                    <Typography>
                      {row.type}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box>
                  <Typography>
                    {row.location}
                  </Typography>
                  <Typography>
                    {dayjs(row.created_at).from(dayjs())}
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default Jobs