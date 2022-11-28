import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { debounceTime, tap, switchMap, finalize, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-edfs',
  templateUrl: './edfs.component.html',
  styleUrls: ['./edfs.component.css']
})
export class EdfsComponent implements OnInit {
  searchForm!: FormGroup;
  selectedCommand = '';
  url = '';
  partition_num = '';
  returnData: any = "";
  request_body =
    {}

  onSelectedCommand(value:string): void {
    this.selectedCommand = value;
    if (['mkdir', 'ls', 'rm'].includes(this.selectedCommand)) {
      this.searchForm.controls['filename'].disable();
      this.searchForm.controls['readpartitionnumber'].disable();
    } else if (['cat', 'getPartitionLocations'].includes(this.selectedCommand)) {
      this.searchForm.controls['filename'].enable();
      this.searchForm.controls['readpartitionnumber'].disable();
    } else {
      this.searchForm.controls['filename'].enable();
      this.searchForm.controls['readpartitionnumber'].enable();
    }
  }

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit()  {
    this.searchForm = this.formBuilder.group({
      command: ['',Validators.required],
      path: [''],
      filename: [''],
      readpartitionnumber: [''],
      database: [''],
      putfilename: [''],
      partitioncount: ['']
  });

  }

  onSubmit() {
    const putfilename = this.searchForm.value.putfilename;
    const new_putfilename= putfilename.replaceAll("/", "%2F");
    const command = this.searchForm.value.command;
    console.log(command);
    const path = this.searchForm.value.path;
    const new_path= path.replaceAll("/", "%2F");
    var filename = this.searchForm.value.filename;
    console.log(filename);
    const readpartitionnumber = this.searchForm.value.readpartitionnumber;
    const database = this.searchForm.value.database;
    const partitioncount = this.searchForm.value.partitioncount;
    if (["mkdir", "ls"].includes(command)) {
      this.url = "?directory_path=" + new_path;
    } else {
      this.url = "?file_path=" + new_path;
    }
    if (typeof filename === 'undefined') {
      filename = "";
    }
    if (typeof readpartitionnumber != 'undefined') {
      this.partition_num = "&partition_num=" + readpartitionnumber;
  }

    if (["mkdir", "rm"].includes(command)) {
      const body=JSON.stringify(this.request_body);
      this.http.put<any>('https://dsci551-367122.uw.r.appspot.com/api/v1/' + command + this.url + filename + "&db=" + database, body).subscribe(data => {
        console.log(data);
        if (typeof(data) === 'object') {
          this.returnData = JSON.stringify(data, null, 4);
      } else {
        this.returnData = data;
      }
      })
    }
    else if (command === 'put') {
      const body=JSON.stringify(this.request_body);
      this.http.post<any>('http://127.0.0.1:5000/api/v1/put?db=' + database + '&file_src=' + new_putfilename + '&directory_path=' + new_path + '&partition_count=' + partitioncount, body).subscribe(
        (response) => {
        this.returnData = 'success';
      },
      (error) => {
        this.returnData = 'fail';
      })
    }
    else {
      this.http.get<any>('https://dsci551-367122.uw.r.appspot.com/api/v1/' + command + this.url + filename + "&db=" + database + this.partition_num).subscribe(data => {
        console.log(data);
        if (typeof(data) === 'object') {
          this.returnData = JSON.stringify(data, null, 4);
      } else {
        this.returnData = data;
      }
      })
    }

  }

}
