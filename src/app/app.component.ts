import { ElementSchemaRegistry } from '@angular/compiler';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

// component class
export class AppComponent {

  // initial variables
  title: string = `note-taken`;
  placeholder: string = `type your note here`;
  noteColor: string = `green`;
  colorFilter: string = `all`;
  timeSort: string = `newest`;
  initialNoteColors: string[] = [
    'green',
    'blue',
    'red',
    'pink',
    'yellow',
    'orange'
  ]
  noteColors: string[] = [];
  notebookOptions: boolean = false;
  inputtedText: string = ``;
  searchQuery: string = ``;
  view: string = `notepad`;

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
   
    // if there are local notes stored, parse the data, save it to the notes array
    if (this.localNotes) {
      this.allNotes = JSON.parse(this.localNotes);

    // otherwise, set the notes array to empty
    } else {
      this.allNotes = [];
    }

    // if there are notes saved, set the default note color to the last one used
    if (this.allNotes.length > 0) {
      this.noteColor = this.allNotes[this.allNotes.length - 1].color;
    }

    // set the filtered notes to the notes array
    this.filteredNotes = this.allNotes;

    // update the note colours
    this.updateNoteColors();

  }

  // toggle the mobile view function
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

  toggleNotebookOptions = () => {
    this.notebookOptions = !this.notebookOptions;
  }

  // update placeholder text function
  updatePlaceholder = (newPlaceholder: string) => {

    // set the placeholder variable to the parameter taken by the function
    this.placeholder = newPlaceholder;

    // after 1 second, set it back
    setTimeout(() => {
      this.placeholder = `type your note here`;
    }, 1000)
  }

  updateNoteColor = (color: string) => {
    
    if (this.noteColor !== color) {
      this.noteColor = color;
    }

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

    if (this.searchQuery) {

      this.searchNotes()

    } else {

      // establish an empty array for the new filtered notes
      let updatedNotes: {
        text: string,
        color: string,
        meta: {
          time: string,
          date: string,
        }
      }[] = [];

      updatedNotes = this.allNotes;

      // if the colour filter is anything other than 'all'
      if (this.colorFilter !== `all`) {

        // filter the notes by the selected colour filter
        updatedNotes = updatedNotes.filter(note => note.color === this.colorFilter);

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
    let updatedNotes: {
      text: string,
      color: string,
      meta: {
        time: string,
        date: string,
      }
    }[] = this.allNotes;

    if (this.searchQuery && this.colorFilter === 'all') {

      updatedNotes = updatedNotes.filter(note => note.text.toLowerCase().includes(this.searchQuery.toLowerCase()));

    } else if (this.searchQuery && this.colorFilter !== 'all') {

      updatedNotes = updatedNotes.filter(note => note.color === this.colorFilter);
      updatedNotes = updatedNotes.filter(note => note.text.toLowerCase().includes(this.searchQuery.toLowerCase()));

    } else if (!this.searchQuery && this.colorFilter !== 'all') {

      updatedNotes = updatedNotes.filter(note => note.color === this.colorFilter);
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
    let hour = "";
    let meridiem = "AM";
    if (today.getHours() > 12) {
      hour = String(today.getHours() - 12);
      meridiem = 'PM'
    } else {
      hour = String(today.getHours());
    }
    let minute = String(today.getMinutes()).padStart(2, '0');
    
    // return the time string
    return `${hour}:${minute}${meridiem}`

  }

  formatDate = () => {

    // get the date and time info and format it
    let today = new Date();
    let day = today.getDate();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let year = String(today.getFullYear());
    
    // return the date string
    return `${day}/${month}/${year}`

  }

  // save note function
  saveNote(event: any) {

    // if the key pressed is enter
    if (event.keyCode == 13) {
      
      // prevent the default action
      event.preventDefault();
    }
    
    // compile the date and time strings
    let noteTime: string = this.formatTime();
    let noteDate: string = this.formatDate();

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

    // if there are 50 or more notes, display the limit text
    if (updateNotes.length >= 50) {
      this.updatePlaceholder(`storage limit reached`);

    // if the note is already in the array, display the duplicate note text
    } else if (this.inputtedText === "" || this.inputtedText == "\n") {

      this.inputtedText = ``;
      this.updatePlaceholder(`note can't be blank`);

    // if the note is already in the array, display the duplicate note text
    } else if (updateNotes.some(note => (note.text === this.inputtedText) && (note.color === this.noteColor))) {
      this.updatePlaceholder(`note already exists`);

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

    // clear out textbox value and search query
    this.clearText();
    this.clearSearch();

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
    this.toggleView("notepad");

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
    this.allNotes = this.allNotes.filter(note => note !== deletedNote);

    // delete the note from the filtered notes array
    this.filteredNotes = this.filteredNotes.filter(note => note !== deletedNote);

    // update the note colours
    this.updateNoteColors();

    // set the local storage notes to the stringified array
    localStorage.setItem(`notes`, JSON.stringify(this.allNotes));

    // update the local notes variable to delete any trace of the note
    this.localNotes = localStorage.getItem(`notes`);

    // if the notebook is empty, set the mobile view to the notepad
    if (this.allNotes.length === 0) {
      this.toggleView("notepad");
    }

  }

  exportNotes() {

    let exportedNotes = [``]
    let title = `note taken export`
    let query = ``;
    let filter = ``;
    let heading = ``;
    let date = this.formatDate();
    let filename = ``;

    if (this.searchQuery && this.colorFilter !== 'all') {
      query =  this.searchQuery;
      filter =  this.colorFilter;
      heading = title + ` [ "` + query + `" || ` + filter + ` ] `
      filename = `note-taken-export--${filter}--${query}--${date.replaceAll("/", "_")}.txt`
    } else if (this.searchQuery && this.colorFilter === 'all') {
      query =  this.searchQuery;
      heading = title + ` [ "` + query + `" ]`
      filename = `note-taken-export--${query.replaceAll(/\s/g, "_")}--${date.replaceAll("/", "_")}.txt`
    } else if (!this.searchQuery && this.colorFilter !== 'all'){
      filter =  this.colorFilter;
      heading = title + ` [ ` + filter + ` ]`
      filename = `note-taken-export--${filter}--${date.replaceAll("/", "_")}.txt`
    } else {
      heading = title;
      filename = `note-taken-export--${date.replaceAll("/", "_")}.txt`
    }

    exportedNotes.push(heading + ` - ` + date);

    this.filteredNotes.forEach((note) => {
      exportedNotes.push(`\n\n${note.text}\n// ${note.meta.date} @ ${note.meta.time} || ${note.color} //`)
    })

    let FileSaver = require('file-saver');
    let blob = new Blob(exportedNotes, {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, filename);

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
    this.toggleView("notepad");

  }

  // clear text function
  clearText() {

    // set textbox value to an empty string
    this.inputtedText = ``;

  }

}
