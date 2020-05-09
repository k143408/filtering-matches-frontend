import {Component, Input, OnInit} from '@angular/core';
import {Filter} from "../shared/request/filter";
import {UsersService} from "../shared/services/users.service";
import {User} from "../shared/response/user";
import {ChangeContext, Options} from 'ng5-slider';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less']
})
export class UsersComponent implements OnInit {

  @Input() filterRequest = new Filter();


  current_user: User;
  users: any = [];
  /**
   * Options declaration
   **/

  compatibility_options: Options = {
    floor: 1,
    minLimit: 1,
    maxLimit: 99,
    ceil: 99,
    step: 1,
    translate: (value: number): string => {
      return value + "%";
    }
  };
  age_options: Options = {
    floor: 18,
    minLimit: 18,
    maxLimit: 95,
    ceil: 95,
    step: 1,
    getSelectionBarColor: (value: number): string => {
      return '#2E8B57'
    },
    translate: (value: number): string => {
      return value + " Years";
    }
  };
  height_options: Options = {
    floor: 135,
    minLimit: 135,
    maxLimit: 210,
    ceil: 210,
    step: 1,
    getSelectionBarColor: (value: number): string => {
      return '#F4A460'
    },
    translate: (value: number): string => {
      return value + " cm";
    }
  };

  constructor(private usersService: UsersService) {
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    return this.usersService.getRandomLoginUser().subscribe((data: User) => {
      this.current_user = data;
    });
  }

  refresh() {
    this.filterRequest = new Filter();
    this.users = [];
    this.loadUsers();
  }

  filterUsers() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        return this.usersService.fetchBasedOnFilter(this.filterRequest, longitude, latitude).subscribe((data: {}) => {
          this.setUserList(data);
        });
      }, (error) => {
        return this.usersService.fetchBasedOnFilter(this.filterRequest, this.current_user.city.lon, this.current_user.city.lat).subscribe((data: {}) => {
          this.setUserList(data);
        });
      });
    } else {
      return this.usersService.fetchBasedOnFilter(this.filterRequest, this.current_user.city.lon, this.current_user.city.lat).subscribe((data: {}) => {
        this.setUserList(data);
      });
    }

  }

  /**
   * Setting values from ng5-sliders
   **/
  setCompatibility(compatibility: ChangeContext) {
    this.filterRequest.compatibilityScore = [compatibility.value / 100, compatibility.highValue / 100];
  }

  setAge(age: ChangeContext) {
    this.filterRequest.age = [age.value, age.highValue];
  }

  setHeight(height: ChangeContext) {
    this.filterRequest.height = [height.value, height.highValue];
  }

  setDistance(value: number) {
    this.filterRequest.distance = value;
  }

  private setUserList(data: {}) {
    this.users = data;
    this.users.filter(user => user.store_id !== this.current_user.id);
  }

}
