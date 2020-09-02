const express = require("express");
const app = express();
const exec = require("child_process").execSync;

app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

function checkwrite(value) {
  if (value == 1) {
    return "A1";
  } else {
    return "A0";
  }
}

app.post("/write/rfid", (req, res) => {
  const { tv1, tv2, tv42t, room25 } = req.body;
  const tv1code = checkwrite(tv1);
  const tv2code = checkwrite(tv2);
  const tv42tcode = checkwrite(tv42t);
  const room25code = checkwrite(room25);
  // A1A1A1A1000000000000000000000000
  const rfid_scan = `${tv1code}${tv2code}${tv42tcode}${room25code}000000000000000000000000`;
  const result = exec(`VBCallReader.exe "4" "9600" "${rfid_scan}"`);
  const temp_status = result.toString("UTF-8").split(",");
  const RFID_CONNECT = temp_status[0].trim();
  const RFID_WIRTE = temp_status[1].trim();
  if (RFID_CONNECT == "True" && RFID_WIRTE == "True") {
    res.json({ status: true, message: "เขียน RFID สำเร็จ", code: rfid_scan });
  } else if (RFID_CONNECT == "False") {
    res.json({
      status: false,
      message: "ไม่สามารถเขียนได้ กรุณาตรวจสอบการต่ออุปกรณ์",
    });
  }
});

app.listen(8888, console.log("RFID API 8888"));
