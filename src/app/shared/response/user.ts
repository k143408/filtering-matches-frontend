import {City} from './city';

export class User {
  id: string;
  display_name: string;
  age: number;
  job_title: string;
  height_in_cm: number;
  city: City;
  main_photo: string;
  compatibility_score: number;
  contacts_exchanged: number;
  favourite: boolean;
  religion: string;
}
