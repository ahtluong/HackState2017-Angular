import { Component, OnInit } from '@angular/core';
import { ContributionsService } from '../../services/contributions.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
	todo:boolean;
	todos: any[];
	show:boolean;

  constructor(
  	private contributionsService:ContributionsService
  ) { }

  ngOnInit() {
		this.show = false;
  	this.contributionsService.getTodos().subscribe(todos => {
  		this.todos = todos;
  		if (todos) this.todo = true;
  		else this.todo = false;
  	});
<<<<<<< HEAD
  }
=======
	}
	
	toggleShow() {
		this.show = !this.show;
	}

>>>>>>> 71963026dc73296179a8bc4efd6c192bdcf1efb5
}
