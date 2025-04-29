import { Box, Card, Stack, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import dayjs from "dayjs"
import { useGetMyReservationsQuery } from "../features/reserve/reserveApiSlice"

const Main = () => {
  const { data = [], isLoading } = useGetMyReservationsQuery(undefined)

  return (
    <Stack spacing={2}>
      <Card>
        <DataGrid
          disableColumnMenu
          rows={data}
          pageSizeOptions={[10, 20, 50]}
          loading={isLoading}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
                page: 0,
              },
            },
          }}
          columns={[
            {
              field: "id",
              headerName: "ID",
              align: "center",
              headerAlign: "center",
            },
            {
              field: "courtName",
              headerName: "코트",
              headerAlign: "center",
              align: "center",
              width: 150,
            },

            {
              field: "startTime",
              headerName: "예약시간",
              flex: 1,
              renderCell: params =>
                dayjs(params.value as string).format("YYYY-MM-DD HH:mm"),
            },
            {
              field: "dateFixed",
              headerName: "예약상태",
              width: 150,
              renderCell: params => {
                return (
                  <Typography
                    component="span"
                    variant="body2"
                    color={!params.value ? "error" : undefined}
                  >
                    {params.value ? "결제완료" : "결제대기"}
                  </Typography>
                )
              },
            },
          ]}
        />
      </Card>
      <Box height={100} />
    </Stack>
  )
}

export default Main
