import { Component } from '@angular/core';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

// component class
export class AppComponent {

  // initial variables
  title: string = `note-taken`;
  theme: string = `light`;
  storedTheme: any = localStorage.getItem(`theme`);
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
  placeholder: string = `Type your note here`;
  noteColor: string = `green`;
  colorFilter: string = `all`;
  timeSort: string = `desc`;
  noteColors: string[] = [];
  inputtedText: string = ``;
  mobileView: string = `notepad`;

  // component class constructor
  constructor() {
   
    // if there are notes stored, set the notes to the parsed array
    if (this.localNotes) {
      this.allNotes = JSON.parse(this.localNotes);

    // otherwise set the notes to an empty array
    } else {
      this.allNotes = [];
    }

    // if the stored theme is dark, turn on the dark theme
    if (this.storedTheme === `dark`) {
      this.theme = `dark`;
    }

    this.filteredNotes = this.allNotes;

    this.updateNoteColors();
  }

  toggleMobileView = () => {

    if (this.mobileView === "notepad") {
      this.mobileView = "notebook";
    } else {
      this.mobileView = "notepad"
    }

  }

  toggleSiteInfo = () => {

    if (this.mobileView !== "info") {
      this.mobileView = "info";
    } else {
      this.mobileView = "notepad"
    }

  }

  updatePlaceholder = (newPlaceholder: string) => {

    this.placeholder = newPlaceholder;

    setTimeout(() => {
      this.placeholder = 'Type your note here';
    }, 1000)
  }

  updateNoteColors = () => {
    let newNoteColors: string[] = [];

    this.allNotes.forEach((note) => {
      if (!newNoteColors.includes(note.color)) {
        newNoteColors.push(note.color);
      }
    })

    if (!newNoteColors.includes(this.colorFilter)) {
      this.colorFilter = `all`;
      this.filterNotesByColor();
    }

    this.noteColors = newNoteColors;

  }

  filterNotesByColor = () => {

    let updatedNotes: {
      text: string,
      color: string,
      meta: {
        time: string,
        date: string,
      }
    }[] = this.allNotes;

    if (this.colorFilter !== `all`) {
      updatedNotes = updatedNotes.filter(note => note.color === this.colorFilter);
    }

    this.filteredNotes = updatedNotes;

  }

  // save note function
  saveNote(event: any) {

    if (event.keyCode == 13) {
      event.preventDefault();
    }

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

    console.log(updateNotes);

    // set the notes to the updated notes
    this.allNotes = updateNotes;

    this.updateNoteColors();

    if (this.colorFilter !== this.noteColor) {
      this.colorFilter = `all`;
    }

    this.filterNotesByColor();

    // set the local storage notes to the stringified array
    localStorage.setItem(`notes`, JSON.stringify(updateNotes));

    // clear out textbox value
    this.inputtedText = ``;

  }

  // edit note function

  editNote(index: number) {

    let editedNote = this.filteredNotes[((this.filteredNotes.length - 1) - index)];

    this.inputtedText = editedNote.text;
    this.noteColor = editedNote.color;

    this.removeNote(index);

    this.toggleMobileView();

  }

  // remove note function
  removeNote(index: number) {

    let removedNote = this.filteredNotes[((this.filteredNotes.length - 1) - index)];

    this.filteredNotes = this.filteredNotes.filter(note => note.text !== removedNote.text);

    this.allNotes = this.allNotes.filter(note => note.text !== removedNote.text);

    this.localNotes = this.allNotes;

    this.updateNoteColors();

    // set the local storage notes to the stringified array 
    localStorage.setItem(`notes`, JSON.stringify(this.localNotes));

  }

  // remove all notes function
  removeAll() {

    // empty all the notes arrays
    this.allNotes = [];
    this.filteredNotes = [];
    this.localNotes = [];
    
    this.updateNoteColors();

    // clear the local storage
    localStorage.removeItem(`notes`);

    this.toggleMobileView();

  }

  // clear text function
  clearText() {

    // set textbox value to an empty string
    this.inputtedText = ``;

  }

  // update theme function
  updateTheme() {

    // if theme is dark
    if (this.theme === `dark`) {

      // update theme to light and send to local storage
      this.theme = `light`
      localStorage.setItem(`theme`, `light`);

    // if theme is light
    } else {

      // update theme to dark and send to local storage
      this.theme = `dark`;
      localStorage.setItem(`theme`, `dark`);

    }
  }

}
