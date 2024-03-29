import { Component } from '@angular/core';
import { CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
// import {map} from 'rxjs/Operator/map';
import { ToastrService } from 'ngx-toastr';
const swal = require('sweetalert');

@Component({
  selector: 'app-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.scss']
})
export class MenuItemsComponent {

  public currency: any = {};
  siteVal: any;
  menuItems: Array<any>;
  menuItemsDataRef: AngularFireList<any>;
  menuObservable: Observable<any>;
  constructor(public af: AngularFireDatabase, public router: Router, public toastr: ToastrService) {
    if (localStorage.getItem('currency')) {
      this.currency = JSON.parse(localStorage.getItem('currency'));
    }
    this.menuItemsDataRef = af.list('/menuItems');
    this.menuObservable = this.menuItemsDataRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
    this.menuObservable.subscribe((res) => {
      this.menuItems = res;
    });
  }


  getMenuItems(ev: any) {
    let val = ev;

    this.menuObservable = this.af.list('/menuItems', ref => ref.orderByChild('title').startAt(val.charAt(0).toUpperCase() + val.slice(1))
      .endAt(val.charAt(0).toUpperCase() + val.slice(1) + '\uf8ff')).valueChanges();
    this.menuObservable.subscribe((data) => {
      this.menuItems = data;
    });


  }

  menuItemShow(key) {
    this.router.navigate(['/menu/viewItems', key]);
  }

  menuItemEdit(key) {
    this.router.navigate(['/menu/editItems', key]);
  }

  menuItemDelete(key: any) {
    swal({
      title: 'Are you sure?',
      text: 'Your will not be able to recover this data!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      closeOnConfirm: false,
      closeOnCancel: false
    }, (isConfirm) => {
      if (isConfirm) {
        this.menuItemsDataRef.remove(key).then((res) => {
          swal('Deleted!', 'Menu Item Deleted Successfully!', 'success');
        })
      } else {
        swal('Cancelled', 'Your data is safe :)', 'error');
      }
    });
  }

}
