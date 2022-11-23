import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {
  returnData: any = "";
  searchForm!: FormGroup;
  path = "";
  request_body =
    {};
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
      this.path += "%2F";
      this.returnData = data.children;
      console.log(typeof(this.returnData));
      console.log(this.returnData);
    })
  }

  itemclick(child: string) {
    console.log("workks")
    if (child.includes(".")) {
      this.path += child;
      this.http.put<any>('https://dsci551-367122.uw.r.appspot.com/api/v1/cat?file_path=' + this.path,this.request_body + '&db=' + this.database).subscribe(data => {
        console.log(data)
        console.log(this.path);
      })
    } else {
      this.path += child;
      this.path += "%2F"
      this.http.get<any>('https://dsci551-367122.uw.r.appspot.com/api/v1/ls?directory_path=' + this.path + '&db='+ this.database).subscribe(data => {
        this.returnData = data.children;
        console.log(this.returnData);
        console.log(this.path);
      })
    }
  }



}
