const $=s=>document.querySelector(s),esc=s=>{let d=document.createElement("div");d.textContent=s||"";return d.innerHTML};let tasks=JSON.parse(localStorage.getItem("azz_v22_tasks")||"null")||structuredClone(DEFAULT_TASKS),templates=JSON.parse(localStorage.getItem("azz_v22_tpls")||"null")||structuredClone(DEFAULT_TEMPLATES),selectedProperty="Olympic",selectedTime="";const save=()=>{localStorage.setItem("azz_v22_tasks",JSON.stringify(tasks));localStorage.setItem("azz_v22_tpls",JSON.stringify(templates))},fmt=t=>{let[h,m]=t.split(":").map(Number);return `${(h+11)%12+1}:${String(m).padStart(2,"0")} ${h>=12?"PM":"AM"}`},late=t=>{let d=new Date(),[h,m]=t.time.split(":").map(Number);return !t.done&&h*60+m<d.getHours()*60+d.getMinutes()};$("#today").textContent=new Intl.DateTimeFormat(undefined,{weekday:"long",month:"long",day:"numeric",year:"numeric"}).format(new Date());function populate(el){el.innerHTML=PROPERTIES.map(p=>`<option>${p}</option>`).join("")}$("#tplFilter").innerHTML='<option>All Templates</option><option>New Guest Check-In</option><option>Extension</option>';
populate($("#taskProp"));
$("#tplProp").innerHTML=[...new Set([...PROPERTIES,"Guest Messages"])].map(p=>`<option>${p}</option>`).join("");function nav(){let html=PROPERTIES.map(p=>{let n=tasks.filter(t=>t.property===p&&!t.done).length;return `<button class="propBtn ${selectedProperty===p?"active":""}" data-prop="${esc(p)}">${esc(p)} <span>${n}</span></button>`}).join("");$("#propertyNav").innerHTML=html}function renderProperty(){nav();$("#templatesView").hidden=true;$("#checkinView").hidden=true;$("#extensionView").hidden=true;$("#spielsView").hidden=true;$("#adminView").hidden=true;$("#taskView").hidden=false;$("#templatesBtn").classList.remove("active");$("#adminBtn").classList.remove("active");let list=tasks.filter(t=>t.property===selectedProperty).sort((a,b)=>a.time.localeCompare(b.time));let times=[...new Set(list.map(t=>t.time))];if(!times.includes(selectedTime))selectedTime=times[0]||"";$("#propertyTitle").textContent=selectedProperty;$("#propertySummary").textContent="Receptionist deadlines only. Cleaner time schedules are inside the cleaning-list template.";let done=list.filter(t=>t.done).length;$("#counts").innerHTML=`<div class="countPill">${done}/${list.length} completed</div>`;$("#timeTabs").innerHTML=times.map(t=>`<button class="timeBtn ${t===selectedTime?"active":""}" data-time="${t}">${fmt(t)}</button>`).join("")+`<button class="timeBtn" data-checkin="1">Check-In</button>${activeProperty==="Olympic"?"":`<button class="timeBtn" data-extension="1">Extension</button>`}<button class="timeBtn" data-spiels="1">Spiels</button>`;let shown=list.filter(t=>t.time===selectedTime);$("#taskPanel").innerHTML=shown.length?shown.map(t=>`<article class="card"><div class="cardTop"><div><div><span class="badge">${fmt(t.time)}</span>${late(t)?'<span class="late">OVERDUE</span>':""}${t.done?'<span class="done">COMPLETED</span>':""}</div><h3>${esc(t.title)}</h3><div class="writtenInstructions"><div class="instructionLabel">Written Instructions</div><div class="instructionText">${esc(t.action)}</div></div><p class="required"><b>Required Submission:</b> ${esc(t.proof)}</p>${t.completedAt?`<div class="sentMeta">Completed ${esc(t.completedAt)}</div>`:""}</div><div class="taskActions">${t.template?`<button data-copy="${esc(t.template)}">View / Copy Template</button>`:""}<button class="primary" data-done="${esc(t.id)}">${t.done?"Undo":"Mark Sent / Complete"}</button></div></div></article>`).join(""):'<div class="empty">No receptionist task at this time.</div>'}function renderTemplates(){let p=$("#tplFilter").value,q=$("#tplSearch").value.toLowerCase(),l=templates.filter(t=>(p==="All Templates"||(p==="New Guest Check-In"&&t.category==="Guest Check-In")||(p==="Extension"&&t.category==="Extension"))&&(t.name+" "+t.category+" "+t.property).toLowerCase().includes(q));$("#templateList").innerHTML='<div class="templateGrid">'+l.map(t=>`<article class="card"><span class="badge">${esc(t.property)}</span><span class="badge">${esc(t.category)}</span><h3>${esc(t.name)}</h3><button class="primary" data-copy="${esc(t.id)}">Open & Copy</button></article>`).join("")+"</div>"}function renderEditor(){$("#adminTasks").innerHTML=tasks.slice().sort((a,b)=>a.property.localeCompare(b.property)||a.time.localeCompare(b.time)).map(t=>`<div class="adminRow"><div><b>${esc(t.property)} · ${fmt(t.time)} — ${esc(t.title)}</b><small>${esc(t.proof)}</small></div><div class="adminBtns"><button data-edit-task="${esc(t.id)}">Edit</button><button data-del-task="${esc(t.id)}">Delete</button></div></div>`).join("");$("#adminTpls").innerHTML=templates.map(t=>`<div class="adminRow"><div><b>${esc(t.name)}</b><small>${esc(t.property)} · ${esc(t.category)}</small></div><div class="adminBtns"><button data-edit-tpl="${esc(t.id)}">Edit</button><button data-del-tpl="${esc(t.id)}">Delete</button></div></div>`).join("");$("#taskTpl").innerHTML='<option value="">None</option>'+templates.map(t=>`<option value="${esc(t.id)}">${esc(t.name)}</option>`).join("")}function openCopy(id){let t=templates.find(x=>x.id===id);if(!t)return;$("#copyTitle").textContent=t.name;$("#copyBody").value=t.body;$("#copyStatus").textContent="";$("#copyDlg").showModal()}function openTask(t={}){$("#taskForm").reset();$("#taskId").value=t.id||"";$("#taskProp").value=t.property||selectedProperty;$("#taskTime").value=t.time||"09:00";$("#taskName").value=t.title||"";$("#taskAction").value=t.action||"";$("#taskProof").value=t.proof||"";$("#taskTpl").value=t.template||"";$("#taskDlg").showModal()}function openTpl(t={}){$("#tplForm").reset();$("#tplId").value=t.id||"";$("#tplProp").value=t.property||selectedProperty;$("#tplCat").value=t.category||"Group Chat";$("#tplName").value=t.name||"";$("#tplBody").value=t.body||"";$("#tplDlg").showModal()}document.addEventListener("click",e=>{let sp=e.target.closest("[data-spiels]");if(sp){$("#taskView").hidden=true;$("#templatesView").hidden=true;$("#adminView").hidden=true;$("#checkinView").hidden=true;$("#extensionView").hidden=true;$("#spielsView").hidden=false;renderSpiel("checkin");return}let ex=e.target.closest("[data-extension]");if(ex){$("#taskView").hidden=true;$("#templatesView").hidden=true;$("#adminView").hidden=true;$("#checkinView").hidden=true;$("#extensionView").hidden=false;setupExtension();return}let oc=e.target.closest("[data-checkin]");if(oc){$("#taskView").hidden=true;$("#templatesView").hidden=true;$("#adminView").hidden=true;$("#extensionView").hidden=true;$("#spielsView").hidden=true;$("#checkinView").hidden=false;setupCheckin();return}let b=e.target.closest("[data-prop]");if(b){selectedProperty=b.dataset.prop;selectedTime="";renderProperty();return}b=e.target.closest("[data-time]");if(b){selectedTime=b.dataset.time;renderProperty();return}b=e.target.closest("[data-copy]");if(b){openCopy(b.dataset.copy);return}b=e.target.closest("[data-done]");if(b){let t=tasks.find(x=>x.id===b.dataset.done);t.done=!t.done;t.completedAt=t.done?new Date().toLocaleString():"";save();renderProperty();return}b=e.target.closest("[data-edit-task]");if(b){openTask(tasks.find(x=>x.id===b.dataset.editTask));return}b=e.target.closest("[data-del-task]");if(b&&confirm("Delete this receptionist task?")){tasks=tasks.filter(x=>x.id!==b.dataset.delTask);save();renderEditor();return}b=e.target.closest("[data-edit-tpl]");if(b){openTpl(templates.find(x=>x.id===b.dataset.editTpl));return}b=e.target.closest("[data-del-tpl]");if(b&&confirm("Delete this template?")){templates=templates.filter(x=>x.id!==b.dataset.delTpl);save();renderEditor();return}if(e.target.matches("[data-close]"))e.target.closest("dialog").close()});$("#templatesBtn").onclick=()=>{$("#taskView").hidden=true;$("#checkinView").hidden=true;$("#extensionView").hidden=true;$("#spielsView").hidden=true;$("#adminView").hidden=true;$("#templatesView").hidden=false;$("#templatesBtn").classList.add("active");$("#adminBtn").classList.remove("active");renderTemplates()};$("#adminBtn").onclick=()=>{$("#taskView").hidden=true;$("#checkinView").hidden=true;$("#extensionView").hidden=true;$("#spielsView").hidden=true;$("#templatesView").hidden=true;$("#adminView").hidden=false;$("#adminBtn").classList.add("active");$("#templatesBtn").classList.remove("active");renderEditor()};$("#tplFilter").onchange=renderTemplates;$("#tplSearch").oninput=renderTemplates;$("#addTask").onclick=()=>openTask();$("#addTpl").onclick=()=>openTpl();$("#copyBtn").onclick=async()=>{try{await navigator.clipboard.writeText($("#copyBody").value)}catch{$("#copyBody").select();document.execCommand("copy")}$("#copyStatus").textContent="Copied to clipboard."};$("#taskForm").onsubmit=e=>{e.preventDefault();let id=$("#taskId").value,d={property:$("#taskProp").value,time:$("#taskTime").value,title:$("#taskName").value.trim(),action:$("#taskAction").value.trim(),proof:$("#taskProof").value.trim(),template:$("#taskTpl").value,kind:"send"};if(id)Object.assign(tasks.find(x=>x.id===id),d);else tasks.push({id:"task-"+Date.now(),...d,done:false});save();$("#taskDlg").close();renderEditor()};$("#tplForm").onsubmit=e=>{e.preventDefault();let id=$("#tplId").value,d={property:$("#tplProp").value,category:$("#tplCat").value.trim(),name:$("#tplName").value.trim(),body:$("#tplBody").value};if(id)Object.assign(templates.find(x=>x.id===id),d);else templates.push({id:"tpl-"+Date.now(),...d});save();$("#tplDlg").close();renderEditor()};

const OLYMPIC_ROOMS={
1:["1st level","ensuite"],2:["1st level","shared"],3:["1st level","ensuite"],4:["1st level","ensuite"],
5:["1st level","ensuite"],6:["1st level","shared"],7:["1st level","shared"],8:["1st level","ensuite"],
9:["1st level","ensuite"],10:["1st level","ensuite"],11:["1st level","ensuite"],12:["1st level","shared"],
13:["1st level","ensuite"],14:["1st level","ensuite"],15:["2nd level","ensuite"],16:["2nd level","ensuite"],
17:["2nd level","shared"],18:["2nd level","shared"],19:["2nd level","ensuite"],20:["2nd level","owner"],
21:["2nd level","ensuite"],22:["2nd level","owner"],23:["2nd level","owner"],24:["2nd level","shared"],
25:["2nd level","owner"],26:["2nd level","shared"],27:["2nd level","ensuite"],28:["2nd level","ensuite"],
29:["2nd level","ensuite"],30:["2nd level","shared"]
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
   .replaceAll("[Room PIN]",pin).replaceAll("[####]",pin)
   .replaceAll("[Door Code]",door).replaceAll("[Main Door Code]",door).replaceAll("[Receptionist Name]",receptionist).replaceAll("[Receptionist’s Name]",receptionist);
}
function generateCheckin(){
 const guest=$("#ciGuest").value.trim(),receptionist=$("#ciReceptionist").value.trim(),room=$("#ciRoom").value.trim(),bed=$("#ciBed").value.trim(),pin=$("#ciRoomPin").value.trim(),door=$("#ciDoor").value.trim();
 if(selectedProperty==="Olympic"){
   const info=OLYMPIC_ROOMS[room];
   if(!guest||!receptionist||!room||!door||!info){$("#ciResultCard").hidden=true;$("#ciOlympicInfo").textContent=room?"Room number not found in Olympic room list.":"Select/enter an Olympic room number.";return}
   if(info[1]==="owner"){$("#ciResultCard").hidden=true;$("#ciOlympicInfo").textContent=`Room ${room} is marked Owner Occupied.`;return}
   const level=info[0],shared=info[1]==="shared";
   $("#ciOlympicInfo").innerHTML=`<b>Detected:</b> Room ${esc(room)} · ${esc(level)} · ${shared?"Shared Bathroom":"Ensuite Bathroom"}`;
   const baths=shared?`\n\n${OLY_BATH[level]}`:"";
   $("#ciResult").value=`Hi ${guest},

We're delighted to have you stay with us.
Here are your check-in details:

Room Number: Room ${room} (${level})
Main Door Code: ${door}

Use the Goki round lock attached to the door to enter the code.${baths}

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