
let teacherData = "";
// get api
  const getTeacher = (e) => {

    document.querySelector(".container").innerHTML = `<div>資料處理中</div>`;

    fetch("/api/teacher")
    .then((res) => res.json())
    .then((data) => {
      teacherData = data;
      // teacherData.map((data) => console.log(data.name));

      document.querySelector(".container").innerHTML = `
        <table class="teacherTable">
          <thead>
            <tr  class="theadTR">
              <th class="nameTh">姓名</th>
              <th class="instrumentTh">樂器</th>
              <th class="introductionTh">相片</th>
              <th class="introductionTh">介紹</th>
              <th class="introductionTh">
                <input type="button" value="上傳資料" onclick=updata() />
                <input type="button" value="新增資料" onclick=insertTeacher() />
              </th>
            </tr>
          </thead>
          <tbody class="tbody">
              ${teacherData.map((data, index) => `
                <tr class="tr${index}">
                  <td><input 
                    id="teacherName${index}" 
                    class="teacherName teacher teacher${index}" 
                    type="text" value=${data.name} 
                    onchange=changeTeacherName(${index}) 
                    disabled /></td>

                  <td>
                    <input 
                      id="teacherInstrument${index}" 
                      class="teacherInstrument teacher teacher${index}" 
                      type="text" 
                      value=${data.instrument} 
                      onchange=changeTeacherInstrument(${index}) 
                      disabled /></td>

                  <td>
                    <div class="smImgDiv">
                      <img 
                        id='teacherImg${index}' 
                        class="base64image"
                        src=${data.image}
                        alt=${data.name}
                      />
                    </div>
                    <input 
                      id="teacherImgInput${index}" 
                      class="teacher teacher${index} teacherImgInput${index}" 
                      type="text" 
                      name="imgTeacher"
                      value=${data.image} 
                      onchange=changeTeacherImg(${index})
                      disabled />
                      
                  </td>

                  <td><textarea 
                    id="teacherIntroduction${index}" 
                    class="teacherIntroduction teacher teacher${index}" 
                    onchange=teacherIntroduction(${index})
                    disabled>${data.introduction}</textarea></td>
                    
                  <td class="td5">
                    <input type="button" value="編輯" onclick="edit(${index})" />
                    <input type="button" value="刪除" onclick=delet(${index}) />
                  </td>
                </tr>          
              `).join("")}
          </tbody>
        </table>
      `;
    //   <img 
    //   id='teacherImg${index}' 
    //   class="base64image"
    //   src=${'data:image/jpeg;base64,' + data.image}
    //   alt=${data.name}
    // />

    // <form id='test'>
    // <input 
    //   id='teacherImgInput${index}'
    //   class="teacher teacher${index} teacherImgInput${index}" 
    //   id="imgTeacher" 
    //   type="file" 
    //   name="imgTeacher" 
    //   onchange=changeTeacherImg(${index})
    //   disabled>
    // </form>

      if (e) alert("取得成功");
      return ;
    })
    .catch((err) => console.log("error:", err));
  };
  // getTeacher();

// insert api

  const insertTeacher = () => {
    
    document.querySelector(".tbody").innerHTML += `
      <tr class="tr${teacherData.length}">
        <td><input 
          id="teacherName${teacherData.length}"
          class="teacher teacher${teacherData.length}" 
          type="text" 
          value="" 
          onchange=changeTeacherName(${teacherData.length}) 
          disabled /></td>

        <td>

          <input 
          id="teacherInstrument${teacherData.length}"
          class="teacher teacher${teacherData.length} 
          "type="text" 
          value="" 
          onchange=changeTeacherInstrument(${teacherData.length}) 
          disabled /></td>

        <td>
          <div class="smImgDiv">
            <img 
              id='teacherImg${teacherData.length}' 
              class="base64image"
              src=""
              alt=""
            />
          </div>
          <input 
            id="teacherImgInput${teacherData.length}"
            class="teacher teacher${teacherData.length} teacherImgInput${teacherData.length}" 
            type="text" 
            name="imgTeacher"
            onchange=changeTeacherImg(${teacherData.length}) 
            disabled>
        </td>

        <td><textarea 
          id="teacherIntroduction${teacherData.length}"
          class="teacher teacher${teacherData.length}" 
          onchange=teacherIntroduction(${teacherData.length})
          disabled></textarea></td>

        <td><input type="button" value="編輯" onclick="edit(${teacherData.length})" /><input type="button" value="刪除" onclick=delet(${teacherData.length}) /></td>
                </tr> 
    `
    teacherData.push({
      name: "",
      instrument: "",
      introduction: "",
      image: ""
    });
  //   <td>
  //   <div class="smImgDiv">
  //     <img 
  //       id='teacherImg${teacherData.length}' 
  //       class="base64image"
  //       src=${'data:image/jpeg;base64,' + ""}
  //       alt=""
  //     />
  //   </div>
  //   <input 
  //     id="teacherImg${teacherData.length}"
  //     class="teacher teacher${teacherData.length} teacherImgInput${teacherData.length}" 
  //     id="imgTeacher" 
  //     type="file" 
  //     name="imgTeacher"
  //     onchange=changeTeacherImg(${teacherData.length}) 
  //     disabled>
  // </td>
  }

// updata api

  const updata = () => {
    fetch("/api/teacher", {
      method: "POST",
      body: JSON.stringify({
        teacherData: teacherData,
        updata: true
      }),
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then((res) => res.json())
    .then((data) => {
      alert(data);
      getTeacher();
    })
    .catch((err) => console.log("error:", err));
  }

  // change api

  const changeTeacherName = (e) => {
    const teacherName = document.getElementById("teacherName" + e).value;
    teacherData[e].name = teacherName;
  }

  const changeTeacherInstrument = (e) => {
    const teacherInstrument = document.getElementById("teacherInstrument" + e).value;
    teacherData[e].instrument = teacherInstrument;
  }

  const teacherIntroduction = (e) => {
    const teacherIntroduction = document.getElementById("teacherIntroduction" + e).value;
    teacherData[e].introduction = teacherIntroduction;
  }

  const changeTeacherImg = (e) => {
    const teacherImgInputClass = document.getElementById("teacherImgInput" + e).value;
    teacherData[e].image = teacherImgInputClass;

    // const teacherImgInputClass = document.getElementsByClassName("teacherImgInput" + e)[0].files[0];
    // const teacherImg = document.getElementById("teacherImg" + e);

    // let reader = new FileReader();
    // reader.readAsDataURL(teacherImgInputClass);
    // reader.onload = () => {
    // let deletDataImg = reader.result.replace("data:image/jpeg;base64,", "")
    //   teacherData[e].image = deletDataImg;
    //   teacherImg.src = reader.result;
    // };
    // reader.onerror = (error) => {
    //  console.log('Error: ', error);
    // };
  }

  
  const edit = (num) => {
    const buttons = document.querySelectorAll('.teacher' + num);
    // console.log(buttons);
    // if (button[num].disabled) button[num].removeAttribute('disabled');
    // else  button[num].setAttribute('disabled', '');
    
    for (const button of buttons) {
      if (button.disabled) button.removeAttribute('disabled');
      else button.setAttribute('disabled', '');
    };
  };

  const delet = (num) => {
    let buttons = document.getElementsByClassName('tr' + num);
    for (let button of buttons) {
      button.remove();
    }
    teacherData[num] = { _id: teacherData[num]._id };
  }