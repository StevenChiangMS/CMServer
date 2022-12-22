'use strict';

const express = require("express");
const cookieParser = require('cookie-parser')
const http = require('http');
const https = require('https');



// Database
const mongo = require("mongodb");
const mongoose = require("mongoose");

// 環境變數
const dotenvPath = process.cwd()
require("dotenv").config({ path: dotenvPath + "/sample.env" });
const port = process.env.PORT;
const uri = process.env.MONGO_URI;
const uri_cmdb = process.env.MONGO_URI_CMDB;
// const uri_cmdb = process.env.MONGO_URI_CMDB_SERVER_ATLAS;
const user = process.env.EMAIL_ACCOUNT;
const password = process.env.EMAIL_PASS;

// 中間件
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const nodemailer = require("nodemailer");
const fs = require("fs");
const { json } = require("body-parser");

// const privateKey  = fs.readFileSync('/Users/steven/CMProject/CMServer/src/ssl/private.key');
// const certificate = fs.readFileSync(__dirname + '/ssl/certificate.crt');
const credentials = { 
  key: fs.readFileSync(__dirname + '/../ssl/private.key'), 
  cert: fs.readFileSync(__dirname + '/../ssl/certificate.crt')
};

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "img");     
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, file.fieldname + Date.now()+ "." + ext);
  },
});
const upload = multer({storage});

const app = express();
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

app.use((req, res, next) => {
  res.cookie("hello_from_server", "hello", {
    path: '/api/img',
    sameSite: 'none',
    secure: true
  });
  next();
});
// app.use(cookieParser())
app.use(express.json({limit: "500mb"}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());

// Database

// mongoose.connect(uri)
//   .then(() => console.log("Database is connected."))
//   .catch(err => console.error("Database error:", err));
mongoose.connect(uri_cmdb)
  .then(() => console.log("CMserverDB Database is connected."))
  .catch(err => console.error("CMserverDB Database error:", err));

// Database model
const Schema = mongoose.Schema;
const teacherSchema = new Schema({
  name: { type: String, required: true },
  instrument: { type: String, required: true },
  introduction: { type: String },
  image: { data: Buffer, type: String },
  imgType: { type: String, required: true },
});
const TEACHER = mongoose.model("TEACHER", teacherSchema);

const ContactUsSchema = new Schema({
  date: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  isProcessing: { type: Boolean, required: true },
  reqText: { type: String, required: true },
});
const CONTACTUS = mongoose.model("CONTACTUS", ContactUsSchema);

const SignUpSchema = new Schema({
  date: { type: String, required: true },
  name: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true },
  birthday: { type: String, required: true },
  addressCounty: { type: String, required: true },
  addressDistrict: { type: String, required: true },
  addressZip: { type: String, required: true },
  address: { type: String, required: true },
  id: { type: String, required: true },
  roman: { type: String, required: true },
  school: { type: String, required: true },
  grade: { type: String, required: true },
  graded: { type: String, required: true },
  phone: { type: String, required: true },
  fatherName: { type: String },
  fatherPhone: { type: String },
  matherName: { type: String },
  matherPhone: { type: String },
  studentPhone: { type: String },
  introducer: { type: String },
  instrument: { type: String, required: true },
  experience: { type: String, required: true },
  track: { type: String, required: true },
  specify: { type: String },
  payCheckbox: { type: Array, required: true },
  friend1: { type: String },
  friend2: { type: String },
  friend3: { type: String },
  diseaseVerify: { type: String, required: true },
  disease: { type: String },
  food: { type: String, required: true },
  height: { type: String, required: true },
  weight: { type: String, required: true },
  TShirtSize: { type: String, required: true },
  massageCheckbox: { type: Array, required: true },
  agree: { type: Boolean, required: true },
  reqCode: { type: String, required: true },
});
const SIGNUP = mongoose.model("SIGNUP", SignUpSchema);

// api

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/get.html')
});

app.get('/api', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});

app.get('/api/contactUs',async (req, res) => {
  let dbcontactus = await CONTACTUS.find(
    // {instrument: req.params.instrument}
    );

  res.json(dbcontactus);
});


app.get('/api/:instrument',async (req, res) => {
  // console.log("樂器:", req.params.instrument);
  // console.log("IP:", req.ip);
  console.log(req.connection.remoteAddress);
  // console.log(req.ip);
  let dbTeacher = await TEACHER.find(
    // {instrument: req.params.instrument}
    );
  // console.log("數量:", dbTeacher.length);
  // res.set({
  //   "Content-Type": "application/json",
  //   "Access-Control-Allow-Origin": "*",
  // });

  res.json(dbTeacher);
});

app.get('/api/signUp/inquire/:id',async (req, res) => {
    try {
      const dbInquire = await SIGNUP.find(
        {id: req.params.id}
      );
      if (dbInquire.length === 0) {
        console.log("無資料");
        return res.json("無資料");
      }
      console.log(req.params.id + " 查詢資料");
      return res.json(dbInquire);
    } catch (e) {
      console.log(e)
      return res.status(400).json(e);
    }
});

app.post('/api/signUp',async (req, res) => {
  const sendDate = new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'});

  try {
    let dbcheck = await SIGNUP.find(
        {id: req.body.id}
      );
    if (req.body.reqCode !== "2022") {
      console.log("表單過期");
      return res.json("表單過期");
    }else if (dbcheck) {
      console.log("今年申請過囉");
      return res.json("今年申請過囉");
    }
    // send database
    console.log(req.body);
    const SignUp = new SIGNUP({
      date: sendDate,
      name: req.body.name,
      gender: req.body.gender,
      email: req.body.email,
      birthday: req.body.birthday,
      address: req.body.address,
      id: req.body.id,
      roman: req.body.roman,
      school: req.body.school,
      grade: req.body.grade,
      phone: req.body.phone,
      fatherName: req.body.fatherName,
      fatherPhone: req.body.fatherPhone,
      matherName: req.body.matherName,
      matherPhone: req.body.matherPhone,
      studentPhone: req.body.studentPhone,
      introducer: req.body.introducer,
      instrument: req.body.instrument,
      experience: req.body.experience,
      track: req.body.track,
      specify: req.body.specify,
      payTeamInstrument: req.body.payTeamInstrument,
      payTeamPiano: req.body.payTeamPiano,
      friend1: req.body.friend1,
      friend2: req.body.friend2,
      friend3: req.body.friend3,
      diseaseVerify: req.body.diseaseVerify,
      disease: req.body.disease,
      food: req.body.food,
      height: req.body.height,
      weight: req.body.weight,
      TShirtSize: req.body.TShirtSize,
      massageCheckbox: req.body.massageCheckbox,
      agree: req.body.agree,
      reqCode: req.body.reqCode
    });

    await SignUp.save();


    const client = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: user,
        pass: password,
      },
    });
    
    const mailOtions = {
      from: user,
      to: req.body.email,
      subject: "申請通知:  " + SignUp.date,
      html: `<h2>${SignUp.name + "的申請通知！！"}</h2>`
    };
  
    client.sendMail(mailOtions, (err, data) => {
      if (err) {
        return console.log(err);
      }
      console.log("信件已寄出");
      resmail.redirect("/");
    });
    res.json("報名成功");
  } catch (e) {
    console.log(e)
    res.status(400).send(e.message);
  }

})

app.post('/api/contactUs',async (req, res) => {

  if (req.body.contactUpdata) {
    let contactInformation = req.body.contactData
    console.log(contactInformation);
    await contactInformation.map(async (data) => {
      let contact_ID = await CONTACTUS.find(
        {_id: data._id}
      );
      try {
        if (!data.firstName) {
          if (contact_ID.length === 1) {
            let contact_ID = await CONTACTUS.deleteMany({_id: data._id});
            console.log("後台刪除一筆");
            return
          }
        } else {
          let contact_ID = await CONTACTUS.findOneAndUpdate({_id: data._id}, data, { new: true });
          console.log("後台更改一筆");
          return
        }
      } catch(err) {
        console.log(err);
        res.json();
      }
    })
    return res.json("contact");
  }

  const sendDate = new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'});

  if (!req.body.reqCode) {
    return res.json("Server Error");
  }
  // send database
  const contactUs = new CONTACTUS({
    date: sendDate,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    isProcessing: req.body.isProcessing,
    reqText: req.body.reqText,
  })
  await contactUs.save();

  // send mail

  const client = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: user,
      pass: password,
    },
  });
  
  const mailOtions = {
    from: user,
    to: user,
    subject: "顧客回覆 " + contactUs.date,
    // text: 
    //   " 姓名: " + contactUs.firstName + " " + contactUs.lastName +
    //   " 信箱: " + contactUs.email + 
    //   " 電話: " + contactUs.phone + 
    //   " 回覆內容: " + contactUs.reqText,
    html: `<h2>${contactUs.lastName + contactUs.firstName + " " + "回報內容"}</h2><br /><div>${"信箱: " + contactUs.email}</div><br /><div>${"電話: " + contactUs.phone}</div><br /><div>${"回覆內容: " + contactUs.reqText}</div>`
  };

  client.sendMail(mailOtions, (err, data) => {
    if (err) {
      return console.log(err);
    }
    console.log("信件已寄出");
    // resmail.status(200).json({msg:"Email has been sent"});
    resmail.redirect("/");
  });

  res.json('信件已寄出');
});

app.get('/api/teacher',async (req, res) => {
  console.log(1);
  res.json(1);
})

app.post("/api/teacher", upload.single("imgTeacher"), async (req, res) => {

  if (req.body.updata) {
    let teacherInformation = req.body.teacherData;
    // teacherInformation = teacherInformation.filter(data => data !== "");
    await teacherInformation.map(async(data) => {
      try {

        let teacher_ID = await TEACHER.find(
          {_id: data._id}
        );

        if (data._id && (!data.name)) {
          if (teacher_ID.length === 1) {
            let teacher_ID = await TEACHER.deleteMany({_id: data._id});
            console.log("後台刪除一筆");
            return
          }
        } else if (data._id) {
          let teacher = await TEACHER.findOneAndUpdate({_id: data._id}, data, { new: true });
          console.log("後台更改一筆");
          return
        } else {
            teacherInformation = new TEACHER({
            name: data.name,
            instrument: data.instrument,
            introduction: data.introduction,
            image: data.image,
            imgType: "image/jpeg"
          })
          console.log("後台新增成功");
          await teacherInformation.save();
          return
        }
      } catch(err) {
        console.log(err);
        res.json();
      }
    });
    console.log(teacherInformation);
    return res.json("true");
  }

  const img = fs.readFileSync(req.file.path);
  const base64img = img.toString("base64");
  const x = Buffer.from(base64img, "base64");
  console.log("新增一筆師資");

  const name = req.body.teachername;
  const instrument = req.body.instrument;
  const introduction = req.body.introduction;

  try {
    if (name && instrument && base64img) {
      let teacherInformation = new TEACHER({
        name: name,
        instrument: instrument,
        introduction: introduction,
        image: base64img,
        imgType: req.file.mimetype
        // image: Buffer.from(base64img, "base64")
      })
      await teacherInformation.save();
      // res.json({
      //   name: teacherInformation.name,
      //   instrument: teacherInformation.instrument,
      //   introduction: teacherInformation.introduction,
      //   image: teacherInformation.image,
      //   imgType: teacherInformation.imgType
      // });
      res.json("新增成功");

    }else {
      res.json({});
    }
  } catch(err) {
    console.log(err);
    res.json();
  }
});

app.put("/api/teacher", upload.single("updateImgTeacher"), async (req, res) => {

  const state = {
    instrument: req.body.instrument,
    introduction: req.body.introduction
  };

  try {
    let teachername = await TEACHER.find(
      {name: req.body.teachername}
    );
    console.log("teachername:", teachername[0].name , "END");

    if (teachername.length === 1) {
      let teacher = await TEACHER.findOneAndUpdate({name: teachername[0].name}, state, { new: true });
      console.log("更新成功");
      res.json("更新成功");
      return
    }
    res.json("無資料");
    return console.log("無資料");
  } catch(err) {
    console.log(err);
    res.json(err);
  }
});

app.delete("/api/teacher", async (req, res) => {
  try {
    let teachername = await TEACHER.find(
      {name: req.body.teachername}
    );
    if (teachername.length === 1) {
      teachername = await TEACHER.deleteMany({name: req.body.teachername});
      console.log("刪除成功");
      res.json("刪除成功");
      return
    }
    res.json("無資料");
    return console.log("無資料");
  } catch(err) {
    console.log(err);
    res.json(err);
  }
});

app.put("/api/update/:id", async (req, res) => {

  try{
    let SignUp = await SIGNUP.findOneAndUpdate(req.body.state._id, req.body.state, { new: true });
    console.log("更改一筆申請表單");

    res.json("OK");
    res.end();
  } catch(err) {
    console.log(err);
    res.json(err);
  }
});

// app.listen(port, () => {
//   console.log(`Listening on port http://localhost:${port}`);
// });

httpServer.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`);
});

// httpsServer.listen(port, () => {
//   console.log(`Listening on port https://localhost:${port}`);
// });