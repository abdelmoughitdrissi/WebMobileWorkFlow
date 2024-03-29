import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-loyalitys',
  templateUrl: './loyalitys.component.html',
  styleUrls: ['./loyalitys.component.scss']
})
export class LoyalitysComponent {

  loyalitys: any = {
    loylityPercentage: 0,
    minLoyalityPointes: 0,
    enable: true
  };
  loyalityData: AngularFireObject<any>;

  constructor(public af: AngularFireDatabase, private toastr: ToastrService) {
    this.loyalityData = af.object('/loyalitys');
    this.loyalityData.valueChanges().subscribe((res) => {
      if (res != null) {
        this.loyalitys = res;
      }
    });
  }

  onSubmitLoyality() {
    this.loyalityData.set({
      loylityPercentage: this.loyalitys.loylityPercentage,
      minLoyalityPointes: this.loyalitys.minLoyalityPointes,
      enable: this.loyalitys.enable
    }).then((res) => {
      this.toastr.success("Loyalitys updated Successfully!", 'Success!');
    });
  }
}