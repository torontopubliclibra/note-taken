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
   
    // if savedNotes isn't null
    if (savedNotes) {

      // set notes to parsed array
      this.notes = JSON.parse(savedNotes);

    } else {

      // else set notes to an empty array
      this.notes = [];
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
    localStorage.clear();
  }

  // clear function
  clear() {

    // set textbox value to an empty string
    this.textareaValue = "";
  }

}
