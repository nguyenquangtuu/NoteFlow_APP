const fs = require('fs');
const files = ['Sidebar.tsx', 'NoteList.tsx', 'NoteEditor.tsx', 'Modals.tsx', 'Toasts.tsx'];
files.forEach(f => {
  let p = 'src/components/NoteFlow/' + f;
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace(/\\`/g, '`').replace(/\\\$/g, '$');
  fs.writeFileSync(p, c);
});
