# seating-hall-management

## Run the application

Open a terminal in the `seating arrangements` folder and start the Flask app:

```powershell
python zen_app.py
```

Then open `http://127.0.0.1:5000/` in a browser. Keep the terminal open while using the app.

## Seating arrangement features

- The generator checks room capacity, roll-number ranges, missing students, and duplicate roll numbers before creating an arrangement.
- Generated arrangements are saved in the SQLite database and appear under **History**.
- Students can use **Find My Seat** with their roll number to see the room, seat number, row, and column.
- Arrangement pages provide an Excel download and a printable seating grid. Choose **Print / Save as PDF**, then select **Save as PDF** in the browser's print dialog.
- The pages adapt to smaller screens.