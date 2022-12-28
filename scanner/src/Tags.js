import Chip from '@mui/material/Chip';

function AcceptedTag() {
    return (
        <Chip style={{ zoom: "1.5", margin: "10px" }} label={"Welcome"} color={"success"} variant="contained" />
    );
}
function RefusedTag() {
    return (
        <Chip style={{ zoom: "2" }} label={"Unvalid-token"} color={"error"} variant="contained" />
    );
}
function AllreadyAcceptedTag() {
    return (
        <Chip style={{ zoom: "2" }} label={"Allready-checked"} color={"warning"} variant="contained" />
    );
}

export { AcceptedTag, RefusedTag, AllreadyAcceptedTag }


