import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  title = 'pigeon-pad';

  textareaValue: string = '';
  
  notes: string[] = [];

  constructor() {
    let savedNotes: any = localStorage.getItem('notes');
    if (savedNotes) {
      this.notes = JSON.parse(savedNotes);
    } else {
      this.notes = [];
    }
  }

  save() {
    let updateNotes: string[] = this.notes;
    if (this.textareaValue) {
      updateNotes.push(this.textareaValue);
    }
    this.notes = updateNotes;
    localStorage.setItem('notes', JSON.stringify(updateNotes));
    this.textareaValue = '';
    blur();
  }

  remove(index: number) {
    let updateNotes: string[] = this.notes;
    updateNotes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(updateNotes));
    this.notes = updateNotes;
  }

  removeAll() {
    this.notes = [];
    localStorage.clear();
    blur();
  }

  clear() {
    this.textareaValue = "";
    blur();
  }

}
