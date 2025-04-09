import { Typography, ToggleButtonGroup, ToggleButton, Box } from "@mui/material"

interface Props {
  dayOption: { value: number; label: string }
}

const hoursOptions = Array.from({ length: 24 }, (_, i) => ({
  value: i,
  label: `${i}`.padStart(2, "0") + "시",
})).filter(hour => hour.value >= 8 && hour.value <= 20)

const CourtToggleButtonGroup = ({ dayOption }: Props) => {
  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {dayOption.label}
      </Typography>
      <ToggleButtonGroup color="primary" size="medium">
        {hoursOptions.map(hour => (
          <ToggleButton key={hour.value} value={hour.value}>
            {hour.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  )
}

export default CourtToggleButtonGroup
