
  const processing = (e) => {
    
    const teacherIntroduction = document.getElementsByClassName("contactForm" + e)[0][0].checked;
    // console.log(teacherIntroduction);
    if (teacherIntroduction) {
      document.getElementsByClassName("contactForm" + e)[0][0].checked = true;
      contactData[e].isProcessing = true;
    }else {
      document.getElementsByClassName("contactForm" + e)[0][1].checked = true;
      contactData[e].isProcessing = false;
    }
  }

  const contactEdit = (e) => {
    const buttons = document.querySelectorAll('.contact' + e);
    
    for (const button of buttons) {
      if (button.disabled) button.removeAttribute('disabled');
      else button.setAttribute('disabled', '');
    };
  };

  const contactDelet = (e) => {
    let buttons = document.getElementsByClassName('contactTr' + e);
    for (let button of buttons) {
      button.remove();
    }
    contactData[e] = { _id: contactData[e]._id };
  }

  const contactUpdata = () => {
    fetch("/api/contactUs", {
      method: "POST",
      body: JSON.stringify({
        contactData: contactData,
        contactUpdata: true
      }),
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then((res) => res.json())
    .then((data) => {
      alert(data);
      getContact();
    })
    .catch((err) => console.log("error:", err));
  }

  const changeContactFirstName = (e) => {
    const firstName = document.getElementById("contactFirstName" + e).value;
    contactData[e].firstName = firstName;
  }

  const changeContactLastName = (e) => {
    const lastName = document.getElementById("contactLastName" + e).value;
    contactData[e].lastName = lastName;
  }

  const changeContactEmail = (e) => {
    const email = document.getElementById("contactEmail" + e).value;
    contactData[e].email = email;
  }

  const changeContactPhone = (e) => {
    const phone = document.getElementById("contactPhone" + e).value;
    contactData[e].phone = phone;
  }

  const changeContactReqText = (e) => {
    const reqText = document.getElementById("contactReqText" + e).value;
    contactData[e].reqText = reqText;
  }

let contactData = "";
const getContact = (e) => {

  fetch("/api/contactUs")
  .then((res) => res.json())
  .then((data) => { 
    contactData = data;
    // contactData.map((data) => console.log(data));
    document.querySelector(".container").innerHTML = `
    <table class="contactTable">
      <thead>
        <tr>
          <th class="nameTh">發送日期</th>
          <th class="nameTh">姓名</th>
          <th class="instrumentTh">Email</th>
          <th class="introductionTh">電話</th>
          <th class="introductionTh">內容</th>
          <th class="introductionTh">處理狀況</th>
          <th class="introductionTh">
            <input type="button" value="上傳資料" onclick="contactUpdata()" />
          </th>
        </tr>
      </thead>

      <tbody class="tbody">
        ${contactData.map((data, index) => `
          <tr class="contactTr${index}">
            <td class="contactCSS">
              ${data.date}
            </td>
            <td>
              <input 
              id="contactFirstName${index}" 
              class="contactCSS contact contact${index}" 
              placeholder="first name"
              type="text" value="${data.firstName}" 
              onchange="changeContactFirstName(${index})"
              disabled />
              <input 
              id="contactLastName${index}" 
              class="contactCSS contact contact${index}" 
              placeholder="last name"
              type="text" value="${data.lastName}" 
              onchange="changeContactLastName(${index})"
              disabled />
            </td>
            <td>
              <input 
              id="contactEmail${index}" 
              class="contactCSS contact contact${index}" 
              type="text" value="${data.email}" 
              onchange="changeContactEmail(${index})"
              disabled />
            </td>
            <td>
              <input 
              id="contactPhone${index}" 
              class="contactCSS contact contact${index}" 
              type="text" value="${data.phone}" 
              onchange="changeContactPhone(${index})"
              disabled />
            </td>
            <td>
              <textarea 
              id="contactReqText${index}" 
              class="contact contact${index}" 
              type="text"
              onchange="changeContactReqText(${index})"
              disabled >${data.reqText}</textarea>
            </td>
            <td class="contactCSS">
              <form id="contactForm${index}" class="contactForm${index}">
              <input 
              id="contactTrue${index}" 
              class="contact contact${index}" 
              name="contact${index}"
              value=true
              type="radio"
              onclick="processing(${index})"
              disabled />
              <label for="contactReqText${index}">未處理</label>


              <input 
              id="contactFalse${index}" 
              class="contact contact${index}" 
              name="contact${index}"
              value=false
              type="radio"
              onclick="processing(${index})"
              disabled />
              <label for="contactReqText${index}">已處理</label>
              </form>

            </td>
            <td class="td5">
              <input type="button" value="編輯" onclick="contactEdit(${index})" /><input type="button" value="刪除" onclick="contactDelet(${index})" />
            </td>
          </tr>
          
        `).join("")}
      </tbody>
    </table>

    `
    contactData.map((data, index) => {
      if (data.isProcessing) {
        document.getElementsByClassName("contactForm" + index)[0][0].checked = true;
      }else {
        document.getElementsByClassName("contactForm" + index)[0][1].checked = true;
      }
    })
  })
  
  

}