import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormGroup} from '@angular/forms';
import {debounce, debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  info = new Info();
  saved: Info;
  isDisable = false;
  url = 'https://jsonbox.io/box_45a57f1f8a3037894fb8';

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.http.get<Array<Info>>(this.url)
      .subscribe(value => {
        console.log(value);
        if (!!value) {
          this.info = value[0];
          this.saved = {...value[0]};
          this.isDisable = true;
        }
      });

    const formgroup = new FormGroup({
      name: new FormControl(),
    });
    formgroup.get('name').valueChanges
      .pipe(debounceTime(100))
      .subscribe(value => {
        // save();
      });
  }


  save(): void {
    this.http.post(this.url, this.info)
      .subscribe(value => {
        console.log('save success');
        this.saved = {...this.info};
        this.isDisable = true;
      });
  }

  onChange(): void {
    console.log('onchange', this.info, this.saved);
    this.isDisable = !(this.info.name !== this.saved.name
      || this.info.phone !== this.saved.phone
      || this.info.address !== this.saved.address);
    // console.log(this.isDisable);
  }
}

export class Info {
  name: string;
  phone: number;
  address: string;
}
