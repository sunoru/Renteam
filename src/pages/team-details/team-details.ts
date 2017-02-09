import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { TeamDetail } from '../../models/team-detail';

@Component({
  selector: 'page-team-details',
  templateUrl: 'team-details.html'
})
export class TeamDetailsPage {
  team: TeamDetail;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
      this.team = navParams.get('team');
  }

}
