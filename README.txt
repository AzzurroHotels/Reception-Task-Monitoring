AZZURRO RECEPTION TASK MONITOR v3

HOW TO TEST
1. Extract the ZIP.
2. Open index.html.

IMPORTANT STRUCTURE CHANGE
- Left sidebar = one tab per property.
- Hover (desktop) or click/tap a property to open it.
- The property page shows tabs ONLY for receptionist task/send times.
- Cleaning task lists are sent ONCE when the cleaner arrives.
- The detailed timed cleaning schedule is inside that one copied cleaning template.
- The receptionist does NOT tick the cleaner's internal time blocks.
- If two receptionist actions share the same time, both appear under the same time tab.
- Admin can edit receptionist tasks and templates separately.

LOCAL TEST LIMITATIONS
- Data is stored in browser localStorage only.
- No multi-user login, cloud database, proof uploads, or shared audit log yet.
- Do not store passwords or account credentials in templates.

V4 CHANGE
- The 6:00 PM Tomorrow Projected Check-In / Check-Out task is now under Potts Point because the Potts Point receptionist performs this reception-wide report.
- The projected report still covers every property; only task ownership/location in the app changed.

V5 CHANGE
- Property navigation is CLICK/TAP ONLY.
- Hovering over a property no longer switches the active property.
- The selected property remains open until the receptionist clicks/taps another property.

V6 CHANGE — WHATSAPP READY
- Cleaning shift templates now use ☐ checkbox lines instead of bullet points.
- The full cleaning schedule remains one message sent once when the cleaner arrives.
- Time headings remain in the message so cleaners can follow their own schedule.
- Copy Message preserves the plain-text checkbox format for WhatsApp.

V7 CHANGES
- Removed the All Properties property tab. Reception-wide duties are owned by the responsible property/receptionist.
- The projected next-day check-in/check-out report remains under Potts Point.
- Added source-based guest check-in templates for Darling Harbour, Potts Point, Central Sydney and Pyrmont.
- Added Moved Bed Extension and Same Room & Bed Extension guest templates.
- Guest templates are available under Templates and are copy/edit ready for WhatsApp.
- Olympic is not given an invented guest check-in message because the supplied source labels an Olympic Check In section but did not provide retrievable message text.

V9 CHANGE
- The Copyable Templates dropdown is now message-type based:
  All Templates
  New Guest Check-In
  Extension
- New Guest Check-In shows the property-specific guest arrival messages.
- Extension shows both Moved Bed Extension and Same Room & Bed Extension.
- Property names remain displayed on each template card.

V10 CHANGE
- Added Olympic New Guest Check-In — Shared Bathroom.
- Added Olympic New Guest Check-In — Ensuite Room.
- Both appear under Templates > New Guest Check-In.
- Shared template includes the supplied Level 1 and Level 2 bathroom codes.
- Ensuite template does not include shared bathroom codes.
- Guest name, room number and level use editable placeholders; supplied property codes/details are retained.

V11 CHANGE
- Olympic access/lock codes are now placeholders because they change.
- Shared Bathroom: Main Door Code and every bathroom code are editable placeholders.
- Ensuite: Main Door Code is an editable placeholder.

V12 CORRECTION
- Olympic bathroom codes restored as fixed codes.
- Only the Olympic Main/Front Door Code remains an editable placeholder.

V13 CHANGES
- Removed the admin-only concept. Everyone using the app can edit tasks and templates.
- Editor renamed to "Edit Tasks & Templates".
- Task send/required times are editable in the task editor.
- Updated task/template storage version so the revised editor loads cleanly.

V14 CHANGE
- Added Olympic New Guest Check-In Generator.
- Receptionist enters Guest Name, Room Number, Level and current Goki/Main Door Code.
- Selecting Room Number automatically detects the stored level and whether the room uses the Ensuite or Bathroom template.
- Rooms 20, 22, 23 and 25 are marked Owner Occupied and cannot generate a guest template.
- Rooms listed by the user as Private Room with Detached Private Bathroom use the supplied Olympic bathroom-code template.
- Fixed bathroom codes remain fixed; only the current Goki/Main Door Code is entered per guest.

V15
- Olympic Check-In is a tab inside the Olympic property page.
- Clicking it opens a fill-up page.
- Enter Guest Name, select Room Number, and enter current Goki/Main Door Code.
- Level is automatically filled from room mapping.
- Correct Olympic check-in template appears automatically according to stored room type.
- Owner-occupied rooms do not generate guest messages.

V16
- Every property now has a Check-In tab.
- Darling Harbour, Potts Point, Central Sydney and Pyrmont use their own existing property check-in templates.
- Fill-up fields: Guest Name, Room Number, Bed Number, Room PIN, Main Door Code.
- Olympic automatically identifies room level and room type.
- Olympic shared-bathroom guests receive bathroom codes ONLY for their own level:
  Level 1 rooms -> Level 1 bathroom codes only.
  Level 2 rooms -> Level 2 bathroom codes only.
- Olympic ensuite rooms receive no shared-bathroom codes.
- Other properties do not add bathroom door codes.
- Goki Confirmation was not included as a fill-up field per the requested field list, so generated non-Olympic messages omit that placeholder line rather than invent a value.

V17
- Added Receptionist Name to every property Check-In fill-up page.
- Receptionist Name fills the [Receptionist Name] / [Receptionist’s Name] signature in property templates.
- Olympic check-in messages now also include the receptionist signature.
- Refreshed check-in page styling for desktop and mobile: cleaner two-column form, improved spacing, inputs, result panel and responsive layout.

V18
- Added Extension tab to every property.
- Extension type selector: Same Room & Bed / Moved Bed.
- Fill-up fields: Guest Name, Room Number, Bed Number, Room PIN, Main Door PIN, Goki Confirmation/Code.
- Message appears automatically once all fields are complete.
- Uses the exact source extension wording from the Azzurro reception/cleaning document.
- Includes Copy Message button and responsive styling matching the Check-In generator.

V19
- Added a Spiels tab to every property workspace.
- Includes the source Check-In Spiel, weekly dinner menu, positive check-in review prompt, and Check-Out Spiel.
- Check-Out Spiel includes the guest experience questions, positive-feedback review request, and final checkout closing.
- Spiels are presented as receptionist scripts, separate from guest message generators.

V20
- Darling Harbour Property Supplies & Fresh Linen Count changed from 2:30 PM to 1:00 PM per user instruction.

V21
- Full Bed Making written instruction restored to all five 10:00 AM property tasks.
- Includes all four Make/Check conditions, Quick Guide, and Important reminder.
- Written Instructions and Required Submission are now visually separate.
- Written Instructions remain editable by everyone.

V22
- Olympic Extension tab removed.
- Olympic generated check-in signature changed to:
  Warm regards,
  [Receptionist Name]
  Olympic Budget Hotel
- Other properties retain Extension.
