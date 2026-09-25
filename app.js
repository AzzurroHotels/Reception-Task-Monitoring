const $=s=>document.querySelector(s);
const esc=value=>{const d=document.createElement("div");d.textContent=value??"";return d.innerHTML};
const STORAGE_TASKS="azz_v38_tasks",STORAGE_TPLS="azz_v38_tpls";
const previousTasks=localStorage.getItem("azz_v37_tasks")||localStorage.getItem("azz_v36_tasks")||localStorage.getItem("azz_v35_tasks")||localStorage.getItem("azz_v34_tasks");
const previousTpls=localStorage.getItem("azz_v37_tpls")||localStorage.getItem("azz_v36_tpls")||localStorage.getItem("azz_v35_tpls")||localStorage.getItem("azz_v34_tpls");
let tasks=JSON.parse(localStorage.getItem(STORAGE_TASKS)||previousTasks||"null")||structuredClone(DEFAULT_TASKS);
let templates=JSON.parse(localStorage.getItem(STORAGE_TPLS)||previousTpls||"null")||structuredClone(DEFAULT_TEMPLATES);
let selectedProperty="Olympic",selectedTime="";

const save=()=>localStorage.setItem(STORAGE_TASKS,JSON.stringify(tasks));
const fmt=time=>{const [h,m]=time.split(":").map(Number);return `${(h+11)%12+1}:${String(m).padStart(2,"0")} ${h>=12?"PM":"AM"}`};
const isLate=t=>{const d=new Date(),[h,m]=t.time.split(":").map(Number);return !t.done&&h*60+m<d.getHours()*60+d.getMinutes()};
const taskIcon=title=>/dinner/i.test(title)?"🍽️":/goki|wi-fi/i.test(title)?"📶":/bed|check-in\/out/i.test(title)?"🛏️":/suppl/i.test(title)?"📦":/projected/i.test(title)?"📊":"✓";
const shortTitle=title=>title.replace(/^Send /,"").replace(/ Task List$/,"").replace(/Property /,"").replace(/Tomorrow /,"");

$("#today").textContent=new Intl.DateTimeFormat(undefined,{weekday:"long",month:"long",day:"numeric",year:"numeric"}).format(new Date());

function showView(id){
  ["taskView","checkinView","extensionView","reviewView","spielsView"].forEach(v=>$("#"+v).hidden=v!==id);
}
function nav(){
  $("#propertyNav").innerHTML=PROPERTIES.map(p=>{
    const all=tasks.filter(t=>t.property===p),open=all.filter(t=>!t.done).length;
    return `<button class="propertyBtn ${selectedProperty===p?"active":""}" data-prop="${esc(p)}"><span class="hotelIcon">▦</span><span class="propertyName">${esc(p)}</span><span class="propertyCount">${open}</span></button>`;
  }).join("");
}
function renderInstruction(task){
  const text=task.action||"";
  if(!/^STEP 1/m.test(text)) return `<div class="instructionPlain">${esc(text)}</div>`;
  const parts=text.split(/(?=STEP \d+ —|FINAL —)/).filter(Boolean);
  return `<div class="steps">${parts.map((part,index)=>{
    const lines=part.trim().split("\n"),heading=lines.shift();
    const stepMatch=heading.match(/^STEP (\d+) — (.*)$/);
    const final=heading.startsWith("FINAL —");
    const stepNo=stepMatch?.[1];
    const num=final?"✓":(stepNo||index+1);
    const title=final?heading.replace("FINAL — ",""):(stepMatch?.[2]||heading);
    const body=lines.join("\n").trim();

    let bodyHtml="";
    if(stepNo==="1" && body.includes("Send this message to the Reception group chat:")){
      const marker="Send this message to the Reception group chat:";
      const message=body.slice(body.indexOf(marker)+marker.length).trim().replace(/^"|"$/g,"");
      bodyHtml=`<p class="stepIntro">${esc(marker)}</p><div class="messageQuote">${esc(message)}</div>`;
    }else{
      const bodyLines=body.split("\n").filter(x=>x.trim());
      bodyHtml=`<div class="stepText">${bodyLines.map(line=>{
        const numbered=line.match(/^(\d+)\.\s+(.*)$/);
        const bullet=line.match(/^•\s+(.*)$/);
        if(numbered)return `<div class="instructionLine"><span class="lineBadge">${numbered[1]}</span><span>${esc(numbered[2])}</span></div>`;
        if(bullet)return `<div class="instructionLine bulletLine"><span class="bulletDot">•</span><span>${esc(bullet[1])}</span></div>`;
        return `<p class="instructionParagraph">${esc(line)}</p>`;
      }).join("")}</div>`;
    }

    const extra=stepNo==="2"
      ? `<a class="sheetLink" href="https://docs.google.com/spreadsheets/d/1_DKXGIxadYq6tEDtD1xDQwiqguPQIih3nqMLEymhq38/edit?gid=277691328#gid=277691328" target="_blank" rel="noopener">Open Dinner List Google Sheet ↗</a>`
      : "";

    const imgs=(task.instructionImages||[]).filter(im=>im.caption.startsWith(`Step ${stepNo} `));
    const images=imgs.length
      ? `<div class="stepImages">${imgs.map(im=>`<figure><a href="${esc(im.src)}" target="_blank" rel="noopener"><img src="${esc(im.src)}" alt="${esc(im.caption)}" loading="lazy"></a><figcaption>${esc(im.caption)}</figcaption></figure>`).join("")}</div>`
      : "";

    return `<section class="step ${final?"finalStep":""}">
      <div class="stepNum">${num}</div>
      <div class="stepBody"><h4>${esc(title)}</h4>${bodyHtml}${extra}${images}</div>
    </section>`;
  }).join("")}</div>`;
}
function templatePreview(task){
  if(!task.template)return "";
  const tpl=templates.find(t=>t.id===task.template);
  if(!tpl)return "";
  const lines=tpl.body.split("\\n"),preview=lines.slice(0,24).join("\\n");
  return `<aside class="templatePanel"><div class="panelTitleRow"><div><span class="eyebrow">MESSAGE / TEMPLATE</span><h3>${esc(tpl.name)}</h3></div><button class="copySmall" data-copy="${esc(tpl.id)}">Open & Copy</button></div><pre>${esc(preview)}${lines.length>24?"\\n\\n… Open to view the full template":""}</pre></aside>`;
}
function renderProperty(){
  showView("taskView");nav();
  const list=tasks.filter(t=>t.property===selectedProperty).sort((a,b)=>a.time.localeCompare(b.time));
  const times=[...new Set(list.map(t=>t.time))];
  if(!times.includes(selectedTime)) selectedTime=times[0]||"";
  $("#propertyTitle").textContent=selectedProperty;
  const done=list.filter(t=>t.done).length;
  $("#counts").innerHTML=`<div class="progressCard"><strong>${done}/${list.length}</strong><span>tasks completed</span><div class="progressTrack"><i style="width:${list.length?done/list.length*100:0}%"></i></div></div>`;
  $("#timeTabs").innerHTML=times.map(time=>{
    const first=list.find(t=>t.time===time);
    return `<button class="actionCard ${time===selectedTime?"active":""}" data-time="${time}"><span class="actionIcon">${taskIcon(first.title)}</span><span><b>${fmt(time)}</b><small>${esc(shortTitle(first.title))}</small></span></button>`;
  }).join("")+`<button class="actionCard tool" data-checkin><span class="actionIcon">👤</span><span><b>Check-In</b><small>Guest message</small></span></button>${selectedProperty==="Olympic"?"":`<button class="actionCard tool" data-extension><span class="actionIcon">↔</span><span><b>Extension</b><small>Stay update</small></span></button><button class="actionCard tool" data-review><span class="actionIcon">★</span><span><b>Google Review</b><small>Checkout request</small></span></button>`}<button class="actionCard tool" data-spiels><span class="actionIcon">💬</span><span><b>Scripts</b><small>Guest conversations</small></span></button>`;

  const shown=list.filter(t=>t.time===selectedTime);
  $("#taskPanel").innerHTML=shown.map(t=>`<article class="taskCard">
    <div class="taskHeader"><div class="taskTitleWrap"><div class="taskGlyph">${taskIcon(t.title)}</div><div><span class="taskTime">${fmt(t.time)}</span><h3>${esc(t.title)}</h3></div></div>
      <div class="taskState">${isLate(t)?'<span class="status overdue">OVERDUE</span>':t.done?'<span class="status complete">COMPLETED</span>':'<span class="status pending">TO DO</span>'}<button class="primary" data-done="${esc(t.id)}">${t.done?"Undo Complete":"✓ Mark Complete"}</button></div>
    </div>
    <div class="taskWorkspace">
      <section class="instructionPanel"><div class="sectionHead"><span>STEP-BY-STEP INSTRUCTIONS</span></div>${renderInstruction(t)}<div class="submission"><b>Required submission</b><span>${esc(t.proof)}</span></div></section>
      ${templatePreview(t)}
    </div>
    ${t.completedAt?`<div class="completedMeta">Completed ${esc(t.completedAt)}</div>`:""}
  </article>`).join("")||'<div class="emptyState">No receptionist task at this time.</div>';
}
function openCopy(id){
  const tpl=templates.find(t=>t.id===id);if(!tpl)return;
  $("#copyTitle").textContent=tpl.name;$("#copyBody").value=tpl.body;$("#copyStatus").textContent="";$("#copyDlg").showModal();
}
async function copyText(text,status){
  try{await navigator.clipboard.writeText(text)}catch{const ta=document.createElement("textarea");ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove()}
  if(status)status.textContent="Copied ✓";
}
document.addEventListener("click",e=>{
  const prop=e.target.closest("[data-prop]");if(prop){selectedProperty=prop.dataset.prop;selectedTime="";renderProperty();return}
  const time=e.target.closest("[data-time]");if(time){selectedTime=time.dataset.time;renderProperty();return}
  if(e.target.closest("[data-home]")){renderProperty();return}
  if(e.target.closest("[data-checkin]")){showView("checkinView");setupCheckin();return}
  if(e.target.closest("[data-extension]")){showView("extensionView");setupExtension();return}
  if(e.target.closest("[data-review]")){showView("reviewView");setupReview();return}
  if(e.target.closest("[data-spiels]")){showView("spielsView");renderSpiel("checkin");return}
  const copy=e.target.closest("[data-copy]");if(copy){openCopy(copy.dataset.copy);return}
  const done=e.target.closest("[data-done]");if(done){const t=tasks.find(x=>x.id===done.dataset.done);if(t){t.done=!t.done;t.completedAt=t.done?new Date().toLocaleString():"";save();renderProperty()}return}
  if(e.target.closest("[data-close]")) e.target.closest("dialog")?.close();
});
$("#copyBtn").onclick=()=>copyText($("#copyBody").value,$("#copyStatus"));

const OLYMPIC_ROOMS={
1:["1st level","ensuite"],
2:["1st level","shared"],
3:["1st level","ensuite"],
4:["1st level","ensuite"],
5:["1st level","shared"],
6:["1st level","shared"],
7:["1st level","shared"],
8:["1st level","shared"],
9:["1st level","ensuite"],
10:["1st level","ensuite"],
11:["1st level","ensuite"],
12:["1st level","shared"],
13:["1st level","ensuite"],
14:["1st level","ensuite"],
15:["2nd level","ensuite"],
16:["2nd level","shared"],
17:["2nd level","shared"],
18:["2nd level","shared"],
19:["2nd level","ensuite"],
20:["2nd level","shared"],
21:["2nd level","ensuite"],
22:["2nd level","ensuite"],
23:["2nd level","shared"],
24:["2nd level","shared"],
25:["2nd level","shared"],
26:["2nd level","shared"],
27:["2nd level","ensuite"],
28:["2nd level","ensuite"],
29:["2nd level","ensuite"],
30:["2nd level","shared"]
};
const OLY_BATH={
"1st level":`Shared Bathroom Codes:
Level 1
Bathroom A1 - C5329
Bathroom B1 - C5324
Bathroom C1 - C5326
Bathroom D1 - C5327`,
"2nd level":`Shared Bathroom Codes:
Level 2
Bathroom A2 - C4321
Bathroom B2 - C4325
Bathroom C2 - C8326`
};
function guestTemplate(prop){
  const map={"Darling Harbour":"tpl-guest-dh","Potts Point":"tpl-guest-pp","Central Sydney":"tpl-guest-central","Pyrmont":"tpl-guest-pyr"};
  return templates.find(t=>t.id===map[prop]);
}
function setupCheckin(){
  $("#ciEyebrow").textContent=selectedProperty.toUpperCase();
  $("#ciHeading").textContent=`${selectedProperty} Check-In`;
  const olympic=selectedProperty==="Olympic";
  $("#ciBedLabel").hidden=olympic;
  $("#ciOlympicInfo").hidden=!olympic;
  $("#ciRoom").value="";$("#ciBed").value="";$("#ciRoomPin").value="";$("#ciDoor").value="";$("#ciGuest").value="";$("#ciReceptionist").value="";
  $("#ciResultCard").hidden=true;$("#ciCopyStatus").textContent="";
  $("#ciHelp").textContent=olympic
    ?"Enter the guest name, room number and Main Door / Goki code. Room type, level and the correct bathroom codes are selected automatically."
    :"Enter the guest details below. The existing check-in template for this property will be filled automatically.";
}
function replaceCommon(body,guest,room,bed,pin,door,receptionist){
  return body
   .replaceAll("[Guest Name]",guest)
   .replaceAll("[Room # / Bed #]",`${room}, ${bed}`)
   .replaceAll("[Room #]",room).replaceAll("[Bed #]",bed)
   .replaceAll("Room [#] – Bed [#]",`Room ${room} – Bed ${bed}`)
   .replaceAll("[Room PIN]",pin)
   .replaceAll("[Door Code]",door).replaceAll("[Main Door Code]",door).replaceAll("[Receptionist Name]",receptionist).replaceAll("[Receptionist’s Name]",receptionist);
}
function generateCheckin(){
 const guest=$("#ciGuest").value.trim(),receptionist=$("#ciReceptionist").value.trim(),room=$("#ciRoom").value.trim(),bed=$("#ciBed").value.trim(),pin=$("#ciRoomPin").value.trim(),door=$("#ciDoor").value.trim();
 if(selectedProperty==="Olympic"){
   const info=OLYMPIC_ROOMS[room];
   if(!guest||!receptionist||!room||!door||!info){$("#ciResultCard").hidden=true;$("#ciOlympicInfo").textContent=room?"Room number not found in Olympic room list.":"Select/enter an Olympic room number.";return}
   if(info[1]==="owner"){$("#ciResultCard").hidden=true;$("#ciOlympicInfo").textContent=`Room ${room} is marked Owner Occupied.`;return}
   const level=info[0],shared=info[1]==="shared";
   $("#ciOlympicInfo").innerHTML=`<b>Detected:</b> Room ${esc(room)} · ${esc(level)} · ${shared?"Shared Bathroom":"Ensuite Bathroom"}${room==="12"?" · Digital Door Lock Code 3570":""}`;
   const baths=shared?`\n\n${OLY_BATH[level]}`:"";
   const roomAccess=room==="12"?`\n\nRoom 12 Door Lock Code: 3570\nUse this code to access the digital door lock for Room 12.`:"";
   $("#ciResult").value=`Hi ${guest},

We're delighted to have you stay with us.
Here are your check-in details:

Room Number: Room ${room} (${level})
Main Door Code: ${door}

Use the Goki round lock attached to the door to enter the code.${roomAccess}${baths}

The onsite reception will hand over the key to your room.

Wi-Fi Details
Network: Olympic Hotel Guest
Password: Olympic@308

Need Assistance?
Reach out on WhatsApp or call:
WhatsApp: +61 417 008 030
Phone: +61 440 133 104

We wish you a comfortable and enjoyable stay, and thank you for choosing the Olympic Hotel.

Warm regards,
${receptionist}
Olympic Budget Hotel`;
   $("#ciResultTitle").textContent=`Olympic Check-In — ${shared?"Shared Bathroom":"Ensuite"}`;
   $("#ciResultCard").hidden=false;return;
 }
 if(!guest||!receptionist||!room||!bed||!pin||!door){$("#ciResultCard").hidden=true;return}
 const t=guestTemplate(selectedProperty);if(!t){$("#ciResultCard").hidden=true;return}
 let body=replaceCommon(t.body,guest,room,bed,pin,door,receptionist);
 // User requested fill-up fields only Room & Bed, Room PIN, Main Door Code (+ guest name).
 // Remove unsupported Goki Confirmation line from generated output rather than inventing a value.
 body=body.replace(/^.*Goki Confirmation:.*\n?/gm,"");
 $("#ciResult").value=body;$("#ciResultTitle").textContent=t.name;$("#ciResultCard").hidden=false;
}
["ciGuest","ciReceptionist","ciRoom","ciBed","ciRoomPin","ciDoor"].forEach(id=>$("#"+id).oninput=generateCheckin);
$("#ciCopy").onclick=async()=>{try{await navigator.clipboard.writeText($("#ciResult").value)}catch{$("#ciResult").select();document.execCommand("copy")}$("#ciCopyStatus").textContent="Copied to clipboard."};


function setupExtension(){
 $("#extEyebrow").textContent=selectedProperty.toUpperCase();
 $("#extHeading").textContent=`${selectedProperty} Guest Extension`;
 $("#extType").value="same";
 ["extGuest","extRoom","extBed","extRoomPin","extDoor","extGoki"].forEach(id=>$("#"+id).value="");
 $("#extResultCard").hidden=true;$("#extCopyStatus").textContent="";
}
function generateExtension(){
 const type=$("#extType").value,guest=$("#extGuest").value.trim(),room=$("#extRoom").value.trim(),bed=$("#extBed").value.trim(),pin=$("#extRoomPin").value.trim(),door=$("#extDoor").value.trim(),goki=$("#extGoki").value.trim();
 if(!guest||!room||!bed||!pin||!door||!goki){$("#extResultCard").hidden=true;return}
 let msg,title;
 if(type==="moved"){
  title="Moved Bed Extension";
  msg=`Hi ${guest},
Thank you for extending your stay with us!
Just a quick update — your new room will be available from 11:00 AM.
Please let us know once you’ve moved so we can inform the cleaners and avoid any confusion.
If possible, it would be really helpful if you could wait to unpack around 2:00–3:00 PM, as our cleaners may still be finishing up the room.
🔐 Please note: Your new room has a different PIN code, so make sure to use the one below when entering!
Here are your new room details:
● Room: ${room} bed ${bed}
● Room PIN: ${pin}
● Main Door PIN: ${door}
● Goki Code: ${goki}
If you’re using the Goki app and your new reservation isn’t showing, just let us know and we’ll help you out.
If you need anything else, feel free to reach out.
Enjoy the rest of your stay!
– Azzurro Hotels Team`;
 } else {
  title="Same Room & Bed Extension";
  msg=`Hello ${guest},
I hope you're doing well. Thank you for extending with us! You will be extending your stay in the same room and bed. Below are your updated key details and confirmation code for extended access:
🛏 Room: ${room} bed ${bed}
🔐 Room PIN: ${pin}
🔐 Main Door PIN: ${door}
📲 Goki Confirmation: ${goki}
Your keys are already activated. If you encounter any issues or require further adjustments to your keys, please don’t hesitate to reach out. I’m here to assist!
Warm Regards,
Azzurro Hotels`;
 }
 $("#extResultTitle").textContent=title;
 $("#extResult").value=msg;$("#extResultCard").hidden=false;
}
["extType","extGuest","extRoom","extBed","extRoomPin","extDoor","extGoki"].forEach(id=>{
 const el=$("#"+id);el[el.tagName==="SELECT"?"onchange":"oninput"]=generateExtension;
});
$("#extCopy").onclick=async()=>{try{await navigator.clipboard.writeText($("#extResult").value)}catch{$("#extResult").select();document.execCommand("copy")}$("#extCopyStatus").textContent="Copied to clipboard."};



const REVIEW_LINKS={
 "Darling Harbour":"https://tinyurl.com/2vb86wa7",
 "Central Sydney":"https://tinyurl.com/25tj8fzv",
 "Potts Point":"https://tinyurl.com/44ruudw3",
 "Pyrmont":"https://tinyurl.com/yeypnmen"
};
function setupReview(){
 $("#reviewEyebrow").textContent=selectedProperty.toUpperCase();
 $("#reviewHeading").textContent=`${selectedProperty} Google Review Request`;
 $("#reviewGuest").value="";$("#reviewReceptionist").value="";
 $("#reviewResultCard").hidden=true;$("#reviewCopyStatus").textContent="";
}
function generateReview(){
 const guest=$("#reviewGuest").value.trim(),receptionist=$("#reviewReceptionist").value.trim(),link=REVIEW_LINKS[selectedProperty];
 if(!guest||!receptionist||!link){$("#reviewResultCard").hidden=true;return}
 $("#reviewResult").value=`Hi ${guest}! 😊
Thank you for staying with us! We hope you enjoyed your stay.

If you have a moment, we'd really appreciate a Google review:
⭐ ${link}

If you could mention my name, ${receptionist}, in your review, it would really help with my performance review. Thank you so much! 🙏

Warm regards,
${receptionist}`;
 $("#reviewResultCard").hidden=false;
}
["reviewGuest","reviewReceptionist"].forEach(id=>$("#"+id).oninput=generateReview);
$("#reviewCopy").onclick=async()=>{try{await navigator.clipboard.writeText($("#reviewResult").value)}catch{$("#reviewResult").select();document.execCommand("copy")}$("#reviewCopyStatus").textContent="Copied to clipboard."};

const SPIELS={
checkin:`<h3>Check-In Spiel</h3>
<p class="spielLead"><b>After providing all check-in details, say:</b></p>
<div class="scriptBox">“Before you settle in, please let us know immediately if you notice any cleanliness or maintenance issues so we can address them promptly.<br><br>If you use the fridge, please keep your items in a clear container. We have 9-litre containers available for a $5 refundable deposit.<br><br>Would you like me to add you to tonight’s dinner list? Tonight’s meal is [today’s meal].”</div>
<h4>Weekly Dinner Menu</h4>
<ul class="menuList">
<li><b>Monday:</b> Neapolitan pasta with salad</li>
<li><b>Tuesday:</b> Chicken schnitzel with mashed potatoes</li>
<li><b>Wednesday:</b> Chicken curry with rice</li>
<li><b>Thursday:</b> Creamy pasta with salad</li>
<li><b>Friday:</b> Saffron rice with chicken mince and salad</li>
<li><b>Saturday:</b> Lamb pasta with salad</li>
<li><b>Sunday:</b> Chicken Maryland with mashed potatoes</li>
</ul>
<p class="spielLead"><b>If the check-in was completed smoothly without any issues or delays, say:</b></p>
<div class="scriptBox">“If you were happy with my assistance today, would you mind leaving a Google or Booking.com review and mentioning my name? It would really help with my performance review. Thank you!”</div>`,
checkout:`<h3>Check-Out Spiel</h3>
<p class="spielLead"><b>When the guest approaches reception to check out, say:</b></p>
<div class="scriptBox">“While I’m checking everything, would it be okay if I asked you a few quick questions about your experience?”<br><br>“How was your overall stay with us?”</div>
<p class="spielLead"><b>Then ask naturally:</b></p>
<ul class="questionList">
<li>“What did you think about the dinner?”</li>
<li>“How did you find our location?”</li>
<li>“How was your experience with our staff?”</li>
<li>“What could we improve for your next stay?”</li>
</ul>
<p class="spielLead"><b>If the guest gives positive feedback:</b></p>
<div class="scriptBox">“I’m glad you enjoyed your stay! Would you mind sharing your experience on Google or Booking.com and mentioning my name? It would really help with my performance review.”</div>
<p class="spielLead"><b>After completing the check-out:</b></p>
<div class="scriptBox">“Thank you for your feedback. Everything is confirmed, and you’re all set to check out. We hope to welcome you again on your next visit to Sydney. Have a safe journey!”</div>`
};
function renderSpiel(type){
 document.querySelectorAll("[data-spiel]").forEach(b=>b.classList.toggle("active",b.dataset.spiel===type));
 $("#spielContent").innerHTML=SPIELS[type];
}




document.addEventListener("click",e=>{const b=e.target.closest("[data-spiel]");if(b)renderSpiel(b.dataset.spiel)});
renderProperty();
