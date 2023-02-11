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

  // default background image
  background = {
    backgroundImage: 'url(./assets/pigeon-bg.jpg'
  }
  
  // empty notes array
  notes: string[] = [];

  // default darkMode value
  darkMode: boolean = false;

  // component class constructor
  constructor() {

    // get local storage value
    let savedNotes: any = localStorage.getItem('notes');

    let savedMode: any = localStorage.getItem('mode');
   
    // if savedNotes isn't null
    if (savedNotes) {

      // set notes to parsed array
      this.notes = JSON.parse(savedNotes);

    } else {

      // else set notes to an empty array
      this.notes = [];
    }

    if (savedMode === 'dark') {
      this.darkMode = true;
    }
  }

  // save function
  save() {

    // create copy of notes
    let updateNotes: string[] = this.notes;

    // if textbox value isn't empty
    if (this.textareaValue) {

      // push textbox value to notes copy
      updateNotes.push(this.textareaValue);
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
    let updateNotes: string[] = this.notes;

    // remove item from notes array copy at index
    updateNotes.splice(index, 1);

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

  // note colour function (takes array index)
  noteColor(index: number) {

    // if note position is divisible by 2
    if ((index + 1) % 2 === 0) {

      // return note color class
      return "noteColor-2"
    } else {

      // else return empty string
      return ""
    }
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
