import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {
  returnData: any = "";
  returnInfo: any = "";
  searchForm!: FormGroup;
  path = "";
  database = "";

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      database: ['',Validators.required]
  });
  }
  onSubmit() {
    this.database = this.searchForm.value.database;
    this.http.get<any>('https://dsci551-367122.uw.r.appspot.com/api/v1/ls?directory_path=%2F&db='+ this.database).subscribe(data => {
      this.returnData = data.children;
    })
  }
  clear() {
    this.path =this.path.substring(0, this.path.lastIndexOf('%2F'));
    if (this.path === "") {
      this.path = "%2F";
    }
    console.log(this.path);
    this.http.get<any>('https://dsci551-367122.uw.r.appspot.com/api/v1/ls?directory_path=' + this.path + '&db='+ this.database).subscribe(data => {
        this.returnData = data.children;
        console.log(this.returnData);
      })

  }

  itemclick(child: string) {
    if (child.includes(".")) {
      this.path += "%2F";
      this.path += child;
      console.log(this.path);
      this.http.get<any>('https://dsci551-367122.uw.r.appspot.com/api/v1/cat?file_path=' + this.path + '&db=' + this.database).subscribe(data => {
        console.log(data)
        console.log(this.path);
        if (typeof(data) === 'object') {
          this.returnInfo = JSON.stringify(data, null, 4);
        } else {
        this.returnInfo = data;
        }
      })
    } else {
      if (this.path === "%2F") {
        this.path += child;
      } else {
        this.path += "%2F";
        this.path += child;
      }
      this.http.get<any>('https://dsci551-367122.uw.r.appspot.com/api/v1/ls?directory_path=' + this.path + '&db='+ this.database).subscribe(data => {
        this.returnData = data.children;
        console.log(this.returnData);
        console.log(this.path);

      })
    }
  }



}
