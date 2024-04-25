import { useState } from "react";
import QrReader from "react-scan-qr";
import Button from '@mui/material/Button';
import { Grid } from "@mui/material";
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
// import logo from "./assets/gdsc_logo_white.png";
import logo from "./assets/logo svg.svg";

import Accepted from "./Accepted"
import { AcceptedTag, RefusedTag, AllreadyAcceptedTag } from "./Tags"
import { Loader } from '@mantine/core';


const url = "http://127.0.0.1:5001/api/v1/postData"


export default function App() {
  const [cameraOn, setCameraOn] = useState(false);
  const [classNameStyle, setClassNameStyle] = useState('')
  const [isfetching, setIsfetching] = useState(false);
  const classNameStyles = ['accepted', 'already-accepted', 'not-accepted']
  const [acceptedInfo, setAcceptedInfo] = useState(null);
  const handleScann = async (e) => {
    if (e) {
      setCameraOn(false);
      setIsfetching(true);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: e
        })
      });
      const data = await response.json()
      setIsfetching(false);
      console.table(data);
      setAcceptedInfo(data);
      setClassNameStyle(classNameStyles[[200, 300, 404].indexOf(response.status)])
    }
  }
  const handleError = (e) => {
    console.log(e)
  }

  return (
    <div>
      <center>
        <img alt="logo" style={{ zoom: "0.6", margin: "20px", width: 300 }} src={logo} />
      </center>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <div style={{ width: "500px" }}>
            {
              cameraOn ? (

                <QrReader
                  delay={500}
                  onError={handleError}
                  onScan={handleScann}
                  style={{ width: "100%", borderRadius: "10px" }}
                  showViewFinder={true}
                />

              ) : (<div style={{ width: "500px", height: "500px", backgroundColor: "#363232", borderRadius: "10px" }}></div>)
            }
          </div>
          <Button startIcon={cameraOn ? <VideocamOffIcon /> : <VideocamIcon />} variant="outlined" style={{ margin: "7px" }}
            onClick={() => {
              setCameraOn(!cameraOn);
              setClassNameStyle("");
            }}
          >
            {cameraOn ? "close camera" : "open camera"}
          </Button>

        </Grid>
        <Grid style={{ height: "500px" }} item xs={6}>

          {isfetching ?
            (
              <section className='content'>
                <Loader variant="dots" style={{ zoom: "2" }} />
              </section>
            )
            : classNameStyle === "accepted" ?
              (
                <section className='content'>
                  <div>
                    <Accepted data={acceptedInfo} />
                    <center><AcceptedTag /></center>
                  </div>
                </section>) : classNameStyle === "already-accepted" ? (
                  <section className='content'>
                    <center>
                      <AllreadyAcceptedTag />
                    </center>
                  </section>
                ) : classNameStyle === "not-accepted" ? (
                  <section className='content'>
                    <center>
                      <RefusedTag />
                    </center>
                  </section>
                ) : <section className='content'>
                <center>
                  <h1>SCAN THE PARTICIPANT'S QR-CODE</h1>
                </center>
              </section>
          }
        </Grid>
      </Grid>

    </div >
  );
}
