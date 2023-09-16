import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

// component class
export class AppComponent {

  // initial variables
  title: string = `note-taken`;
  placeholder: string = `Type your note here`;
  noteColor: string = `green`;
  colorFilter: string = `all`;
  timeSort: string = `newest`;
  noteColors: string[] = [];
  inputtedText: string = ``;
  mobileView: string = `notepad`;

  // note data objects
  localNotes: any = localStorage.getItem(`notes`);
  allNotes: {
    text: string,
    color: string,
    meta: {
      time: string,
      date: string,
    }
  }[] = [];
  filteredNotes: {
    text: string,
    color: string,
    meta: {
      time: string,
      date: string,
    }
  }[] = [];

  // component class constructor
  constructor() {
   
    // if there are local notes stored, parse the data and set the notes array
    if (this.localNotes) {
      this.allNotes = JSON.parse(this.localNotes);

    // otherwise, set the notes array to empty
    } else {
      this.allNotes = [];
    }

    // set the filtered notes to the notes array
    this.filteredNotes = this.allNotes;

    // update the note colours
    this.updateNoteColors();

  }

  // toggle the mobile view function
  toggleMobileView = (view: string) => {

    // set the mobile view variable to the parameter taken by the function
    if (view === `notebook`) {
      this.mobileView = `notebook`;
    } else if (view === `notepad`) {
      this.mobileView = `notepad`
    } else if (view === `info`) {
      this.mobileView = `info`
    }

  }

  // update placeholder text function
  updatePlaceholder = (newPlaceholder: string) => {

    // set the placeholder variable to the parameter taken by the function
    this.placeholder = newPlaceholder;

    // after 1 second, set it back
    setTimeout(() => {
      this.placeholder = `Type your note here`;
    }, 1000)
  }

  // update note colours function
  updateNoteColors = () => {

    // establish an empty array for the new note colours
    let newNoteColors: string[] = [];

    // for each note in the notes array
    this.allNotes.forEach((note) => {

      // if the colour isn't already in the note colours
      if (!newNoteColors.includes(note.color)) {

        // add it
        newNoteColors.push(note.color);
      }
    })

    // if the new note colours doesn't include the selected colour filter
    if (!newNoteColors.includes(this.colorFilter)) {

      // reset the colour filter
      this.colorFilter = `all`;

      // refilter the colours
      this.filterNotesByColor();
    }

    // set the note colours variable to the new note colours
    this.noteColors = newNoteColors;

  }

  // filter notes by colour function
  filterNotesByColor = () => {

    // establish an empty array for the new filtered notes
    let updatedNotes: {
      text: string,
      color: string,
      meta: {
        time: string,
        date: string,
      }
    }[] = this.allNotes;

    // if the colour filter is anything other than 'all'
    if (this.colorFilter !== `all`) {

      // filter the notes by the selected colour filter
      updatedNotes = updatedNotes.filter(note => note.color === this.colorFilter);
    }

    // set the filtered notes variables to the new filtered notes
    this.filteredNotes = updatedNotes;

  }

  // save note function
  saveNote(event: any) {

    // if the key pressed is enter
    if (event.keyCode == 13) {
      
      // prevent the default action
      event.preventDefault();
    }

    // get the date and time info and format it
    let today = new Date();
    let day = today.getDate();
    let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
  "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    let month = monthNames[today.getMonth()];
    let year = String(today.getFullYear());
    let hour = "";
    let meridiem = "AM";
    if (today.getHours() > 12) {
      hour = String(today.getHours() - 12);
      meridiem = 'PM'
    } else {
      hour = String(today.getHours());
    }
    let minute = String(today.getMinutes()).padStart(2, '0');
    
    // compile the date and time strings
    let noteTime: string = `${hour}:${minute} ${meridiem}`
    let noteDate: string = `${month} ${day}, ${year}`

    // create a copy of the current notes and placeholder
    let updateNotes: {
      text: string,
      color: string,
      meta: {
        time: string,
        date: string,
      }
    }[] = this.allNotes;
    let initialPlaceholder = this.placeholder;

    // if there are 20 or more notes, display the limit text
    if (updateNotes.length >= 20) {
      this.updatePlaceholder(`Storage limit reached`);

    // if the note is already in the array, display the duplicate note text
    } else if (updateNotes.some(note => note.text === this.inputtedText)) {
      this.updatePlaceholder(`Note already exists`);
    
    // if the note is blank, display the empty note text
    } else if (this.inputtedText === "" || this.inputtedText == "\n") {

      this.inputtedText = ``;
      this.updatePlaceholder(`Note can't be empty`);

    // otherwise
    } else {

      // push the inputted text to the updated notes
      updateNotes.push({
          text: this.inputtedText,
          color: this.noteColor,
          meta: {
            time: noteTime,
            date: noteDate,
          }
        });

      // and reset the placeholder
      this.placeholder = initialPlaceholder;

    }

    // set the notes array to the updated notes
    this.allNotes = updateNotes;

    // update the note colours
    this.updateNoteColors();

    // if the selected colour filter isn't the colour of the note just added
    if (this.colorFilter !== this.noteColor) {

      // reset the colour filter
      this.colorFilter = `all`;
    }

    // filter the notes by colour
    this.filterNotesByColor();

    // set the local storage notes to the stringified array
    localStorage.setItem(`notes`, JSON.stringify(updateNotes));

    // clear out textbox value
    this.inputtedText = ``;

  }

  // edit note function
  editNote(index: number) {

    // save the note to edit as a variable
    let editedNote = {
      text: '',
      color: '',
      meta: {
        time: '',
        date: '',
      }
    };

    // save the note to edit as a variable
    if (this.timeSort === "newest") {
      editedNote = this.filteredNotes[((this.filteredNotes.length - 1) - index)];
    } else {
      editedNote = this.filteredNotes[(index)];
    }

    // set the input text and colour to that of the edited note
    this.inputtedText = editedNote.text;
    this.noteColor = editedNote.color;

    // delete the note
    this.deleteNote(index);

    // toggle the mobile view back to the notepad
    this.toggleMobileView("notepad");

  }

  // delete note function
  deleteNote(index: number) {

    let deletedNote = {
      text: '',
      color: '',
      meta: {
        time: '',
        date: '',
      }
    };

    // save the note to delete as a variable
    if (this.timeSort === "newest") {
      deletedNote = this.filteredNotes[((this.filteredNotes.length - 1) - index)];
    } else {
      deletedNote = this.filteredNotes[(index)];
    }

    // delete the note from the notes array
    this.allNotes = this.allNotes.filter(note => note.text !== deletedNote.text);

    // delete the note from the filtered notes array
    this.filteredNotes = this.filteredNotes.filter(note => note.text !== deletedNote.text);

    // update the note colours
    this.updateNoteColors();

    // set the local storage notes to the stringified array
    localStorage.setItem(`notes`, JSON.stringify(this.allNotes));

    // update the local notes variable to delete any trace of the note
    this.localNotes = localStorage.getItem(`notes`);

    // if the notebook is empty, set the mobile view to the notepad
    if (this.allNotes.length === 0) {
      this.toggleMobileView("notepad");
    }

  }

  // delete all notes function
  deleteAll() {

    // empty all the notes arrays
    this.allNotes = [];
    this.filteredNotes = [];
    this.localNotes = [];
    
    // update the note colours
    this.updateNoteColors();

    // clear the local storage note
    localStorage.removeItem(`notes`);

    // toggle the mobile view to the notepad
    this.toggleMobileView("notepad");

  }

  // clear text function
  clearText() {

    // set textbox value to an empty string
    this.inputtedText = ``;

  }

}
