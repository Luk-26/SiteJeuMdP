import { Component } from '@angular/core';
import { Generateurmdp } from "../../elements/generateurmdp/generateurmdp";
import { Testeurmdp } from "../../elements/testeurmdp/testeurmdp";

@Component({
  selector: 'app-outils',
  imports: [Generateurmdp, Testeurmdp],
  templateUrl: './outils.html',
  styleUrl: './outils.css',
})
export class Outils {

}
