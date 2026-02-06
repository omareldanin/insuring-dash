import TextField, { type TextFieldProps } from "@mui/material/TextField";

export default function RTLTextField(props: TextFieldProps) {
  return (
    <TextField
      {...props}
      fullWidth
      InputProps={{
        ...(props.InputProps || {}),
        sx: {
          direction: "rtl",
          textAlign: "right",
          ...(props.InputProps?.sx || {}),
        },
      }}
      InputLabelProps={{
        ...(props.InputLabelProps || {}),
        sx: {
          right: 0,
          left: "auto",
          transformOrigin: "top right",
          textAlign: "right",
          ...(props.InputLabelProps?.sx || {}),
        },
      }}
    />
  );
}
