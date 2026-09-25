AZZURRO RECEPTION HUB — V35

Receptionist-first redesign and code audit.

Key changes:
- Full UI redesign around Property → Current task → Instructions → Message → Complete.
- Removed hidden task/template editor screens and their unused JavaScript.
- Removed unused template-search/admin code and legacy CSS.
- Rebuilt task navigation as compact action cards with time + task name.
- Added two-column task workspace: step-by-step instructions and WhatsApp-ready template preview.
- Dinner List instructions render as numbered steps with the supplied screenshots.
- Dinner Google Sheet opens from Step 2 but is not included in the sendable template.
- Preserved Check-In, Extension, Google Review and Reception Scripts tools.
- Olympic remains without Extension and Google Review.
- Olympic Room PIN field is hidden because it is not used by the Olympic check-in generator.
- Fixed Pyrmont ambiguous [####] placeholders so Room PIN and Main Door Code cannot be populated with the same value.
- Migrates existing v34 task completion state into v35 on first load.
- No external frameworks or libraries; local static files only.

V36
- Olympic Room 12 check-in now automatically includes its digital door lock code 3570.
- The extra Room 12 access instruction appears only when Olympic Room 12 is selected.

V37: Fixed Dinner List step parser, restored screenshots to Steps 3 and 6, and improved SOP typesetting. Preserves Room 12 Olympic door code update.

V38 FINAL
- Updated the entire app to a modern Segoe UI Variable / Segoe UI / system sans-serif typography stack.
- Message previews and textareas now use the same modern readable font.
- Final scan completed: JavaScript syntax, DOM references, task/template references, screenshot assets, Dinner workflow parser, Olympic Room 12 code, Central Wi-Fi, Pyrmont PIN placeholders, Olympic extension rule, and debug/merge leftovers.
