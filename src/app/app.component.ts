import { Component } from '@angular/core';

import { note, date, time } from './app.interfaces'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

// component class
export class AppComponent {

  // initial variables
  title: string = `note-taken`;
  view: string = `notepad`;
  allColors: string[] = [
    'green',
    'blue',
    'red',
    'pink',
    'yellow',
    'orange'
  ]
  notepadColor: string = this.allColors[0];
  notebookColors: string[] = [];
  filter: string = `all`;
  placeholders: string[] = [
    `write a note here`,
    `storage limit reached`,
    `note can't be blank`,
    `note already exists`
  ]
  placeholder: string = this.placeholders[0];
  inputtedText: string = ``;
  searchQuery: string = ``;
  sorting: string = `newest`;
  localNotes: any = localStorage.getItem(`notes`);
  filteredNotes: note[] = [];
  allNotes: note[] = [];
  export: {
    blob: any,
    filename: string,
  };
  optionsVisible: boolean = false;
  alert: {
    action: string;
    visibility: boolean;
    text: string;
  };

  // component class constructor
  constructor() {

    this.alert = {
      action: ``,
      visibility: false,
      text: ``,
    };

    this.export = {
      blob: null,
      filename: '',
    }
   
    // if there are local notes stored
    if (this.localNotes) {

      // parse the data and save it to the notes array
      this.allNotes = JSON.parse(this.localNotes);

      // update the notepad colour to the last used colour
      this.notepadColor = this.allNotes[this.allNotes.length - 1].color;
        
      // set the filtered notes to the all notes array
      this.filteredNotes = this.allNotes;

      // update the note colours
      this.updateNotebookColors();
    }

  }

  toggleAlert = (action: string) => {

    if (action === 'delete') {
      this.alert.action = action;

      if (this.filter === 'all') {
        this.alert.text = `Are you sure you want to delete all ${this.allNotes.length} of your notes?`

      } else if (this.filter !== 'all' && !this.searchQuery) {
        this.alert.text = `Are you sure you want to delete all ${this.filteredNotes.length} of your ${this.filter} notes?`

      } else if (this.filter !== 'all' && this.searchQuery) {
        this.alert.text = `Are you sure you want to delete all ${this.filteredNotes.length} of your ${this.filter} notes containing "${this.searchQuery}"?`

      } else {
        this.alert.text = `Are you sure you want to delete all ${this.filteredNotes.length} of your notes containing "${this.searchQuery}"?`
      }

      this.alert.visibility = true;

    } else if (action === 'export') {

      this.alert.action = action;

      this.prepareExport();

      this.alert.text = `Click below to download`;

      this.alert.visibility = true;

    } else if (action === 'close') {
      this.alert.visibility = false;

    }
  }

  // button disabling function
  disableButton = (button: string) => {

    if ((button === 'notebook') && (this.allNotes.length < 1)) {
      return true;
    } else if ((button === 'delete-all') && (this.filteredNotes.length < 2)) {
      return true;
    } else if ((button === 'sorting-newest') && (this.filteredNotes.length < 2 || this.sorting === 'newest')) {
      return true;
    } else if ((button === 'sorting-oldest') && (this.filteredNotes.length < 2 || this.sorting === 'oldest')) {
      return true;
    } else {
      return false;
    }

  }

  // empty notebook text function
  emptyNotebookText = () => {

    let query = this.searchQuery;
    let filter = this.filter;

    if (query && filter === 'all') {
      return `Could not find any notes matching "${query}"`
    } else if (query && filter !== 'all') {
      return `Could note find any ${filter} notes matching "${query}"`
    } else {
      return `There are no notes currently saved in this browser`
    }

  }

  // view toggle function
  toggleView = (view: string) => {

    // set the mobile view variable to the parameter taken by the function
    if (view === `notebook`) {
      this.view = `notebook`;
    } else if (view === `notepad`) {
      this.view = `notepad`
    } else if (view === `info`) {
      this.view = `info`
    }

  }

  toggleOptions = (parameter: boolean) => {
    if (parameter === true) {
      this.optionsVisible = true;
    } else {
      this.filter = 'all';
      this.searchQuery = '';
      this.filteredNotes = this.allNotes;
      this.optionsVisible = false;
    }
  }

  // update placeholder text function
  updatePlaceholder = (index: number) => {

    // set placeholder variable to index taken by function
    this.placeholder = this.placeholders[index];

    // after 1 second, set it back
    setTimeout(() => {
      this.placeholder = this.placeholders[0];
    }, 1000)
  }

  // reverse note order function
  reverseNoteOrder = (order: string) => {

    if (this.sorting !== order) {
      this.sorting = order;
      this.filteredNotes = this.filteredNotes.reverse();
    }

  }

  // update note colour function
  updateNotepadColor = (index: number) => {
    
    if (this.notepadColor !== this.allColors[index]) {
      this.notepadColor = this.allColors[index];
    }

  }

  // update notebook colours function
  updateNotebookColors = () => {

    // establish an empty array for the new note colours
    let newColors: string[] = [];

    // for each note in the notes array
    this.allNotes.forEach((note) => {

      // if the colour isn't already in the note colours
      if (!newColors.includes(note.color)) {

        // add it
        newColors.push(note.color);
      }
    })

    // if the new note colours doesn't include the selected colour filter
    if (!newColors.includes(this.filter)) {

      // reset the colour filter
      this.filter = `all`;

      // refilter the colours
      this.filterNotesByColor();
    }

    // set the note colours variable to the new note colours
    this.notebookColors = newColors;

  }

  // filter notes by colour function
  filterNotesByColor = () => {

    if (this.searchQuery) {

      this.searchNotes()

    } else {

      // establish an empty array for the new filtered notes
      let updatedNotes: note[] = this.allNotes;

      // if the colour filter is anything other than 'all'
      if (this.filter !== `all`) {

        // filter the notes by the selected colour filter
        updatedNotes = updatedNotes.filter(note => note.color === this.filter);

      }

      // set the filtered notes variables to the new filtered notes
      this.filteredNotes = updatedNotes;

    }

  }

  formatInput = () => {

    if (this.inputtedText.includes(`\n`)) {
      this.inputtedText = this.inputtedText.replaceAll(/\n/g, ' ')
    }

  }

  // filter notes by search query
  searchNotes = () => {

    // establish an empty array for the new filtered notes
    let updatedNotes: note[] = this.allNotes;

    if (this.searchQuery && this.filter === 'all') {

      updatedNotes = updatedNotes.filter(note => note.text.toLowerCase().includes(this.searchQuery.toLowerCase()));

    } else if (this.searchQuery && this.filter !== 'all') {

      updatedNotes = updatedNotes.filter(note => note.color === this.filter);
      updatedNotes = updatedNotes.filter(note => note.text.toLowerCase().includes(this.searchQuery.toLowerCase()));

    } else if (!this.searchQuery && this.filter !== 'all') {

      updatedNotes = updatedNotes.filter(note => note.color === this.filter);
    }

    this.filteredNotes = updatedNotes;

  }

  // filter notes by search query
  clearSearch = () => {

    this.searchQuery = '';
    this.filterNotesByColor();

  }

  formatTime = () => {

    // get the time info and format it
    let today = new Date();

    let time: time = {
      hour: String(today.getHours()).padStart(2, '0'),
      min: String(today.getMinutes()).padStart(2, '0'),
    }
    
    // return the time string
    return time;

  }

  formatDate = () => {

    // get the date and time info and format it
    let today = new Date();

    let date: date = {
      day: String(today.getDate()).padStart(2, '0'),
      month: String(today.getMonth() + 1).padStart(2, '0'),
      year: String(today.getFullYear()),
    }
    
    // return the date string
    return date;

  }

  // save note function
  saveNote(event: any) {

    // if the key pressed is enter
    if (event.keyCode == 13) {
      
      // prevent the default action
      event.preventDefault();
    }
    
    // compile the date and time strings
    let noteTime: time = this.formatTime();
    let noteDate: date = this.formatDate();

    // create a copy of the current notes and placeholder
    let updateNotes: note[] = this.allNotes;

    // if there are 50 or more notes
    if (updateNotes.length >= 50) {
      this.updatePlaceholder(1);

    // if the note is empty
    } else if (this.inputtedText === "" || this.inputtedText == "\n") {

      this.inputtedText = ``;
      this.updatePlaceholder(2);

    // if the note is already in the array
    } else if (updateNotes.some(note => (note.text === this.inputtedText) && (note.color === this.notepadColor))) {
      this.updatePlaceholder(3);

    // otherwise
    } else {

      // push the inputted text to the updated notes
      updateNotes.push({
          text: this.inputtedText,
          color: this.notepadColor,
          meta: {
            time: {
              hour: noteTime.hour,
              min: noteTime.min,
            },
            date: {
              day: noteDate.day,
              month: noteDate.month,
              year: noteDate.year,
            }
          }
        });

      // and reset the placeholder
      this.placeholder = this.placeholders[0];

    }

    // set the notes array to the updated notes
    this.allNotes = updateNotes;

    // update the note colours
    this.updateNotebookColors();

    // if the selected colour filter isn't the colour of the note just added
    if (this.filter !== this.notepadColor) {

      // reset the colour filter
      this.filter = `all`;
    }

    // filter the notes by colour
    this.filterNotesByColor();

    // set the local storage notes to the stringified array
    localStorage.setItem(`notes`, JSON.stringify(updateNotes));

    // clear out textbox value and search query
    this.clearText();
    this.clearSearch();

  }

  // edit note function
  editNote(index: number) {

    // save the note to edit as a variable
    let editedNote: note = this.filteredNotes[((this.filteredNotes.length - 1) - index)];

    // set the input text and colour to that of the edited note
    this.inputtedText = editedNote.text;
    this.notepadColor = editedNote.color;

    // delete the note
    this.deleteNote(index);

    // toggle the mobile view back to the notepad
    this.toggleView("notepad");

  }

  // delete note function
  deleteNote(index: number) {

    // save the note to delete as a variable
    let deletedNote: note = this.filteredNotes[((this.filteredNotes.length - 1) - index)]

    // delete the note from the notes array
    this.allNotes = this.allNotes.filter(note => note !== deletedNote);

    // delete the note from the filtered notes array
    this.filteredNotes = this.filteredNotes.filter(note => note !== deletedNote);

    // update the note colours
    this.updateNotebookColors();

    // set the local storage notes to the stringified array
    localStorage.setItem(`notes`, JSON.stringify(this.allNotes));

    // update the local notes variable to delete any trace of the note
    this.localNotes = localStorage.getItem(`notes`);

    // if the notebook is empty, set the mobile view to the notepad
    if (this.allNotes.length === 0) {
      this.toggleView("notepad");
    }

  }

  prepareExport() {

    // note export variables
    let exportedNotes: string[] = [];
    let title: string = `note taken export`
    let query: string = ``;
    let filter: string = ``;
    let date: date = this.formatDate();
    let time: time = this.formatTime();
    let heading: string = ``;

    if (this.searchQuery && this.filter !== 'all') {

      query =  this.searchQuery.replaceAll(/\s/g, "_");
      filter =  this.filter;
      heading = `${title} // ${date.day}/${date.month}/${date.year} ${time.hour}:${time.min} // #${filter} // "${query}"`
      this.export.filename = `note-taken-export--#${filter}-$${query}--${date.year}_${date.month}_${date.day}-${time.hour}${time.min}.txt`

    } else if (this.searchQuery && this.filter === 'all') {

      query =  this.searchQuery.replaceAll(/\s/g, "_");
      heading = `${title} // ${date.day}/${date.month}/${date.year} ${time.hour}:${time.min} // "${query}"`
      this.export.filename = `note-taken-export--$${query}--${date.year}_${date.month}_${date.day}-${time.hour}${time.min}.txt`

    } else if (!this.searchQuery && this.filter !== 'all'){

      filter =  this.filter;
      heading = `${title} // ${date.day}/${date.month}/${date.year} ${time.hour}:${time.min} // #${filter}`
      this.export.filename = `note-taken-export--#${filter}--${date.year}_${date.month}_${date.day}-${time.hour}${time.min}.txt`

    } else {

      heading = `${title} // ${date.day}/${date.month}/${date.year} ${time.hour}:${time.min}`
      this.export.filename = `note-taken-export--${date.year}_${date.month}_${date.day}-${time.hour}${time.min}.txt`

    };

    exportedNotes.push(heading);

    this.filteredNotes.forEach((note) => {
      exportedNotes.push(
        `\n\n${note.text}\n[ ${note.meta.date.day}/${note.meta.date.month}/${note.meta.date.year} | ${note.meta.time.hour}:${note.meta.time.min} | #${note.color} ]`
      );
    });

    this.export.blob = new Blob(exportedNotes, {type: "text/plain;charset=utf-8"});

  }

  exportNotes() {

    // import filesaver
    let FileSaver = require('file-saver');

    FileSaver.saveAs(this.export.blob, this.export.filename);

  }

  // delete all notes function
  deleteAll() {

    if (this.filter !== 'all' || this.searchQuery) {

      let updatedNotes = this.allNotes;

      this.filteredNotes.forEach((note) => {

        // delete the note from the notes array
        let deletedNote = note;
        updatedNotes = updatedNotes.filter(note => note !== deletedNote);
      })

      this.allNotes = updatedNotes;
      this.filteredNotes = [];

      if (updatedNotes.length > 0) {
        
        // toggle the mobile view to the notepad
        this.toggleView("notepad");
      }

    } else {

      // empty all the notes arrays
      this.allNotes = [];
      this.localNotes = [];
      
      // clear the local storage note
      localStorage.removeItem(`notes`);

      // toggle the mobile view to the notepad
      this.toggleView("notepad");
    }
    
    // update the note colours
    this.updateNotebookColors();

    // close the alert box
    this.toggleAlert('close');

    // hide the options panel
    this.optionsVisible = false;

  }

  // clear text function
  clearText() {

    // set textbox value to an empty string
    this.inputtedText = ``;

  }

}
