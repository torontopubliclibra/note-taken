import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

// component class
export class AppComponent {

  // app title
  title = 'pigeon-pad';

  // default textbox value
  textareaValue: string = '';

  // default note color
  noteColor: string = 'pink';

  // default placeholder text
  placeholder: string = "Add a note"

  // default background image
  background = {
    backgroundImage: 'url(./assets/pigeon-bg.jpg)'
  }
  
  // empty notes array
  notes: any[] = [];

  // default darkMode value
  darkMode: boolean = false;

  // component class constructor
  constructor() {

    // get local storage notes value
    let savedNotes: any = localStorage.getItem('notes');

    // get local storage mode value
    let savedMode: any = localStorage.getItem('mode');
   
    // if savedNotes isn't null
    if (savedNotes) {
      // set notes to parsed array
      this.notes = JSON.parse(savedNotes);

    } else {
      // else set notes to an empty array
      this.notes = [];
    }

    // if savedMode is dark
    if (savedMode === 'dark') {
      // turn on dark mode
      this.darkMode = true;
    }
  }

  // change placeholder text function (takes new placeholder as argument)
  changePlaceholderText = (newPlaceholder: string) => {

    // set placeholder to new placeholder
    this.placeholder = newPlaceholder;

    // after 1 second, reset the placeholder
    setTimeout(() => {
      this.placeholder = "Add a note"
    }, 1000)
  }

  // save function
  save() {

    // create copy of notes
    let updateNotes: any[] = this.notes;

    // if the notebook has 12 or more notes
    if (updateNotes.length >= 12) {
      // display limit text
      this.changePlaceholderText("Notes limit exceeded");

    // if note is already in notebook
    } else if (updateNotes.some(note => note.text === this.textareaValue)) {
      // display duplicate text
      this.changePlaceholderText("Already in notes");
    
    // if note is blank
    } else if (!this.textareaValue || this.textareaValue === " ") {
      // display empty note text
      this.changePlaceholderText("Note can't be blank");

    // otherwise
    } else {
      // push textbox value to notes copy
      updateNotes.push(
        {
          text: this.textareaValue,
          color: this.noteColor,
        });
      this.placeholder = "Add a note"
    }

    // set notes to updated notes copy
    this.notes = updateNotes;

    // set local storage item to stringified array
    localStorage.setItem('notes', JSON.stringify(updateNotes));

    // clear out textbox value
    this.textareaValue = '';
  }

  // remove function (takes array index)
  remove(index: number) {

    // create copy of notes
    let updateNotes: any[] = this.notes;

    // remove item from notes array copy at reverse index
    updateNotes.splice(((updateNotes.length - 1) - index), 1);

    // set notes to updated notes copy
    this.notes = updateNotes;

    // set local storage item to stringified array 
    localStorage.setItem('notes', JSON.stringify(updateNotes));
  }

  // remove all notes function
  removeAll() {

    // set notes to an empty array
    this.notes = [];

    // clear the local storage
    localStorage.removeItem('notes');
  }

  // clear function
  clear() {

    // set textbox value to an empty string
    this.textareaValue = "";
  }

  // turn on dark mode function
  turnOnDark() {

    // switch on/off dark mode
    this.darkMode = !this.darkMode;

    // if darkMode is true
    if (this.darkMode) {

      // save dark mode to local storage
      localStorage.setItem('mode', 'dark');
    } else {

      // else save light mode to local storage
      localStorage.setItem('mode', 'light');
    }
  }

}
