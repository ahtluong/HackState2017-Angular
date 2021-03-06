import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { CalculationsService } from './calculations.service';
import 'rxjs/add/operator/take';

@Injectable()
export class ContributionsService {
	contributions:FirebaseListObservable<any[]>;
	todos:FirebaseListObservable<any[]>;
	houseName:FirebaseObjectObservable<any>;
  notifications:FirebaseListObservable<any[]>
	uid:string;
  displayName:string;
  house:string;

  constructor(
  	private af:AngularFireDatabase,
  	private authService:AuthService,
    private calculationsService:CalculationsService
  ) {
    this.authService.getAuth().subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;
        this.displayName = auth.displayName;
      }
      this.houseName = this.af.object('private/users/-' + this.uid + '/house');
    });
  }
  
  getHouseName() {
  	return this.houseName;
  }

  checkHouseName(name) {
    return this.af.object('/private/houses/-' + name).take(1);
  }

  createHouse(name) {
    var house = {
      name: name,
      users: {
      }
    };
    if (!this.displayName) this.displayName = this.authService.displayName;
    house.users[this.uid] = this.displayName;
    this.af.object('/private/houses/-' + name).set(house);
    this.af.object('/private/users/-' + this.uid + '/house').set(name);
  }

  setHouse(house) {
    this.house = house;
    this.todos = this.af.list('/private/houses/-' + this.house + '/todo');
  }

  joinHouse(house) {
    this.house = house;
    if (!this.displayName) this.displayName = this.authService.displayName;
    this.af.object('/private/houses/-' + house + '/users/' + this.uid).set(this.displayName);
    this.af.object('/private/users/-' + this.uid + '/house').set(house);
  }

  getTodos() {
    return this.af.list('/private/houses/-' + this.house + '/todo');
  }

  addToDo(newToDo) {
    this.af.list('/private/houses/-' + this.house + '/todo').push(newToDo);
  }

  getRoommies(houseName) {
    return this.af.list('/private/houses/-' + houseName + '/users');
  }

  addContribution(todo, type, value, unit) {
    this.calculationsService.updateSummary(this.uid, type, value, unit);
    if (!this.displayName) this.displayName = this.authService.displayName;
    var newContribution = {
      name: todo,
      value: value,
      unit: unit ,
      user: this.displayName,
      uid: this.uid
    }
    this.af.list('/private/houses/-' + this.house + '/contributions/' + type).push(newContribution);
  }

  removeToDo(key) {
    this.af.list('/private/houses/-' + this.house + '/todo/' + key).remove();
  }

  getNotifications(){
    return this.af.list('/private/houses/-' + this.house + '/notifications');
  }

  addNotification(notiMessage, emergency) {
    this.authService.getAuth().subscribe(auth => {
      var date = new Date();
      var owner = auth.displayName;
      var newNoti = {
        message: notiMessage,
        emergency: emergency,
        date: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        owner: owner
      }
      this.af.list('/private/houses/-' + this.house + '/notifications/').push(newNoti);
    });
  }

  removeNotification(key) {
    this.af.list('/private/houses/-' + this.house + '/notifications/' + key).remove();
  }

  getSummary() {
    return this.af.object('/private/users/-' + this.uid + '/summary');
  }

  getTime() {
    return this.af.list('/private/users/-' + this.uid + '/contributions/time');
  }

  getResources(){
      return this.af.list('/private/houses/-' + this.house + '/contributions/resources/');
  }

  getChores(){
    return this.af.list('/private/houses/-' + this.house + '/contributions/time/');
  }
}